import type { Chain } from "../src/types";
export default {
  "name": "Beam Testnet",
  "chain": "BEAM",
  "rpc": [
    "https://beam-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/beam/testnet/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Merit Circle",
    "symbol": "MC",
    "decimals": 18
  },
  "infoURL": "https://gaming.meritcircle.io",
  "shortName": "BEAM",
  "chainId": 13337,
  "networkId": 13337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets-test.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "beam-testnet"
} as const satisfies Chain;