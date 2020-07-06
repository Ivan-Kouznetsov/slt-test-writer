import { extractJsonPaths } from "../util/extractJsonPaths";
import { query } from "jsonpath";

describe("extractJsonPaths tests", () => {
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

  it("should get jsonpaths", () => {
    const paths = extractJsonPaths(bookStore);
    expect(paths).toEqual([
      "$.store.book[*].category",
      "$.store.book[*].author",
      "$.store.book[*].title",
      "$.store.book[*].price",
      "$.store.book[*].isbn",
      "$.store.bicycle.color",
      "$.store.bicycle.price",
      "$.expensive",
    ]);
  });

  it("should get valid jsonpaths", () => {
    const paths = extractJsonPaths(bookStore);
    paths.forEach((path) => {
      expect(query(bookStore, path)).toBeDefined();
    });
  });
});
