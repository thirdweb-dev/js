export default {
  "name": "CloudTx Testnet",
  "chain": "CloudTx",
  "icon": {
    "url": "ipfs://QmSEsi71AdA5HYH6VNC5QUQezFg1C7BiVQJdx1VVfGz3g3",
    "width": 713,
    "height": 830,
    "format": "png"
  },
  "rpc": [
    "https://cloudtx-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.cloudtx.finance"
  ],
  "faucets": [
    "https://faucet.cloudtx.finance"
  ],
  "nativeCurrency": {
    "name": "CloudTx",
    "symbol": "CLD",
    "decimals": 18
  },
  "infoURL": "https://cloudtx.finance/",
  "shortName": "CLD",
  "chainId": 31224,
  "networkId": 31224,
  "explorers": [
    {
      "name": "cloudtxexplorer",
      "url": "https://explorer.cloudtx.finance",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "cloudtx-testnet"
} as const;