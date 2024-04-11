import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 90354,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "Block Explorer",
      "url": "https://explorerl2new-camp-network-4xje7wy105.t.conduit.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
    "width": 551,
    "height": 540,
    "format": "png"
  },
  "name": "Camp Network",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 90354,
  "redFlags": [],
  "rpc": [
    "https://90354.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-camp-network-4xje7wy105.t.conduit.xyz/"
  ],
  "shortName": "campaign-l2",
  "slug": "camp-network",
  "testnet": false
} as const satisfies Chain;