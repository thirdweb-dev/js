import type { Chain } from "../src/types";
export default {
  "chain": "Toronet",
  "chainId": 54321,
  "ens": {
    "registry": "0x059C474f26D65B0458F9da10A649a7322aB02C09"
  },
  "explorers": [
    {
      "name": "toronet_explorer",
      "url": "https://testnet.toronet.org",
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
  "name": "Toronet Testnet",
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "networkId": 54321,
  "rpc": [
    "https://toronet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://54321.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.toronet.org/rpc"
  ],
  "shortName": "ToronetTestnet",
  "slug": "toronet-testnet",
  "testnet": true
} as const satisfies Chain;