import { handleize } from '~/utils/funcs';

export const defaultPaletteColors = [
  'royalblue',
  'purple',
  'salmon',
  '#feec11',
];

export const initialPalettes = [
  {
    name: 'Tailwind',
    colors: [
      
    ]
  },
  {
    name: 'Almost Summer',
    colors: ['#3e9cbf', '#a7ecf2', '#f2c43d', '#f17c37', '#f26d50'],
  },
  {
    name: 'Pop',
    colors: ['#00ff3f', '#35b5ff', '#ff479c', '#fffb38'],
  },
  {
    name: 'Bubbles',
    colors: ['#f8cd82', '#f65b74', '#f72078', '#23b0bd', '#0df7db', '#ff9684'],
  },
  {
    name: 'Pascal',
    colors: ['#89d1dc', '#f89cfa', '#c386f1', '#f0d689', '#aff28b'],
  },
];

export const generatePaletteName = (
  currentItems,
  suggestedName = 'New',
  suggestedHandle = null
) => {
  const res = {
    name: suggestedName,
    handle: !suggestedHandle ? handleize(suggestedName) : suggestedHandle,
  };
  let x = 0;
  let done = false;
  const current = {
    names: currentItems.map((c) => c.name),
    handles: currentItems.map((c) => c.handle),
  };
  if (
    !current.names.includes(res.name) &&
    !current.handles.includes(res.handle)
  ) {
    done = true;
    return res;
  }
  for (let i = 1; i < 9999999 && !done; i++) {
    if (
      current.names.includes(res.name) ||
      current.handles.includes(res.handle)
    ) {
      if (current.names.includes(res.name)) {
        res.name = `${suggestedName} (${x})`;
      }
      if (current.handles.includes(res.handle)) {
        res.handle = handleize(`${suggestedName} (${x})`);
      }
      x = x + 1;
    } else {
      done = true;
    }
  }

  return res;
};
