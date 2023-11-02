import type { Chain } from "../src/types";
export default {
  "chain": "Toronet",
  "chainId": 77777,
  "ens": {
    "registry": "0x1f45a71f4aAD769E27c969c4359E0e250C67165c"
  },
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://toronet.org/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmciSvgLatP6jhgdazuiyD3fSrhipfAN7wC943v1qxcrpv",
    "width": 846,
    "height": 733,
    "format": "png"
  },
  "infoURL": "https://toronet.org",
  "name": "Toronet Mainnet",
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "networkId": 77777,
  "rpc": [
    "https://toronet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://77777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://toronet.org/rpc"
  ],
  "shortName": "Toronet",
  "slug": "toronet",
  "testnet": false
} as const satisfies Chain;