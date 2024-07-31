import type { Chain } from "../src/types";
export default {
  "chain": "ZERϴ Network",
  "chainId": 4457845,
  "explorers": [
    {
      "name": "ZERϴ Block Explorer",
      "url": "https://explorer.zero.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmTvjjmYw3bmjXjnpK3hDt5vtEjLe3hMza1PUFNkF33QnB",
        "width": 202,
        "height": 202,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    "https://www.alchemy.com/faucets/ethereum-sepolia",
    "https://www.infura.io/faucet/sepolia"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmTvjjmYw3bmjXjnpK3hDt5vtEjLe3hMza1PUFNkF33QnB",
    "width": 202,
    "height": 202,
    "format": "png"
  },
  "infoURL": "https://docs.zero.network/",
  "name": "ZERϴ Network",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4457845,
  "parent": {
    "type": "L2",
    "chain": "Sepolia",
    "bridges": [
      {
        "url": "https://bridge.zero.network/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://4457845.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zerion.io/v1/zero-sepolia"
  ],
  "shortName": "eth",
  "slug": "zer-network",
  "testnet": true
} as const satisfies Chain;