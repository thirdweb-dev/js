import type { Chain } from "../src/types";
export default {
  "chainId": 134,
  "chain": "Bellecour",
  "name": "iExec Sidechain",
  "rpc": [
    "https://iexec-sidechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bellecour.iex.ec"
  ],
  "slug": "iexec-sidechain",
  "icon": {
    "url": "ipfs://QmUYKpVmZL4aS3TEZLG5wbrRJ6exxLiwm1rejfGYYNicfb",
    "width": 155,
    "height": 155,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "xRLC",
    "symbol": "xRLC",
    "decimals": 18
  },
  "infoURL": "https://iex.ec",
  "shortName": "rlc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.bellecour.iex.ec",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;