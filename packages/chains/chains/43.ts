export default {
  "name": "Darwinia Pangolin Testnet",
  "chain": "pangolin",
  "rpc": [
    "https://darwinia-pangolin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangolin-rpc.darwinia.network"
  ],
  "faucets": [
    "https://docs.crab.network/dvm/wallets/dvm-metamask#apply-for-the-test-token"
  ],
  "nativeCurrency": {
    "name": "Pangolin Network Native Token",
    "symbol": "PRING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "pangolin",
  "chainId": 43,
  "networkId": 43,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangolin.subscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "darwinia-pangolin-testnet"
} as const;