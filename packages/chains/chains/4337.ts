import type { Chain } from "../src/types";
export default {
  "chain": "BEAM",
  "chainId": 4337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmQJ21NWyGGDraicVEzS1Uqq1yXahM9NCuNZgnfYvtspdt",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.onbeam.com",
  "name": "Beam",
  "nativeCurrency": {
    "name": "Merit Circle",
    "symbol": "MC",
    "decimals": 18
  },
  "networkId": 4337,
  "rpc": [
    "https://beam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/beam/mainnet/rpc"
  ],
  "shortName": "beam",
  "slug": "beam",
  "testnet": false
} as const satisfies Chain;