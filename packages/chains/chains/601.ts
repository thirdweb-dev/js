import type { Chain } from "../src/types";
export default {
  "name": "PEER Testnet",
  "chain": "PEER",
  "rpc": [
    "https://peer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet-polka-host-232813573.us-west-1.elb.amazonaws.com"
  ],
  "faucets": [
    "https://testnet.peer.inc"
  ],
  "nativeCurrency": {
    "name": "PEER Token",
    "symbol": "PEER",
    "decimals": 18
  },
  "infoURL": "https://peer.inc",
  "shortName": "PEER",
  "chainId": 601,
  "networkId": 601,
  "icon": {
    "url": "ipfs://QmPKKCdjEhP6CHekLD8YnhR2VsdjzprHapapDj7Wzqm52b",
    "width": 1363,
    "height": 760,
    "format": "png"
  },
  "explorers": [
    {
      "name": "PEER Explorer",
      "url": "https://testnet.peer.inc",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmPKKCdjEhP6CHekLD8YnhR2VsdjzprHapapDj7Wzqm52b",
        "width": 1363,
        "height": 760,
        "format": "png"
      }
    }
  ],
  "testnet": true,
  "slug": "peer-testnet"
} as const satisfies Chain;