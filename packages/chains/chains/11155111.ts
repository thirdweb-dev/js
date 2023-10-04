import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 11155111,
  "explorers": [
    {
      "name": "etherscan-sepolia",
      "url": "https://sepolia.etherscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "otterscan-sepolia",
      "url": "https://sepolia.otterscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=11155111&address=${ADDRESS}"
  ],
  "features": [],
  "infoURL": "https://sepolia.otterscan.io",
  "name": "Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.infura.io/v3/${INFURA_API_KEY}",
    "wss://sepolia.infura.io/v3/${INFURA_API_KEY}",
    "https://rpc.sepolia.org",
    "https://rpc2.sepolia.org",
    "https://rpc-sepolia.rockx.com",
    "https://rpc.sepolia.ethpandaops.io",
    "https://sepolia.gateway.tenderly.co",
    "wss://sepolia.gateway.tenderly.co",
    "https://ethereum-sepolia.publicnode.com",
    "wss://ethereum-sepolia.publicnode.com"
  ],
  "shortName": "sep",
  "slug": "sepolia",
  "testnet": true
} as const satisfies Chain;