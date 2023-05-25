import type { Chain } from "../src/types";
export default {
  "name": "Bitfinity Network Testnet",
  "chain": "BFT",
  "rpc": [
    "https://bitfinity-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitfinity.network"
  ],
  "faucets": [
    "https://bitfinity.network/faucet"
  ],
  "nativeCurrency": {
    "name": "BITFINITY",
    "symbol": "BFT",
    "decimals": 18
  },
  "infoURL": "https://bitfinity.network",
  "shortName": "Bitfinity",
  "chainId": 355113,
  "networkId": 355113,
  "explorers": [
    {
      "name": "Bitfinity Block Explorer",
      "url": "https://explorer.bitfinity.network",
      "icon": {
        "url": "ipfs://bafkreiczbhnoc5wpjikskmehexmg3xmqr4fchrny64db4wmk3lrygqik5e",
        "width": 796,
        "height": 129,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bitfinity-network-testnet"
} as const satisfies Chain;