import type { Chain } from "../src/types";
export default {
  "name": "Bear Network Chain Testnet",
  "chain": "BRNKCTEST",
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "rpc": [
    "https://bear-network-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-test.bearnetwork.net"
  ],
  "faucets": [
    "https://faucet.bearnetwork.net"
  ],
  "nativeCurrency": {
    "name": "Bear Network Chain Testnet Token",
    "symbol": "tBRNKC",
    "decimals": 18
  },
  "infoURL": "https://bearnetwork.net",
  "shortName": "BRNKCTEST",
  "chainId": 751230,
  "networkId": 751230,
  "explorers": [
    {
      "name": "brnktestscan",
      "url": "https://brnktest-scan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bear-network-chain-testnet"
} as const satisfies Chain;