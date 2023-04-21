import type { Chain } from "../src/types";
export default {
  "name": "EOS EVM Network Testnet",
  "chain": "EOS",
  "icon": {
    "url": "ipfs://QmXkK5D5GWizvY1FmL6pV8cYLAbhehKETubktCgh6qDJZb",
    "width": 500,
    "height": 750,
    "format": "png"
  },
  "rpc": [
    "https://eos-evm-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet.evm.eosnetwork.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "infoURL": "https://eosnetwork.com/eos-evm",
  "shortName": "eos-testnet",
  "chainId": 15557,
  "networkId": 15557,
  "explorers": [
    {
      "name": "EOS EVM Explorer",
      "url": "https://explorer.testnet.evm.eosnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.testnet.evm.eosnetwork.com"
      }
    ]
  },
  "testnet": true,
  "slug": "eos-evm-network-testnet"
} as const satisfies Chain;