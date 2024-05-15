import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 62831,
  "explorers": [
    {
      "name": "Avalanche Subnet Testnet Explorer",
      "url": "https://subnets-test.avax.network/plyr",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=plyr"
  ],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "PLYR TAU TESTNET",
  "nativeCurrency": {
    "name": "PLYR TAU TESTNET Token",
    "symbol": "PLYR",
    "decimals": 18
  },
  "networkId": 62831,
  "redFlags": [],
  "rpc": [
    "https://62831.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/plyr/testnet/rpc"
  ],
  "shortName": "PLYR TAU TESTNET",
  "slip44": 1,
  "slug": "plyr-tau-testnet",
  "testnet": true
} as const satisfies Chain;