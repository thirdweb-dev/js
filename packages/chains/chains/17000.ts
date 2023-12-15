import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 17000,
  "explorers": [
    {
      "name": "Holesky Explorer",
      "url": "https://holesky.beaconcha.in",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    },
    {
      "name": "otterscan-holesky",
      "url": "https://holesky.otterscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    },
    {
      "name": "Holesky Etherscan",
      "url": "https://holesky.etherscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.holesky.ethpandaops.io",
    "https://holesky-faucet.pk910.de"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://holesky.ethpandaops.io",
  "name": "Holesky",
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 17000,
  "redFlags": [],
  "rpc": [
    "https://holesky.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.holesky.ethpandaops.io",
    "https://ethereum-holesky.publicnode.com",
    "wss://ethereum-holesky.publicnode.com"
  ],
  "shortName": "holesky",
  "slug": "holesky",
  "status": "incubating",
  "testnet": true,
  "title": "Ethereum Testnet Holesky"
} as const satisfies Chain;