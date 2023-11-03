import type { Chain } from "../types";
export default {
  "chain": "FIL",
  "chainId": 314159,
  "explorers": [
    {
      "name": "Filscan - Calibration",
      "url": "https://calibration.filscan.io",
      "standard": "none"
    },
    {
      "name": "Filscout - Calibration",
      "url": "https://calibration.filscout.com/en",
      "standard": "none"
    },
    {
      "name": "Filfox - Calibration",
      "url": "https://calibration.filfox.info",
      "standard": "none"
    },
    {
      "name": "Glif Explorer - Calibration",
      "url": "https://explorer.glif.io/?network=calibration",
      "standard": "none"
    },
    {
      "name": "Beryx",
      "url": "https://beryx.zondax.ch",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.calibration.fildev.network/"
  ],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Calibration testnet",
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 314159,
  "rpc": [
    "https://filecoin-calibration-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://314159.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.calibration.node.glif.io/rpc/v1",
    "https://rpc.ankr.com/filecoin_testnet",
    "https://filecoin-calibration.chainstacklabs.com/rpc/v1",
    "https://filecoin-calibration.chainup.net/rpc/v1",
    "https://calibration.filfox.info/rpc/v1"
  ],
  "shortName": "filecoin-calibration",
  "slip44": 1,
  "slug": "filecoin-calibration-testnet",
  "testnet": true
} as const satisfies Chain;