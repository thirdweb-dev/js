export default {
  "name": "EOS Mainnet",
  "chain": "EOS",
  "rpc": [
    "https://eos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.eosargentina.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "infoURL": "https://eoscommunity.org/",
  "shortName": "EOSMainnet",
  "chainId": 59,
  "networkId": 59,
  "explorers": [
    {
      "name": "bloks",
      "url": "https://bloks.eosargentina.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "eos"
} as const;