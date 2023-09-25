import type { Chain } from "../src/types";
export default {
  "chainId": 15557,
  "chain": "EOS",
  "name": "EOS EVM Network Testnet",
  "rpc": [
    "https://eos-evm-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.testnet.evm.eosnetwork.com"
  ],
  "slug": "eos-evm-network-testnet",
  "icon": {
    "url": "ipfs://QmXkK5D5GWizvY1FmL6pV8cYLAbhehKETubktCgh6qDJZb",
    "width": 500,
    "height": 750,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EOS",
    "symbol": "EOS",
    "decimals": 18
  },
  "infoURL": "https://eosnetwork.com/eos-evm",
  "shortName": "eos-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "EOS EVM Explorer",
      "url": "https://explorer.testnet.evm.eosnetwork.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;