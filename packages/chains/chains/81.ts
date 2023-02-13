export default {
  "name": "Zenith Testnet (Vilnius)",
  "chain": "Zenith",
  "rpc": [
    "https://zenith-testnet-vilnius.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://vilnius.zenithchain.co/http"
  ],
  "faucets": [
    "https://faucet.zenithchain.co/"
  ],
  "nativeCurrency": {
    "name": "Vilnius",
    "symbol": "VIL",
    "decimals": 18
  },
  "infoURL": "https://www.zenithchain.co/",
  "chainId": 81,
  "networkId": 81,
  "shortName": "VIL",
  "explorers": [
    {
      "name": "vilnius scan",
      "url": "https://vilnius.scan.zenithchain.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "zenith-testnet-vilnius"
} as const;