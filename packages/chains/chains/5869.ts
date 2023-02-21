export default {
  "name": "Wegochain Rubidium Mainnet",
  "chain": "RBD",
  "rpc": [
    "https://wegochain-rubidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy.wegochain.io",
    "http://wallet.wegochain.io:7764"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rubid",
    "symbol": "RBD",
    "decimals": 18
  },
  "infoURL": "https://www.wegochain.io",
  "shortName": "rbd",
  "chainId": 5869,
  "networkId": 5869,
  "explorers": [
    {
      "name": "wegoscan2",
      "url": "https://scan2.wegochain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "wegochain-rubidium"
} as const;