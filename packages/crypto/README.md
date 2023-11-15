<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb crypto</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/crypto"><img src="https://img.shields.io/npm/v/@thirdweb-dev/crypto?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Secure, performant and cross-platform cryptography methods commonly used across other thirdweb packages.</strong></p>
<br />

## Installation

```bash
npm install @thirdweb-dev/crypto
```

## Available methods

### Encryption

| method                                       | use case                                                                                              | return type       | underlying technology |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------- | --------------------- |
| `aesEncrypt(<plaintext>, <password>)`        | Encrypts a string/Uint8Array with AES-GCM                                                             | `Promise<string>` | `WebCrypto` (AES-GCM) |
| `aesDecrypt(<ciphertext>, <password>)`       | Decrypts a value encrypted via `aesEncrypt`                                                           | `Promise<string>` | `WebCrypto` (AES-GCM) |
| `aesDecryptCompat(<ciphertext>, <password>)` | Same as `aesDecrypt` but also supports values encrypted via `crypto-js` (for backwards compatibility) | `Promise<string>` | `WebCrypto` (AES-GCM) |

### Hashing

| method                              | use case                                                        | return type           | underlying technology |
| ----------------------------------- | --------------------------------------------------------------- | --------------------- | --------------------- |
| `sha256(<value>)`                   | Hashes a string/Uint8Array with SHA256                          | `Promise<Uint8Array>` | `WebCrypto`           |
| `sha256Hex(<value>)`                | Same as `sha256` but reruns as hex string                       | `Promise<string>`     | `WebCrypto`           |
| `sha256Sync(<value>)`               | Same as `sha256` but synchronous                                | `Uint8Array`          | `@noble/hashes`       |
| `sha256SyncHex(<value>)`            | Same as `sha256Sync` but reruns as hex string                   | `string`              | `@noble/hashes`       |
| `keccak256Sync(<value>)`            | Hashes a string/Uint8Array with Keccak256                       | `Uint8Array`          | `js-sha3`             |
| `keccak256SyncHex(<value>)`         | Same as `keccak256Sync` but returns as hex string               | `string`              | `js-sha3`             |
| `keccak256SyncHexPrefixed(<value>)` | Same as `keccak256Sync` but returns as `0x` prefixed hex string | `0x${string}`         | `js-sha3`             |

## Initial Benchmarks

#### sha256 -> Uint8Array

```bash
┌──────────────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│          Task Name           │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├──────────────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ @thirdweb-dev/crypto (async) │ 112,929 │ 8855.08539999982   │ ±1.37% │ 100000  │
│ @thirdweb-dev/crypto (sync)  │ 55,004  │ 18180.482820000594 │ ±1.02% │ 100000  │
│ crypto-js (sync)             │ 19,213  │ 52047.35353999857  │ ±0.25% │ 100000  │
└──────────────────────────────┴─────────┴────────────────────┴────────┴─────────┘
```

#### sha256 -> hex

```bash
┌──────────────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│          Task Name           │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├──────────────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ @thirdweb-dev/crypto (async) │ 100,845 │ 9916.125730001713  │ ±1.24% │ 100000  │
│ @thirdweb-dev/crypto (sync)  │ 53,751  │ 18604.047449997142 │ ±0.92% │ 100000  │
│ crypto-js (sync)             │ 19,077  │ 52419.03465000334  │ ±0.24% │ 100000  │
└──────────────────────────────┴─────────┴────────────────────┴────────┴─────────┘
```

#### keccack256 -> Uint8Array

```bash
┌──────────────────────┬─────────┬────────────────────┬────────┬─────────┐
│      Task Name       │ ops/sec │ Average Time (ns)  │ Margin │ Samples │
├──────────────────────┼─────────┼────────────────────┼────────┼─────────┤
│ @thirdweb-dev/crypto │ 72,533  │ 13786.719900000808 │ ±0.31% │ 100000  │
│ ethers@v5            │ 71,891  │ 13909.94663000107  │ ±0.33% │ 100000  │
│ @noble/hashes        │ 27,244  │ 36704.73226000136  │ ±0.19% │ 100000  │
│ viem                 │ 27,115  │ 36879.07953999698  │ ±0.26% │ 100000  │
└──────────────────────┴─────────┴────────────────────┴────────┴─────────┘
```

#### keccack256 -> hex

```bash
┌──────────────────────┬─────────┬───────────────────┬────────┬─────────┐
│      Task Name       │ ops/sec │ Average Time (ns) │ Margin │ Samples │
├──────────────────────┼─────────┼───────────────────┼────────┼─────────┤
│ @thirdweb-dev/crypto │ 42,947  │ 23284.22780000266 │ ±0.23% │ 100000  │
│ ethers@5             │ 35,568  │ 28114.98005000045 │ ±0.42% │ 100000  │
│ @noble/hashes        │ 15,149  │ 66009.80448000187 │ ±0.26% │ 100000  │
│ viem                 │ 15,217  │ 65714.15843999518 │ ±0.25% │ 100000  │
└──────────────────────┴─────────┴───────────────────┴────────┴─────────┘
```
