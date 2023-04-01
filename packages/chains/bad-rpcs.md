# Bad RPCs

## Mismatched Chain IDs

**Why is this bad?**
If the chain ID is mismatched then the RPC is not actually connected to the chain. This means that the RPC is not actually serving the chain and is not a valid RPC for the chain.

### Genesis L1 testnet (26)

<details>
  <summary>https://testrpc.genesisl1.org</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 29 (expected: 26)
  ```
</details>
    

### Dehvo (113)

<details>
  <summary>https://rpc1.dehvo.com</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 1928 (expected: 113)
  ```
</details>
    

<details>
  <summary>https://connect.dehvo.com</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 1928 (expected: 113)
  ```
</details>
    

<details>
  <summary>https://rpc2.dehvo.com</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 1928 (expected: 113)
  ```
</details>
    

<details>
  <summary>https://rpc.dehvo.com</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 1928 (expected: 113)
  ```
</details>
    

### SiriusNet V2 (217)

<details>
  <summary>https://rpc2.siriusnet.io</summary>
  
  ```js
  InvalidChainIdError: Invalid chainId: 10103 (expected: 217)
  ```
</details>
    

## Fetch Errors

**Why is this bad?**
If the RPC is not responding then it is not useful.

### Ethereum Mainnet (1)

<details>
  <summary>`https://api.mycryptoapi.com/eth`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

### Ropsten (3)

<details>
  <summary>`wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Unexpected server response: 410
  ```
</details>
    

<details>
  <summary>`https://ropsten.infura.io/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Request failed with status code 410
  ```
</details>
    

### Rinkeby (4)

<details>
  <summary>`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Request failed with status code 410
  ```
</details>
    

<details>
  <summary>`wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Unexpected server response: 410
  ```
</details>
    

### Goerli (5)

<details>
  <summary>`wss://goerli.infura.io/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Unexpected server response: 404
  ```
</details>
    

### ThaiChain 2.0 ThaiFi (17)

<details>
  <summary>`https://rpc.thaifi.com`</summary>

  ```js
  Error: Request failed with status code 523
  ```
</details>
    

### Songbird Canary-Network (19)

<details>
  <summary>`https://sgb.lightft.so/rpc`</summary>

  ```js
  FetchError: request to https://sgb.lightft.so/rpc failed, reason: getaddrinfo ENOTFOUND sgb.lightft.so
  ```
</details>
    

<details>
  <summary>`https://sgb-rpc.ftso.eu`</summary>

  ```js
  FetchError: invalid json response body at https://songbird-api.flare.network/ext/C/rpc reason: Unexpected end of JSON input
  ```
</details>
    

### ShibaChain (27)

<details>
  <summary>`https://rpc.shibachain.net`</summary>

  ```js
  Error: Request failed with status code 429
  ```
</details>
    

### Boba Network Rinkeby Testnet (28)

<details>
  <summary>`https://rinkeby.boba.network/`</summary>

  ```js
  FetchError: request to https://rinkeby.boba.network/ failed, reason: getaddrinfo ENOTFOUND rinkeby.boba.network
  ```
</details>
    

### GoodData Testnet (32)

<details>
  <summary>`https://test2.goodata.io`</summary>

  ```js
  FetchError: request to https://test2.goodata.io/ failed, reason: getaddrinfo ENOTFOUND test2.goodata.io
  ```
</details>
    

### GoodData Mainnet (33)

<details>
  <summary>`https://rpc.goodata.io`</summary>

  ```js
  FetchError: request to https://rpc.goodata.io/ failed, reason: getaddrinfo ENOTFOUND rpc.goodata.io
  ```
</details>
    

### Valorbit (38)

<details>
  <summary>`https://rpc.valorbit.com/v2`</summary>

  ```js
  FetchError: request to https://rpc.valorbit.com/v2 failed, reason: getaddrinfo ENOTFOUND rpc.valorbit.com
  ```
</details>
    

### Kovan (42)

<details>
  <summary>`https://kovan.poa.network`</summary>

  ```js
  FetchError: request to https://kovan.poa.network/ failed, reason: getaddrinfo ENOTFOUND kovan.poa.network
  ```
</details>
    

<details>
  <summary>`http://kovan.poa.network:8545`</summary>

  ```js
  FetchError: request to http://kovan.poa.network:8545/ failed, reason: getaddrinfo ENOTFOUND kovan.poa.network
  ```
</details>
    

<details>
  <summary>`ws://kovan.poa.network:8546`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND kovan.poa.network
  ```
</details>
    

<details>
  <summary>`https://kovan.infura.io/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Request failed with status code 410
  ```
</details>
    

<details>
  <summary>`wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}`</summary>

  ```js
  Error: Unexpected server response: 410
  ```
</details>
    

### XinFin XDC Network (50)

<details>
  <summary>`https://rpc1.xinfin.network`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Openpiece Mainnet (54)

<details>
  <summary>`https://mainnet.openpiece.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Binance Smart Chain Mainnet (56)

<details>
  <summary>`wss://bsc-ws-node.nariox.org`</summary>

  ```js
  Error: Unexpected server response: 503
  ```
</details>
    

### Ellaism (64)

<details>
  <summary>`https://jsonrpc.ellaism.org`</summary>

  ```js
  FetchError: request to https://jsonrpc.ellaism.org/ failed, reason: getaddrinfo ENOTFOUND jsonrpc.ellaism.org
  ```
</details>
    

### DBChain Testnet (67)

<details>
  <summary>`http://test-rpc.dbmbp.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### SoterOne Mainnet (68)

<details>
  <summary>`https://rpc.soter.one`</summary>

  ```js
  FetchError: request to https://rpc.soter.one/ failed, reason: getaddrinfo ENOTFOUND rpc.soter.one
  ```
</details>
    

### Optimism Kovan (69)

<details>
  <summary>`https://kovan.optimism.io/`</summary>

  ```js
  FetchError: request to https://kovan.optimism.io/ failed, reason: getaddrinfo ENOTFOUND kovan.optimism.io
  ```
</details>
    

### Hoo Smart Chain (70)

<details>
  <summary>`https://http-mainnet2.hoosmartchain.com`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

<details>
  <summary>`wss://ws-mainnet2.hoosmartchain.com`</summary>

  ```js
  Error: Unexpected server response: 503
  ```
</details>
    

<details>
  <summary>`wss://ws-mainnet.hoosmartchain.com`</summary>

  ```js
  Error: Unexpected server response: 503
  ```
</details>
    

### DxChain Testnet (72)

<details>
  <summary>`https://testnet-http.dxchain.com`</summary>

  ```js
  FetchError: request to https://testnet-http.dxchain.com/ failed, reason: getaddrinfo ENOTFOUND testnet-http.dxchain.com
  ```
</details>
    

### Decimal Smart Chain Mainnet (75)

<details>
  <summary>`https://node.decimalchain.com/web3`</summary>

  ```js
  Error: Request failed with status code 405
  ```
</details>
    

### Mix (76)

<details>
  <summary>`https://rpc2.mix-blockchain.org:8647`</summary>

  ```js
  FetchError: request to https://rpc2.mix-blockchain.org:8647/ failed, reason: connect ECONNREFUSED 74.207.240.177:8647
  ```
</details>
    

### POA Network Sokol (77)

<details>
  <summary>`https://sokol.poa.network`</summary>

  ```js
  FetchError: request to https://sokol.poa.network/ failed, reason: getaddrinfo ENOTFOUND sokol.poa.network
  ```
</details>
    

<details>
  <summary>`wss://sokol.poa.network/wss`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND sokol.poa.network
  ```
</details>
    

<details>
  <summary>`ws://sokol.poa.network:8546`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND sokol.poa.network
  ```
</details>
    

### Zenith Mainnet (79)

<details>
  <summary>`https://dataserver-us-1.zenithchain.co/`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### GeneChain (80)

<details>
  <summary>`https://rpc.genechain.io`</summary>

  ```js
  FetchError: request to https://rpc.genechain.io/ failed, reason: getaddrinfo ENOTFOUND rpc.genechain.io
  ```
</details>
    

### GateChain Testnet (85)

<details>
  <summary>`https://testnet.gatenode.cc`</summary>

  ```js
  FetchError: request to https://testnet.gatenode.cc/ failed, reason: Hostname/IP does not match certificate's altnames: Host: testnet.gatenode.cc. is not in the cert's altnames: DNS:hokkaido.moodlejapan.org, DNS:showcase.moodlejapan.org
  ```
</details>
    

### Nova Network (87)

<details>
  <summary>`https://0x57.redjackstudio.com`</summary>

  ```js
  FetchError: request to https://0x57.redjackstudio.com/ failed, reason: unable to verify the first certificate
  ```
</details>
    

<details>
  <summary>`https://connect.novanetwork.io`</summary>

  ```js
  FetchError: request to https://connect.novanetwork.io/ failed, reason: unable to verify the first certificate
  ```
</details>
    

### Garizon Stage0 (90)

<details>
  <summary>`https://s0.garizon.net/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Garizon Stage1 (91)

<details>
  <summary>`https://s1.garizon.net/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Garizon Stage2 (92)

<details>
  <summary>`https://s2.garizon.net/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Garizon Stage3 (93)

<details>
  <summary>`https://s3.garizon.net/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### POA Network Core (99)

<details>
  <summary>`https://core.poa.network`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

### EtherInc (101)

<details>
  <summary>`https://api.einc.io/jsonrpc/mainnet`</summary>

  ```js
  FetchError: request to https://api.einc.io/jsonrpc/mainnet failed, reason: getaddrinfo ENOTFOUND api.einc.io
  ```
</details>
    

### Web3Games Testnet (102)

<details>
  <summary>`https://testnet-rpc-0.web3games.org/evm`</summary>

  ```js
  Error: Request failed with status code 521
  ```
</details>
    

<details>
  <summary>`https://testnet-rpc-1.web3games.org/evm`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

<details>
  <summary>`https://testnet-rpc-2.web3games.org/evm`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Kaiba Lightning Chain Testnet (104)

<details>
  <summary>`https://klc.live/`</summary>

  ```js
  FetchError: request to https://klc.live/ failed, reason: getaddrinfo ENOTFOUND klc.live
  ```
</details>
    

### Nebula Testnet (107)

<details>
  <summary>`https://testnet.rpc.novanetwork.io:9070`</summary>

  ```js
  FetchError: request to https://testnet.rpc.novanetwork.io:9070/ failed, reason: connect ECONNREFUSED 74.208.29.238:9070
  ```
</details>
    

### Proton Testnet (110)

<details>
  <summary>`https://protontestnet.greymass.com/`</summary>

  ```js
  Error: Invalid response
{
  "server_version": "d0860c4e",
  "chain_id": "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd",
  "head_block_num": 188105746,
  "last_irreversible_block_num": 188105416,
  "last_irreversible_block_id": "0b3642c847c7c6b0197176838f697a59032d0286adcf17e06bca6465423b4722",
  "head_block_id": "0b3644124d365b056dc892feb25e1a70ce13ad17efdb0283dafa950a0dd83fbc",
  "head_block_time": "2023-04-01T06:39:08.500",
  "head_block_producer": "brotonbp",
  "virtual_block_cpu_limit": 200000000,
  "virtual_block_net_limit": 1048576000,
  "block_cpu_limit": 200000,
  "block_net_limit": 1048576,
  "server_version_string": "v2.0.4",
  "fork_db_head_block_num": 188105746,
  "fork_db_head_block_id": "0b3644124d365b056dc892feb25e1a70ce13ad17efdb0283dafa950a0dd83fbc",
  "server_full_version_string": "v2.0.4-d0860c4ecf59b1535ef39c6ac7cae606fdb6a3ff-dirty"
}
  ```
</details>
    

### Arcology Testnet (118)

<details>
  <summary>`https://testnet.arcology.network/rpc`</summary>

  ```js
  FetchError: request to https://testnet.arcology.network/rpc failed, reason: unable to verify the first certificate
  ```
</details>
    

### Realchain Mainnet (121)

<details>
  <summary>`https://rcl-dataseed4.rclsidechain.com`</summary>

  ```js
  Error: Request failed with status code 526
  ```
</details>
    

<details>
  <summary>`wss://rcl-dataseed4.rclsidechain.com/v1/`</summary>

  ```js
  Error: Unexpected server response: 526
  ```
</details>
    

<details>
  <summary>`https://rcl-dataseed1.rclsidechain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://rcl-dataseed2.rclsidechain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://rcl-dataseed3.rclsidechain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`wss://rcl-dataseed1.rclsidechain.com/v1/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`wss://rcl-dataseed2.rclsidechain.com/v1/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`wss://rcl-dataseed3.rclsidechain.com/v1/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Decentralized Web Mainnet (124)

<details>
  <summary>`https://decentralized-web.tech/dw_rpc.php`</summary>

  ```js
  FetchError: request to https://decentralized-web.tech/dw_rpc.php failed, reason: certificate has expired
  ```
</details>
    

### OYchain Testnet (125)

<details>
  <summary>`https://rpc.testnet.oychain.io`</summary>

  ```js
  FetchError: request to https://rpc.testnet.oychain.io/ failed, reason: getaddrinfo ENOTFOUND rpc.testnet.oychain.io
  ```
</details>
    

### OYchain Mainnet (126)

<details>
  <summary>`https://rpc.mainnet.oychain.io`</summary>

  ```js
  FetchError: request to https://rpc.mainnet.oychain.io/ failed, reason: getaddrinfo ENOTFOUND rpc.mainnet.oychain.io
  ```
</details>
    

### Alyx Chain Testnet (135)

<details>
  <summary>`https://testnet-rpc.alyxchain.com`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Polygon Mainnet (137)

<details>
  <summary>`https://matic-mainnet-full-rpc.bwarelabs.com`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

<details>
  <summary>`https://rpc-mainnet.matic.network`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### Openpiece Testnet (141)

<details>
  <summary>`https://testnet.openpiece.io`</summary>

  ```js
  Error: Request failed with status code 521
  ```
</details>
    

### DAX CHAIN (142)

<details>
  <summary>`https://rpc.prodax.io`</summary>

  ```js
  FetchError: request to https://rpc.prodax.io/ failed, reason: getaddrinfo ENOTFOUND rpc.prodax.io
  ```
</details>
    

### Armonia Eva Chain Mainnet (160)

<details>
  <summary>`https://evascan.io/api/eth-rpc/`</summary>

  ```js
  Error: Invalid response
{
  "jsonrpc": "2.0",
  "error": "Action not found.",
  "id": 1
}
  ```
</details>
    

### Armonia Eva Chain Testnet (161)

<details>
  <summary>`https://testnet.evascan.io/api/eth-rpc/`</summary>

  ```js
  Error: Invalid response
{
  "jsonrpc": "2.0",
  "error": "Action not found.",
  "id": 1
}
  ```
</details>
    

### Lightstreams Mainnet (163)

<details>
  <summary>`https://node.mainnet.lightstreams.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### HOO Smart Chain Testnet (170)

<details>
  <summary>`https://http-testnet.hoosmartchain.com`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### Latam-Blockchain Resil Testnet (172)

<details>
  <summary>`https://rpc.latam-blockchain.com`</summary>

  ```js
  FetchError: request to https://rpc.latam-blockchain.com/ failed, reason: connect ECONNREFUSED 142.111.206.61:443
  ```
</details>
    

<details>
  <summary>`wss://ws.latam-blockchain.com`</summary>

  ```js
  Error: connect ECONNREFUSED 142.111.206.61:443
  ```
</details>
    

### Arbitrum on xDai (200)

<details>
  <summary>`https://arbitrum.xdaichain.com/`</summary>

  ```js
  FetchError: request to https://arbitrum.xdaichain.com/ failed, reason: getaddrinfo ENOTFOUND arbitrum.xdaichain.com
  ```
</details>
    

### Freight Trust Network (211)

<details>
  <summary>`https://app.freighttrust.net/ftn/${API_KEY}`</summary>

  ```js
  FetchError: request to https://app.freighttrust.net/ftn/$%7BAPI_KEY%7D failed, reason: getaddrinfo ENOTFOUND app.freighttrust.net
  ```
</details>
    

<details>
  <summary>`http://13.57.207.168:3435`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Huobi ECO Chain Testnet (256)

<details>
  <summary>`https://http-testnet.hecochain.com`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

<details>
  <summary>`wss://ws-testnet.hecochain.com`</summary>

  ```js
  Error: Unexpected server response: 502
  ```
</details>
    

### SUR Blockchain Network (262)

<details>
  <summary>`https://sur.nilin.org`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Optimism on Gnosis (300)

<details>
  <summary>`https://optimism.gnosischain.com`</summary>

  ```js
  FetchError: request to https://optimism.gnosischain.com/ failed, reason: getaddrinfo ENOTFOUND optimism.gnosischain.com
  ```
</details>
    

<details>
  <summary>`wss://optimism.gnosischain.com/wss`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND optimism.gnosischain.com
  ```
</details>
    

### KCC Mainnet (321)

<details>
  <summary>`https://public-rpc.blockpi.io/http/kcc`</summary>

  ```js
  FetchError: request to https://public-rpc.blockpi.io/http/kcc failed, reason: connect ECONNREFUSED 139.99.8.21:443
  ```
</details>
    

### Web3Q Mainnet (333)

<details>
  <summary>`https://mainnet.web3q.io:8545`</summary>

  ```js
  FetchError: request to https://mainnet.web3q.io:8545/ failed, reason: getaddrinfo ENOTFOUND mainnet.web3q.io
  ```
</details>
    

### Shiden (336)

<details>
  <summary>`https://shiden-rpc.dwellir.com`</summary>

  ```js
  Error: Invalid response
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
  ```
</details>
    

<details>
  <summary>`wss://shiden-rpc.dwellir.com`</summary>

  ```js
  Error: Invalid response
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
  ```
</details>
    

### Theta Sapphire Testnet (363)

<details>
  <summary>`https://eth-rpc-api-sapphire.thetatoken.org/rpc`</summary>

  ```js
  FetchError: request to https://eth-rpc-api-sapphire.thetatoken.org/rpc failed, reason: getaddrinfo ENOTFOUND eth-rpc-api-sapphire.thetatoken.org
  ```
</details>
    

### Theta Amber Testnet (364)

<details>
  <summary>`https://eth-rpc-api-amber.thetatoken.org/rpc`</summary>

  ```js
  FetchError: request to https://eth-rpc-api-amber.thetatoken.org/rpc failed, reason: getaddrinfo ENOTFOUND eth-rpc-api-amber.thetatoken.org
  ```
</details>
    

### PulseChain Mainnet (369)

<details>
  <summary>`wss://rpc.mainnet.pulsechain.com/`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND rpc.mainnet.pulsechain.com
  ```
</details>
    

<details>
  <summary>`https://rpc.mainnet.pulsechain.com/`</summary>

  ```js
  FetchError: request to https://rpc.mainnet.pulsechain.com/ failed, reason: getaddrinfo ENOTFOUND rpc.mainnet.pulsechain.com
  ```
</details>
    

### Consta Testnet (371)

<details>
  <summary>`https://rpc-testnet.theconsta.com`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Lisinski (385)

<details>
  <summary>`https://rpc-bitfalls1.lisinski.online`</summary>

  ```js
  FetchError: request to https://rpc-bitfalls1.lisinski.online/ failed, reason: getaddrinfo ENOTFOUND rpc-bitfalls1.lisinski.online
  ```
</details>
    

### HyperonChain TestNet (400)

<details>
  <summary>`https://testnet-rpc.hyperonchain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Zeeth Chain (427)

<details>
  <summary>`https://rpc.zeeth.io`</summary>

  ```js
  FetchError: request to https://rpc.zeeth.io/ failed, reason: getaddrinfo ENOTFOUND rpc.zeeth.io
  ```
</details>
    

### XT Smart Chain Mainnet (520)

<details>
  <summary>`https://datarpc3.xsc.pub`</summary>

  ```js
  FetchError: request to https://datarpc3.xsc.pub/ failed, reason: getaddrinfo ENOTFOUND datarpc3.xsc.pub
  ```
</details>
    

### Firechain Mainnet (529)

<details>
  <summary>`https://mainnet.rpc1.thefirechain.com`</summary>

  ```js
  FetchError: invalid json response body at https://mainnet.rpc1.thefirechain.com/ reason: Unexpected token < in JSON at position 0
  ```
</details>
    

### Candle (534)

<details>
  <summary>`https://candle-rpc.com/`</summary>

  ```js
  FetchError: request to https://candle-rpc.com/ failed, reason: connect ECONNREFUSED 35.225.63.183:443
  ```
</details>
    

### Tao Network (558)

<details>
  <summary>`https://rpc.testnet.tao.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`http://rpc.testnet.tao.network:8545`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://rpc.tao.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`wss://rpc.tao.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Astar (592)

<details>
  <summary>`https://rpc.astar.network:8545`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Pixie Chain Testnet (666)

<details>
  <summary>`wss://ws-testnet.chain.pixie.xyz`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND ws-testnet.chain.pixie.xyz
  ```
</details>
    

### Star Social Testnet (700)

<details>
  <summary>`https://avastar.cc/ext/bc/C/rpc`</summary>

  ```js
  FetchError: request to https://avastar.cc/ext/bc/C/rpc failed, reason: Hostname/IP does not match certificate's altnames: Host: avastar.cc. is not in the cert's altnames: DNS:my.silverrapid.com
  ```
</details>
    

### BlockChain Station Mainnet (707)

<details>
  <summary>`https://rpc-mainnet.bcsdev.io`</summary>

  ```js
  FetchError: request to https://rpc-mainnet.bcsdev.io/ failed, reason: getaddrinfo ENOTFOUND rpc-mainnet.bcsdev.io
  ```
</details>
    

<details>
  <summary>`wss://rpc-ws-mainnet.bcsdev.io`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND rpc-ws-mainnet.bcsdev.io
  ```
</details>
    

### BlockChain Station Testnet (708)

<details>
  <summary>`https://rpc-testnet.bcsdev.io`</summary>

  ```js
  FetchError: request to https://rpc-testnet.bcsdev.io/ failed, reason: getaddrinfo ENOTFOUND rpc-testnet.bcsdev.io
  ```
</details>
    

<details>
  <summary>`wss://rpc-ws-testnet.bcsdev.io`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND rpc-ws-testnet.bcsdev.io
  ```
</details>
    

### Lycan Chain (721)

<details>
  <summary>`https://rpc.lycanchain.com/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### QL1 (766)

<details>
  <summary>`https://rpc.qom.one`</summary>

  ```js
  FetchError: request to https://rpc.qom.one/ failed, reason: getaddrinfo ENOTFOUND rpc.qom.one
  ```
</details>
    

### cheapETH (777)

<details>
  <summary>`https://node.cheapeth.org/rpc`</summary>

  ```js
  FetchError: request to https://node.cheapeth.org/rpc failed, reason: connect ECONNREFUSED 144.126.216.39:443
  ```
</details>
    

### Aerochain Testnet (788)

<details>
  <summary>`https://testnet-rpc.aerochain.id/`</summary>

  ```js
  FetchError: request to https://testnet-rpc.aerochain.id/ failed, reason: getaddrinfo ENOTFOUND testnet-rpc.aerochain.id
  ```
</details>
    

### Haic (803)

<details>
  <summary>`https://orig.haichain.io/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Portal Fantasy Chain Test (808)

<details>
  <summary>`https://subnets.avax.network/portal-fantasy/testnet/rpc`</summary>

  ```js
  Error: Request failed with status code 405
  ```
</details>
    

### Qitmeer (813)

<details>
  <summary>`https://evm-dataseed2.meerscan.com`</summary>

  ```js
  FetchError: request to https://evm-dataseed2.meerscan.com/ failed, reason: connect ECONNREFUSED 180.188.198.41:443
  ```
</details>
    

### Zeeth Chain Dev (859)

<details>
  <summary>`https://rpc.dev.zeeth.io`</summary>

  ```js
  FetchError: request to https://rpc.dev.zeeth.io/ failed, reason: getaddrinfo ENOTFOUND rpc.dev.zeeth.io
  ```
</details>
    

### Ambros Chain Mainnet (880)

<details>
  <summary>`https://api.ambros.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Garizon Testnet Stage1 (901)

<details>
  <summary>`https://s1-testnet.garizon.net/rpc`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Garizon Testnet Stage2 (902)

<details>
  <summary>`https://s2-testnet.garizon.net/rpc`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Garizon Testnet Stage3 (903)

<details>
  <summary>`https://s3-testnet.garizon.net/rpc`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Rinia Testnet (917)

<details>
  <summary>`https://rinia.rpc1.thefirechain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### PulseChain Testnet (940)

<details>
  <summary>`https://rpc.v2.testnet.pulsechain.com/`</summary>

  ```js
  FetchError: request to https://rpc.v2.testnet.pulsechain.com/ failed, reason: getaddrinfo ENOTFOUND rpc.v2.testnet.pulsechain.com
  ```
</details>
    

<details>
  <summary>`wss://rpc.v2.testnet.pulsechain.com/`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND rpc.v2.testnet.pulsechain.com
  ```
</details>
    

### PulseChain Testnet v2b (941)

<details>
  <summary>`wss://rpc.v2b.testnet.pulsechain.com/`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### PulseChain Testnet v3 (942)

<details>
  <summary>`wss://rpc.v3.testnet.pulsechain.com/`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### Oort Mainnet (970)

<details>
  <summary>`https://rpc.oortech.com`</summary>

  ```js
  FetchError: request to https://rpc.oortech.com/ failed, reason: getaddrinfo ENOTFOUND rpc.oortech.com
  ```
</details>
    

### Nepal Blockchain Network (977)

<details>
  <summary>`https://api.nepalblockchain.dev`</summary>

  ```js
  FetchError: request to https://api.nepalblockchain.dev/ failed, reason: getaddrinfo ENOTFOUND api.nepalblockchain.dev
  ```
</details>
    

<details>
  <summary>`https://api.nepalblockchain.network`</summary>

  ```js
  FetchError: invalid json response body at https://api.nepalblockchain.network/ reason: Unexpected token C in JSON at position 0
  ```
</details>
    

### Memo Smart Chain Mainnet (985)

<details>
  <summary>`wss://chain.metamemo.one:16801`</summary>

  ```js
  Error: connect ECONNREFUSED 183.240.196.215:16801
  ```
</details>
    

### Lucky Network (998)

<details>
  <summary>`https://rpc.luckynetwork.org`</summary>

  ```js
  FetchError: request to https://rpc.luckynetwork.org/ failed, reason: getaddrinfo ENOTFOUND rpc.luckynetwork.org
  ```
</details>
    

<details>
  <summary>`wss://ws.lnscan.org`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND ws.lnscan.org
  ```
</details>
    

<details>
  <summary>`https://rpc.lnscan.org`</summary>

  ```js
  FetchError: request to https://rpc.lnscan.org/ failed, reason: getaddrinfo ENOTFOUND rpc.lnscan.org
  ```
</details>
    

### Eurus Mainnet (1008)

<details>
  <summary>`https://mainnet.eurus.network/`</summary>

  ```js
  FetchError: request to https://mainnet.eurus.network/ failed, reason: getaddrinfo ENOTFOUND mainnet.eurus.network
  ```
</details>
    

### BitTorrent Chain Testnet (1028)

<details>
  <summary>`https://testrpc.bittorrentchain.io/`</summary>

  ```js
  FetchError: request to https://testrpc.bittorrentchain.io/ failed, reason: getaddrinfo ENOTFOUND testrpc.bittorrentchain.io
  ```
</details>
    

### Proxy Network Testnet (1031)

<details>
  <summary>`http://128.199.94.183:8041`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### MathChain (1139)

<details>
  <summary>`https://mathchain-asia.maiziqianbao.net/rpc`</summary>

  ```js
  FetchError: request to https://mathchain-asia.maiziqianbao.net/rpc failed, reason: getaddrinfo ENOTFOUND mathchain-asia.maiziqianbao.net
  ```
</details>
    

<details>
  <summary>`https://mathchain-us.maiziqianbao.net/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### MathChain Testnet (1140)

<details>
  <summary>`https://galois-hk.maiziqianbao.net/rpc`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Smart Host Teknoloji TESTNET (1177)

<details>
  <summary>`https://s2.tl.web.tr:4041`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Iora Chain (1197)

<details>
  <summary>`https://dataseed.iorachain.com`</summary>

  ```js
  FetchError: invalid json response body at http://ww25.dataseed.iorachain.com/?subid1=20230401-1739-13f5-94e1-b0affb05b269 reason: Unexpected token < in JSON at position 0
  ```
</details>
    

### Evanesco Testnet (1201)

<details>
  <summary>`https://seed5.evanesco.org:8547`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### World Trade Technical Chain Mainnet (1202)

<details>
  <summary>`wss://rpc.cadaut.com/ws`</summary>

  ```js
  Error: Client network socket disconnected before secure TLS connection was established
  ```
</details>
    

<details>
  <summary>`https://rpc.cadaut.com`</summary>

  ```js
  FetchError: request to https://rpc.cadaut.com/ failed, reason: Client network socket disconnected before secure TLS connection was established
  ```
</details>
    

### Exzo Network Mainnet (1229)

<details>
  <summary>`https://mainnet.exzo.technology`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Moonrock (1288)

<details>
  <summary>`https://rpc.api.moonrock.moonbeam.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`wss://wss.api.moonrock.moonbeam.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Dos Fuji Subnet (1311)

<details>
  <summary>`https://test.doschain.com/jsonrpc`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### Beagle Messaging Chain (1515)

<details>
  <summary>`https://beagle.chat/eth`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### Catecoin Chain Mainnet (1618)

<details>
  <summary>`https://send.catechain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Atheios (1620)

<details>
  <summary>`https://wallet.atheios.com:8797`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Btachain (1657)

<details>
  <summary>`https://dataseed1.btachain.com/`</summary>

  ```js
  Error: Request failed with status code 521
  ```
</details>
    

### LUDAN Mainnet (1688)

<details>
  <summary>`https://rpc.ludan.org/`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### Rabbit Analog Testnet Chain (1807)

<details>
  <summary>`https://rabbit.analog-rpc.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Cube Chain Testnet (1819)

<details>
  <summary>`wss://ws-testnet-us.cube.network`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

<details>
  <summary>`wss://ws-testnet.cube.network`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

<details>
  <summary>`https://http-testnet-sg.cube.network`</summary>

  ```js
  FetchError: invalid json response body at https://http-testnet-sg.cube.network/ reason: Unexpected end of JSON input
  ```
</details>
    

<details>
  <summary>`https://http-testnet-jp.cube.network`</summary>

  ```js
  FetchError: invalid json response body at https://http-testnet-jp.cube.network/ reason: Unexpected end of JSON input
  ```
</details>
    

<details>
  <summary>`https://http-testnet.cube.network`</summary>

  ```js
  FetchError: invalid json response body at https://http-testnet.cube.network/ reason: Unexpected end of JSON input
  ```
</details>
    

<details>
  <summary>`https://http-testnet-us.cube.network`</summary>

  ```js
  FetchError: invalid json response body at https://http-testnet-us.cube.network/ reason: Unexpected end of JSON input
  ```
</details>
    

<details>
  <summary>`wss://ws-testnet-jp.cube.network`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

<details>
  <summary>`wss://ws-testnet-sg.cube.network`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### Teslafunds (1856)

<details>
  <summary>`https://tsfapi.europool.me`</summary>

  ```js
  FetchError: request to https://tsfapi.europool.me/ failed, reason: certificate has expired
  ```
</details>
    

### Gitshock Cartenz Testnet (1881)

<details>
  <summary>`https://rpc.cartenz.works`</summary>

  ```js
  FetchError: request to https://rpc.cartenz.works/ failed, reason: getaddrinfo ENOTFOUND rpc.cartenz.works
  ```
</details>
    

### Lightlink Pegasus Testnet (1891)

<details>
  <summary>`https://replicator-02.pegasus.lightlink.io/rpc/v1`</summary>

  ```js
  FetchError: request to https://replicator-02.pegasus.lightlink.io/rpc/v1 failed, reason: getaddrinfo ENOTFOUND replicator-02.pegasus.lightlink.io
  ```
</details>
    

### BON Network (1898)

<details>
  <summary>`http://rpc.boyanet.org:8545`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`ws://rpc.boyanet.org:8546`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Atelier (1971)

<details>
  <summary>`wss://1971.network/atlr`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### Eurus Testnet (1984)

<details>
  <summary>`https://testnet.eurus.network`</summary>

  ```js
  FetchError: request to https://testnet.eurus.network/ failed, reason: getaddrinfo ENOTFOUND testnet.eurus.network
  ```
</details>
    

### Quokkacoin Mainnet (2077)

<details>
  <summary>`https://rpc.qkacoin.org`</summary>

  ```js
  FetchError: request to https://rpc.qkacoin.org/ failed, reason: certificate has expired
  ```
</details>
    

### Ecoball Mainnet (2100)

<details>
  <summary>`https://api.ecoball.org/ecoball/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Ecoball Testnet Espuma (2101)

<details>
  <summary>`https://api.ecoball.org/espuma/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Bitcoin EVM (2203)

<details>
  <summary>`https://connect.bitcoinevm.com`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### VChain Mainnet (2223)

<details>
  <summary>`https://bc.vcex.xyz`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### EZChain C-Chain Mainnet (2612)

<details>
  <summary>`https://api.ezchain.com/ext/bc/C/rpc`</summary>

  ```js
  FetchError: request to https://api.ezchain.com/ext/bc/C/rpc failed, reason: Hostname/IP does not match certificate's altnames: Host: api.ezchain.com. is not in the cert's altnames: DNS:undeveloped.com, DNS:undeveloped.es, DNS:undeveloped.cn, DNS:undeveloped.uk, DNS:undeveloped.eu, DNS:undeveloped.us, DNS:undeveloped.nl, DNS:undeveloped.be, DNS:undeveloped.co.uk, DNS:undeveloped.domains, DNS:dan.com, DNS:www.dan.com, DNS:undeveloped.fr, DNS:undeveloped.nu
  ```
</details>
    

### EZChain C-Chain Testnet (2613)

<details>
  <summary>`https://testnet-api.ezchain.com/ext/bc/C/rpc`</summary>

  ```js
  FetchError: request to https://testnet-api.ezchain.com/ext/bc/C/rpc failed, reason: Hostname/IP does not match certificate's altnames: Host: testnet-api.ezchain.com. is not in the cert's altnames: DNS:undeveloped.com, DNS:undeveloped.es, DNS:undeveloped.cn, DNS:undeveloped.uk, DNS:undeveloped.eu, DNS:undeveloped.us, DNS:undeveloped.nl, DNS:undeveloped.be, DNS:undeveloped.co.uk, DNS:undeveloped.domains, DNS:dan.com, DNS:www.dan.com, DNS:undeveloped.fr, DNS:undeveloped.nu
  ```
</details>
    

### Orlando Chain (3031)

<details>
  <summary>`https://rpc-testnet.orlchain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### ZCore Testnet (3331)

<details>
  <summary>`https://rpc-testnet.zcore.cash`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Metacodechain (3666)

<details>
  <summary>`https://j.blockcoach.com:8503`</summary>

  ```js
  FetchError: request to https://j.blockcoach.com:8503/ failed, reason: unable to verify the first certificate
  ```
</details>
    

### Bittex Mainnet (3690)

<details>
  <summary>`https://rpc1.bittexscan.info`</summary>

  ```js
  FetchError: request to https://rpc1.bittexscan.info/ failed, reason: getaddrinfo ENOTFOUND rpc1.bittexscan.info
  ```
</details>
    

<details>
  <summary>`https://rpc2.bittexscan.info`</summary>

  ```js
  FetchError: request to https://rpc2.bittexscan.info/ failed, reason: getaddrinfo ENOTFOUND rpc2.bittexscan.info
  ```
</details>
    

### AlveyChain Mainnet (3797)

<details>
  <summary>`https://rpc.alveychain.com/rpc`</summary>

  ```js
  FetchError: request to https://rpc.alveychain.com/rpc failed, reason: getaddrinfo ENOTFOUND rpc.alveychain.com
  ```
</details>
    

### DYNO Mainnet (3966)

<details>
  <summary>`https://api.dynoprotocol.com`</summary>

  ```js
  FetchError: request to https://api.dynoprotocol.com/ failed, reason: connect ECONNREFUSED 66.228.60.122:443
  ```
</details>
    

### DYNO Testnet (3967)

<details>
  <summary>`https://tapi.dynoprotocol.com`</summary>

  ```js
  FetchError: request to https://tapi.dynoprotocol.com/ failed, reason: Hostname/IP does not match certificate's altnames: Host: tapi.dynoprotocol.com. is not in the cert's altnames: DNS:moddepot.net, DNS:www.moddepot.net
  ```
</details>
    

### Bobaopera Testnet (4051)

<details>
  <summary>`wss://wss.testnet.bobaopera.boba.network`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Nahmii 3 Testnet (4062)

<details>
  <summary>`https://ngeth.testnet.n3.nahmii.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Bitindi Testnet (4096)

<details>
  <summary>`https://testnet-rpc.bitindi.org`</summary>

  ```js
  FetchError: request to https://testnet-rpc.bitindi.org/ failed, reason: getaddrinfo ENOTFOUND testnet-rpc.bitindi.org
  ```
</details>
    

### Bitindi Mainnet (4099)

<details>
  <summary>` https://rpc-mainnet.bitindi.org`</summary>

  ```js
  Error: Invalid RPC URL:  https://rpc-mainnet.bitindi.org
  ```
</details>
    

<details>
  <summary>`https://mainnet-rpc.bitindi.org`</summary>

  ```js
  FetchError: request to https://mainnet-rpc.bitindi.org/ failed, reason: getaddrinfo ENOTFOUND mainnet-rpc.bitindi.org
  ```
</details>
    

### Nexi Mainnet (4242)

<details>
  <summary>`https://chain.nexi.evmnode.online`</summary>

  ```js
  FetchError: request to https://chain.nexi.evmnode.online/ failed, reason: unable to verify the first certificate
  ```
</details>
    

### Htmlcoin Mainnet (4444)

<details>
  <summary>`https://janus.htmlcoin.com/api/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### BlackFort Exchange Network Testnet (4777)

<details>
  <summary>`https://testnet.blackfort.network/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Mantle (5000)

<details>
  <summary>`https://rpc.mantle.xyz`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### TLChain Network Mainnet (5177)

<details>
  <summary>`https://mainnet-rpc.tlxscan.com/`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Uzmi Network Mainnet (5315)

<details>
  <summary>`https://network.uzmigames.com.br/`</summary>

  ```js
  FetchError: request to https://network.uzmigames.com.br/ failed, reason: self signed certificate in certificate chain
  ```
</details>
    

### Nahmii Testnet (5553)

<details>
  <summary>`https://l2.testnet.nahmii.io`</summary>

  ```js
  Error: Request failed with status code 401
  ```
</details>
    

### Ganache (5777)

<details>
  <summary>`https://127.0.0.1:7545`</summary>

  ```js
  FetchError: request to https://127.0.0.1:7545/ failed, reason: connect ECONNREFUSED 127.0.0.1:7545
  ```
</details>
    

### Pixie Chain Mainnet (6626)

<details>
  <summary>`wss://ws-mainnet.chain.pixie.xyz`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND ws-mainnet.chain.pixie.xyz
  ```
</details>
    

### ZetaChain Mainnet (7000)

<details>
  <summary>`https://api.mainnet.zetachain.com/evm`</summary>

  ```js
  FetchError: request to https://api.mainnet.zetachain.com/evm failed, reason: getaddrinfo ENOTFOUND api.mainnet.zetachain.com
  ```
</details>
    

### KLYNTAR (7331)

<details>
  <summary>`https://evm.klyntar.org/kly_evm_rpc`</summary>

  ```js
  FetchError: request to https://evm.klyntar.org/kly_evm_rpc failed, reason: getaddrinfo ENOTFOUND evm.klyntar.org
  ```
</details>
    

<details>
  <summary>`https://evm.klyntarscan.org/kly_evm_rpc`</summary>

  ```js
  FetchError: request to https://evm.klyntarscan.org/kly_evm_rpc failed, reason: getaddrinfo ENOTFOUND evm.klyntarscan.org
  ```
</details>
    

### Hazlor Testnet (7878)

<details>
  <summary>`https://hatlas.rpc.hazlor.com:8545`</summary>

  ```js
  FetchError: request to https://hatlas.rpc.hazlor.com:8545/ failed, reason: getaddrinfo ENOTFOUND hatlas.rpc.hazlor.com
  ```
</details>
    

<details>
  <summary>`wss://hatlas.rpc.hazlor.com:8546`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND hatlas.rpc.hazlor.com
  ```
</details>
    

### Teleport (8000)

<details>
  <summary>`https://evm-rpc.teleport.network`</summary>

  ```js
  FetchError: request to https://evm-rpc.teleport.network/ failed, reason: getaddrinfo ENOTFOUND evm-rpc.teleport.network
  ```
</details>
    

### Teleport Testnet (8001)

<details>
  <summary>`https://evm-rpc.testnet.teleport.network`</summary>

  ```js
  FetchError: request to https://evm-rpc.testnet.teleport.network/ failed, reason: getaddrinfo ENOTFOUND evm-rpc.testnet.teleport.network
  ```
</details>
    

### MDGL Testnet (8029)

<details>
  <summary>`https://testnet.mdgl.io`</summary>

  ```js
  FetchError: request to https://testnet.mdgl.io/ failed, reason: getaddrinfo ENOTFOUND testnet.mdgl.io
  ```
</details>
    

### StreamuX Blockchain (8098)

<details>
  <summary>`https://u0ma6t6heb:KDNwOsRDGcyM2Oeui1p431Bteb4rvcWkuPgQNHwB4FM@u0xy4x6x82-u0e2mg517m-rpc.us0-aws.kaleido.io/`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### KorthoTest (8285)

<details>
  <summary>`https://www.krotho-test.net`</summary>

  ```js
  FetchError: request to https://www.krotho-test.net/ failed, reason: Client network socket disconnected before secure TLS connection was established
  ```
</details>
    

### Toki Network (8654)

<details>
  <summary>`https://mainnet.buildwithtoki.com/v0/rpc`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### TOOL Global Testnet (8724)

<details>
  <summary>`https://testnet-web3.wolot.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Alph Network (8738)

<details>
  <summary>`wss://rpc.alph.network`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### BerylBit Mainnet (9012)

<details>
  <summary>`https://mainnet.berylbit.io`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Genesis Coin (9100)

<details>
  <summary>`https://genesis-gn.com`</summary>

  ```js
  FetchError: request to https://genesis-gn.com/ failed, reason: getaddrinfo ENOTFOUND genesis-gn.com
  ```
</details>
    

<details>
  <summary>`wss://genesis-gn.com`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND genesis-gn.com
  ```
</details>
    

### myOwn Testnet (9999)

<details>
  <summary>`https://geth.dev.bccloud.net`</summary>

  ```js
  FetchError: request to https://geth.dev.bccloud.net/ failed, reason: getaddrinfo ENOTFOUND geth.dev.bccloud.net
  ```
</details>
    

### Smart Bitcoin Cash (10000)

<details>
  <summary>`https://rpc-mainnet.smartbch.org`</summary>

  ```js
  FetchError: request to https://rpc-mainnet.smartbch.org/ failed, reason: getaddrinfo ENOTFOUND rpc-mainnet.smartbch.org
  ```
</details>
    

<details>
  <summary>`https://smartbch.devops.cash/mainnet`</summary>

  ```js
  FetchError: request to https://smartbch.devops.cash/mainnet failed, reason: getaddrinfo ENOTFOUND smartbch.devops.cash
  ```
</details>
    

### Smart Bitcoin Cash Testnet (10001)

<details>
  <summary>`https://smartbch.devops.cash/testnet`</summary>

  ```js
  FetchError: request to https://smartbch.devops.cash/testnet failed, reason: getaddrinfo ENOTFOUND smartbch.devops.cash
  ```
</details>
    

<details>
  <summary>`https://rpc-testnet.smartbch.org`</summary>

  ```js
  FetchError: request to https://rpc-testnet.smartbch.org/ failed, reason: unable to verify the first certificate
  ```
</details>
    

### SJATSH (10086)

<details>
  <summary>`http://geth.free.idcfengye.com`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### 0XTade (10248)

<details>
  <summary>`https://node.0xtchain.com`</summary>

  ```js
  FetchError: request to https://node.0xtchain.com/ failed, reason: self signed certificate
  ```
</details>
    

### Quadrans Blockchain (10946)

<details>
  <summary>`https://rpcna.quadrans.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Singularity ZERO Testnet (12051)

<details>
  <summary>`https://betaenv.singularity.gold:18545`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Fibonacci Mainnet (12306)

<details>
  <summary>`https://node1.fibo-api.asia`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### BLG Testnet (12321)

<details>
  <summary>`https://rpc.blgchain.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Rikeza Network Testnet (12715)

<details>
  <summary>`https://testnet-rpc.rikscan.com`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### MetaDot Mainnet (16000)

<details>
  <summary>`https://mainnet.metadot.network`</summary>

  ```js
  FetchError: request to https://mainnet.metadot.network/ failed, reason: getaddrinfo ENOTFOUND mainnet.metadot.network
  ```
</details>
    

### MetaDot Testnet (16001)

<details>
  <summary>`https://testnet.metadot.network`</summary>

  ```js
  FetchError: request to https://testnet.metadot.network/ failed, reason: getaddrinfo ENOTFOUND testnet.metadot.network
  ```
</details>
    

### Frontier of Dreams Testnet (18000)

<details>
  <summary>`https://rpc.fod.games/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Proof Of Memes (18159)

<details>
  <summary>`https://mainnet-rpc2.memescan.io`</summary>

  ```js
  FetchError: request to https://mainnet-rpc2.memescan.io/ failed, reason: getaddrinfo ENOTFOUND mainnet-rpc2.memescan.io
  ```
</details>
    

<details>
  <summary>`https://mainnet-rpc3.memescan.io`</summary>

  ```js
  FetchError: request to https://mainnet-rpc3.memescan.io/ failed, reason: getaddrinfo ENOTFOUND mainnet-rpc3.memescan.io
  ```
</details>
    

<details>
  <summary>`https://mainnet-rpc4.memescan.io`</summary>

  ```js
  FetchError: request to https://mainnet-rpc4.memescan.io/ failed, reason: getaddrinfo ENOTFOUND mainnet-rpc4.memescan.io
  ```
</details>
    

### Optimism Bedrock (Goerli Alpha Testnet) (28528)

<details>
  <summary>`https://alpha-1-replica-0.bedrock-goerli.optimism.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://alpha-1-replica-1.bedrock-goerli.optimism.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://alpha-1-replica-2.bedrock-goerli.optimism.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://alpha-1-replica-2.bedrock-goerli.optimism.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Piece testnet (30067)

<details>
  <summary>`https://testnet-rpc0.piecenetwork.com`</summary>

  ```js
  FetchError: invalid json response body at http://testnet-rpc0.piecenetwork.com/ reason: Unexpected token < in JSON at position 0
  ```
</details>
    

### Ethersocial Network (31102)

<details>
  <summary>`https://api.esn.gonspool.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### CloudTx Testnet (31224)

<details>
  <summary>`https://testnet-rpc.cloudtx.finance`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### GoChain Testnet (31337)

<details>
  <summary>`https://testnet-rpc.gochain.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Filecoin - Wallaby testnet (31415)

<details>
  <summary>`https://wallaby.node.glif.io/rpc/v1`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### Bitgert Mainnet (32520)

<details>
  <summary>`https://serverrpc.com`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

<details>
  <summary>`https://chainrpc.com`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

<details>
  <summary>`https://mainnet-rpc.brisescan.com`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

### Opulent-X BETA (41500)

<details>
  <summary>`https://connect.opulent-x.com`</summary>

  ```js
  FetchError: request to https://connect.opulent-x.com/ failed, reason: getaddrinfo ENOTFOUND connect.opulent-x.com
  ```
</details>
    

### Athereum (43110)

<details>
  <summary>`https://ava.network:21015/ext/evm/rpc`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Liveplex OracleEVM (50001)

<details>
  <summary>`https://rpc.oracle.liveplex.io`</summary>

  ```js
  Error: Invalid response
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "rpc: can't find method \"eth.ChainId\"",
    "data": null
  },
  "id": 1
}
  ```
</details>
    

### Thinkium Testnet Chain 0 (60000)

<details>
  <summary>`https://test.thinkiumrpc.net/`</summary>

  ```js
  Error: Request failed with status code 400
  ```
</details>
    

### DoKEN Super Chain Mainnet (61916)

<details>
  <summary>`https://ukrpc.doken.dev`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

<details>
  <summary>`https://nyrpc.doken.dev`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Condrieu (69420)

<details>
  <summary>`https://rpc.condrieu.ethdevops.io:8545`</summary>

  ```js
  FetchError: request to https://rpc.condrieu.ethdevops.io:8545/ failed, reason: getaddrinfo ENOTFOUND rpc.condrieu.ethdevops.io
  ```
</details>
    

### Thinkium Mainnet Chain 0 (70000)

<details>
  <summary>`https://proxy.thinkiumrpc.net/`</summary>

  ```js
  Error: Request failed with status code 400
  ```
</details>
    

### Polyjuice Testnet (71393)

<details>
  <summary>`https://godwoken-testnet-web3-rpc.ckbapp.dev`</summary>

  ```js
  FetchError: request to https://godwoken-testnet-web3-rpc.ckbapp.dev/ failed, reason: getaddrinfo ENOTFOUND godwoken-testnet-web3-rpc.ckbapp.dev
  ```
</details>
    

<details>
  <summary>`ws://godwoken-testnet-web3-rpc.ckbapp.dev/ws`</summary>

  ```js
  Error: getaddrinfo ENOTFOUND godwoken-testnet-web3-rpc.ckbapp.dev
  ```
</details>
    

### Mumbai (80001)

<details>
  <summary>`https://matic-testnet-archive-rpc.bwarelabs.com`</summary>

  ```js
  FetchError: request to https://matic-testnet-archive-rpc.bwarelabs.com/ failed, reason: getaddrinfo ENOTFOUND matic-testnet-archive-rpc.bwarelabs.com
  ```
</details>
    

### CYBERTRUST (85449)

<details>
  <summary>`http://testnet.cybertrust.space:48501`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Beverly Hills (90210)

<details>
  <summary>`https://rpc.beverlyhills.ethdevops.io:8545`</summary>

  ```js
  FetchError: request to https://rpc.beverlyhills.ethdevops.io:8545/ failed, reason: getaddrinfo ENOTFOUND rpc.beverlyhills.ethdevops.io
  ```
</details>
    

### UB Smart Chain(testnet) (99998)

<details>
  <summary>`https://testnet.rpc.uschain.network`</summary>

  ```js
  FetchError: request to https://testnet.rpc.uschain.network/ failed, reason: connect ECONNREFUSED 47.243.141.247:443
  ```
</details>
    

### UB Smart Chain (99999)

<details>
  <summary>`https://rpc.uschain.network`</summary>

  ```js
  FetchError: request to https://rpc.uschain.network/ failed, reason: certificate has expired
  ```
</details>
    

### QuarkChain Mainnet Root (100000)

<details>
  <summary>`http://jrpc.mainnet.quarkchain.io:38391`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### Crystaleum (103090)

<details>
  <summary>`https://evm.cryptocurrencydevs.org`</summary>

  ```js
  FetchError: request to https://evm.cryptocurrencydevs.org/ failed, reason: getaddrinfo ENOTFOUND evm.cryptocurrencydevs.org
  ```
</details>
    

<details>
  <summary>`https://rpc.crystaleum.org`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### BROChain Mainnet (108801)

<details>
  <summary>`http://rpc.brochain.org/mainnet`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

<details>
  <summary>`http://rpc.brochain.org`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

<details>
  <summary>`https://rpc.brochain.org/mainnet`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

<details>
  <summary>`https://rpc.brochain.org`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### QuarkChain Devnet Root (110000)

<details>
  <summary>`http://jrpc.devnet.quarkchain.io:38391`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### ETND Chain Mainnets (131419)

<details>
  <summary>`https://rpc.node1.etnd.pro/`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

### Condor Test Network (188881)

<details>
  <summary>`https://testnet.condor.systems/rpc`</summary>

  ```js
  FetchError: request to https://testnet.condor.systems/rpc failed, reason: getaddrinfo ENOTFOUND testnet.condor.systems
  ```
</details>
    

### Akroma (200625)

<details>
  <summary>`https://remote.akroma.io`</summary>

  ```js
  FetchError: request to https://remote.akroma.io/ failed, reason: getaddrinfo ENOTFOUND remote.akroma.io
  ```
</details>
    

### Mythical Chain (201804)

<details>
  <summary>`https://chain-rpc.mythicalgames.com`</summary>

  ```js
  FetchError: request to https://chain-rpc.mythicalgames.com/ failed, reason: getaddrinfo ENOTFOUND chain-rpc.mythicalgames.com
  ```
</details>
    

### Decimal Smart Chain Testnet (202020)

<details>
  <summary>`https://testnet-val.decimalchain.com/web3`</summary>

  ```js
  Error: Request failed with status code 405
  ```
</details>
    

### Jellie (202624)

<details>
  <summary>`wss://jellie-rpc-wss.twala.io/`</summary>

  ```js
  Error: Unexpected server response: 403
  ```
</details>
    

### HashKey Chain Testnet (230315)

<details>
  <summary>`https://testnet.hashkeychain/rpc`</summary>

  ```js
  FetchError: request to https://testnet.hashkeychain/rpc failed, reason: getaddrinfo ENOTFOUND testnet.hashkeychain
  ```
</details>
    

### Haymo Testnet (234666)

<details>
  <summary>`https://testnet1.haymo.network`</summary>

  ```js
  FetchError: invalid json response body at https://testnet1.haymo.network/ reason: Unexpected token < in JSON at position 0
  ```
</details>
    

### CMP-Mainnet (256256)

<details>
  <summary>`wss://mainnet.block.caduceus.foundation`</summary>

  ```js
  Error: Unexpected server response: 405
  ```
</details>
    

### Social Smart Chain Mainnet (281121)

<details>
  <summary>`https://socialsmartchain.digitalnext.business`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Polis Testnet (333888)

<details>
  <summary>`https://sparta-rpc.polis.tech`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Arbitrum Rinkeby (421611)

<details>
  <summary>`https://rinkeby.arbitrum.io/rpc`</summary>

  ```js
  FetchError: request to https://rinkeby.arbitrum.io/rpc failed, reason: getaddrinfo ENOTFOUND rinkeby.arbitrum.io
  ```
</details>
    

### Arbitrum Goerli (421613)

<details>
  <summary>`https://abritrum-goerli.infura.io/v3/${INFURA_API_KEY}`</summary>

  ```js
  FetchError: request to https://abritrum-goerli.infura.io/v3/84842078b09946638c03157f83405213 failed, reason: getaddrinfo ENOTFOUND abritrum-goerli.infura.io
  ```
</details>
    

### CMP-Testnet (512512)

<details>
  <summary>`wss://galaxy.block.caduceus.foundation`</summary>

  ```js
  Error: Unexpected server response: 405
  ```
</details>
    

### Scroll Pre-Alpha Testnet (534354)

<details>
  <summary>`https://prealpha-rpc.scroll.io/l2`</summary>

  ```js
  FetchError: request to https://prealpha-rpc.scroll.io/l2 failed, reason: getaddrinfo ENOTFOUND prealpha-rpc.scroll.io
  ```
</details>
    

### Bear Network Chain Mainnet (641230)

<details>
  <summary>`https://brnkc-mainnet1.bearnetwork.net`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

### 4GoodNetwork (846000)

<details>
  <summary>`https://chain.deptofgood.com`</summary>

  ```js
  Error: Request failed with status code 403
  ```
</details>
    

### Posichain Devnet Shard 0 (920000)

<details>
  <summary>`https://api.s0.d.posichain.org`</summary>

  ```js
  FetchError: request to https://api.s0.d.posichain.org/ failed, reason: getaddrinfo ENOTFOUND api.s0.d.posichain.org
  ```
</details>
    

### Posichain Devnet Shard 1 (920001)

<details>
  <summary>`https://api.s1.d.posichain.org`</summary>

  ```js
  FetchError: request to https://api.s1.d.posichain.org/ failed, reason: getaddrinfo ENOTFOUND api.s1.d.posichain.org
  ```
</details>
    

### Eluvio Content Fabric (955305)

<details>
  <summary>`https://host-76-74-28-226.contentfabric.io/eth/`</summary>

  ```js
  Error: Request failed with status code 404
  ```
</details>
    

<details>
  <summary>`https://host-76-74-29-34.contentfabric.io/eth/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://host-60-240-133-202.contentfabric.io/eth/`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Xerom (1313500)

<details>
  <summary>`https://rpc.xerom.org`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Kintsugi (1337702)

<details>
  <summary>`https://rpc.kintsugi.themerge.dev`</summary>

  ```js
  FetchError: request to https://rpc.kintsugi.themerge.dev/ failed, reason: getaddrinfo ENOTFOUND rpc.kintsugi.themerge.dev
  ```
</details>
    

### Kiln (1337802)

<details>
  <summary>`https://rpc.kiln.themerge.dev`</summary>

  ```js
  FetchError: request to https://rpc.kiln.themerge.dev/ failed, reason: getaddrinfo ENOTFOUND rpc.kiln.themerge.dev
  ```
</details>
    

### Imversed Mainnet (5555555)

<details>
  <summary>`https://ws-jsonrpc.imversed.network`</summary>

  ```js
  Error: Request failed with status code 400
  ```
</details>
    

### Imversed Testnet (5555558)

<details>
  <summary>`https://ws-jsonrpc-test.imversed.network`</summary>

  ```js
  Error: Request failed with status code 400
  ```
</details>
    

### Musicoin (7762959)

<details>
  <summary>`https://mewapi.musicoin.tw`</summary>

  ```js
  FetchError: request to https://mewapi.musicoin.tw/ failed, reason: certificate has expired
  ```
</details>
    

### PepChain Churchill (13371337)

<details>
  <summary>`https://churchill-rpc.pepchain.io`</summary>

  ```js
  FetchError: request to https://churchill-rpc.pepchain.io/ failed, reason: getaddrinfo ENOTFOUND churchill-rpc.pepchain.io
  ```
</details>
    

### IOLite (18289463)

<details>
  <summary>`https://net.iolite.io`</summary>

  ```js
  FetchError: request to https://net.iolite.io/ failed, reason: getaddrinfo ENOTFOUND net.iolite.io
  ```
</details>
    

### Excoincial Chain Volta-Testnet (27082017)

<details>
  <summary>`https://testnet-rpc.exlscan.com`</summary>

  ```js
  FetchError: request to https://testnet-rpc.exlscan.com/ failed, reason: certificate has expired
  ```
</details>
    

### Excoincial Chain Mainnet (27082022)

<details>
  <summary>`https://rpc.exlscan.com`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Auxilium Network Mainnet (28945486)

<details>
  <summary>`https://rpc.auxilium.global`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Flachain Mainnet (29032022)

<details>
  <summary>`https://flachain.flaexchange.top/`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Aquachain (61717561)

<details>
  <summary>`https://tx.aquacha.in/api`</summary>

  ```js
  Error: Request failed with status code 502
  ```
</details>
    

### Joys Digital TestNet (99415706)

<details>
  <summary>`https://toys.joys.cash/`</summary>

  ```js
  FetchError: request to https://toys.joys.cash/ failed, reason: getaddrinfo ENOTFOUND toys.joys.cash
  ```
</details>
    

### Neon EVM MainNet (245022934)

<details>
  <summary>`https://mainnet.neonevm.org`</summary>

  ```js
  FetchError: request to https://mainnet.neonevm.org/ failed, reason: getaddrinfo ENOTFOUND mainnet.neonevm.org
  ```
</details>
    

### Neon EVM TestNet (245022940)

<details>
  <summary>`https://testnet.neonevm.org`</summary>

  ```js
  FetchError: request to https://testnet.neonevm.org/ failed, reason: getaddrinfo ENOTFOUND testnet.neonevm.org
  ```
</details>
    

### Gather Devnet Network (486217935)

<details>
  <summary>`https://devnet.gather.network`</summary>

  ```js
  Error: Request failed with status code 503
  ```
</details>
    

### IPOS Network (1122334455)

<details>
  <summary>`https://rpc.iposlab.com`</summary>

  ```js
  FetchError: request to https://rpc.iposlab.com/ failed, reason: write EPROTO 8489238848:error:14094438:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:../deps/openssl/openssl/ssl/record/rec_layer_s3.c:1546:SSL alert number 80

  ```
</details>
    

<details>
  <summary>`https://rpc2.iposlab.com`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Nebula Mainnet (1482601649)

<details>
  <summary>`wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Harmony Devnet Shard 0 (1666900000)

<details>
  <summary>`https://api.s1.ps.hmny.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

<details>
  <summary>`https://api.s1.ps.hmny.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### DataHopper (2021121117)

<details>
  <summary>`https://23.92.21.121:8545`</summary>

  ```js
  FetchError: request to https://23.92.21.121:8545/ failed, reason: connect ECONNREFUSED 23.92.21.121:8545
  ```
</details>
    

### Europa SKALE Chain (2046399126)

<details>
  <summary>`wss://mainnet.skalenodes.com/v1/elated-tan-skat`</summary>

  ```js
  Error: Unexpected server response: 200
  ```
</details>
    

### Pirl (3125659152)

<details>
  <summary>`https://wallrpc.pirl.io`</summary>

  ```js
  RequestTimeoutError: Request timed out after 5000ms
  ```
</details>
    

### Molereum Network (6022140761023)

<details>
  <summary>`https://molereum.jdubedition.com`</summary>

  ```js
  FetchError: request to https://molereum.jdubedition.com/ failed, reason: getaddrinfo ENOTFOUND molereum.jdubedition.com
  ```
</details>
    

