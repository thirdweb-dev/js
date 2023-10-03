import type { Chain } from "../src/types";
export default {
  "chain": "EOS",
  "chainId": 15557,
  "explorers": [
    {
      "name": "EOS EVM Explorer",
      "url": "https://explorer.testnet.evm.eosnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmXkK5D5GWizvY1FmL6pV8cYLAbhehKETubktCgh6qDJZb",
    "width": 500,
    "height": 750,
    "format": "png"
  },
  "infoURL": "https://eosnetwork.com/eos-evm",
  "name": "EOS EVM Network Testnet",
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://eos-evm-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet.evm.eosnetwork.com"
  ],
  "shortName": "eos-testnet",
  "slug": "eos-evm-network-testnet",
  "testnet": true
} as const satisfies Chain;