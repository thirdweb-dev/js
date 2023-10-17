import type { Chain } from "../src/types";
export default {
  "chain": "GNO",
  "chainId": 100,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gnosis.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "gnosisscan",
      "url": "https://gnosisscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://gnosisfaucet.com",
    "https://stakely.io/faucet/gnosis-chain-xdai",
    "https://faucet.prussia.dev/xdai"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "infoURL": "https://docs.gnosischain.com",
  "name": "Gnosis",
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "XDAI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gnosis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gnosischain.com",
    "https://rpc.gnosis.gateway.fm",
    "https://rpc.ankr.com/gnosis",
    "https://gnosischain-rpc.gateway.pokt.network",
    "https://gnosis-mainnet.public.blastapi.io",
    "https://gnosis.api.onfinality.io/public",
    "https://gnosis.blockpi.network/v1/rpc/public",
    "https://web3endpoints.com/gnosischain-mainnet",
    "https://gnosis.oat.farm",
    "wss://rpc.gnosischain.com/wss",
    "https://gnosis.publicnode.com",
    "wss://gnosis.publicnode.com"
  ],
  "shortName": "gno",
  "slug": "gnosis",
  "testnet": false
} as const satisfies Chain;