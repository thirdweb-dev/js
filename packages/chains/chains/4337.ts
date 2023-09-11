import type { Chain } from "../src/types";
export default {
  "name": "Beam",
  "chain": "BEAM",
  "rpc": [
    "https://beam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
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
  "infoURL": "https://www.onbeam.com",
  "shortName": "beam",
  "icon": {
    "url": "ipfs://QmQJ21NWyGGDraicVEzS1Uqq1yXahM9NCuNZgnfYvtspdt",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "chainId": 4337,
  "networkId": 4337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "beam"
} as const satisfies Chain;