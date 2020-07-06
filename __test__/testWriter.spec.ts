import * as testWriter from "../lib/testWriter";
import { extractJsonPaths } from "../util/extractJsonPaths";

describe("testWriter tests", () => {
  const bookStore = {
    store: {
      book: [
        {
          category: "reference",
          author: "Nigel Rees",
          title: "Sayings of the Century",
          price: 8.95,
        },
        {
          category: "fiction",
          author: "Herman Melville",
          title: "Moby Dick",
          isbn: "0-553-21311-3",
          price: 8.99,
        },
        {
          category: "fiction",
          author: "J.R.R. Tolkien",
          title: "The Lord of the Rings",
          isbn: "0-395-19395-8",
          price: 22.99,
        },
      ],
      bicycle: {
        color: "red",
        price: 19.95,
      },
    },
    expensive: 10,
  };
  const paths = [
    "$.store.book[*].category",
    "$.store.book[*].author",
    "$.store.book[*].title",
    "$.store.book[*].price",
    "$.store.book[*].isbn",
    "$.store.bicycle.color",
    "$.store.bicycle.price",
    "$.expensive",
  ];

  const catteryApiResponse = {
    success: true,
    cats: [
      { name: "Lemon", notes: "", isCat: true, age: 2, id: 0 },
      { name: "Apple", notes: "some notes", isCat: true, age: "old", id: 1 },
      { name: "barky", notes: "", isCat: false, age: undefined, id: 2 },
    ],
    dogs: undefined,
  };

  it("should make a rule set", () => {
    const ruleSet = testWriter.createTypeRules(paths, bookStore);

    expect(ruleSet.length).toEqual(paths.length);
    expect(ruleSet).toEqual([
      {
        path: "$.store.book[*].category",
        when: "when.each.is.nonEmptyString",
      },
      {
        path: "$.store.book[*].author",
        when: "when.each.is.nonEmptyString",
      },
      {
        path: "$.store.book[*].title",
        when: "when.each.is.nonEmptyString",
      },
      { path: "$.store.book[*].price", when: "when.each.is.number" },
      {
        path: "$.store.book[*].isbn",
        when: "when.each.is.nonEmptyString",
      },
      {
        path: "$.store.bicycle.color",
        when: "when.each.is.nonEmptyString",
      },
      { path: "$.store.bicycle.price", when: "when.each.is.number" },
      { path: "$.expensive", when: "when.each.is.number" },
    ]);
  });

  it("should make a test", () => {
    const ruleSet = testWriter.createTypeRules(paths, bookStore);
    const testCode = testWriter.ruleListToTest(
      "'http://www.example.com'",
      ruleSet
    );

    const testCodeLines = testCode.split("\n");

    expect(testCodeLines).toEqual([
      "const result = await expect('http://www.example.com')",
      ".toMatch({'$.store.book[*].category':when.each.is.nonEmptyString,",
      "'$.store.book[*].author':when.each.is.nonEmptyString,",
      "'$.store.book[*].title':when.each.is.nonEmptyString,",
      "'$.store.book[*].price':when.each.is.number,",
      "'$.store.book[*].isbn':when.each.is.nonEmptyString,",
      "'$.store.bicycle.color':when.each.is.nonEmptyString,",
      "'$.store.bicycle.price':when.each.is.number,",
      "'$.expensive':when.each.is.number});",
    ]);
  });

  it("should make a test with all types", () => {
    const ruleSet = testWriter.createTypeRules(
      extractJsonPaths(catteryApiResponse),
      catteryApiResponse
    );
    const testCode = testWriter.ruleListToTest(
      "'http://www.example.com'",
      ruleSet
    );
    const testCodeLines = testCode.split("\n");

    expect(ruleSet).toEqual([
      { path: "$.success", when: true },
      { path: "$.cats[*].name", when: "when.each.is.nonEmptyString" },
      { path: "$.cats[*].notes", when: "when.each.is.string" },
      { path: "$.cats[*].isCat", when: "when.each.is.boolean" },
      { path: "$.cats[*].age", when: "when.each.is.defined" },
      { path: "$.cats[*].id", when: "when.each.is.greaterThanOrEqual(0)" },
      { path: "$.dogs", when: undefined },
    ]);

    expect(testCodeLines).toEqual([
      "const result = await expect('http://www.example.com')",
      ".toMatch({'$.success':true,",
      "'$.cats[*].name':when.each.is.nonEmptyString,",
      "'$.cats[*].notes':when.each.is.string,",
      "'$.cats[*].isCat':when.each.is.boolean,",
      "'$.cats[*].age':when.each.is.defined,",
      "'$.cats[*].id':when.each.is.greaterThanOrEqual(0),",
      "'$.dogs':undefined});",
    ]);
  });
});
