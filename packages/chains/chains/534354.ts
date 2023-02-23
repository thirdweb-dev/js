export default {
  "name": "Scroll Pre-Alpha Testnet",
  "chain": "ETH",
  "rpc": [
    "https://scroll-pre-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://prealpha-rpc.scroll.io/l2"
  ],
  "faucets": [
    "https://prealpha.scroll.io/faucet"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "TSETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-prealpha",
  "chainId": 534354,
  "networkId": 534354,
  "explorers": [
    {
      "name": "Scroll L2 Block Explorer",
      "url": "https://l2scan.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "scroll-pre-alpha-testnet"
} as const;