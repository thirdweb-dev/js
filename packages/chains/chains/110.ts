export default {
  "name": "Proton Testnet",
  "chain": "XPR",
  "rpc": [
    "https://proton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://protontestnet.greymass.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Proton",
    "symbol": "XPR",
    "decimals": 4
  },
  "infoURL": "https://protonchain.com",
  "shortName": "xpr",
  "chainId": 110,
  "networkId": 110,
  "testnet": true,
  "slug": "proton-testnet"
} as const;