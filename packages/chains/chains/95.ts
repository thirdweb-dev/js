export default {
  "name": "CryptoKylin Testnet",
  "chain": "EOS",
  "rpc": [
    "https://cryptokylin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kylin.eosargentina.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "infoURL": "https://www.cryptokylin.io/",
  "shortName": "KylinTestnet",
  "chainId": 95,
  "networkId": 95,
  "explorers": [
    {
      "name": "eosq",
      "url": "https://kylin.eosargentina.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "cryptokylin-testnet"
} as const;