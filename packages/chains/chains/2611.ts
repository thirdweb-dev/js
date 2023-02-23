export default {
  "name": "Redlight Chain Mainnet",
  "chain": "REDLC",
  "rpc": [
    "https://redlight-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed2.redlightscan.finance"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Redlight Coin",
    "symbol": "REDLC",
    "decimals": 18
  },
  "infoURL": "https://redlight.finance/",
  "shortName": "REDLC",
  "chainId": 2611,
  "networkId": 2611,
  "explorers": [
    {
      "name": "REDLC Explorer",
      "url": "https://redlightscan.finance",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "redlight-chain"
} as const;