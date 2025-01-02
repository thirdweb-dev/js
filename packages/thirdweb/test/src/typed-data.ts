export const typedData = {
  basic: {
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
    primaryType: "Mail",
  },
  complex: {
    domain: {
      name: "Ether Mail 🥵",
      version: "1.1.1",
      chainId: 1,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      Name: [
        { name: "first", type: "string" },
        { name: "last", type: "string" },
      ],
      Person: [
        { name: "name", type: "Name" },
        { name: "wallet", type: "address" },
        { name: "favoriteColors", type: "string[3]" },
        { name: "foo", type: "uint256" },
        { name: "age", type: "uint8" },
        { name: "isCool", type: "bool" },
      ],
      Mail: [
        { name: "timestamp", type: "uint256" },
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
        { name: "hash", type: "bytes" },
      ],
    },
    message: {
      timestamp: 1234567890n,
      contents: "Hello, Bob! 🖤",
      hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      from: {
        name: {
          first: "Cow",
          last: "Burns",
        },
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        age: 69,
        foo: 123123123123123123n,
        favoriteColors: ["red", "green", "blue"],
        isCool: false,
      },
      to: {
        name: { first: "Bob", last: "Builder" },
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        age: 70,
        foo: 123123123123123123n,
        favoriteColors: ["orange", "yellow", "green"],
        isCool: true,
      },
    },
  },
} as const;
