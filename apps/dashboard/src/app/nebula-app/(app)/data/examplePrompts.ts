type ExamplePrompt = {
  title: string;
  message: string;
  interceptedReply?: string;
};

const whatCanNebulaDoReply = `
Nebula is a natural language model with improved blockchain reasoning, autonomous transaction capabilities, and real-time access to the blockchain.
[Learn more about Nebula](https://portal.thirdweb.com/nebula)

Here are some example actions you can perform with Nebula:

### Bridge & Swap
Bridge and swap native currencies
- Swap 1 USDC to 1 USDT on the Ethereum Mainnet
- Bridge 0.5 ETH from Ethereum Mainnet to Polygon

### Transfer
Send native and ERC-20 currencies
- Send 0.1 ETH to vitalik.eth
- Transfer 1 USDC to saminacodes.eth on Base

### Deploy
Deploy published contracts
- Deploy a Token ERC20 Contract with name "Hello World" and description "My Hello Contract" on Ethereum.
- Deploy a Split contract with two recipients.
- Deploy an ERC1155 Contract named 'Hello World' with description 'Hello badges on Ethereum'

### Understand
Retrieve information about smart contracts.
- What ERC standards are implemented by contract address 0x59325733eb952a92e069C87F0A6168b29E80627f on Ethereum?
- What functions can I use to mint more of my contract's NFTs?
- What is the total supply of NFTs on 0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e?

### Interact
Query wallet balances, addresses, and token holdings.
- How much ETH is in my wallet?
- What is the wallet address of vitalik.eth?
- Does my wallet hold USDC on Base?

### Explore
Access blockchain-specific data.
- What is the last block on zkSync?
- What is the current gas price on Avalanche C-Chain?
- Can you show me transaction details for 0xdfc450bb39e44bd37c22e0bfd0e5212edbea571e4e534d87b5cbbf06f10b9e04 on Optimism?

### Research
Obtain details about tokens, their addresses, and current prices.
- What is the address of USDC on Ethereum?
- Is there a UNI token on Arbitrum?
- What is the current price of ARB?

### Build
Implement features using Web3 SDKs and tools.
- How can I add a connect wallet button to my web app? I want to support users connecting with both email/social wallets and MetaMask and use smart wallets.
- Can you show me how to claim an NFT from an ERC721 using TypeScript?
- I have an ERC1155 contract from thirdweb. Can you show me how to generate and mint with a signature?
`;

export const examplePrompts: ExamplePrompt[] = [
  {
    title: "What can Nebula do?",
    message: "What can Nebula do?",
    interceptedReply: whatCanNebulaDoReply,
  },
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
];
