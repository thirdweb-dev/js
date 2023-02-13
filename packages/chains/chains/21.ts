export default {
  "name": "Elastos Smart Chain Testnet",
  "chain": "ETH",
  "rpc": [
    "https://elastos-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-testnet.elastos.io/eth"
  ],
  "faucets": [
    "https://esc-faucet.elastos.io/"
  ],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "tELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "esct",
  "chainId": 21,
  "networkId": 21,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc-testnet.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "elastos-smart-chain-testnet"
} as const;