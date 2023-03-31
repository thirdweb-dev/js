import type { Chain } from "../src/types";
export default {
  "name": "Rangers Protocol Testnet Robin",
  "chain": "Rangers",
  "icon": {
    "url": "ipfs://QmXR5e5SDABWfQn6XT9uMsVYAo5Bv7vUv4jVs8DFqatZWG",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "rpc": [
    "https://rangers-protocol-testnet-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "tRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "trpg",
  "chainId": 9527,
  "networkId": 9527,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "rangers-protocol-testnet-robin"
} as const satisfies Chain;