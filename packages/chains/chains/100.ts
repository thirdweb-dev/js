import type { Chain } from "../src/types";
export default {
  "chain": "GNO",
  "chainId": 100,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gnosis.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "gnosisscan",
      "url": "https://gnosisscan.io",
      "standard": "EIP3091"
    },
    {
      "name": "dexguru",
      "url": "https://gnosis.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://gnosisfaucet.com",
    "https://stakely.io/faucet/gnosis-chain-xdai",
    "https://faucet.prussia.dev/xdai"
  ],
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
  "networkId": 100,
  "rpc": [
    "https://100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
    "https://gnosis-rpc.publicnode.com",
    "wss://gnosis-rpc.publicnode.com"
  ],
  "shortName": "gno",
  "slip44": 700,
  "slug": "gnosis",
  "testnet": false
} as const satisfies Chain;