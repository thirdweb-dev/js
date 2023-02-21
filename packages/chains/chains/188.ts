export default {
  "name": "BMC Mainnet",
  "chain": "BMC",
  "rpc": [
    "https://bmc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bmcchain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BTM",
    "symbol": "BTM",
    "decimals": 18
  },
  "infoURL": "https://bmc.bytom.io/",
  "shortName": "BMC",
  "chainId": 188,
  "networkId": 188,
  "explorers": [
    {
      "name": "Blockmeta",
      "url": "https://bmc.blockmeta.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bmc"
} as const;