export default {
  "name": "Endurance Smart Chain Mainnet",
  "chain": "ACE",
  "rpc": [
    "https://endurance-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-endurance.fusionist.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Endurance Chain Native Token",
    "symbol": "ACE",
    "decimals": 18
  },
  "infoURL": "https://ace.fusionist.io/",
  "shortName": "ace",
  "chainId": 648,
  "networkId": 648,
  "explorers": [
    {
      "name": "Endurance Scan",
      "url": "https://explorer.endurance.fusionist.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "endurance-smart-chain"
} as const;