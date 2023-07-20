import type { Chain } from "../src/types";
export default {
  "name": "Toronet Testnet",
  "chain": "Toronet",
  "icon": {
    "url": "ipfs://QmciSvgLatP6jhgdazuiyD3fSrhipfAN7wC943v1qxcrpv",
    "width": 846,
    "height": 733,
    "format": "png"
  },
  "rpc": [
    "https://toronet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.toronet.org/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toro",
    "symbol": "TORO",
    "decimals": 18
  },
  "infoURL": "https://toronet.org",
  "shortName": "ToronetTestnet",
  "chainId": 54321,
  "networkId": 54321,
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
  "testnet": true,
  "slug": "toronet-testnet"
} as const satisfies Chain;