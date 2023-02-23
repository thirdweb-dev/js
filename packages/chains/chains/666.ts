export default {
  "name": "Pixie Chain Testnet",
  "chain": "PixieChain",
  "rpc": [
    "https://pixie-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.chain.pixie.xyz",
    "wss://ws-testnet.chain.pixie.xyz"
  ],
  "faucets": [
    "https://chain.pixie.xyz/faucet"
  ],
  "nativeCurrency": {
    "name": "Pixie Chain Testnet Native Token",
    "symbol": "PCTT",
    "decimals": 18
  },
  "infoURL": "https://scan-testnet.chain.pixie.xyz",
  "shortName": "pixie-chain-testnet",
  "chainId": 666,
  "networkId": 666,
  "testnet": true,
  "slug": "pixie-chain-testnet"
} as const;