import type { Chain } from "../src/types";
export default {
  "chain": "UPchain",
  "chainId": 336666,
  "explorers": [
    {
      "name": "UPchain Mainnet Explorer",
      "url": "https://explorer.uniport.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNMqcPyQnaaFfUDsmsnu2T6agZfoWij3zFYebCNUPkfAH",
        "width": 320,
        "height": 320,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmNMqcPyQnaaFfUDsmsnu2T6agZfoWij3zFYebCNUPkfAH",
    "width": 320,
    "height": 320,
    "format": "jpg"
  },
  "infoURL": "https://uniport.network",
  "name": "UPchain Mainnet",
  "nativeCurrency": {
    "name": "UBTC",
    "symbol": "UBTC",
    "decimals": 18
  },
  "networkId": 336666,
  "rpc": [
    "https://336666.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.uniport.network"
  ],
  "shortName": "UPchain-mainnet",
  "slug": "upchain",
  "testnet": false
} as const satisfies Chain;