import { generateCollectionOrPaletteName } from '~/utils/colorCollections';
import { v4 as uuidv4 } from 'uuid';
import { objectsAreTheSame } from '~/utils/funcs';
import {
  initialCollections,
  initialPalettes,
  defaultPaletteColors,
} from '~/utils/defaults';
import { asyncDelay } from '../utils/funcs';

export const state = () => ({
    stored: {
      collections: [],
      palettes: [],
    }
});

export const mutations = {
  setCollections(state, collections) {
    state.stored = Object.assign({}, state.stored, {...state.stored, collections});
  },

  setPalettes(state, palettes) {
    state.stored = Object.assign({}, state.stored, {...state.stored, palettes});
  },

  

  newCollection(state, params) {
    const { palettes = [], name = `New Collection` } = params || {};
    if (!state.stored.collections?.length) {
      state.stored.collections = initialCollections;
    }
    const collections = [{
      palettes,
      createdAt: Date.now(),
      id: uuidv4(),
      ...generateCollectionOrPaletteName(state.stored.collections, name),
    },
      ...state.stored.collections
    ];
    state.stored = Object.assign({}, state.stored, {...state.stored, collections});
  },

  newPalette(state, params) {
    const { colors = [], name = `New Palette`, handle = 'new-palette', id = uuidv4() } = params || {};
    if (!state?.stored?.palettes?.length) {
      state.stored.palettes = initialPalettes;
    }
    state.stored.palettes.unshift({
      colors,
      createdAt: Date.now(),
      id,
      ...generateCollectionOrPaletteName(state.stored.palettes, name, handle),
    });
  },

  setColorsOnPalette(state, params) {
    const { paletteId, colors = [] } = params;
    if (!paletteId) {
      return;
    }
    const palettes = this.getters.storedPalettes;
    const palette = palettes.filter((c) => c.id === paletteId)[0];
    if (!palette || objectsAreTheSame(colors, palette.colors)) {
      return;
    }
    palettes.filter((c) => c.id === paletteId)[0].colors = colors;
    state.stored.palettes = [];
    state.stored.palettes.forEach((p) =>
      state.stored.palettes.push(p.id === paletteId ? { ...p, colors } : p)
    );
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
    const currentCollection = state.stored.collections?.filter(
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
    const collections = state.stored.collections.reduce((acc, c) => {
      if (c.id === collectionId) {
        return [...acc, data];
      }
      return [...acc, c];
    }, []);
    commit('setCollections', collections);
  },

  deleteCollection({ state, commit }, id) {
    const current = state.stored.collections?.length
      ? state.stored.collections
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
    const storedPalettes = this.getters?.storedPalettes || [];
    const currentPalette = storedPalettes?.filter((c) => c.id === paletteId)[0];
    if (!paletteId) {
      return console.error('paletteId not provided');
    }
    if (!currentPalette) {
      return console.error(`current palette not found w/ id "${paletteId}" `);
    }
    const data = merge
      ? { ...currentPalette, ...palette }
      : { ...palette, id: paletteId };
    const palettes = storedPalettes.reduce((acc, c) => {
      if (c.id === paletteId) {
        return [...acc, data];
      }
      return [...acc, c];
    }, []);
    commit('setPalettes', palettes);
  },

  deletePalette({ state, commit }, id) {
    const current = state?.stored?.palettes?.length ? state?.stored?.palettes : initialPalettes;
    commit(
      'setPalettes',
      current.filter((p) => p.id !== id)
    );
  },

  addColorToPalette({ state, commit, dispatch }, params) {
    const { paletteId, color } = params;
    const palette = JSON.parse(
      JSON.stringify(
        this.getters.storedPalettes?.filter((c) => c.id === paletteId)[0]
      )
    );
    if (!palette) {
    }
    palette.colors.unshift({ ...color, createdAt: Date.now() });
    dispatch('updatePalette', {
      paletteId: palette.id,
      palette,
      merge: false,
    });
  },

  addPaletteToCollection({ state, commit }, params) {
    const { paletteId, collectionId } = params;
    const collections = JSON.parse(JSON.stringify(state.stored.collections || []));
    const palettes = collections?.filter((c) => c.id === collectionId)[0] || [];
    if (palettes?.includes(paletteId)) {
      return;
    }
    palettes.unshift(paletteId);
    commit('setPalettesOnCollection', { collectionId: collection.id, palettes });
  },

  duplicateCollection ({ commit }, params) {
    const { collection = null } = params;
    if (!collection) {
      return alert(`${JSON.stringify(collection)} is not accepted collection`)
    }
    const d = new Date();
    let { name = `${collection.name} (${d.toLocaleDateString(d).split('/').join('-')} ${d.toLocaleTimeString().split(' ').join('')}` } = params;
    const nameAndHandle = generateCollectionOrPaletteName(this.getters.storedCollections, name, handleize(name));
    commit('newCollection', { ...collection, ...nameAndHandle, id: uuidv4() })
    window.open(`/collections/${nameAndHandle.handle}`, '_blank')
  },

  duplicatePalette ({ commit }, params) {
    const { palette = null, collectionId = null } = params;
    if (!palette) {
      return alert(`${JSON.stringify(palette)} is not accepted palette`)
    }
    const d = new Date();
    let { name = `${palette.name} (${d.toLocaleDateString(d).split('/').join('-')} ${d.toLocaleTimeString().split(' ').join('')}` } = params;
    const nameAndHandle = generateCollectionOrPaletteName(this.getters.storedPalettes, name, handleize(name));
    const newPaletteId = uuidv4()
    commit('newPalette', { ...palette, ...nameAndHandle, id: newPaletteId })
    if (collectionId) {
      const collection = this.getters.storedCollections.filter(c => c.id === collectionId)[0];
      if (!collection) { return }
      commit('updateCollection', { ...collection, palettes: [newPaletteId, ...collection.palettes] });
    }
    window.open(`/palettes/${nameAndHandle.handle}`, '_blank')
  },

  duplicateColor ({ commit }, params) {
    const { color = null, paletteId = null } = params;
    if (!color) {
      return alert(`${JSON.stringify(color)} is not accepted color`)
    }
    const palette = this.getters.storedPalettes.filter(p => p.id === paletteId)[0] || null
    if (!paletteId || !palette) {
      return alert(`"${JSON.stringify(paletteId)}" is not a valid paletteId`)
    }
    const value = color.value || 'cyan';
    const { name = value } = color;
    commit('updatePalette', { ...palette, colors: [{ name, value, id: uuidv4() }, ...(palette.colors || [])] })
    if(!this.$route.params.palette || this.$route.params.palette)
    window.open(`/palettes/${nameAndHandle.handle}`, '_blank')
  },

  

  updateColor ({commit}, color) {
    const palettes = JSON.parse(JSON.stringify(
      this.getters.storedPalettes.map(palette => {
          return {
            ...palette,
            colors: palette.colors.map(c => c.id === color.id ? color : c)
          }
        })
    ));
    commit('setPalettes', palettes)
  },

  movePalette ({ dispatch, commit }, params) {
    const { palette, collectionId } = params;
    if (!palette) {
      return alert(`${JSON.stringify(palette)} is not accepted palette`)
    }
    if (!collectionId || !collection) {
      return alert(`"${JSON.stringify(collectionId)}" is not a valid collectionId`)
    }
    const collection = this.getters.storedPalettes.filter(p => p.id === collectionId)[0] || null
    dispatch('deletePalette', palette);
    asyncDelay(400).then(() => commit('updatePalette', {
      ...collection, palettes: [palette.id, ...collection.palettes]
    }))
  },

  moveColor ({ dispatch, commit }, params) {
    const { color, paletteId } = params;
    if (!color) {
      return alert(`${JSON.stringify(color)} is not accepted color`)
    }
    if (!paletteId || !palette) {
      return alert(`"${JSON.stringify(paletteId)}" is not a valid paletteId`)
    }
    const palette = this.getters.storedPalettes.filter(p => p.id === paletteId)[0] || null
    dispatch('deleteColor', color);
    asyncDelay(400).then(() => commit('updatePalette', {
      ...palette, colors: [color, ...palette.colors]
    }))
  },

  deleteColor ({ commit }, color) {
    const palettes = JSON.parse(JSON.stringify(
      this.getters.storedPalettes.map(palette => {
          return {
            ...palette,
            colors: palette.colors.filter(c => c.id !== color.id)
          }
        })
    ));
    commit('setPalettes', palettes)
  },

};

export const getters = {
  editingPalette(state) {
    return state?.stored?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
  },
  editingSelectedColors(state) {
    const palette =
      state?.stored?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    if (!palette) {
      return state?.editing?.selectedColors?.length
        ? state.editing.selectedColors
        : defaultPaletteColors;
    }
    return state?.editing?.selectedColors || [];
  },
  editingPaletteColors(state) {
    const palette =
      state?.stored?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    return palette?.colors || [];
  },
  storedCollections (state) {
    return state?.stored?.collections?.length
      ? state.stored.collections
      : initialCollections;
  },
  storedPalettes(state) {
    return state?.stored?.palettes?.length
      ? state.stored.palettes
      : initialPalettes;
  },
};

