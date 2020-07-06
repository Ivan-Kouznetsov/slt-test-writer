export const getTypesOfArrayItems = (arr: any[]): string[] => {
  let types: string[] = [];

  arr.forEach((item) => {
    const type = typeof item;
    if (!types.includes(type)) {
      types.push(type);
    }
  });

  return types;
};

export const getRange = (nums: number[]): { start: number; end: number } => {
  return { start: Math.min(...nums), end: Math.max(...nums) };
};

export const hasEmptyStrings = (strings: string[]): boolean => {
  for (const s of strings) {
    if (s.length === 0) {
      return true;
    }
  }

  return false;
};

export const alwaysSameValue = (arr: any[]): boolean => {
  return arr.every((val, _i, arr) => val === arr[0]);
};
