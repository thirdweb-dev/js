export default {
  "name": "SPS",
  "chain": "SPS",
  "rpc": [
    "https://sps.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ssquad.games"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ECG",
    "symbol": "ECG",
    "decimals": 18
  },
  "infoURL": "https://ssquad.games/",
  "shortName": "SPS",
  "chainId": 13000,
  "networkId": 13000,
  "explorers": [
    {
      "name": "SPS Explorer",
      "url": "http://spsscan.ssquad.games",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "sps"
} as const;