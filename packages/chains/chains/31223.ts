export default {
  "name": "CloudTx Mainnet",
  "chain": "CLD",
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "rpc": [
    "https://cloudtx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.cloudtx.finance"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance",
  "shortName": "CLDTX",
  "chainId": 31223,
  "networkId": 31223,
  "explorers": [
    {
      "name": "cloudtxscan",
      "url": "https://scan.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "cloudtx"
} as const;