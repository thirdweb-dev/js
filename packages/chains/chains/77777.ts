import type { Chain } from "../src/types";
export default {
  "name": "Toronet Mainnet",
  "chain": "Toronet",
  "icon": {
    "url": "ipfs://QmciSvgLatP6jhgdazuiyD3fSrhipfAN7wC943v1qxcrpv",
    "width": 846,
    "height": 733,
    "format": "png"
  },
  "rpc": [
    "https://toronet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://toronet.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "infoURL": "https://toronet.org",
  "shortName": "Toronet",
  "chainId": 77777,
  "networkId": 77777,
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
  "testnet": false,
  "slug": "toronet"
} as const satisfies Chain;