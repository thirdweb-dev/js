import type { Chain } from "../src/types";
export default {
  "chain": "BEAM",
  "chainId": 13337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets-test.avax.network/beam",
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
  "name": "Beam Testnet",
  "nativeCurrency": {
    "name": "Merit Circle",
    "symbol": "MC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://beam-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/beam/testnet/rpc"
  ],
  "shortName": "beam-testnet",
  "slug": "beam-testnet",
  "testnet": true
} as const satisfies Chain;