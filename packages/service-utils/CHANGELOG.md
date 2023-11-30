# @thirdweb-dev/service-utils

## 0.4.10

### Patch Changes

- [#1988](https://github.com/thirdweb-dev/js/pull/1988) [`17fe41d4`](https://github.com/thirdweb-dev/js/commit/17fe41d42bf99ccc83669557dc48d6fd22a5a04e) Thanks [@assimovt](https://github.com/assimovt)! - fix api key caching ttl

## 0.4.9

### Patch Changes

- [#1976](https://github.com/thirdweb-dev/js/pull/1976) [`8ff87be6`](https://github.com/thirdweb-dev/js/commit/8ff87be631f1754b15e7ec4556d51e8eec5cbd18) Thanks [@arcoraven](https://github.com/arcoraven)! - Handle if error parsing JSON response in authorization helper

## 0.4.8

### Patch Changes

- [#1907](https://github.com/thirdweb-dev/js/pull/1907) [`8d1b8a47`](https://github.com/thirdweb-dev/js/commit/8d1b8a47e6d2262ef7e326ff561a30f401cb9834) Thanks [@arcoraven](https://github.com/arcoraven)! - chore: add "checkout" as a usage type

## 0.4.7

### Patch Changes

- [#1752](https://github.com/thirdweb-dev/js/pull/1752) [`1fbbc2d2`](https://github.com/thirdweb-dev/js/commit/1fbbc2d27d88af6029267e6993dd79e077a60ab2) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - chore(service-utils): add `redirecrUrls` type to `ApiKeyMetadata`

- [#1751](https://github.com/thirdweb-dev/js/pull/1751) [`95380eae`](https://github.com/thirdweb-dev/js/commit/95380eaed4aad93d47ece4da2b45fdbba2d14205) Thanks [@arcoraven](https://github.com/arcoraven)! - Add walletType to usage payload

## 0.4.6

### Patch Changes

- [#1729](https://github.com/thirdweb-dev/js/pull/1729) [`52b1a0fc`](https://github.com/thirdweb-dev/js/commit/52b1a0fcacb136e8da417d883e5365f2ab558d59) Thanks [@arcoraven](https://github.com/arcoraven)! - Make accountId optional in publishUsageEvents. This will be hydrated internally.

## 0.4.5

### Patch Changes

- [#1641](https://github.com/thirdweb-dev/js/pull/1641) [`d66ff413`](https://github.com/thirdweb-dev/js/commit/d66ff413dee8abeb8b5ad75919a2e553d8dedb1e) Thanks [@arcoraven](https://github.com/arcoraven)! - Adds platform metrics to usage tracker payload

- [#1640](https://github.com/thirdweb-dev/js/pull/1640) [`e2e6bdd4`](https://github.com/thirdweb-dev/js/commit/e2e6bdd4cda061019c8b76519f019cebc43128c5) Thanks [@assimovt](https://github.com/assimovt)! - add embedded wallets to service definitions

- [#1584](https://github.com/thirdweb-dev/js/pull/1584) [`903145a4`](https://github.com/thirdweb-dev/js/commit/903145a4ae4474356f46b62e363871f4f3f613c5) Thanks [@assimovt](https://github.com/assimovt)! - rate limit worker

## 0.4.4

### Patch Changes

- [#1566](https://github.com/thirdweb-dev/js/pull/1566) [`d378106a`](https://github.com/thirdweb-dev/js/commit/d378106a852f941779bb72ac1841bddf34fc15a6) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - docs(service-utils): Add documentation for authorizeNode for node auth function

- [#1569](https://github.com/thirdweb-dev/js/pull/1569) [`1e6f9dcc`](https://github.com/thirdweb-dev/js/commit/1e6f9dcc04022c6a8a39d490123a3e22e52b5e0b) Thanks [@Marfuen](https://github.com/Marfuen)! - Use a different globalThis for CLI related flow.

- [#1559](https://github.com/thirdweb-dev/js/pull/1559) [`13ef6a50`](https://github.com/thirdweb-dev/js/commit/13ef6a50cf10b442b2b54b780e42210cab2db762) Thanks [@assimovt](https://github.com/assimovt)! - expose account status in api key metadata

## 0.4.3

### Patch Changes

- [#1422](https://github.com/thirdweb-dev/js/pull/1422) [`0f027069`](https://github.com/thirdweb-dev/js/commit/0f027069064bebe647f9235fa86ef7f165ffc7b3) Thanks [@Marfuen](https://github.com/Marfuen)! - CLI will now use an OAuth like login flow to authenticate the device with the wallet on the dashboard.
  Any actions performed by the CLI will be linked to your account / wallet on the dashboard, including but not limited to tracking your usage, and billing as needed.

## 0.4.2

### Patch Changes

- [#1463](https://github.com/thirdweb-dev/js/pull/1463) [`205018f6`](https://github.com/thirdweb-dev/js/commit/205018f6e191d2a2fb89f1bee276d0ea89643f30) Thanks [@arcoraven](https://github.com/arcoraven)! - Add userOpHash

- [#1473](https://github.com/thirdweb-dev/js/pull/1473) [`73462ef1`](https://github.com/thirdweb-dev/js/commit/73462ef10800aeeb5976634e2bc6fb5d3e8501e4) Thanks [@jnsdls](https://github.com/jnsdls)! - handle possible empty auth tokens

- [#1475](https://github.com/thirdweb-dev/js/pull/1475) [`cf82c3b5`](https://github.com/thirdweb-dev/js/commit/cf82c3b58c92714d006f3880ec84a84893da861b) Thanks [@nessup](https://github.com/nessup)! - Improve error logging when authentication fails

- [#1466](https://github.com/thirdweb-dev/js/pull/1466) [`7e483ec9`](https://github.com/thirdweb-dev/js/commit/7e483ec97f576067d0220518b86d00794da94b4d) Thanks [@arcoraven](https://github.com/arcoraven)! - Silence output for publishUsageEvents()

## 0.4.1

### Patch Changes

- [#1454](https://github.com/thirdweb-dev/js/pull/1454) [`6979810d`](https://github.com/thirdweb-dev/js/commit/6979810de5c3fc700c7b5b91ac1567d9cdf50607) Thanks [@nessup](https://github.com/nessup)! - Update error message

## 0.4.0

### Minor Changes

- [#1448](https://github.com/thirdweb-dev/js/pull/1448) [`3e1c4045`](https://github.com/thirdweb-dev/js/commit/3e1c4045e7c58e2fe58e2ab6a7f767c8f5e206e9) Thanks [@arcoraven](https://github.com/arcoraven)! - Add logHttpRequest helper func

### Patch Changes

- [#1453](https://github.com/thirdweb-dev/js/pull/1453) [`0647f124`](https://github.com/thirdweb-dev/js/commit/0647f12498ed1cdd5aca4dcea5bd3cf0d5d3a23b) Thanks [@arcoraven](https://github.com/arcoraven)! - Remove clientId from logRequest

## 0.3.1

### Patch Changes

- [#1447](https://github.com/thirdweb-dev/js/pull/1447) [`b103872d`](https://github.com/thirdweb-dev/js/commit/b103872daff87b032082a433713d16b9dee13082) Thanks [@nessup](https://github.com/nessup)! - Export extractAuthorizationData for CF Workers

## 0.3.0

### Minor Changes

- [#1424](https://github.com/thirdweb-dev/js/pull/1424) [`d01e6396`](https://github.com/thirdweb-dev/js/commit/d01e6396d176a162aaacb10792f0d9abade62a1f) Thanks [@arcoraven](https://github.com/arcoraven)! - Add helper to publish usage events from backend services

### Patch Changes

- [#1440](https://github.com/thirdweb-dev/js/pull/1440) [`5ec0f064`](https://github.com/thirdweb-dev/js/commit/5ec0f064d27acbd5225934dfe8ea2cd2c5af3997) Thanks [@arcoraven](https://github.com/arcoraven)! - [service-utils] Switch to aws4fetch to call AWS services

- [#1437](https://github.com/thirdweb-dev/js/pull/1437) [`5ee700e8`](https://github.com/thirdweb-dev/js/commit/5ee700e80438650fa253c25c0bee6658ce68d2cf) Thanks [@farhanW3](https://github.com/farhanW3)! - Updated the error messages

- [#1435](https://github.com/thirdweb-dev/js/pull/1435) [`2a3cd62d`](https://github.com/thirdweb-dev/js/commit/2a3cd62dc9af6accae5c2c48ef4956d139a637e4) Thanks [@arcoraven](https://github.com/arcoraven)! - Use string type for gasPricePerUnit

## 0.2.5

### Patch Changes

- [#1411](https://github.com/thirdweb-dev/js/pull/1411) [`3b6b0746`](https://github.com/thirdweb-dev/js/commit/3b6b0746b3fc792f4c5092814a7abfabcbc9801e) Thanks [@jnsdls](https://github.com/jnsdls)! - allow account level auth via jwt

## 0.2.4

### Patch Changes

- [#1420](https://github.com/thirdweb-dev/js/pull/1420) [`952009cd`](https://github.com/thirdweb-dev/js/commit/952009cd73a1851dfef7a8f8c29ab6d73d580508) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Handle \* domain as public

- [#1417](https://github.com/thirdweb-dev/js/pull/1417) [`580e77b1`](https://github.com/thirdweb-dev/js/commit/580e77b17088a439208bd1411c71e9fb0c2cbb79) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Return accountId from authorize service call

## 0.2.3

### Patch Changes

- [#1415](https://github.com/thirdweb-dev/js/pull/1415) [`256ee0d5`](https://github.com/thirdweb-dev/js/commit/256ee0d5ec9c8598aa79cd4cb1fd839c6cc7d390) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Downgrade preconstruct to 2.7.0

## 0.2.2

### Patch Changes

- [#1409](https://github.com/thirdweb-dev/js/pull/1409) [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#1386](https://github.com/thirdweb-dev/js/pull/1386) [`5e58c799`](https://github.com/thirdweb-dev/js/commit/5e58c799263e4a8efbc980e3d7620b5995045dbc) Thanks [@farhanW3](https://github.com/farhanW3)! - updated response messages to include more details on error

## 0.2.1

### Patch Changes

- [#1365](https://github.com/thirdweb-dev/js/pull/1365) [`da95dce5`](https://github.com/thirdweb-dev/js/commit/da95dce5805210c97e09258be2b25d974f47f8d6) Thanks [@assimovt](https://github.com/assimovt)! - Handle port in the origin check

## 0.2.0

### Minor Changes

- [#1345](https://github.com/thirdweb-dev/js/pull/1345) [`5eb6fc1b`](https://github.com/thirdweb-dev/js/commit/5eb6fc1bf309a34167bf1f27fe5b09a3ae781219) Thanks [@jnsdls](https://github.com/jnsdls)! - expose separate entrypoints for cloudflare workers and node projects

### Patch Changes

- [#1342](https://github.com/thirdweb-dev/js/pull/1342) [`4915ac50`](https://github.com/thirdweb-dev/js/commit/4915ac50f8ffd90cd965636905f73d1c99cbda29) Thanks [@jnsdls](https://github.com/jnsdls)! - add relayer service definition

- [#1340](https://github.com/thirdweb-dev/js/pull/1340) [`d724ad85`](https://github.com/thirdweb-dev/js/commit/d724ad85c52f6da341a248fbe62d85a99c1b65d0) Thanks [@jnsdls](https://github.com/jnsdls)! - fix use endpoint

- [#1354](https://github.com/thirdweb-dev/js/pull/1354) [`0bfdedd4`](https://github.com/thirdweb-dev/js/commit/0bfdedd4ba6ce9b42f9636303027b4421eb68d65) Thanks [@assimovt](https://github.com/assimovt)! - Fix enforceAuth param

- [#1355](https://github.com/thirdweb-dev/js/pull/1355) [`d5aee62b`](https://github.com/thirdweb-dev/js/commit/d5aee62bf41e45b5fed3061d4338d4a279a27c38) Thanks [@assimovt](https://github.com/assimovt)! - Remove unused type

- [#1349](https://github.com/thirdweb-dev/js/pull/1349) [`ddb3dabe`](https://github.com/thirdweb-dev/js/commit/ddb3dabe694be96d2de4c01c53d8c6fc6b9e211d) Thanks [@assimovt](https://github.com/assimovt)! - Allow target addresses array and fix api url stringy

- [#1351](https://github.com/thirdweb-dev/js/pull/1351) [`fd0650dc`](https://github.com/thirdweb-dev/js/commit/fd0650dcacfa6bf4a3fa479934046957eef8cf94) Thanks [@farhanW3](https://github.com/farhanW3)! - Fixed Node Service Url formation

- [#1353](https://github.com/thirdweb-dev/js/pull/1353) [`42d9ab68`](https://github.com/thirdweb-dev/js/commit/42d9ab68d949bc6788f628042d916a1c5e660b16) Thanks [@assimovt](https://github.com/assimovt)! - Allow to skip auth for backwards compat

- [#1347](https://github.com/thirdweb-dev/js/pull/1347) [`781e26d8`](https://github.com/thirdweb-dev/js/commit/781e26d89632ef421bec2914d4e3abcc17d96816) Thanks [@assimovt](https://github.com/assimovt)! - Authorize service bundle

- [#1343](https://github.com/thirdweb-dev/js/pull/1343) [`7dc685bb`](https://github.com/thirdweb-dev/js/commit/7dc685bbece749030e85a9f6d5aafa48d3ab8a74) Thanks [@nessup](https://github.com/nessup)! - Add missing type to ApiKey

- [#1346](https://github.com/thirdweb-dev/js/pull/1346) [`f7392138`](https://github.com/thirdweb-dev/js/commit/f7392138eeda55a6557b26a6c957d5b6b90b645c) Thanks [@assimovt](https://github.com/assimovt)! - fix api url extraction from URL in fetchKeyMetadataFromApi

## 0.1.0

### Minor Changes

- [#1333](https://github.com/thirdweb-dev/js/pull/1333) [`07c7d97c`](https://github.com/thirdweb-dev/js/commit/07c7d97c288063f7a5a65819e37ebe3f51095faf) Thanks [@jnsdls](https://github.com/jnsdls)! - add package

### Patch Changes

- [#1339](https://github.com/thirdweb-dev/js/pull/1339) [`cfa7ecbc`](https://github.com/thirdweb-dev/js/commit/cfa7ecbc9ab8f1c5031f82d5c23a6ee0a800c9f4) Thanks [@assimovt](https://github.com/assimovt)! - Remove crypto and unfetch node dependencies
