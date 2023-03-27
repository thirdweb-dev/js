export default {
  "name": "DOS Tesnet",
  "chain": "DOS",
  "rpc": [
    "https://dos-tesnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test.doschain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "DOS",
    "symbol": "DOS",
    "decimals": 18
  },
  "infoURL": "http://doschain.io/",
  "shortName": "dost",
  "chainId": 3939,
  "networkId": 3939,
  "explorers": [
    {
      "name": "DOScan-Test",
      "url": "https://test.doscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "dos-tesnet"
} as const;