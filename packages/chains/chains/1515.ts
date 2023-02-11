export default {
  "name": "Beagle Messaging Chain",
  "chain": "BMC",
  "rpc": [
    "https://beagle-messaging-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beagle.chat/eth"
  ],
  "faucets": [
    "https://faucet.beagle.chat/"
  ],
  "nativeCurrency": {
    "name": "Beagle",
    "symbol": "BG",
    "decimals": 18
  },
  "infoURL": "https://beagle.chat/",
  "shortName": "beagle",
  "chainId": 1515,
  "networkId": 1515,
  "explorers": [
    {
      "name": "Beagle Messaging Chain Explorer",
      "url": "https://eth.beagle.chat",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "beagle-messaging-chain"
} as const;