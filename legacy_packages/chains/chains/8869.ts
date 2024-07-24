import type { Chain } from "../src/types";
export default {
  "chain": "lif3chain",
  "chainId": 8869,
  "explorers": [
    {
      "name": "lif3scout",
      "url": "https://lif3scout.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmQqNBEqNnNsaSV6rik6mM8VnaSgYFxfEkjkiXSwgmEgaH",
    "width": 200,
    "height": 200,
    "format": "svg"
  },
  "infoURL": "https://docs.lif3.com/",
  "name": "Lif3 Chain",
  "nativeCurrency": {
    "name": "LIF3",
    "symbol": "LIF3",
    "decimals": 18
  },
  "networkId": 8869,
  "rpc": [
    "https://8869.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lif3.com"
  ],
  "shortName": "lif3-mainnet",
  "slug": "lif3-chain",
  "testnet": false
} as const satisfies Chain;