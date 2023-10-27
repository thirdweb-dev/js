import type { Chain } from "../src/types";
export default {
  "chain": "EOS",
  "chainId": 17777,
  "explorers": [
    {
      "name": "EOS EVM Explorer",
      "url": "https://explorer.evm.eosnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXkK5D5GWizvY1FmL6pV8cYLAbhehKETubktCgh6qDJZb",
    "width": 500,
    "height": 750,
    "format": "png"
  },
  "infoURL": "https://eosnetwork.com/eos-evm",
  "name": "EOS EVM Network",
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "networkId": 17777,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.evm.eosnetwork.com"
      },
      {
        "url": "https://app.multichain.org"
      }
    ]
  },
  "rpc": [
    "https://eos-evm-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.evm.eosnetwork.com"
  ],
  "shortName": "eos",
  "slug": "eos-evm-network",
  "testnet": false
} as const satisfies Chain;