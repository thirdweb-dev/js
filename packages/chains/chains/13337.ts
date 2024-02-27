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
  "faucets": [
    "https://faucet.avax.network/?subnet=beam",
    "https://faucet.onbeam.com"
  ],
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
    "name": "Beam",
    "symbol": "BEAM",
    "decimals": 18
  },
  "networkId": 13337,
  "rpc": [
    "https://13337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://build.onbeam.com/rpc/testnet",
    "wss://build.onbeam.com/ws/testnet",
    "https://subnets.avax.network/beam/testnet/rpc",
    "wss://subnets.avax.network/beam/testnet/ws"
  ],
  "shortName": "beam-testnet",
  "slip44": 1,
  "slug": "beam-testnet",
  "testnet": true
} as const satisfies Chain;