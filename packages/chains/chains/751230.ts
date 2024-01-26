import type { Chain } from "../src/types";
export default {
  "chain": "BRNKCTEST",
  "chainId": 751230,
  "explorers": [
    {
      "name": "brnktestscan",
      "url": "https://brnktest-scan.bearnetwork.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.bearnetwork.net"
  ],
  "icon": {
    "url": "ipfs://QmQqhH28QpUrreoRw5Gj8YShzdHxxVGMjfVrx3TqJNLSLv",
    "width": 1067,
    "height": 1067,
    "format": "png"
  },
  "infoURL": "https://bearnetwork.net",
  "name": "Bear Network Chain Testnet",
  "nativeCurrency": {
    "name": "Bear Network Chain Testnet Token",
    "symbol": "tBRNKC",
    "decimals": 18
  },
  "networkId": 751230,
  "rpc": [
    "https://bear-network-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://751230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://brnkc-test.bearnetwork.net"
  ],
  "shortName": "BRNKCTEST",
  "slip44": 1,
  "slug": "bear-network-chain-testnet",
  "testnet": true
} as const satisfies Chain;