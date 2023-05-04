# @thirdweb-dev/auth

## 3.0.16

### Patch Changes

- [#958](https://github.com/thirdweb-dev/js/pull/958) [`72b8b982`](https://github.com/thirdweb-dev/js/commit/72b8b9829eb11d51a63530af62e5634f182c0d03) Thanks [@adam-maj](https://github.com/adam-maj)! - Add extra options to cookie on logout

- Updated dependencies [[`7012513b`](https://github.com/thirdweb-dev/js/commit/7012513bc20f283b2cde46c0b938af33fe3a1a20), [`5d67b280`](https://github.com/thirdweb-dev/js/commit/5d67b2807f2504add4c202d2eb18897415662fb6), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`5a67d5d8`](https://github.com/thirdweb-dev/js/commit/5a67d5d89474eac9a638ffaddba139b62965deff), [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f), [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392), [`e22e4a47`](https://github.com/thirdweb-dev/js/commit/e22e4a47d73e1bbc6e3f0ae7ed56717b44e5ffcd), [`1e4ac672`](https://github.com/thirdweb-dev/js/commit/1e4ac672720c2fb01046bec195877a074ffbda06), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a), [`4a69f8c8`](https://github.com/thirdweb-dev/js/commit/4a69f8c85dec420615e9eda8d1ad5b5ef0b87713), [`26cd91ff`](https://github.com/thirdweb-dev/js/commit/26cd91ffe18dad37133a18988f21185c13d64cfb), [`0186721b`](https://github.com/thirdweb-dev/js/commit/0186721bc455aa1f8454839a1a25fa4062b45102), [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa), [`7af99d9a`](https://github.com/thirdweb-dev/js/commit/7af99d9a6d54492a29a90288a25b30773a8a10a7), [`8cfb4f38`](https://github.com/thirdweb-dev/js/commit/8cfb4f38ed89c26ad04f19d27c65c24cefa976b6)]:
  - @thirdweb-dev/wallets@0.2.17

## 3.0.15

### Patch Changes

- [#874](https://github.com/thirdweb-dev/js/pull/874) [`49922de9`](https://github.com/thirdweb-dev/js/commit/49922de9d9c1258e58a3a05e656b229db469b1dd) Thanks [@iketw](https://github.com/iketw)! - [RN] Adds Auth to React Native

  - Adds an optional `secureStorage` to authConfig
  - Adds `expo-secure-store` to store the JWT token securely in React Native, passing a default value
  - Stores the token in secure storage to be accessed by subsequent calls
  - Returns the token in `useLogin` to be used by the user

  How I tested:

  - Tested in Android/iOS/Web

  Usage:

  ```
  <ThirdwebProvider
        activeChain="ethereum"
        supportedWallets={[metamaskWallet(), rainbowWallet()]}
        authConfig={{
          domain: https://your-domain.com,
          authUrl: '/api/auth',
        }}>
        <AppInner />
      </ThirdwebProvider>
  ```

  ```
  const { login } = useLogin();
  const { logout } = useLogout();
  const { user, isLoggedIn } = useUser();
  ...

  const token = await login();
  ```

- Updated dependencies [[`4acb2b55`](https://github.com/thirdweb-dev/js/commit/4acb2b5561118dde5c7372400d4d754b879aef2e), [`82bea3fa`](https://github.com/thirdweb-dev/js/commit/82bea3fa10294eb3c5c7327fb047e3d1b2c62ff9), [`664d1cd0`](https://github.com/thirdweb-dev/js/commit/664d1cd0dd03f32337c2cf532f0ad860e5aa5ea8), [`c2fec930`](https://github.com/thirdweb-dev/js/commit/c2fec930520e2df89532ec0027ead4563c7708cf)]:
  - @thirdweb-dev/wallets@0.2.16

## 3.0.14

### Patch Changes

- Updated dependencies [[`b616dca7`](https://github.com/thirdweb-dev/js/commit/b616dca7eb861cd1d2adba3f3d1fe9c3b50f259e), [`2545a440`](https://github.com/thirdweb-dev/js/commit/2545a440dc272690cacbc23023f7b0a68f390c6e), [`229a4741`](https://github.com/thirdweb-dev/js/commit/229a47413e422952ad946b8c09af32cc1fcdc7f0)]:
  - @thirdweb-dev/wallets@0.2.15

## 3.0.13

### Patch Changes

- Updated dependencies [[`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d)]:
  - @thirdweb-dev/wallets@0.2.14

## 3.0.12

### Patch Changes

- Updated dependencies [[`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc), [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48)]:
  - @thirdweb-dev/wallets@0.2.13

## 3.0.11

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/wallets@0.2.12

## 3.0.10

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/wallets@0.2.11

## 3.0.9

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/wallets@0.2.10

## 3.0.8

### Patch Changes

- [#791](https://github.com/thirdweb-dev/js/pull/791) [`c2324bfd`](https://github.com/thirdweb-dev/js/commit/c2324bfdc25e92589a0dcd9736925924f7b7e516) Thanks [@jnsdls](https://github.com/jnsdls)! - now relies on `@thirdweb-dev/wallets` for wallet integrations instead of rolling its own

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

- [#709](https://github.com/thirdweb-dev/js/pull/709) [`d6913d70`](https://github.com/thirdweb-dev/js/commit/d6913d70b2d62a40f5e08e5f23f74e1f174887ca) Thanks [@adam-maj](https://github.com/adam-maj)! - Make @thirdweb-dev/wallets actual dev dependency of auth

- Updated dependencies [[`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`93eca1de`](https://github.com/thirdweb-dev/js/commit/93eca1de7d23d66a129418aee72a41e394cbec16), [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406), [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb), [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682), [`83e99dbf`](https://github.com/thirdweb-dev/js/commit/83e99dbf289c7b8b8991c58383f8bc2a63f5a702), [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a), [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`6b31a9bc`](https://github.com/thirdweb-dev/js/commit/6b31a9bcd3898cf56ee3b774a44b7481738c8e60), [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a), [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94), [`6c0c6538`](https://github.com/thirdweb-dev/js/commit/6c0c65389fb5b990a6e780e7d3f7dbd403fe950d), [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8), [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922)]:
  - @thirdweb-dev/wallets@0.2.9

## 3.0.7

### Patch Changes

- [#665](https://github.com/thirdweb-dev/js/pull/665) [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75) Thanks [@shift4id](https://github.com/shift4id)! - Fix spelling throughout all packages

## 3.0.6

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

## 3.0.5

### Patch Changes

- [#588](https://github.com/thirdweb-dev/js/pull/588) [`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e) Thanks [@adam-maj](https://github.com/adam-maj)! - Add verify login to auth

## 3.0.4

### Patch Changes

- [#581](https://github.com/thirdweb-dev/js/pull/581) [`4d9e5c6`](https://github.com/thirdweb-dev/js/commit/4d9e5c6193b839fc7f67e7e73e0589dc8c4db90d) Thanks [@adam-maj](https://github.com/adam-maj)! - Remove wallet from next-auth config

- [#576](https://github.com/thirdweb-dev/js/pull/576) [`f6ea971`](https://github.com/thirdweb-dev/js/commit/f6ea97185470f91fc73a117827df51cf8e1c99d1) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for next-auth to auth and react

## 3.0.3

### Patch Changes

- [#533](https://github.com/thirdweb-dev/js/pull/533) [`dee4596`](https://github.com/thirdweb-dev/js/commit/dee45965496d5d0298944031dd13a4345f9e1683) Thanks [@adam-maj](https://github.com/adam-maj)! - Remove next major version pin on auth

## 3.0.2

## 3.0.1

### Patch Changes

- [#520](https://github.com/thirdweb-dev/js/pull/520) [`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth and react-core dependencies

## 3.0.0

### Major Changes

- [#460](https://github.com/thirdweb-dev/js/pull/460) [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab) Thanks [@adam-maj](https://github.com/adam-maj)! - Complete Auth redesign and update to add a number of major and quality of life improvements, including the following:

  - Ability to use Auth APIs with both cookies and JWTs, allowing non browser clients to interact with Auth (mobile, gaming, scripts, etc.)
  - Ability to store session data and other data on the Auth user
  - Callbacks to run side-effects on login, logout, and requesting user data
  - Ability to configure cookies for custom domains and backend setups
  - Support for validation of the entire EIP4361/CAIP122 specification
  - No more need for redirects or payload encoding on Auth requests
  - and more...

  See the new documentation to view the new changes and usage: [Auth Documentation](https://portal.thirdweb.com/auth).

  ## How to upgrade

  The `ThirdwebAuth` constructor now takes the `domain` in the constructor, and takes a more generic `wallet` interface as input. The `wallet` can be imported from the `@thirdweb-dev/wallets` package, or for more simpler use cases, from the `@thirdweb-dev/auth/evm` and `@thirdweb-dev/auth/solana` entrypoints.

  ```js
  import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

  // Pass in domain and wallet to the constructor
  const wallet = new PrivateKeyWallet("0x...");
  const auth = new ThirdwebAuth(wallet, "example.com");

  // Auth functions no longer require domain to be passed in
  const payload = await auth.login();
  ```

## 2.0.41

## 2.0.40

## 2.0.39

## 2.0.38

## 2.0.37

## 2.0.36

## 2.0.35

## 2.0.34

### Patch Changes

- [#425](https://github.com/thirdweb-dev/js/pull/425) [`f545a67`](https://github.com/thirdweb-dev/js/commit/f545a67e9fb597d27bb39ca515d24d306fbb121a) Thanks [@adam-maj](https://github.com/adam-maj)! - Add sameSite none and include credentials

## 2.0.33

## 2.0.32

## 2.0.31

### Patch Changes

- [#397](https://github.com/thirdweb-dev/js/pull/397) [`72589ec`](https://github.com/thirdweb-dev/js/commit/72589ec234d86939b67b0ca8b3b789f2e9c54cc2) Thanks [@adam-maj](https://github.com/adam-maj)! - Call user callback in getUser

## 2.0.30

## 2.0.29

## 2.0.28

## 2.0.27

## 2.0.26

## 2.0.25

## 2.0.24

## 2.0.23

## 2.0.22

## 2.0.21

### Patch Changes

- [#327](https://github.com/thirdweb-dev/js/pull/327) [`ef27aad`](https://github.com/thirdweb-dev/js/commit/ef27aad0aafc4577e85f44dc77dfbe880bd239b5) Thanks [@jnsdls](https://github.com/jnsdls)! - enable e2e testing

## 2.0.20

## 2.0.19

## 2.0.18

## 2.0.17

## 2.0.16

## 2.0.15

## 2.0.14

### Patch Changes

- [#274](https://github.com/thirdweb-dev/js/pull/274) [`ad06c5b`](https://github.com/thirdweb-dev/js/commit/ad06c5b28902422f9b416d65255c64c937a5e046) Thanks [@adam-maj](https://github.com/adam-maj)! - Add solana auth support and plugins for react and auth package

## 2.0.13

## 2.0.12

## 2.0.11

## 2.0.10

## 2.0.9

## 2.0.8

### Patch Changes

- Updated dependencies [[`ce05bfd`](https://github.com/thirdweb-dev/js/commit/ce05bfd8615a9c79664856bce53de8b43bed5c87)]:
  - @thirdweb-dev/sdk@3.0.8

## 2.0.7

### Patch Changes

- Updated dependencies [[`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c)]:
  - @thirdweb-dev/sdk@3.0.7

## 2.0.6

### Patch Changes

- Updated dependencies [[`a80fc97`](https://github.com/thirdweb-dev/js/commit/a80fc97b6a1e72ed46a400b4b602e180947fb870)]:
  - @thirdweb-dev/sdk@3.0.6

## 2.0.5

### Patch Changes

- Updated dependencies [[`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191), [`3b877ba`](https://github.com/thirdweb-dev/js/commit/3b877ba221acfd85f80b99e1bc382055217f0a39), [`b54f95d`](https://github.com/thirdweb-dev/js/commit/b54f95dc906928ff2f9251748f254a16fe1f2cee), [`f8ab477`](https://github.com/thirdweb-dev/js/commit/f8ab4779bb2d6d66200e1e8fd558e0ac069a2f54), [`772f843`](https://github.com/thirdweb-dev/js/commit/772f8431e3a62d0ded62dae90a43e9a7edd5b1a2), [`a9ec190`](https://github.com/thirdweb-dev/js/commit/a9ec190ff99d2714cef2500d20ea0f3f73f07be3), [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9), [`5345479`](https://github.com/thirdweb-dev/js/commit/534547992243bdd3a77e34ec2b2487b5adab366a)]:
  - @thirdweb-dev/sdk@3.0.5

## 2.0.4

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/sdk@3.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564), [`9d74a43`](https://github.com/thirdweb-dev/js/commit/9d74a43aac21448beba63ba4e2637945965a3634), [`b234c58`](https://github.com/thirdweb-dev/js/commit/b234c58d44d8322e44b2d2ba87ad4ec7d699e961)]:
  - @thirdweb-dev/sdk@3.0.3

## 2.0.2

### Patch Changes

- Updated dependencies [[`42c79e9`](https://github.com/thirdweb-dev/js/commit/42c79e93dc958ca46a55d705aeea44ffdbbcc5f6), [`fe8751e`](https://github.com/thirdweb-dev/js/commit/fe8751eeae7ad013b890a8092ddbd091ecbd6708)]:
  - @thirdweb-dev/sdk@3.0.2

## 2.0.1

### Patch Changes

- Updated dependencies [[`98dd64a`](https://github.com/thirdweb-dev/js/commit/98dd64a375c302a879aab3c628ecfb84b4dd19da)]:
  - @thirdweb-dev/sdk@3.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [[`a70b590`](https://github.com/thirdweb-dev/js/commit/a70b590be1efa7c0ad93a724afb24870439558ed), [`a37bc00`](https://github.com/thirdweb-dev/js/commit/a37bc00991bf1a359f5f8aa8e24e2c388dcd99d8), [`b442c97`](https://github.com/thirdweb-dev/js/commit/b442c970808f6cb7457d29542bd826dba711579c), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397), [`5a5bc36`](https://github.com/thirdweb-dev/js/commit/5a5bc361507bd8707dc12e9000bb9a218221cf61), [`820a519`](https://github.com/thirdweb-dev/js/commit/820a5191b5e7af5aba5e4d1cc90cd895c0dade11), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b)]:
  - @thirdweb-dev/sdk@3.0.0

## 1.0.8

### Patch Changes

- Updated dependencies [[`baa87a1`](https://github.com/thirdweb-dev/js/commit/baa87a1fbd7eee24ce9a95e16028de8435f85e69), [`4079326`](https://github.com/thirdweb-dev/js/commit/407932680fb024f17f12f578aa22c7f8c0c13339), [`05353fd`](https://github.com/thirdweb-dev/js/commit/05353fd8da82f77fb642bb38a533fb99801aed30)]:
  - @thirdweb-dev/sdk@2.4.9

## 1.0.7

### Patch Changes

- [#61](https://github.com/thirdweb-dev/js/pull/61) [`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6) Thanks [@jnsdls](https://github.com/jnsdls)! - fix versions in dependencies before releasing stable

- Updated dependencies [[`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6)]:
  - @thirdweb-dev/sdk@2.4.8

## 1.0.6

### Patch Changes

- Updated dependencies [[`6ba9cad`](https://github.com/thirdweb-dev/js/commit/6ba9cad8d8b933256599dc3b147601cd4828c89b)]:
  - @thirdweb-dev/sdk@2.4.7

## 1.0.5

### Patch Changes

- [`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117) Thanks [@jnsdls](https://github.com/jnsdls)! - bump versions again

- Updated dependencies [[`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117)]:
  - @thirdweb-dev/sdk@2.4.6

## 1.0.4

### Patch Changes

- [`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c) Thanks [@jnsdls](https://github.com/jnsdls)! - release-all-packages

- Updated dependencies [[`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c)]:
  - @thirdweb-dev/sdk@2.4.5

## 1.0.3

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/sdk@2.4.4

## 1.0.2

### Patch Changes

- [#38](https://github.com/thirdweb-dev/js/pull/38) [`74640b2`](https://github.com/thirdweb-dev/js/commit/74640b23bf2c537f873186d3537e49b3289e8197) Thanks [@adam-maj](https://github.com/adam-maj)! - Add callbacks to express and next auth

- [#43](https://github.com/thirdweb-dev/js/pull/43) [`821383e`](https://github.com/thirdweb-dev/js/commit/821383e26f0e9f489e49be708a47823ac2de1473) Thanks [@jnsdls](https://github.com/jnsdls)! - export all entrypoints from main package

- [#39](https://github.com/thirdweb-dev/js/pull/39) [`00015fa`](https://github.com/thirdweb-dev/js/commit/00015fa958fbaea72526f42b95d919382694bbcd) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth build CI

- [#44](https://github.com/thirdweb-dev/js/pull/44) [`f6b24a5`](https://github.com/thirdweb-dev/js/commit/f6b24a5b06b034435785a2b788096e834bcefef9) Thanks [@jnsdls](https://github.com/jnsdls)! - attempt to fix auth build

- [#46](https://github.com/thirdweb-dev/js/pull/46) [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83) Thanks [@jnsdls](https://github.com/jnsdls)! - imrprove babel & tsconfig settings

- [#47](https://github.com/thirdweb-dev/js/pull/47) [`82156cc`](https://github.com/thirdweb-dev/js/commit/82156cc727166230d301eeaf8fdc422332b06a8e) Thanks [@jnsdls](https://github.com/jnsdls)! - re-enable cache for auth build output

- [#37](https://github.com/thirdweb-dev/js/pull/37) [`5d8654a`](https://github.com/thirdweb-dev/js/commit/5d8654a22231c6205829f1731f91fb47d3410e98) Thanks [@adam-maj](https://github.com/adam-maj)! - Update user endpoints for express and next

- [#30](https://github.com/thirdweb-dev/js/pull/30) [`c52a43c`](https://github.com/thirdweb-dev/js/commit/c52a43c8863052b6d1bc9b8c3e1e86d0e1759d39) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for next-auth

- Updated dependencies [[`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19), [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83), [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95)]:
  - @thirdweb-dev/sdk@2.4.2

## 1.0.1

### Patch Changes

- 02c2b52: force version
- Updated dependencies [02c2b52]
  - @thirdweb-dev/sdk@2.4.1

## 1.0.0

### Minor Changes

- 3abe26c: initialze monorepo packages

### Patch Changes

- Updated dependencies [3abe26c]
  - @thirdweb-dev/sdk@2.4.0

## 0.2.1

### Patch Changes

- 86e3b58: use storage helpers from @thirdweb-dev/storage
- Updated dependencies [d4abb09]
- Updated dependencies [274afb5]
- Updated dependencies [86e3b58]
- Updated dependencies [0c78b16]
  - @thirdweb-dev/sdk@2.3.43
