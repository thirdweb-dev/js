export default {
  "name": "Zenith Mainnet",
  "chain": "Zenith",
  "rpc": [
    "https://zenith.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataserver-us-1.zenithchain.co/",
    "https://dataserver-asia-3.zenithchain.co/",
    "https://dataserver-asia-4.zenithchain.co/",
    "https://dataserver-asia-2.zenithchain.co/",
    "https://dataserver-asia-5.zenithchain.co/",
    "https://dataserver-asia-6.zenithchain.co/",
    "https://dataserver-asia-7.zenithchain.co/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ZENITH",
    "symbol": "ZENITH",
    "decimals": 18
  },
  "infoURL": "https://www.zenithchain.co/",
  "chainId": 79,
  "networkId": 79,
  "shortName": "zenith",
  "explorers": [
    {
      "name": "zenith scan",
      "url": "https://scan.zenithchain.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "zenith"
} as const;