import type { Chain } from "../src/types";
export default {
  "chainId": 17000,
  "chain": "ETH",
  "name": "Holesky",
  "rpc": [
    "https://holesky.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.holesky.ethpandaops.io"
  ],
  "slug": "holesky",
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [
    "https://faucet.holesky.ethpandaops.io",
    "https://holesky-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://holesky.ethpandaops.io",
  "shortName": "holesky",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "Holesky Explorer",
      "url": "https://holesky.beaconcha.in",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;