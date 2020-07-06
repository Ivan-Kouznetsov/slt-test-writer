/**
 * Gets JSON paths of the primitives of an object
 * @param obj - an object
 */
export const extractJsonPaths = (obj: object): string[] => {
  const pathList: string[] = [];

  const getPathsFromObject = (obj: object, jsonPath: string = "$"): void => {
    const objIsArray = Array.isArray(obj);
    const parentPath = objIsArray ? `${jsonPath}[*]` : jsonPath;

    for (const key in obj) {
      const value = obj[key];
      const currentJsonPath = objIsArray ? parentPath : `${parentPath}.${key}`; // avoid adding .0 .1 etc for arrays

      if (typeof value === "object" && value !== null) {
        getPathsFromObject(value, currentJsonPath);
      } else if (!pathList.includes(currentJsonPath)) {
        // add current path to the pathList, once we get to the lowest level, indicated by this primitive value, is unique
        pathList.push(currentJsonPath);
      }
    }
  };

  getPathsFromObject(obj);
  return pathList;
};
