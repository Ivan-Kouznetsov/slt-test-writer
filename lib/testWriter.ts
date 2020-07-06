import { IRule } from "../interfaces/IRule";
import { query } from "jsonpath";
import * as arrayUtils from "../util/arrayUtils";

// const result = await expect().toMatch()

/**
 * Create rules based on paths and an object
 * @param paths
 * @param obj
 */
export const createTypeRules = (paths: string[], obj: object): IRule[] => {
  const when_each_is = "when.each.is.";
  const jsTypes = {
    string: "string",
    number: "number",
    boolean: "boolean",
    undefined: "undefined",
  };
  const rules: IRule[] = [];

  paths.forEach((path) => {
    const values = query(obj, path);
    const types = arrayUtils.getTypesOfArrayItems(values);

    if (types.length === 1) {
      const currentType = types[0];
      if (currentType === jsTypes.string) {
        if (arrayUtils.hasEmptyStrings(values)) {
          rules.push({ path, when: when_each_is + currentType });
        } else {
          rules.push({ path, when: when_each_is + "nonEmptyString" });
        }
      } else if (currentType === jsTypes.number) {
        const start = arrayUtils.getRange(values).start;
        if (start === 0 || start == 1) {
          rules.push({
            path,
            when: `${when_each_is}greaterThanOrEqual(${start})`,
          });
        } else {
          rules.push({ path, when: when_each_is + currentType });
        }
      } else if (currentType === jsTypes.boolean) {
        if (arrayUtils.alwaysSameValue(values)) {
          rules.push({ path, when: values[0] });
        } else {
          rules.push({ path, when: when_each_is + currentType });
        }
      } else {
        rules.push({ path, when: values[0] });
      }
    } else {
      rules.push({ path, when: when_each_is + "defined" });
    }
  });

  return rules;
};

export const ruleListToTest = (request: string, ruleSet: IRule[]) => {
  let result = "";
  ruleSet.forEach((rule) => {
    result += `'${rule.path}':${rule.when},\n`;
  });
  result = result.substring(0, result.length - 2);
  return `const result = await expect(${request})\n.toMatch({${result}});`;
};
