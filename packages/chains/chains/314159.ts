import type { Chain } from "../src/types";
export default {
  "name": "Filecoin - Calibration testnet",
  "chain": "FIL",
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://filecoin-calibration-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.calibration.node.glif.io/rpc/v1",
    "https://rpc.ankr.com/filecoin_testnet",
    "https://filecoin-calibration.chainstacklabs.com/rpc/v1",
    "https://filecoin-calibration.chainup.net/rpc/v1",
    "https://calibration.filfox.info/rpc/v1"
  ],
  "faucets": [
    "https://faucet.calibration.fildev.network/"
  ],
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "shortName": "filecoin-calibration",
  "chainId": 314159,
  "networkId": 314159,
  "slip44": 1,
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
  "testnet": true,
  "slug": "filecoin-calibration-testnet"
} as const satisfies Chain;