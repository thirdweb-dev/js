import type { Chain } from "../src/types";
export default {
  "chain": "BFT",
  "chainId": 355113,
  "explorers": [
    {
      "name": "Bitfinity Block Explorer",
      "url": "https://explorer.bitfinity.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiczbhnoc5wpjikskmehexmg3xmqr4fchrny64db4wmk3lrygqik5e",
        "width": 796,
        "height": 129,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://bitfinity.network/faucet"
  ],
  "infoURL": "https://bitfinity.network",
  "name": "Bitfinity Network Testnet",
  "nativeCurrency": {
    "name": "BITFINITY",
    "symbol": "BFT",
    "decimals": 18
  },
  "networkId": 355113,
  "rpc": [
    "https://355113.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitfinity.network"
  ],
  "shortName": "Bitfinity",
  "slip44": 1,
  "slug": "bitfinity-network-testnet",
  "testnet": true
} as const satisfies Chain;