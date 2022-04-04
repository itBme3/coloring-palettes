export const handleize = (strng, reaplceSpacesWith = '-') => {
  return strng
    .toLowerCase()
    .trim()
    .replace(/ /g, reaplceSpacesWith)
    .replace(/[^a-z0-9]+/g, reaplceSpacesWith)
    .replace(/-$/, '')
    .replace(/^-/, '')
    .replace(/--/, reaplceSpacesWith);
};

export const capitalize = (strng, altSpaces = []) => {
  const spaces = [' ', ...(altSpaces || [])];
  const words = spaces.reduce((acc, space) => {
    return acc.split(space).join(' ');
  }, strng);
  return words
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
};

export const objectsAreTheSame = (_obj1, _obj2, dblCheck = true) => {
  const obj1 = (() => {
    try {
      return JSON.parse(JSON.stringify(_obj1));
    } catch (err) {
      return _obj1;
    }
  })();
  const obj2 = (() => {
    try {
      return JSON.parse(JSON.stringify(_obj2));
    } catch (err) {
      return _obj2;
    }
  })();
  if (
    [null, undefined].includes(obj1) ||
    [null, undefined].includes(obj2) ||
    ['string', 'boolean', 'number'].includes(typeof obj1) ||
    ['string', 'boolean', 'number'].includes(typeof obj2)
  ) {
    return obj1 === obj2;
  }
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0; obj1.length; i++) {
        if (!objectsAreTheSame(obj1[i], obj2[i])) {
          return false;
        }
        if (i === obj1.length - 1) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
  const fields = Object.keys(obj1);
  for (const field of fields) {
    if (!objectsAreTheSame(obj1[field], obj2[field])) {
      return false;
    }
  }
  return dblCheck ? objectsAreTheSame(obj2, obj1, false) : true;
};
