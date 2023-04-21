import type { Chain } from "../src/types";
export default {
  "name": "EOS EVM Network",
  "chain": "EOS",
  "icon": {
    "url": "ipfs://QmXkK5D5GWizvY1FmL6pV8cYLAbhehKETubktCgh6qDJZb",
    "width": 500,
    "height": 750,
    "format": "png"
  },
  "rpc": [
    "https://eos-evm-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.evm.eosnetwork.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "infoURL": "https://eosnetwork.com/eos-evm",
  "shortName": "eos",
  "chainId": 17777,
  "networkId": 17777,
  "explorers": [
    {
      "name": "EOS EVM Explorer",
      "url": "https://explorer.evm.eosnetwork.com",
      "standard": "EIP3091"
    }
  ],
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
  "testnet": false,
  "slug": "eos-evm-network"
} as const satisfies Chain;