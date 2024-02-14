import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 168587773,
  "explorers": [
    {
      "name": "Blast Sepolia Explorer",
      "url": "https://testnet.blastscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.quicknode.com/blast/sepolia"
  ],
  "infoURL": "https://blast.io/",
  "name": "Blast Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 168587773,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111"
  },
  "rpc": [
    "https://blast-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://168587773.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.blast.io"
  ],
  "shortName": "blastsepolia",
  "slug": "blast-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;