import type { Chain } from "../src/types";
export default {
  "name": "Beam Subnet",
  "chain": "BEAM",
  "rpc": [
    "https://beam-subnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/beam/mainnet/rpc"
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
  "infoURL": "https://www.onbeam.com/",
  "shortName": "beamsubnet",
  "chainId": 4337,
  "networkId": 4337,
  "explorers": [
    {
      "name": "BEAM Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "beam-subnet"
} as const satisfies Chain;