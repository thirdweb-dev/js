import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 81457,
  "explorers": [
    {
      "name": "Blastscan",
      "url": "https://blastscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeifc2h3x7jgy4x4nmg2m54ghbvmkfu6oweujambwefzqzew5vujhsi",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    },
    {
      "name": "Blast Explorer",
      "url": "https://blastexplorer.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafybeifc2h3x7jgy4x4nmg2m54ghbvmkfu6oweujambwefzqzew5vujhsi",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeifc2h3x7jgy4x4nmg2m54ghbvmkfu6oweujambwefzqzew5vujhsi",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://blast.io/",
  "name": "Blast",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 81457,
  "parent": {
    "type": "L2",
    "chain": "eip155-1"
  },
  "rpc": [
    "https://81457.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blast.io",
    "https://rpc.ankr.com/blast",
    "https://blast.din.dev/rpc",
    "https://blastl2-mainnet.public.blastapi.io",
    "https://blast.blockpi.network/v1/rpc/public"
  ],
  "shortName": "blastmainnet",
  "slug": "blast-blastmainnet",
  "status": "active",
  "testnet": false
} as const satisfies Chain;