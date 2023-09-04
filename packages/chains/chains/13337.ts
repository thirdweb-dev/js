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
  "infoURL": "https://www.onbeam.com",
  "shortName": "beam-testnet",
  "icon": {
    "url": "ipfs://QmQJ21NWyGGDraicVEzS1Uqq1yXahM9NCuNZgnfYvtspdt",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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