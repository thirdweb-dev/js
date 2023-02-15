export default {
  "name": "XT Smart Chain Mainnet",
  "chain": "XSC",
  "icon": {
    "url": "ipfs://QmNmAFgQKkjofaBR5mhB5ygE1Gna36YBVsGkgZQxrwW85s",
    "width": 98,
    "height": 96,
    "format": "png"
  },
  "rpc": [
    "https://xt-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://datarpc1.xsc.pub",
    "https://datarpc2.xsc.pub",
    "https://datarpc3.xsc.pub"
  ],
  "faucets": [
    "https://xsc.pub/faucet"
  ],
  "nativeCurrency": {
    "name": "XT Smart Chain Native Token",
    "symbol": "XT",
    "decimals": 18
  },
  "infoURL": "https://xsc.pub/",
  "shortName": "xt",
  "chainId": 520,
  "networkId": 1024,
  "explorers": [
    {
      "name": "xscscan",
      "url": "https://xscscan.pub",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "xt-smart-chain"
} as const;