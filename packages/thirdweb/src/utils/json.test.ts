import { expect, it } from "vitest";

import { stringify } from "./json.js";

it("default", () => {
  expect(
    stringify({
      foo: "bar",
      baz: {
        value: 69n,
      },
    }),
  ).toEqual('{"foo":"bar","baz":{"value":"69"}}');
});

it("args: replacer", () => {
  expect(
    stringify(
      {
        foo: "bar",
        baz: {
          value: 69n,
        },
      },
      (key, value) => {
        if (key === "value") {
          return `${value}!`;
        }
        return value;
      },
    ),
  ).toEqual('{"foo":"bar","baz":{"value":"69!"}}');
});

it("args: space", () => {
  expect(
    stringify(
      {
        foo: "bar",
        baz: {
          value: 69n,
        },
      },
      null,
      2,
    ),
  ).toMatchInlineSnapshot(`
    "{
      "foo": "bar",
      "baz": {
        "value": "69"
      }
    }"
  `);
});
