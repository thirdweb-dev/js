import type { Chain } from "../src/types";
export default {
  "chain": "BLX",
  "chainId": 879151,
  "explorers": [
    {
      "name": "BlocX Mainnet Explorer",
      "url": "https://explorer.blxscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmXM7XiLdSxhCub8MLSSo2J9V2qAkTcwdAGxcT57kurUzg",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXM7XiLdSxhCub8MLSSo2J9V2qAkTcwdAGxcT57kurUzg",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.blocxchain.org/",
  "name": "BlocX Mainnet",
  "nativeCurrency": {
    "name": "BlocX",
    "symbol": "BLX",
    "decimals": 18
  },
  "networkId": 879151,
  "rpc": [
    "https://blocx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://879151.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.blxscan.com/"
  ],
  "shortName": "blx",
  "slug": "blocx",
  "testnet": false
} as const satisfies Chain;