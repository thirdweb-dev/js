export default {
  "name": "Trust EVM Testnet",
  "chain": "Trust EVM Testnet",
  "rpc": [
    "https://trust-evm-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet-dev.trust.one"
  ],
  "faucets": [
    "https://faucet.testnet-dev.trust.one/"
  ],
  "nativeCurrency": {
    "name": "Trust EVM",
    "symbol": "EVM",
    "decimals": 18
  },
  "infoURL": "https://www.trust.one/",
  "shortName": "TrustTestnet",
  "chainId": 15555,
  "networkId": 15555,
  "explorers": [
    {
      "name": "Trust EVM Explorer",
      "url": "https://trustscan.one",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "trust-evm-testnet"
} as const;