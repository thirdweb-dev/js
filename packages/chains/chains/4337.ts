import type { Chain } from "../src/types";
export default {
  "chainId": 4337,
  "chain": "BEAM",
  "name": "Beam",
  "rpc": [
    "https://beam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/beam/mainnet/rpc"
  ],
  "slug": "beam",
  "icon": {
    "url": "ipfs://QmQJ21NWyGGDraicVEzS1Uqq1yXahM9NCuNZgnfYvtspdt",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Merit Circle",
    "symbol": "MC",
    "decimals": 18
  },
  "infoURL": "https://www.onbeam.com",
  "shortName": "beam",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;