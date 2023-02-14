export default {
  "name": "BMC Testnet",
  "chain": "BMC",
  "rpc": [
    "https://bmc-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bmcchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "shortName": "BMCT",
  "chainId": 189,
  "networkId": 189,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmctestnet.blockmeta.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "bmc-testnet"
} as const;