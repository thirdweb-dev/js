export default {
  "name": "iExec Sidechain",
  "chain": "Bellecour",
  "icon": {
    "url": "ipfs://QmUYKpVmZL4aS3TEZLG5wbrRJ6exxLiwm1rejfGYYNicfb",
    "width": 155,
    "height": 155,
    "format": "png"
  },
  "rpc": [
    "https://iexec-sidechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bellecour.iex.ec"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "xRLC",
    "symbol": "xRLC",
    "decimals": 18
  },
  "infoURL": "https://iex.ec",
  "shortName": "rlc",
  "chainId": 134,
  "networkId": 134,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.bellecour.iex.ec",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "iexec-sidechain"
} as const;