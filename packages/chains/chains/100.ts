export default {
  "name": "Gnosis",
  "chain": "GNO",
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "rpc": [
    "https://gnosis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gnosischain.com",
    "https://rpc.ankr.com/gnosis",
    "https://gnosischain-rpc.gateway.pokt.network",
    "https://gnosis-mainnet.public.blastapi.io",
    "wss://rpc.gnosischain.com/wss"
  ],
  "faucets": [
    "https://gnosisfaucet.com",
    "https://faucet.gimlu.com/gnosis",
    "https://stakely.io/faucet/gnosis-chain-xdai",
    "https://faucet.prussia.dev/xdai"
  ],
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://docs.gnosischain.com",
  "shortName": "gno",
  "chainId": 100,
  "networkId": 100,
  "slip44": 700,
  "explorers": [
    {
      "name": "gnosisscan",
      "url": "https://gnosisscan.io",
      "icon": "gnosisscan",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/mainnet",
      "icon": "blockscout",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "gnosis"
} as const;