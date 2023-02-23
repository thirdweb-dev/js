export default {
  "name": "ThunderCore Testnet",
  "chain": "TST",
  "rpc": [
    "https://thundercore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.thundercore.com"
  ],
  "faucets": [
    "https://faucet-testnet.thundercore.com"
  ],
  "nativeCurrency": {
    "name": "ThunderCore Testnet Token",
    "symbol": "TST",
    "decimals": 18
  },
  "infoURL": "https://thundercore.com",
  "shortName": "TST",
  "chainId": 18,
  "networkId": 18,
  "explorers": [
    {
      "name": "thundercore-blockscout-testnet",
      "url": "https://explorer-testnet.thundercore.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "thundercore-testnet"
} as const;