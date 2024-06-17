import type { Chain } from "../src/types";
export default {
  "chain": "MetaLink",
  "chainId": 2004,
  "explorers": [
    {
      "name": "MetaScan",
      "url": "http://twoto3.com:3000",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfSXRkDPSwt7heQ24pDtWKN6vvervEaTJHmueyRp1mpg1",
    "width": 800,
    "height": 800,
    "format": "jpg"
  },
  "infoURL": "http://totwo3.com:3000",
  "name": "MetaLink Network",
  "nativeCurrency": {
    "name": "MetaLink",
    "symbol": "MTL",
    "decimals": 18
  },
  "networkId": 2004,
  "rpc": [
    "https://2004.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://77.237.237.69:9933"
  ],
  "shortName": "mtl",
  "slug": "metalink-network",
  "testnet": false
} as const satisfies Chain;