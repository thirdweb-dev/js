export default {
  "name": "Kava EVM",
  "chain": "KAVA",
  "rpc": [
    "https://kava-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.kava.io",
    "https://evm2.kava.io",
    "wss://wevm.kava.io",
    "wss://wevm2.kava.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "shortName": "kava",
  "chainId": 2222,
  "networkId": 2222,
  "icon": {
    "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
    "width": 1186,
    "height": 360,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Kava EVM Explorer",
      "url": "https://explorer.kava.io",
      "standard": "EIP3091",
      "icon": "kava"
    }
  ],
  "testnet": false,
  "slug": "kava-evm"
} as const;