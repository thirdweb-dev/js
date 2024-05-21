import type { Chain } from "../src/types";
export default {
  "chain": "BFT",
  "chainId": 355113,
  "explorers": [
    {
      "name": "Bitfinity Testnet Block Explorer",
      "url": "https://explorer.testnet.bitfinity.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiczbhnoc5wpjikskmehexmg3xmqr4fchrny64db4wmk3lrygqik5e",
        "width": 796,
        "height": 129,
        "format": "png"
      }
    },
    {
      "name": "Bitfinity Testnet Block Explorer",
      "url": "https://bitfinity-test.dex.guru",
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
    "https://bitfinity.network/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://bitfinity.network",
  "name": "Bitfinity Network Testnet",
  "nativeCurrency": {
    "name": "Bitfinity Token",
    "symbol": "BFT",
    "decimals": 18
  },
  "networkId": 355113,
  "rpc": [
    "https://355113.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitfinity.network"
  ],
  "shortName": "bitfinity-testnet",
  "slug": "bitfinity-network-testnet",
  "testnet": true
} as const satisfies Chain;