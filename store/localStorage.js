import { generateCollectionOrPaletteName } from '~/utils/colorCollections';
import { v4 as uuidv4 } from 'uuid';
import { objectsAreTheSame } from '../utils/funcs';
import {
  initialCollections,
  initialPalettes,
  defaultPaletteColors,
} from '../utils/defaults';

export const state = () => {
  return {
    collections: [],
    palettes: [],
    addedColors: [],
  };
};

export const mutations = {
  setCollections(state, collections) {
    state.collections = collections;
  },

  setPalettes(state, palettes) {
    state.palettes = palettes;
  },

  newCollection(state, params) {
    const { palettes = [], name = `New Collection` } = params || {};
    if (!state?.collections?.length) {
      state.collections = initialCollections;
    }
    state.collections.unshift({
      palettes,
      createdAt: Date.now(),
      id: uuidv4(),
      ...generateCollectionOrPaletteName(state.collections, name),
    });
  },

  newPalette(state, params) {
    const { colors = [], name = `New Palette` } = params || {};
    if (!state?.palettes?.length) {
      state.palettes = initialPalettes;
    }
    state.palettes.unshift({
      colors,
      createdAt: Date.now(),
      id: uuidv4(),
      ...generateCollectionOrPaletteName(state.palettes, name),
    });
  },

  setPalettesOnCollection(state, params) {
    const { palettes, collectionId, merge = false } = params;
    const paletteIds = palettes?.map((p) => p?.id || p);
    const collection = state?.collection?.filter(
      (c) => c.id === collectionId
    )[0];
    if (!paletteIds || !collection) {
      return;
    }
    if (!merge) {
      collection.palettes = paletteIds;
    } else {
      const paletteIdsNotOnCollection = paletteIds.filter(
        (p) => !collection?.palettes?.includes(p.id)
      );
      if (!paletteIdsNotOnCollection.length && !merge) {
        return;
      }
      paletteIdsNotOnCollection.forEach((id) =>
        collection.palettes.unshift(id)
      );
    }
    const collections = JSON.parse(JSON.stringify(state?.collections || []));
    state.collections = Object.assign({}, state.collections, collections);
  },

  setColorsOnPalette(state, params) {
    const { paletteId, colors = [] } = params;
    if (!paletteId) {
      return;
    }
    const palettes = JSON.parse(JSON.stringify(state?.palettes || []));
    const palette = palettes?.filter((c) => c.id === paletteId)[0];
    if (!palette || objectsAreTheSame(colors, palette.colors)) {
      return;
    }
    palette.colors = colors;
    state.user.palettes = Object.assign({}, state.user.palettes, palettes);
  },

  setEditing(state, params) {
    const { palette, selectedColors = [], merge = false } = params || {};
    const stateOfEditing = JSON.parse(JSON.stringify(state.editing));
    if (palette || !merge) {
      stateOfEditing.palette = palette;
    }
    if (selectedColors?.length || !merge) {
      stateOfEditing.selectedColors = selectedColors;
    }
    if (objectsAreTheSame(stateOfEditing, state?.editing || {})) {
      return;
    }
    if (state?.editing?.selectedColors?.join('') === selectedColors?.join('')) {
      return;
    }
    state.editing = Object.assign({}, state.editing, stateOfEditing);
  },
};

export const actions = {
  updateCollection({ state, commit }, params) {
    const {
      collection = {},
      collectionId = params?.collection?.id || null,
      merge = false,
    } = params || {};
    const currentCollection = state?.collections?.filter(
      (c) => c.id === collectionId
    )[0];
    if (!collectionId) {
      return console.error('collectionId not provided');
    }
    if (!currentCollection) {
      return console.error(
        `current collection not found w/ id "${collectionId}" `
      );
    }
    const data = merge
      ? { ...currentCollection, ...collection }
      : { ...collection, id: collectionId };
    const collections = state.collections.reduce((acc, c) => {
      if (c.id === collectionId) {
        return [...acc, data];
      }
      return [...acc, c];
    }, []);
    commit('setCollections', collections);
  },

  deleteCollection({ state, commit }, id) {
    const current = state?.collections?.length
      ? state?.collections
      : initialCollections;
    commit(
      'setCollections',
      current.filter((c) => c.id !== id)
    );
  },

  updatePalette({ state, commit }, params) {
    const {
      palette = {},
      paletteId = params?.palette?.id || null,
      merge = false,
    } = params || {};
    const currentPalette = state?.palettes?.filter(
      (c) => c.id === paletteId
    )[0];
    if (!paletteId) {
      return console.error('paletteId not provided');
    }
    if (!currentPalette) {
      return console.error(`current palette not found w/ id "${paletteId}" `);
    }
    const data = merge
      ? { ...currentPalette, ...palette }
      : { ...palette, id: paletteId };
    const palettes = state.palettes.reduce((acc, c) => {
      if (c.id === paletteId) {
        return [...acc, data];
      }
      return [...acc, c];
    }, []);
    commit('setPalettes', palettes);
  },

  deletePalette({ state, commit }, id) {
    const current = state?.palettes?.length ? state?.palettes : initialPalettes;
    console.log('id: ', id);
    commit(
      'setPalettes',
      current.filter((p) => p.id !== id)
    );
  },

  addColorToPalette({ state, commit }, params) {
    const { paletteId, color } = params;
    const palette = this.getters.storedPalettes?.filter(
      (c) => c.id === paletteId
    )[0];
    if (!palette) {
      return console.log(`could not find palette with id: ${paletteId}`);
    }
    palette.colors.ushift(color);
    commit('setColorsOnPalette', {
      paletteId: palette.id,
      colors: palette.colors,
    });
    commit('setAddedColors', [...(state?.addedColors || []), color]);
    setTimeout(() => {
      commit('setAddedColors', [
        ...(state?.addedColors || []).filter((c) => c.id !== color.id),
      ]);
    }, 500);
  },

  addPaletteToCollection({ state, commit }, params) {
    const { paletteId, collectionId } = params;
    const collections = JSON.parse(JSON.stringify(state?.collections || []));
    const palettes = collections?.filter((c) => c.id === collectionId)[0] || [];
    if (palettes?.includes(paletteId)) {
      return;
    }
    palettes.unshift(paletteId);
    commit('setPalettesOnColletion', { collectionId: collection.id, palettes });
  },
};

export const getters = {
  collections(state) {
    return state?.collections?.length > 0
      ? state.collections
      : initialCollections;
  },
  palettes(state) {
    return state?.palettes?.length > 0 ? state.palettes : initialPalettes;
  },
  newColors(state) {
    return state?.addedColors || [];
  },
  editingPalette(state) {
    return state?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
  },
  editingSelectedColors(state) {
    const palette =
      state?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    if (!palette) {
      return state?.editing?.selectedColors?.length
        ? state.editing.selectedColors
        : defaultPaletteColors;
    }
    return state?.editing?.selectedColors || [];
  },
  editingPaletteColors(state) {
    const palette =
      state?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    return palette?.colors || [];
  },
};
