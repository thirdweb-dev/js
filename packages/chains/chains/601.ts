import type { Chain } from "../src/types";
export default {
  "chain": "PEER",
  "chainId": 601,
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
  "faucets": [
    "https://testnet.peer.inc"
  ],
  "icon": {
    "url": "ipfs://QmPKKCdjEhP6CHekLD8YnhR2VsdjzprHapapDj7Wzqm52b",
    "width": 1363,
    "height": 760,
    "format": "png"
  },
  "infoURL": "https://peer.inc",
  "name": "PEER Testnet",
  "nativeCurrency": {
    "name": "PEER Token",
    "symbol": "PEER",
    "decimals": 18
  },
  "networkId": 601,
  "rpc": [
    "https://peer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://601.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet-polka-host-232813573.us-west-1.elb.amazonaws.com"
  ],
  "shortName": "PEER",
  "slug": "peer-testnet",
  "testnet": true
} as const satisfies Chain;