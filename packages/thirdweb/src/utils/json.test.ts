import { expect, it } from "vitest";

import { stringify } from "./json.js";

it("default", () => {
  expect(
    stringify({
      baz: {
        value: 69n,
      },
      foo: "bar",
    }),
  ).toMatchInlineSnapshot(`"{"baz":{"value":"69"},"foo":"bar"}"`);
});

it("args: replacer", () => {
  expect(
    stringify(
      {
        baz: {
          value: 69n,
        },
        foo: "bar",
      },
      (key, value) => {
        if (key === "value") {
          return `${value}!`;
        }
        return value;
      },
    ),
  ).toMatchInlineSnapshot(`"{"baz":{"value":"69!"},"foo":"bar"}"`);
});

it("args: space", () => {
  expect(
    stringify(
      {
        baz: {
          value: 69n,
        },
        foo: "bar",
      },
      null,
      2,
    ),
  ).toMatchInlineSnapshot(`
    "{
      "baz": {
        "value": "69"
      },
      "foo": "bar"
    }"
  `);
});
