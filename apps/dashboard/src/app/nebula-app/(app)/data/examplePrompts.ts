type ExamplePrompt = {
  title: string;
  message: string;
};

// Note:
// Keep the title as short as possible so 2 of them can fit in a single row on desktop viewport
// title is only used for displaying the example - the `message` is sent to server when user clicks on the example - it can be as long and descriptive as needed

export const examplePrompts: ExamplePrompt[] = [
  {
    title: "Deploy an ERC-20 Token",
    message:
      "Deploy an ERC-20 Token with name 'Hello World', description 'Hello world token deployed by Nebula', and symbol 'HELLO'",
  },
  {
    title: "USDC contract address on Ethereum",
    message: "What is the USDC contract address on Ethereum?",
  },
  {
    title: "Analyze WETH smart contract",
    message: "Analyze 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 on ethereum",
  },
  {
    title: "Transfer 0.001 ETH to thirdweb.eth",
    message: "Transfer 0.001 ETH to thirdweb.eth",
  },
  {
    title: "Using session keys in Unity",
    message: "How to use session key in Unity?",
  },
];
