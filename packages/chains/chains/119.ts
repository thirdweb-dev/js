export default {
  "name": "ENULS Mainnet",
  "chain": "ENULS",
  "rpc": [
    "https://enuls.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmapi.nuls.io",
    "https://evmapi2.nuls.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "NULS",
    "symbol": "NULS",
    "decimals": 18
  },
  "infoURL": "https://nuls.io",
  "shortName": "enuls",
  "chainId": 119,
  "networkId": 119,
  "icon": {
    "url": "ipfs://QmYz8LK5WkUN8UwqKfWUjnyLuYqQZWihT7J766YXft4TSy",
    "width": 26,
    "height": 41,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "enulsscan",
      "url": "https://evmscan.nuls.io",
      "icon": "enuls",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "enuls"
} as const;