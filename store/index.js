import {
  initialCollections,
  initialPalettes,
  defaultPaletteColors,
} from '../utils/defaults';

export const getters = {
  storedCollections(state) {
    return state?.localStorage?.collections?.length
      ? state.localStorage.collections
      : initialCollections;
  },
  storedPalettes(state) {
    return state?.localStorage?.palettes?.length
      ? state.localStorage.palettes
      : initialPalettes;
  },
};
