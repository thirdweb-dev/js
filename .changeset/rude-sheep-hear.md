---
"thirdweb": minor
---

Support multiple messages for Nebula API, updated input props.

Some prop names have been updated:

`prompt -> messsage`
`context -> contextFilter`

```ts
Nebula.chat({
  client,
  // prompt is now message
  message:
    "What's the total supply of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
  // contextFilter is now contextFilter
  contextFilter: {
    chains: [sepolia],
  },
});
```

The Nebula.chat and Nebula.execute functions now support multiple input messages, and the input properties have been updated to match the http API.

```ts
Nebula.chat({
  client,
  // multi message format
  messages: [
    {
      role: "user",
      content:
        "Tell me the name of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
    },
    {
      role: "assistant",
      content: "The name of the contract is My NFT Collection",
    },
    {
      role: "user",
      content: "What's the symbol of this contract?",
    },
  ],
  contextFilter: {
    chains: [sepolia],
  },
});
```

Same changes apply to Nebula.execute.

```ts
Nebula.execute({
  client,
  account,
  messages: [
    { role: "user", content: "What's the address of vitalik.eth" },
    {
      role: "assistant",
      content:
        "The address of vitalik.eth is 0xd8dA6BF26964aF8E437eEa5e3616511D7G3a3298",
    },
    { role: "user", content: "Send them 0.0001 ETH" },
  ],
  contextFilter: {
    chains: [sepolia],
  },
});
```
