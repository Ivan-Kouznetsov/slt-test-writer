"use strict";
import * as parseCurl from "parse-curl";
import * as readlineSync from "readline-sync";
import fetch from "node-fetch";
import * as testWriter from "./lib/testWriter";
import { extractJsonPaths } from "./util/extractJsonPaths";

const main = async () => {
  try {
    const input = readlineSync.question("Paste cURL request:");
    const parsedInput = parseCurl(input);

    console.log(parsedInput);

    let responseObj: object;
    try {
      const response = await fetch(parsedInput.url, {
        method: parsedInput.method,
        headers: parsedInput.header,
      });
      responseObj = await response.json();
    } catch (e) {
      console.error(e);
      return;
    }

    // Create the test

    const paths = extractJsonPaths(responseObj);
    const ruleSet = testWriter.createTypeRules(paths, responseObj);
    let requestString = `'${parsedInput.url}'`;
    requestString += `, ${JSON.stringify({
      method: parsedInput.method,
      headers: parsedInput.header,
    })}`;
    const test = testWriter.ruleListToTest(requestString, ruleSet);

    // Show it to the user
    console.log("\nTest:\n");
    console.log(test);
  } catch (e) {
    console.error(e);
  }
};

main().catch((e) => {
  console.error(e);
});
