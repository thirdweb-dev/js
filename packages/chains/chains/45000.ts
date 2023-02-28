export default {
  "name": "Autobahn Network",
  "chain": "TXL",
  "rpc": [
    "https://autobahn-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.autobahn.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TXL",
    "symbol": "TXL",
    "decimals": 18
  },
  "infoURL": "https://autobahn.network",
  "shortName": "AutobahnNetwork",
  "chainId": 45000,
  "networkId": 45000,
  "icon": {
    "url": "ipfs://QmZP19pbqTco4vaP9siduLWP8pdYArFK3onfR55tvjr12s",
    "width": 489,
    "height": 489,
    "format": "png"
  },
  "explorers": [
    {
      "name": "autobahn explorer",
      "url": "https://explorer.autobahn.network",
      "icon": "autobahn",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "autobahn-network"
} as const;