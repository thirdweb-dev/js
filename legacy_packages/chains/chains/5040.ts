import type { Chain } from "../src/types";
export default {
  "chain": "ONIGIRI",
  "chainId": 5040,
  "explorers": [
    {
      "name": "ONIGIRI Explorer",
      "url": "https://subnets.avax.network/onigiri",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreieenivbkpmaxslvvvaybi53hynnarng4ek37xhtf5euvsyunvhbai",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.ongr.org/",
  "name": "ONIGIRI Subnet",
  "nativeCurrency": {
    "name": "ONIGIRI",
    "symbol": "ONGR",
    "decimals": 18
  },
  "networkId": 5040,
  "rpc": [
    "https://5040.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/onigiri/mainnet/rpc"
  ],
  "shortName": "onigiri",
  "slug": "onigiri-subnet",
  "testnet": false
} as const satisfies Chain;