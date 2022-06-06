import { generatePaletteName } from '~/utils/palettes';
import { v4 as uuidv4 } from 'uuid';
import { objectsAreTheSame, handleize } from '~/utils/funcs';
import {
  initialPalettes,
  defaultPaletteColors,
} from '~/utils/defaults';
import { asyncDelay } from '../utils/funcs';
import chroma from 'chroma-js'

export const state = () => ({
    stored: {
      palettes: [],
    }
});

export const mutations = {

  setPalettes(state, palettes) {
    state.stored = Object.assign({}, state.stored, {...state.stored, palettes});
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
      ...generatePaletteName(state.stored.palettes, name, handle),
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

  updatePalette({  commit }, params) {
    const {
      palette = {},
      merge = false,
    } = params || {};
    const storedPalettes = this.getters?.storedPalettes || [];
    const currentPalette = storedPalettes?.filter((c) => c.id === palette.id)[0];
    if (!palette.id) {
      return console.error('palette.id not provided');
    }
    if (!currentPalette) {
      return console.error(`current palette not found w/ id "${palette.id}" `);
    }
    const data = merge
      ? { ...currentPalette, ...palette }
      : { ...palette, id: palette.id };
    const palettes = storedPalettes.reduce((acc, c) => {
      if (c.id === palette.id) {
        return [...acc, data];
      }
      return [...acc, c];
    }, []);
    commit('setPalettes', palettes);
  },

  deletePalette({ state, commit }, {id}) {
    const current = state?.stored?.palettes?.length ? state?.stored?.palettes : initialPalettes;
    commit(
      'setPalettes',
      current.filter((p) => p.id !== id)
    );
    this.$router.push('/')
  },

  addColorToPalette({ dispatch }, params) {
    const { paletteId, color } = params;
    const palette = JSON.parse(
      JSON.stringify(
        this.getters.storedPalettes?.filter((p) => p.id === paletteId)[0]
      )
    );
    if (!palette) {
      return;
    }
    palette.colors.unshift({ ...color, createdAt: Date.now() });
    dispatch('updatePalette', {
      palette,
      merge: false,
    });
  },

  duplicatePalette ({ commit, dispatch }, palette) {
    if (!palette) {
      return alert(`${JSON.stringify(palette)} is not accepted palette`)
    }
    const d = new Date();
    let name = `${palette.name} (${d.toLocaleDateString(d).split('/').join('-')} ${d.toLocaleTimeString().split(' ').join('')})`;
    const nameAndHandle = generatePaletteName(this.getters.storedPalettes, name, handleize(name));
    const newPalette = {
      ...palette,
      ...nameAndHandle,
      id: uuidv4(),
      colors: this.getters.storedPalettes.filter(p => p.id === palette.id)[0]
        .colors.map(c => { return { ...c, id: uuidv4() } })
    };
    const palettes = this.getters.storedPalettes.reduce((acc, p) => {
      if (p.id === palette.id) {
        return [...acc, newPalette, p]
      }
      return [...acc, p]
    }, []);
    commit('setPalettes', palettes);
    return newPalette
  },

  duplicateColor ({ dispatch }, color) {
    if (!color) {
      return alert(`${JSON.stringify(color)} is not accepted color`)
    }
    const palette = this.getters.storedPalettes.filter(p => p.colors.filter(c => c.id === color.id).length)[0] || null
    if (!palette) {
      return alert(`could not find palette with color: ${JSON.stringify(color)}`)
    }
    const value = color.value || 'cyan';
    const { name = value } = color;
    const colors = palette.colors.reduce((acc, c) => {
      if (c.id === color.id) {
        return [...acc, c, { ...c, value, name, id: uuidv4() }]
      }
      return [...acc, c]
    }, [])
    dispatch('updatePalette', { palette: { ...palette, colors } })
  },

  

  updateColor ({ commit }, color) {
    if (!color.name || color.name.indexOf('#') === 0 && chroma.valid(color.name)) {
      color.name = color.value
    }
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


  moveColor ({ dispatch }, params) {
    const { color, paletteId } = params;
    if (!color) {
      return alert(`${JSON.stringify(color)} is not accepted color`)
    }
    const palette = this.getters.storedPalettes.filter(p => p.id === paletteId)[0] || null
    if (!paletteId || !palette) {
      return alert(`"${JSON.stringify(paletteId)}" is not a valid paletteId`)
    }
    dispatch('deleteColor', color);
    asyncDelay(50).then(() => {
      dispatch('updatePalette', {
        palette: {
          ...palette, colors: [color, ...palette.colors]
        }
      });
      this.$router.push(`/palettes/${palette.id}`)
    })
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
      window !== undefined && state?.stored?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    if (!palette) {
      return state?.editing?.selectedColors?.length
        ? state.editing.selectedColors
        : defaultPaletteColors;
    }
    return state?.editing?.selectedColors || [];
  },
  editingPaletteColors(state) {
    const palette =
      window !== undefined && state?.stored?.palettes?.filter((p) => p.id === state?.palette)[0] || null;
    return palette?.colors || [];
  },
  storedPalettes(state) {
    return window !== undefined && state?.stored?.palettes?.length
      ? state.stored.palettes
      : initialPalettes;
  },
};

