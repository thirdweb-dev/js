import type { Chain } from "../src/types";
export default {
  "chain": "Bellecour",
  "chainId": 134,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.bellecour.iex.ec",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUYKpVmZL4aS3TEZLG5wbrRJ6exxLiwm1rejfGYYNicfb",
    "width": 155,
    "height": 155,
    "format": "png"
  },
  "infoURL": "https://iex.ec",
  "name": "iExec Sidechain",
  "nativeCurrency": {
    "name": "xRLC",
    "symbol": "xRLC",
    "decimals": 18
  },
  "networkId": 134,
  "rpc": [
    "https://134.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bellecour.iex.ec"
  ],
  "shortName": "rlc",
  "slug": "iexec-sidechain",
  "testnet": false
} as const satisfies Chain;