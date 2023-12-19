# @thirdweb-dev/react

## 4.1.17

### Patch Changes

- [#2084](https://github.com/thirdweb-dev/js/pull/2084) [`c410a1c1`](https://github.com/thirdweb-dev/js/commit/c410a1c18a704d118555215db9ba7d92c3b24d8c) Thanks [@MananTank](https://github.com/MananTank)! - JSDoc comments Improvements

- Updated dependencies [[`c410a1c1`](https://github.com/thirdweb-dev/js/commit/c410a1c18a704d118555215db9ba7d92c3b24d8c), [`fed1313a`](https://github.com/thirdweb-dev/js/commit/fed1313a199011a9b52d7c5e11ad6e72fc969002), [`f369bffe`](https://github.com/thirdweb-dev/js/commit/f369bffe5a30e2e8a9df2ac62f24f93f96324186), [`81c46e22`](https://github.com/thirdweb-dev/js/commit/81c46e22984cdb5b33b2e6eb99a0ebf0e4fbdb33), [`23db97cc`](https://github.com/thirdweb-dev/js/commit/23db97cca51211df82d430fbfff4bbfbd7d4dc38)]:
  - @thirdweb-dev/react-core@4.1.17
  - @thirdweb-dev/wallets@2.3.2
  - @thirdweb-dev/chains@0.1.62
  - @thirdweb-dev/sdk@4.0.23

## 4.1.16

### Patch Changes

- Updated dependencies [[`c701c388`](https://github.com/thirdweb-dev/js/commit/c701c388c65a1e531b88991d8fd67d25f153992e), [`699f31c2`](https://github.com/thirdweb-dev/js/commit/699f31c20a76cd284dbed1629c4a19d93aca7b7f)]:
  - @thirdweb-dev/sdk@4.0.22
  - @thirdweb-dev/react-core@4.1.16
  - @thirdweb-dev/wallets@2.3.1

## 4.1.15

### Patch Changes

- Updated dependencies [[`33c9f6b1`](https://github.com/thirdweb-dev/js/commit/33c9f6b1ab3e65187b2c49c083412d39a1334bba), [`de5ebc90`](https://github.com/thirdweb-dev/js/commit/de5ebc9093aaf5fc08bc0d2d414138b520fe17fe), [`e10173bf`](https://github.com/thirdweb-dev/js/commit/e10173bf8aeaaabdb45231109b4da0c52c91b9da), [`09bafa9a`](https://github.com/thirdweb-dev/js/commit/09bafa9aebadb01641214747148c67d0b39c1275)]:
  - @thirdweb-dev/wallets@2.3.0
  - @thirdweb-dev/react-core@4.1.15

## 4.1.14

### Patch Changes

- Updated dependencies [[`bcfa9463`](https://github.com/thirdweb-dev/js/commit/bcfa9463bbae6bf1d3b6389b7a141f65ef3e1173)]:
  - @thirdweb-dev/sdk@4.0.21
  - @thirdweb-dev/react-core@4.1.14
  - @thirdweb-dev/wallets@2.2.1

## 4.1.13

### Patch Changes

- [#2029](https://github.com/thirdweb-dev/js/pull/2029) [`b50e4a41`](https://github.com/thirdweb-dev/js/commit/b50e4a41b560eb647fec1224d6b6782be7132034) Thanks [@MananTank](https://github.com/MananTank)! - Connect to MetaMask on mobile device using WalletConnect instead of opening the web app in MetaMask browser by default

  This behavior can be changed by setting `connectionMethod` option to `metamaskWallet`

  ```tsx
  <ThirdwebProvider
    supportedWallets={[
      metamaskWallet({
        connectionMethod: "walletConnect", // default
      }),
    ]}
  >
    <App />
  </ThirdwebProvider>
  ```

  this is same as not setting `connectionMethod` option:

  ```tsx
  <ThirdwebProvider supportedWallets={[metamaskWallet()]}>
    <App />
  </ThirdwebProvider>
  ```

  If you want to revert to old behavior of opening the web app in Metamask browser, set `connectionMethod` to `metamaskBrowser`

  ```tsx
  <ThirdwebProvider
    supportedWallets={[
      metamaskWallet({
        connectionMethod: "metamaskBrowser",
      }),
    ]}
  >
    <App />
  </ThirdwebProvider>
  ```

- [#2063](https://github.com/thirdweb-dev/js/pull/2063) [`c8ba5cf8`](https://github.com/thirdweb-dev/js/commit/c8ba5cf863b7b2a92e0cb2c50776511782d4e2b6) Thanks [@MananTank](https://github.com/MananTank)! - - Add option to only show the Official WalletConnect Modal for `walletConnect` in ConnectWallet Modal

  ```ts
  walletConnect({
    qrModal: "walletConnect", // hide the ConnectWallet Modal and only show the WalletConnect Modal
  });
  ```

  If no, `qrModal` is set, it defaults to `"custom"` as shown below:

  ```ts
  walletConnect({
    qrModal: "custom", // render QR code in ConnectWallet Modal
  });
  ```

  - Stop Focus trapping the ConnectWallet Modal when it is rendered but hidden

- [#2058](https://github.com/thirdweb-dev/js/pull/2058) [`15ae5e7f`](https://github.com/thirdweb-dev/js/commit/15ae5e7f95a482a9736923c0e10916a0a6115c3d) Thanks [@MananTank](https://github.com/MananTank)! - Add option to open the official wallet connect modal in ConnectWallet

- Updated dependencies [[`d2001ca4`](https://github.com/thirdweb-dev/js/commit/d2001ca464aa699ac821c97eb37de7409ba865f3), [`85842c15`](https://github.com/thirdweb-dev/js/commit/85842c1596c901e228be1894b6702a8871d9e794), [`e595d4d9`](https://github.com/thirdweb-dev/js/commit/e595d4d92f03e36cbe61e1f00a366e37ede5d814), [`497677f3`](https://github.com/thirdweb-dev/js/commit/497677f3596977fa90ebc0fa76cb5842d46d8dcf), [`94966069`](https://github.com/thirdweb-dev/js/commit/9496606964d65268f8ee6bf9f78b2786e99d33ac), [`15ae5e7f`](https://github.com/thirdweb-dev/js/commit/15ae5e7f95a482a9736923c0e10916a0a6115c3d)]:
  - @thirdweb-dev/chains@0.1.61
  - @thirdweb-dev/sdk@4.0.20
  - @thirdweb-dev/wallets@2.2.0
  - @thirdweb-dev/react-core@4.1.13

## 4.1.12

### Patch Changes

- [#1842](https://github.com/thirdweb-dev/js/pull/1842) [`a36c7e83`](https://github.com/thirdweb-dev/js/commit/a36c7e8331744879a169f84e97b66abf0ab44f56) Thanks [@MananTank](https://github.com/MananTank)! - JSDoc improvements

- [#2045](https://github.com/thirdweb-dev/js/pull/2045) [`a135857c`](https://github.com/thirdweb-dev/js/commit/a135857c7ad73e1a508298858eb0f5fd744ec176) Thanks [@MananTank](https://github.com/MananTank)! - Fix type EmbeddedWalletConfigOptions

- [#1938](https://github.com/thirdweb-dev/js/pull/1938) [`4ae1cd63`](https://github.com/thirdweb-dev/js/commit/4ae1cd63bb7b471cae48a27bf6554c4953c1dc82) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add OneKey wallet

- [#2042](https://github.com/thirdweb-dev/js/pull/2042) [`61c62b3f`](https://github.com/thirdweb-dev/js/commit/61c62b3f07a082ffd7620c949e3bcc6b75c104b5) Thanks [@MananTank](https://github.com/MananTank)! - Improved JSDoc comments and Type exports

- Updated dependencies [[`cfe81b44`](https://github.com/thirdweb-dev/js/commit/cfe81b443205d84e58128b8d7d5f2dc940b12875), [`34546c24`](https://github.com/thirdweb-dev/js/commit/34546c24c74f4e9e1f5e94567ebe1017ad63aea5), [`72c0bb10`](https://github.com/thirdweb-dev/js/commit/72c0bb10d6d765d1679b2b22ac63d85db101b5c4), [`ca618ea0`](https://github.com/thirdweb-dev/js/commit/ca618ea0c9ac5dc4f65cbfbfd39360e4150c72c7), [`aefc4cda`](https://github.com/thirdweb-dev/js/commit/aefc4cda4c4fad81411d3a9485931e28100b5718), [`a36c7e83`](https://github.com/thirdweb-dev/js/commit/a36c7e8331744879a169f84e97b66abf0ab44f56), [`4ae1cd63`](https://github.com/thirdweb-dev/js/commit/4ae1cd63bb7b471cae48a27bf6554c4953c1dc82), [`61c62b3f`](https://github.com/thirdweb-dev/js/commit/61c62b3f07a082ffd7620c949e3bcc6b75c104b5), [`7bb054e4`](https://github.com/thirdweb-dev/js/commit/7bb054e45c75450c8f465809d23eb66371f6ef8e), [`cd87be4a`](https://github.com/thirdweb-dev/js/commit/cd87be4a24a9a3a552fbc4f33da6fcb08b7da88b), [`d20e7898`](https://github.com/thirdweb-dev/js/commit/d20e7898562a3914841522f2e09f88ca37dfdd4b)]:
  - @thirdweb-dev/sdk@4.0.19
  - @thirdweb-dev/react-core@4.1.12
  - @thirdweb-dev/wallets@2.1.11

## 4.1.11

### Patch Changes

- [#1926](https://github.com/thirdweb-dev/js/pull/1926) [`8c2d4e5e`](https://github.com/thirdweb-dev/js/commit/8c2d4e5ea7c38b3efa4d8d94c9822a92d271e59b) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Rabby browser extension

- [#2031](https://github.com/thirdweb-dev/js/pull/2031) [`fdf19b0a`](https://github.com/thirdweb-dev/js/commit/fdf19b0a26be0404ddf5424f26d96719de849627) Thanks [@MananTank](https://github.com/MananTank)! - Do not swallow errors in useEmbeddedWallet().connect

- [#1997](https://github.com/thirdweb-dev/js/pull/1997) [`50749662`](https://github.com/thirdweb-dev/js/commit/507496627bcd77b49bb027b24996a31c57e04819) Thanks [@MananTank](https://github.com/MananTank)! - - Fixes issue #1708

  - Fixes smart wallet icon shown even after clicking on "Switch to Personal wallet" in ConnectWallet dropdown

- [#1987](https://github.com/thirdweb-dev/js/pull/1987) [`b3394277`](https://github.com/thirdweb-dev/js/commit/b3394277c77e4af130151111e056e27a28ac893a) Thanks [@MananTank](https://github.com/MananTank)! - Improved JSDoc comments and type exports

- [#1928](https://github.com/thirdweb-dev/js/pull/1928) [`2b4f1c8e`](https://github.com/thirdweb-dev/js/commit/2b4f1c8e55de091100fb5279887bcb19ea31d38c) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Crypto.com Defi wallet

- Updated dependencies [[`e79b2935`](https://github.com/thirdweb-dev/js/commit/e79b293562bbcf4af6fbcb4829b2acb4cb3e2cb4), [`8c2d4e5e`](https://github.com/thirdweb-dev/js/commit/8c2d4e5ea7c38b3efa4d8d94c9822a92d271e59b), [`b0ecfd2d`](https://github.com/thirdweb-dev/js/commit/b0ecfd2d8d5cda33dc8f5ea2d20119cb901a0bcb), [`a27b10c5`](https://github.com/thirdweb-dev/js/commit/a27b10c5c3400500ef0138069acc550b3a07ffc6), [`d28097f5`](https://github.com/thirdweb-dev/js/commit/d28097f508739cdbd6625e09c2ed0fe25a922c0f), [`94559129`](https://github.com/thirdweb-dev/js/commit/9455912932c71f3ef9b67461bf5604f1ea1f71e8), [`b8332500`](https://github.com/thirdweb-dev/js/commit/b833250053320c8608109053f5cffe2dc96ce70a), [`8bf3be88`](https://github.com/thirdweb-dev/js/commit/8bf3be88be051178a7142618c4371d2f2ef26271), [`b02fb91a`](https://github.com/thirdweb-dev/js/commit/b02fb91a548a3f66f7677ced24be9397e0f9a7ba), [`2861dff1`](https://github.com/thirdweb-dev/js/commit/2861dff1f013b5150314fdaccaeadddbcf0d21c9), [`61b6a002`](https://github.com/thirdweb-dev/js/commit/61b6a00214716454222e67fe5fdb47edba391070), [`28fc3736`](https://github.com/thirdweb-dev/js/commit/28fc3736aa30c89690084aa2c62556c183796352), [`50749662`](https://github.com/thirdweb-dev/js/commit/507496627bcd77b49bb027b24996a31c57e04819), [`b3394277`](https://github.com/thirdweb-dev/js/commit/b3394277c77e4af130151111e056e27a28ac893a), [`06805217`](https://github.com/thirdweb-dev/js/commit/06805217c26de203a57c21246acba22def8a78fa), [`2b4f1c8e`](https://github.com/thirdweb-dev/js/commit/2b4f1c8e55de091100fb5279887bcb19ea31d38c), [`4c488aa3`](https://github.com/thirdweb-dev/js/commit/4c488aa31f6fadc13759ff60f30230b929feb314)]:
  - @thirdweb-dev/react-core@4.1.11
  - @thirdweb-dev/wallets@2.1.10
  - @thirdweb-dev/sdk@4.0.18
  - @thirdweb-dev/chains@0.1.60

## 4.1.10

### Patch Changes

- [#1996](https://github.com/thirdweb-dev/js/pull/1996) [`4bb8f5b1`](https://github.com/thirdweb-dev/js/commit/4bb8f5b15e58de39c5edccc7476da3e4907d7688) Thanks [@MananTank](https://github.com/MananTank)! - Revert commit fb0cb676b996fe386dcc53b5a6dab03f88e76175

- [#1994](https://github.com/thirdweb-dev/js/pull/1994) [`68288436`](https://github.com/thirdweb-dev/js/commit/68288436acd62256be561395743762965888449d) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Remove `overrides` props from Web3ButtonProps

- Updated dependencies [[`4bb8f5b1`](https://github.com/thirdweb-dev/js/commit/4bb8f5b15e58de39c5edccc7476da3e4907d7688), [`47b0ed51`](https://github.com/thirdweb-dev/js/commit/47b0ed5171be5608ae23c19481a1b04948443c6a), [`d4ce855e`](https://github.com/thirdweb-dev/js/commit/d4ce855e5f5e6c4206a3efa250e92e690ae87281), [`b5bbe2bd`](https://github.com/thirdweb-dev/js/commit/b5bbe2bd438179c38451bc2cfa20a54fc79e4f3a)]:
  - @thirdweb-dev/react-core@4.1.10
  - @thirdweb-dev/chains@0.1.59
  - @thirdweb-dev/wallets@2.1.9
  - @thirdweb-dev/sdk@4.0.17

## 4.1.9

### Patch Changes

- [#1952](https://github.com/thirdweb-dev/js/pull/1952) [`fb0cb676`](https://github.com/thirdweb-dev/js/commit/fb0cb676b996fe386dcc53b5a6dab03f88e76175) Thanks [@MananTank](https://github.com/MananTank)! - - Add `ConnectEmbed`` component to embed the ConnectWallet's Modal UI directly in page

  - Fix `ConnectWallet` component setting personal wallet as "connected" wallet when connecting a Safe / Smart Wallet

- [#1921](https://github.com/thirdweb-dev/js/pull/1921) [`1094a03a`](https://github.com/thirdweb-dev/js/commit/1094a03a04f3e7ade84af0f7a6073794c0904cb1) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Coin98 wallet

- Updated dependencies [[`fb0cb676`](https://github.com/thirdweb-dev/js/commit/fb0cb676b996fe386dcc53b5a6dab03f88e76175), [`1094a03a`](https://github.com/thirdweb-dev/js/commit/1094a03a04f3e7ade84af0f7a6073794c0904cb1), [`7c45941b`](https://github.com/thirdweb-dev/js/commit/7c45941b57fb5a6f83be507ee64dbf885d93c9d4), [`12d85dec`](https://github.com/thirdweb-dev/js/commit/12d85dec10f47d6520b737a23576e4f832abb47f)]:
  - @thirdweb-dev/react-core@4.1.9
  - @thirdweb-dev/wallets@2.1.8
  - @thirdweb-dev/sdk@4.0.16

## 4.1.8

### Patch Changes

- Updated dependencies [[`6832b19f`](https://github.com/thirdweb-dev/js/commit/6832b19fc5eedc7c17e69940a361840de0a84881), [`7abb36a7`](https://github.com/thirdweb-dev/js/commit/7abb36a7ec39766dd7da03015ccef401ef7a7863), [`1c4cbedb`](https://github.com/thirdweb-dev/js/commit/1c4cbedb6a3c9f9014ffbf83c02b998768958d96), [`e43beec3`](https://github.com/thirdweb-dev/js/commit/e43beec36a569211b6fe708107aa7dc04bff08ec)]:
  - @thirdweb-dev/wallets@2.1.7
  - @thirdweb-dev/sdk@4.0.15
  - @thirdweb-dev/react-core@4.1.8

## 4.1.7

### Patch Changes

- [#1969](https://github.com/thirdweb-dev/js/pull/1969) [`4c5e40ae`](https://github.com/thirdweb-dev/js/commit/4c5e40ae4eccdca9158a52ec0d677dec4c72ed00) Thanks [@MananTank](https://github.com/MananTank)! - Fix text alignment issue in embedded-wallet/paper

- [#1965](https://github.com/thirdweb-dev/js/pull/1965) [`13029e32`](https://github.com/thirdweb-dev/js/commit/13029e328609eecfd3f0a180d6003c03c67caac1) Thanks [@MananTank](https://github.com/MananTank)! - - Fix Minor Safari / iOS UI issues

  - Adjust Magic Link's social icons UI to match EmbeddedWallet's social icons UI
  - expose hook `useEmbeddedWalletUserEmail` for fetching email from connected embeddedWallet. The hook returns the `react-query` query object. See example below:

  ```tsx
  const emailQuery = useEmbeddedWalletUserEmail();

  const email = emailQuery.data;
  const isFetchingEmail = emailQuery.isFetching;
  ```

- Updated dependencies [[`ab2dfd4f`](https://github.com/thirdweb-dev/js/commit/ab2dfd4f5cf4256fa62d76f84ca804992afab1e4), [`ab2dfd4f`](https://github.com/thirdweb-dev/js/commit/ab2dfd4f5cf4256fa62d76f84ca804992afab1e4)]:
  - @thirdweb-dev/sdk@4.0.14
  - @thirdweb-dev/wallets@2.1.6
  - @thirdweb-dev/react-core@4.1.7

## 4.1.6

### Patch Changes

- [#1954](https://github.com/thirdweb-dev/js/pull/1954) [`7912c263`](https://github.com/thirdweb-dev/js/commit/7912c263237708e9d2e9471873db7679e783b6f8) Thanks [@MananTank](https://github.com/MananTank)! - use Custom Theme context in styled components to prevent theme conflicts

- [#1945](https://github.com/thirdweb-dev/js/pull/1945) [`69d68f5a`](https://github.com/thirdweb-dev/js/commit/69d68f5a25877bf5ea694719d2cf4ca8388f3091) Thanks [@iketw](https://github.com/iketw)! - Enable Facebook Sign In for embedded wallet

- Updated dependencies [[`69d68f5a`](https://github.com/thirdweb-dev/js/commit/69d68f5a25877bf5ea694719d2cf4ca8388f3091)]:
  - @thirdweb-dev/wallets@2.1.5
  - @thirdweb-dev/react-core@4.1.6

## 4.1.5

### Patch Changes

- Updated dependencies [[`9f993dcc`](https://github.com/thirdweb-dev/js/commit/9f993dcc1e60cc087850b8fb9ce09524073ce0b5)]:
  - @thirdweb-dev/wallets@2.1.4
  - @thirdweb-dev/react-core@4.1.5

## 4.1.4

### Patch Changes

- [#1944](https://github.com/thirdweb-dev/js/pull/1944) [`6fcdec7c`](https://github.com/thirdweb-dev/js/commit/6fcdec7c12e4a3c0d10f3a67771e19cfad5c8ab5) Thanks [@iketw](https://github.com/iketw)! - Adds tsdoc warnings to enforce a common comments format

- [#1948](https://github.com/thirdweb-dev/js/pull/1948) [`42c74368`](https://github.com/thirdweb-dev/js/commit/42c743682739de77c264c11cc1692ed752f929a6) Thanks [@iketw](https://github.com/iketw)! - Deprecates PaperWallet in favor of EmbeddedWallet

- Updated dependencies [[`23ab897e`](https://github.com/thirdweb-dev/js/commit/23ab897e329cdd5b316fbe554ea0f64add91f2b4), [`a3f3e160`](https://github.com/thirdweb-dev/js/commit/a3f3e160e07328655a4f0332f41f4edd210a1a8a), [`e79a9520`](https://github.com/thirdweb-dev/js/commit/e79a95206116ea09de0126fdbe30fb4413fdff28), [`6fcdec7c`](https://github.com/thirdweb-dev/js/commit/6fcdec7c12e4a3c0d10f3a67771e19cfad5c8ab5), [`42c74368`](https://github.com/thirdweb-dev/js/commit/42c743682739de77c264c11cc1692ed752f929a6), [`6fcdec7c`](https://github.com/thirdweb-dev/js/commit/6fcdec7c12e4a3c0d10f3a67771e19cfad5c8ab5), [`480ed721`](https://github.com/thirdweb-dev/js/commit/480ed721d1c736049fa8b6ee4cbdbdf3cce18abd), [`16e9e8b6`](https://github.com/thirdweb-dev/js/commit/16e9e8b64d7d1a97a5b32fc855479e992b7ed3a8), [`b1190914`](https://github.com/thirdweb-dev/js/commit/b1190914a97a9c4d9019c4ce8ee49ad345aed18c)]:
  - @thirdweb-dev/sdk@4.0.13
  - @thirdweb-dev/react-core@4.1.4
  - @thirdweb-dev/wallets@2.1.3

## 4.1.3

### Patch Changes

- [#1943](https://github.com/thirdweb-dev/js/pull/1943) [`30ea9c6b`](https://github.com/thirdweb-dev/js/commit/30ea9c6bf74b483a98592a1d8d64589b7f1b22a3) Thanks [@iketw](https://github.com/iketw)! - Adds tsdoc warnings to enforce a common comments format

- [#1929](https://github.com/thirdweb-dev/js/pull/1929) [`06e59cf9`](https://github.com/thirdweb-dev/js/commit/06e59cf91647e4080829d49f8cb91a4d8fdc87f7) Thanks [@iketw](https://github.com/iketw)! - Move addresses' utils to the core package

- [#1920](https://github.com/thirdweb-dev/js/pull/1920) [`a81a5285`](https://github.com/thirdweb-dev/js/commit/a81a5285b7ef4ddf47fd2779ab80ebbef4bd9e0e) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - feat: add apple auth to embedded wallet

  ```
  <ThirdwebProvider
    supportedWallets={[
      embeddedWallet({
        auth: {
          options: ["google", "email", "apple"], // <- new apple option!
        }
      })
    ]}
  >
  ```

- Updated dependencies [[`3f3a484a`](https://github.com/thirdweb-dev/js/commit/3f3a484a3aa6e9f784e4d44458461bac0d3d4c6b), [`a81a5285`](https://github.com/thirdweb-dev/js/commit/a81a5285b7ef4ddf47fd2779ab80ebbef4bd9e0e), [`30ea9c6b`](https://github.com/thirdweb-dev/js/commit/30ea9c6bf74b483a98592a1d8d64589b7f1b22a3), [`06e59cf9`](https://github.com/thirdweb-dev/js/commit/06e59cf91647e4080829d49f8cb91a4d8fdc87f7), [`97fdbc8f`](https://github.com/thirdweb-dev/js/commit/97fdbc8f6443dcd08a7610e4437bd4c9d6b0e8c8), [`3f3a484a`](https://github.com/thirdweb-dev/js/commit/3f3a484a3aa6e9f784e4d44458461bac0d3d4c6b)]:
  - @thirdweb-dev/wallets@2.1.2
  - @thirdweb-dev/react-core@4.1.3
  - @thirdweb-dev/sdk@4.0.12

## 4.1.2

### Patch Changes

- [#1906](https://github.com/thirdweb-dev/js/pull/1906) [`b90d3af5`](https://github.com/thirdweb-dev/js/commit/b90d3af5b8cfb762b38a88d7997879be9b5744bf) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add `hideSwitchToPersonalWallet` prop on `ConnectWallet` component to hide the "switch to Personal wallet" option in the ConnectWallet dropdown which is shown when wallet is connected to either Smart Wallet or Safe

  ```tsx
  <ConnectWallet hideSwitchToPersonalWallet={true} > // default: false
  ```

- [#1891](https://github.com/thirdweb-dev/js/pull/1891) [`20d0f53b`](https://github.com/thirdweb-dev/js/commit/20d0f53b46a2975a0a14ddaa4a377f2f758804db) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add Core wallet (Avalanche)

- [#1847](https://github.com/thirdweb-dev/js/pull/1847) [`c34ac468`](https://github.com/thirdweb-dev/js/commit/c34ac468fbf983a6806cd88828c77eb6d7231e78) Thanks [@MananTank](https://github.com/MananTank)! - Add Localization API to change language used in components `ConnectWallet` and `Web3Button` and/or override the default texts

  ### Japanese

  ```tsx
  import { ja } from "@thirdweb-dev/react";

  const japanese = ja();

  <ThirdwebProvider locale={japanese}>
    <App />
  </ThirdwebProvider>;
  ```

  ### Spanish

  ```tsx
  import { es } from "@thirdweb-dev/react";

  const spanish = es();

  <ThirdwebProvider locale={spanish}>
    <App />
  </ThirdwebProvider>;
  ```

  ### English ( default )

  ```tsx
  import { en } from "@thirdweb-dev/react";

  const english = en();

  <ThirdwebProvider locale={english}>
    <App />
  </ThirdwebProvider>;
  ```

  This API also allows overriding the default texts in the locale object. You can override all the texts or just some parts

  ```tsx
  import { en } from "@thirdweb-dev/react";

  // override some texts
  const english = en({
    connectWallet: {
      confirmInWallet: "Confirm in your wallet",
    },
    wallets: {
      metamaskWallet: {
        connectionScreen: {
          inProgress: "Awaiting Confirmation",
          instruction: "Accept connection request in your MetaMask wallet",
        },
      },
    },
  });

  <ThirdwebProvider locale={english}>
    <App />
  </ThirdwebProvider>;
  ```

- Updated dependencies [[`0dcb15b7`](https://github.com/thirdweb-dev/js/commit/0dcb15b7e647acd038b0ec8b1a2b200808aae00e), [`fefeaeef`](https://github.com/thirdweb-dev/js/commit/fefeaeef18f52a75462c43da8b85a77975d32e01), [`20d0f53b`](https://github.com/thirdweb-dev/js/commit/20d0f53b46a2975a0a14ddaa4a377f2f758804db), [`91c2352b`](https://github.com/thirdweb-dev/js/commit/91c2352b03d7cf1c3cbbbc98846f248b0f707ea7)]:
  - @thirdweb-dev/chains@0.1.58
  - @thirdweb-dev/sdk@4.0.11
  - @thirdweb-dev/wallets@2.1.1
  - @thirdweb-dev/react-core@4.1.2

## 4.1.1

### Patch Changes

- [#1888](https://github.com/thirdweb-dev/js/pull/1888) [`789700cf`](https://github.com/thirdweb-dev/js/commit/789700cf60ac40d4cc2742c8aa735a225089c522) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix sign in connect button display logic

- Updated dependencies []:
  - @thirdweb-dev/react-core@4.1.1

## 4.1.0

### Minor Changes

- [#1846](https://github.com/thirdweb-dev/js/pull/1846) [`0acc530f`](https://github.com/thirdweb-dev/js/commit/0acc530f8bbee59672d9705724edc278bd853d9a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New API to configure authentication options on `embeddedWallet`

  ```ts
  // default - google sign in is enabled
  embeddedWallet();

  // this is same as
  embeddedWallet({
    auth: {
      options: ["email", "google"],
    },
  });

  // only email
  embeddedWallet({
    auth: {
      options: ["email"],
    },
  });

  // only google sign in
  embeddedWallet({
    auth: {
      options: ["google"],
    },
  });
  ```

### Patch Changes

- [#1885](https://github.com/thirdweb-dev/js/pull/1885) [`961ef644`](https://github.com/thirdweb-dev/js/commit/961ef644d1b1adaad08c071903cd53aacac50bb4) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Improved `useSmartWallet()` hook

  Example with metamask:

  ```ts
  const { connect } = useSmartWallet(metamaskWallet(), {
    factoryAddress: factoryAddress,
    gasless: true,
  });

  const onClick = async () => {
    // nothing to do here, all handled internally
    await connect();
  };
  ```

  ```ts
  Example with localWallet:

  const { connect } = useSmartWallet(localWallet(), {
      factoryAddress: factoryAddress,
      gasless: true,
  });

  const onClick = async () => {
      // function to 'load' the local wallet before using it
      await connect({
          connectPersonalWallet: async (w) => {
              await w.generate();
              await w.connect();
          }
      });
  }
  ```

  ```ts
  Example with embeddedWallet:

  const { connect } = useSmartWallet(embeddedWallet(), {
      factoryAddress: factoryAddress,
      gasless: true,
  });

  const onClick = async () => {
      // function to 'auth' the embedded wallet before using it
      await connect({
          connectPersonalWallet: async (w) => {
              const authResult = await w.authenticate({ strategy: "google" });
              await w.connect({ authResult });
          }
      });
  }
  ```

- [#1886](https://github.com/thirdweb-dev/js/pull/1886) [`6fcd09dd`](https://github.com/thirdweb-dev/js/commit/6fcd09ddbdad2c5e02fad9c3d2c61348ebd987de) Thanks [@edwardysun](https://github.com/edwardysun)! - Fix for user address and active wallet address out of sync

- Updated dependencies [[`a9d32f3c`](https://github.com/thirdweb-dev/js/commit/a9d32f3c90251a459e17a19eca803bbfdeeaeb79), [`0acc530f`](https://github.com/thirdweb-dev/js/commit/0acc530f8bbee59672d9705724edc278bd853d9a)]:
  - @thirdweb-dev/sdk@4.0.10
  - @thirdweb-dev/wallets@2.1.0
  - @thirdweb-dev/react-core@4.1.0

## 4.0.10

### Patch Changes

- Updated dependencies [[`a75e4cc8`](https://github.com/thirdweb-dev/js/commit/a75e4cc80a5a36bf6baeeb40e8ae3be485d35618), [`3faa9f21`](https://github.com/thirdweb-dev/js/commit/3faa9f21efb1ae29a57747d6f0b8fb1151930ab4)]:
  - @thirdweb-dev/chains@0.1.57
  - @thirdweb-dev/wallets@2.0.10
  - @thirdweb-dev/react-core@4.0.10
  - @thirdweb-dev/sdk@4.0.9

## 4.0.9

### Patch Changes

- [#1855](https://github.com/thirdweb-dev/js/pull/1855) [`b6f72c56`](https://github.com/thirdweb-dev/js/commit/b6f72c566c9cec5c2d0a0ebe709d6177b2af68e4) Thanks [@jnsdls](https://github.com/jnsdls)! - require minimum node version: `>=18`

- Updated dependencies [[`d1743a32`](https://github.com/thirdweb-dev/js/commit/d1743a3279ddda4f408794a6bbe7bbd235a9fd36), [`4fa09df6`](https://github.com/thirdweb-dev/js/commit/4fa09df6d0ece89e5e6f1c8f9b530a4bd6c266d7), [`6028a881`](https://github.com/thirdweb-dev/js/commit/6028a88111d9071155370c7aeaf22d4ee0c3ec93), [`0358722c`](https://github.com/thirdweb-dev/js/commit/0358722c1aede51fb349fa132a37a80b46927c93), [`db0bbf51`](https://github.com/thirdweb-dev/js/commit/db0bbf517306c6110d49f031202eeb7d5bfff61a), [`4cb6e287`](https://github.com/thirdweb-dev/js/commit/4cb6e287c857e3597ae9f3c92c9c3961ca7a9f4e), [`80def43d`](https://github.com/thirdweb-dev/js/commit/80def43d44b7d47b5b3a49c54116d12c0974a264), [`5917e626`](https://github.com/thirdweb-dev/js/commit/5917e626b0744af369b67a2e44d9361422a8045d), [`44f258d6`](https://github.com/thirdweb-dev/js/commit/44f258d6bf801b553ca67a5dcebe213a4772e8a1), [`7ff0b4d5`](https://github.com/thirdweb-dev/js/commit/7ff0b4d54715afc86fc72e297a4d8bbe6897e49c), [`b6f72c56`](https://github.com/thirdweb-dev/js/commit/b6f72c566c9cec5c2d0a0ebe709d6177b2af68e4), [`042459fe`](https://github.com/thirdweb-dev/js/commit/042459fe3424add527209ac273913b494b5e426c), [`cc651135`](https://github.com/thirdweb-dev/js/commit/cc6511351fea568246ddf49f687a5616d484d2a4), [`1934ef5f`](https://github.com/thirdweb-dev/js/commit/1934ef5fac339dab2b1fda39f00f5268daa2168a)]:
  - @thirdweb-dev/sdk@4.0.8
  - @thirdweb-dev/wallets@2.0.9
  - @thirdweb-dev/chains@0.1.56
  - @thirdweb-dev/react-core@4.0.9

## 4.0.8

### Patch Changes

- [#1797](https://github.com/thirdweb-dev/js/pull/1797) [`246b0d4a`](https://github.com/thirdweb-dev/js/commit/246b0d4aace8c785d89bc8f0bd156c96fc53ed10) Thanks [@MananTank](https://github.com/MananTank)! - Fix wrong Icon size of few icons in Firefox in ConnectWallet Modal

- [#1787](https://github.com/thirdweb-dev/js/pull/1787) [`ff996646`](https://github.com/thirdweb-dev/js/commit/ff996646b228d4d095eea04b05004dd26fc7e522) Thanks [@MananTank](https://github.com/MananTank)! - Enable typedoc for packages

- [#1815](https://github.com/thirdweb-dev/js/pull/1815) [`5ffbcfc3`](https://github.com/thirdweb-dev/js/commit/5ffbcfc302f74167768b196d93a328f979344036) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - Add onAuthSuccess for paperWallet

- [#1826](https://github.com/thirdweb-dev/js/pull/1826) [`2307f11a`](https://github.com/thirdweb-dev/js/commit/2307f11ab311aa4a775edd23e777d10f8015ce86) Thanks [@MananTank](https://github.com/MananTank)! - Add OKX wallet

- Updated dependencies [[`5ffbcfc3`](https://github.com/thirdweb-dev/js/commit/5ffbcfc302f74167768b196d93a328f979344036), [`42ba15f2`](https://github.com/thirdweb-dev/js/commit/42ba15f2c0e77e23e62650119dfaaa5c0dbe4481), [`d27a3dee`](https://github.com/thirdweb-dev/js/commit/d27a3dee8398d5707d2d1343c428abf8e03f67e3), [`ff996646`](https://github.com/thirdweb-dev/js/commit/ff996646b228d4d095eea04b05004dd26fc7e522), [`d8d48a95`](https://github.com/thirdweb-dev/js/commit/d8d48a9516fc8fdd173fbb91a858fe7ec0725ddd), [`aa9f48d1`](https://github.com/thirdweb-dev/js/commit/aa9f48d1361194fc81146da530c95a3409bd0799), [`fd7a9f09`](https://github.com/thirdweb-dev/js/commit/fd7a9f09989e39b02a93d9dfd01cc7378e6ead53), [`fd7a9f09`](https://github.com/thirdweb-dev/js/commit/fd7a9f09989e39b02a93d9dfd01cc7378e6ead53), [`2307f11a`](https://github.com/thirdweb-dev/js/commit/2307f11ab311aa4a775edd23e777d10f8015ce86), [`64138642`](https://github.com/thirdweb-dev/js/commit/64138642e84d8b56b254762eca613d443cca292b), [`6d1eabe9`](https://github.com/thirdweb-dev/js/commit/6d1eabe9f9818ee2a79ce5bf6aa74417dbfd0558)]:
  - @thirdweb-dev/wallets@2.0.8
  - @thirdweb-dev/sdk@4.0.7
  - @thirdweb-dev/react-core@4.0.8

## 4.0.7

### Patch Changes

- Updated dependencies [[`137f46a5`](https://github.com/thirdweb-dev/js/commit/137f46a5470d2b5f9d7f9eda9b2d839a53ddeb64)]:
  - @thirdweb-dev/chains@0.1.55
  - @thirdweb-dev/react-core@4.0.7
  - @thirdweb-dev/sdk@4.0.6
  - @thirdweb-dev/wallets@2.0.7

## 4.0.6

### Patch Changes

- Updated dependencies [[`07544252`](https://github.com/thirdweb-dev/js/commit/07544252b49163e1ae84ba2cc76b99597a1c4553)]:
  - @thirdweb-dev/sdk@4.0.5
  - @thirdweb-dev/react-core@4.0.6
  - @thirdweb-dev/wallets@2.0.6

## 4.0.5

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/sdk@4.0.4
  - @thirdweb-dev/wallets@2.0.5
  - @thirdweb-dev/react-core@4.0.5

## 4.0.4

### Patch Changes

- [#1769](https://github.com/thirdweb-dev/js/pull/1769) [`010955ff`](https://github.com/thirdweb-dev/js/commit/010955ff5cc35a975b54c25992b8e65b40e033a1) Thanks [@MananTank](https://github.com/MananTank)! - Fix OTP input not working well with Japanese keyboard

- Updated dependencies [[`956b5645`](https://github.com/thirdweb-dev/js/commit/956b5645e4266cba536abd27ee250dab5aa9a177)]:
  - @thirdweb-dev/sdk@4.0.3
  - @thirdweb-dev/wallets@2.0.4
  - @thirdweb-dev/react-core@4.0.4

## 4.0.3

### Patch Changes

- [#1766](https://github.com/thirdweb-dev/js/pull/1766) [`dd7d0fca`](https://github.com/thirdweb-dev/js/commit/dd7d0fca2d14a529343396a31939d49b1a074d3e) Thanks [@MananTank](https://github.com/MananTank)! - Fix Continue as Guest button missing when Social + Guest login is setup in ConnectWallet Modal

- [#1692](https://github.com/thirdweb-dev/js/pull/1692) [`fb0f12ae`](https://github.com/thirdweb-dev/js/commit/fb0f12ae2835f4eba60ba4a74b453151cab0d393) Thanks [@etnlbck](https://github.com/etnlbck)! - Refactored OTPInput component to be simpler to read

- Updated dependencies [[`526176c4`](https://github.com/thirdweb-dev/js/commit/526176c47108c91d83bcfc5f0ca556274e6462d6), [`d1f8e951`](https://github.com/thirdweb-dev/js/commit/d1f8e951623f1691fdfe3d1e8645970d0a52eb06), [`09120c92`](https://github.com/thirdweb-dev/js/commit/09120c923cca804b9d4f5f779e5a53c97ecc8223), [`08e9cd20`](https://github.com/thirdweb-dev/js/commit/08e9cd206bcc37cf1e84a878dc78bc4f38e5092c), [`6573556d`](https://github.com/thirdweb-dev/js/commit/6573556d0e03efa0d6a157fccb0a1c08dd22d7cd)]:
  - @thirdweb-dev/sdk@4.0.2
  - @thirdweb-dev/react-core@4.0.3
  - @thirdweb-dev/wallets@2.0.3

## 4.0.2

### Patch Changes

- [#1750](https://github.com/thirdweb-dev/js/pull/1750) [`bb1666b9`](https://github.com/thirdweb-dev/js/commit/bb1666b92b5e151d78ea7dae6831297fb947d954) Thanks [@MananTank](https://github.com/MananTank)! - ConnectWallet UI tweaks/fixes

- Updated dependencies [[`1f3c64d3`](https://github.com/thirdweb-dev/js/commit/1f3c64d3618903b9008cc7b633ea890b508e7800), [`74941603`](https://github.com/thirdweb-dev/js/commit/74941603a96456da46a47147f67c98235ac55022), [`4b98e487`](https://github.com/thirdweb-dev/js/commit/4b98e487d4b47225d7095e5444dc5e7608db48a3), [`693f349d`](https://github.com/thirdweb-dev/js/commit/693f349db2478e1cd0fc82a9ef9882f46832b125), [`dcdb0dcb`](https://github.com/thirdweb-dev/js/commit/dcdb0dcb838168a22c8335738852316dfb6e6fc9), [`0f12d1f9`](https://github.com/thirdweb-dev/js/commit/0f12d1f90320923309f085c372d3a5ed01dd4606), [`b3b9edca`](https://github.com/thirdweb-dev/js/commit/b3b9edca29e7d4053b14270a61caa89c34fecf9e), [`63ad0050`](https://github.com/thirdweb-dev/js/commit/63ad0050f0a24ec15b90933b5664d697618cf2d0)]:
  - @thirdweb-dev/sdk@4.0.1
  - @thirdweb-dev/wallets@2.0.2
  - @thirdweb-dev/react-core@4.0.2

## 4.0.1

### Patch Changes

- [#1742](https://github.com/thirdweb-dev/js/pull/1742) [`e684d05e`](https://github.com/thirdweb-dev/js/commit/e684d05e222458f02c8158eb9385d68c879dd946) Thanks [@MananTank](https://github.com/MananTank)! - Apply ConnectWallet theme to Google Sign in popup opened from paperWallet, embeddedWallet

- Updated dependencies [[`e684d05e`](https://github.com/thirdweb-dev/js/commit/e684d05e222458f02c8158eb9385d68c879dd946)]:
  - @thirdweb-dev/wallets@2.0.1
  - @thirdweb-dev/react-core@4.0.1

## 4.0.0

### Major Changes

- [#1630](https://github.com/thirdweb-dev/js/pull/1630) [`ce4608bf`](https://github.com/thirdweb-dev/js/commit/ce4608bff4783caf164ad6e21b42a827b89badf8) Thanks [@jnsdls](https://github.com/jnsdls)! - **Dropped Support for Solana**:

  - We've decided to drop support for Solana across our SDKs.
  - Starting with this version of our SDKs all previous solana related functionality will be removed.
  - Previous versions of our SDKs will continue to work with Solana. However, we will not be providing any further updates or bug fixes for Solana.
  - You can read a detailed explanation of our decision [on our blog](https://blog.thirdweb.com/discontinuing-solana-support/).

### Patch Changes

- [#1645](https://github.com/thirdweb-dev/js/pull/1645) [`79f91ee2`](https://github.com/thirdweb-dev/js/commit/79f91ee2d96e3a9591d6104c542496bce11f3c71) Thanks [@MananTank](https://github.com/MananTank)! - - Fix the Modal closing and opening again when connecting to wallets like Smart Wallet and Safe ( EOA wrappers )
  - Prompt for signing directly in the Modal instead of closing the Modal and rendering a "Sign in" Button
  - Lot of UI improvements
- Updated dependencies [[`ce4608bf`](https://github.com/thirdweb-dev/js/commit/ce4608bff4783caf164ad6e21b42a827b89badf8), [`79f91ee2`](https://github.com/thirdweb-dev/js/commit/79f91ee2d96e3a9591d6104c542496bce11f3c71), [`ce4608bf`](https://github.com/thirdweb-dev/js/commit/ce4608bff4783caf164ad6e21b42a827b89badf8)]:
  - @thirdweb-dev/react-core@4.0.0
  - @thirdweb-dev/wallets@2.0.0
  - @thirdweb-dev/sdk@4.0.0

## 3.16.5

### Patch Changes

- Updated dependencies [[`ec36b13a`](https://github.com/thirdweb-dev/js/commit/ec36b13a30e0071548df0b7a6eb5299e2e65e4f9), [`6abb8459`](https://github.com/thirdweb-dev/js/commit/6abb8459712e387b6d8b2edf7eb16fb906c05dae), [`a6c36724`](https://github.com/thirdweb-dev/js/commit/a6c36724eb930ee0abbce876bb7847c859c6fb48)]:
  - @thirdweb-dev/sdk@3.10.67
  - @thirdweb-dev/react-core@3.16.5
  - @thirdweb-dev/wallets@1.3.5

## 3.16.4

### Patch Changes

- [#1713](https://github.com/thirdweb-dev/js/pull/1713) [`46672a49`](https://github.com/thirdweb-dev/js/commit/46672a490a82924e3c4a003419e3eaad10d6dd8b) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Update upsell link

- [#1717](https://github.com/thirdweb-dev/js/pull/1717) [`ffb1bb0a`](https://github.com/thirdweb-dev/js/commit/ffb1bb0a603a69c22eb8b6429326c23a2977e5a6) Thanks [@MananTank](https://github.com/MananTank)! - Add spinner in the Google Sign in popup instead of blank page

- Updated dependencies [[`9bd01de5`](https://github.com/thirdweb-dev/js/commit/9bd01de5f9c388e758fba9af7899dc4a9c5a0101), [`93127047`](https://github.com/thirdweb-dev/js/commit/931270479ef227556a1077357a8c000b08de6e8d), [`d3c8626a`](https://github.com/thirdweb-dev/js/commit/d3c8626a5a8def882c1592b236048ebe88e85d49), [`f35fbec1`](https://github.com/thirdweb-dev/js/commit/f35fbec1be14332d06e73b5f44f66975ef311d6c), [`9bd01de5`](https://github.com/thirdweb-dev/js/commit/9bd01de5f9c388e758fba9af7899dc4a9c5a0101)]:
  - @thirdweb-dev/wallets@1.3.4
  - @thirdweb-dev/react-core@3.16.4
  - @thirdweb-dev/sdk@3.10.66

## 3.16.3

### Patch Changes

- [#1707](https://github.com/thirdweb-dev/js/pull/1707) [`6d3d76cf`](https://github.com/thirdweb-dev/js/commit/6d3d76cff8018015faa191a1f8bd4f34506a6650) Thanks [@MananTank](https://github.com/MananTank)! - Fix Unchecked Index accesses

- Updated dependencies [[`6d3d76cf`](https://github.com/thirdweb-dev/js/commit/6d3d76cff8018015faa191a1f8bd4f34506a6650), [`04f2f7b8`](https://github.com/thirdweb-dev/js/commit/04f2f7b8ff5f19345d868fc515a24ccd6ffd0ab9), [`15fe4779`](https://github.com/thirdweb-dev/js/commit/15fe4779f4b99e51afe214ac3ebb31f611089787)]:
  - @thirdweb-dev/wallets@1.3.3
  - @thirdweb-dev/sdk@3.10.65
  - @thirdweb-dev/react-core@3.16.3

## 3.16.2

### Patch Changes

- Updated dependencies [[`f64b7236`](https://github.com/thirdweb-dev/js/commit/f64b7236bbcc5b15fea582db22f120d71d9e126f)]:
  - @thirdweb-dev/chains@0.1.54
  - @thirdweb-dev/react-core@3.16.2
  - @thirdweb-dev/sdk@3.10.64
  - @thirdweb-dev/wallets@1.3.2

## 3.16.1

### Patch Changes

- [#1637](https://github.com/thirdweb-dev/js/pull/1637) [`54f83a50`](https://github.com/thirdweb-dev/js/commit/54f83a5013ed65ddd5a787e13ba7e5d86625537d) Thanks [@MananTank](https://github.com/MananTank)! - add SignerWallet

- [#1682](https://github.com/thirdweb-dev/js/pull/1682) [`eb9e9f0c`](https://github.com/thirdweb-dev/js/commit/eb9e9f0ce8019570a00660724a9bf669910959b9) Thanks [@MananTank](https://github.com/MananTank)! - - Always show "Connected to Smart Wallet" text in ConnectWallet dropdown but only link to dashboard if it is deployed

  - Show QR code in the Receive funds screen on mobile too

- [#1687](https://github.com/thirdweb-dev/js/pull/1687) [`fd378ec3`](https://github.com/thirdweb-dev/js/commit/fd378ec3e41c17bca6b67ff2969d3591e4e0f047) Thanks [@MananTank](https://github.com/MananTank)! - ConnectWallet UI Improvements for OTP screen and other minor UI tweaks

- Updated dependencies [[`54f83a50`](https://github.com/thirdweb-dev/js/commit/54f83a5013ed65ddd5a787e13ba7e5d86625537d), [`a9b4b0c5`](https://github.com/thirdweb-dev/js/commit/a9b4b0c5d875dec660694466e5e322cc574bb21b), [`c7e7ec95`](https://github.com/thirdweb-dev/js/commit/c7e7ec9502b46312d36cad5177c4f4a50c34f1a3), [`96e832cc`](https://github.com/thirdweb-dev/js/commit/96e832cc80692da38279c53f1289265b3728cb19), [`b16c09df`](https://github.com/thirdweb-dev/js/commit/b16c09df75c7193a91b832db7d9c92612ae09357), [`6897ad65`](https://github.com/thirdweb-dev/js/commit/6897ad6502d585d55a8c7b2312b4af30663336c3), [`ee028e12`](https://github.com/thirdweb-dev/js/commit/ee028e12092fd306f076f6ea1d49a2295802dd6b), [`d28b1c0f`](https://github.com/thirdweb-dev/js/commit/d28b1c0f1e1e53eedc8f331be555e22b64fb920d), [`c085d690`](https://github.com/thirdweb-dev/js/commit/c085d69060c68b3335761bdb2cc0c3e082548702), [`de05c2da`](https://github.com/thirdweb-dev/js/commit/de05c2da174a69315f2d34dd32a811bbd9a0b604), [`bdb2ccc7`](https://github.com/thirdweb-dev/js/commit/bdb2ccc7a66c33ec5dc331b6fa792e6361769e88), [`c7e7ec95`](https://github.com/thirdweb-dev/js/commit/c7e7ec9502b46312d36cad5177c4f4a50c34f1a3)]:
  - @thirdweb-dev/wallets@1.3.1
  - @thirdweb-dev/sdk@3.10.63
  - @thirdweb-dev/react-core@3.16.1

## 3.16.0

### Minor Changes

- [#1618](https://github.com/thirdweb-dev/js/pull/1618) [`64528263`](https://github.com/thirdweb-dev/js/commit/64528263f42bd2c564aad5e777f9f6dbba30af54) Thanks [@MananTank](https://github.com/MananTank)! - ## New smartWallet() API (Breaking Change)

  ### Before

  In the previous API, adding a smart wallet created it's own new entry called "Smart wallet" in the ConnectWallet Modal and you had to pass in the personal wallets which was shown to the user when they clicked on the "Smart wallet".

  ```tsx
  <ThirdwebProvider
    supportedWallets={[
      smartWalet({
        personalWallets: [metamaskWallet(), coinbaseWallet()],
        factoryAddress: "....",
        gassless: true,
      }),
    ]}
  />
  ```

  ### After

  Since most users don't know what a smart wallet is, this was confusing. So with the new API, you can just use smart wallet under the hood for any wallet you want and it will just show up as that wallet and not a "smart wallet" in ConnectWallet Modal to improve the user experience.

  Once the user is connected, the ConnectWallet Details button shows to the user that they are infact connected to a smart wallet.

  ```tsx
  const config = {
    factoryAddress: "....",
    gassless: true,
  }

  <ThirdwebProvider
    supportedWallets={[
      smartWalet(metamaskWallet(), config),
      smartWalet(coinbaseWallet(), config),
    ]}
  />
  ```

  ## New Features added to `ConnectWallet` component

  - ENS Name + Avatar support added
  - New 'Send funds' button added to ConnectWallet which users can use to send various tokens.
  - New "Receive funds" button added to ConnectWallet which users scan the QR code from their wallet app on phone to send funds to their other wallet on desktop
  - Added `supportedTokens` prop to customize the list of tokens for each network in for the "Send Funds" screen.
  - "Transaction history" button added to ConnectWallet which opens the block explorer
  - New wallet `embededWallet()` to sign in with Google / Email
  - Ability to show balance of any token instead of just native token in the ConnectWallet details button using the `displayBalanceToken` prop

- [#1622](https://github.com/thirdweb-dev/js/pull/1622) [`4268775f`](https://github.com/thirdweb-dev/js/commit/4268775f9c81d559e19af72887b1f2d1fb893e51) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - feat(react): add `embeddedWallet` wallet type

- [#1598](https://github.com/thirdweb-dev/js/pull/1598) [`43f188c8`](https://github.com/thirdweb-dev/js/commit/43f188c8a7ec02f394604120b414a039a2650525) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - feat(wallets): Add `EmbeddedWallet` and `EmbeddedWalletConnector` to `@thirdweb-dev/wallets` for use in vanilla JS clients

### Patch Changes

- [#1650](https://github.com/thirdweb-dev/js/pull/1650) [`1018eb56`](https://github.com/thirdweb-dev/js/commit/1018eb56a6560d97a2768b1d6d726082cd91a728) Thanks [@MananTank](https://github.com/MananTank)! - - show the first token given to `supportedTokens` as the default selected token in the "Send Funds" screen

  - Show smart wallet icon in "Receive Funds" screen when connected to a smart wallet
  - only show "Connected to smart wallet" link if the smart wallet is deployed

- [#1653](https://github.com/thirdweb-dev/js/pull/1653) [`bd18e4f5`](https://github.com/thirdweb-dev/js/commit/bd18e4f5ef0378cc141009287d3555b4445081dd) Thanks [@MananTank](https://github.com/MananTank)! - NetworkSelector component UI tweaks

- [#1659](https://github.com/thirdweb-dev/js/pull/1659) [`ea5b9c3e`](https://github.com/thirdweb-dev/js/commit/ea5b9c3ecdd588461fb00f0e9da463de4a30ed1d) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - fix(wallets/react): Show recovery modal for `USER_MANAGED` wallets in `paperWallet` implementation

- [#1664](https://github.com/thirdweb-dev/js/pull/1664) [`a9854e69`](https://github.com/thirdweb-dev/js/commit/a9854e69ced6657db758b7b000a5b12580276370) Thanks [@MananTank](https://github.com/MananTank)! - Fix Img component crashing app on invalid URL

- Updated dependencies [[`64528263`](https://github.com/thirdweb-dev/js/commit/64528263f42bd2c564aad5e777f9f6dbba30af54), [`dd3d1a87`](https://github.com/thirdweb-dev/js/commit/dd3d1a87c2dadbadecc9ac3722941a8992bc8131), [`9d553746`](https://github.com/thirdweb-dev/js/commit/9d553746b025ac489f9b8ee357372c9d01c835e1), [`64528263`](https://github.com/thirdweb-dev/js/commit/64528263f42bd2c564aad5e777f9f6dbba30af54), [`d5fafdde`](https://github.com/thirdweb-dev/js/commit/d5fafddea58bc307c9b514a1c9578cafd18b5861), [`c29042b7`](https://github.com/thirdweb-dev/js/commit/c29042b71e266cb11d70d67f0fe2ffcc0fc1f5fa), [`b5b7e524`](https://github.com/thirdweb-dev/js/commit/b5b7e5243df83e3ab60d0917c099fb6967b63439), [`b6df6b89`](https://github.com/thirdweb-dev/js/commit/b6df6b895723947427c515411a7a833edaa324c6), [`94bdcc14`](https://github.com/thirdweb-dev/js/commit/94bdcc142a7fe1e9f53273560404fa6b5ac3a7c4), [`48906a9d`](https://github.com/thirdweb-dev/js/commit/48906a9d8ef2cfdd9ac489822a72d50cbd825628), [`43f188c8`](https://github.com/thirdweb-dev/js/commit/43f188c8a7ec02f394604120b414a039a2650525), [`ea5b9c3e`](https://github.com/thirdweb-dev/js/commit/ea5b9c3ecdd588461fb00f0e9da463de4a30ed1d), [`def6d400`](https://github.com/thirdweb-dev/js/commit/def6d400ab463bda3118d4c9cb00e5cc25a415c2)]:
  - @thirdweb-dev/react-core@3.16.0
  - @thirdweb-dev/chains@0.1.53
  - @thirdweb-dev/wallets@1.3.0
  - @thirdweb-dev/sdk@3.10.62

## 3.15.0

### Minor Changes

- [#1550](https://github.com/thirdweb-dev/js/pull/1550) [`3f3c63c0`](https://github.com/thirdweb-dev/js/commit/3f3c63c01e34242ae1f074e62b51787b305c059e) Thanks [@MananTank](https://github.com/MananTank)! - # New ConnectWallet UI and APIs

  This introduces a new UI for the ConnectWallet modal and some new APIs along with it.

  ### modalSize

  ConnectWallet modal now has two sizes - "wide" and "compact".

  The default is “wide” for desktop. Note that it's always “compact” on mobile device no matter what you pass in.

  ```tsx
  <ConnectWallet modalSize="wide" />
  ```

  ```tsx
  <ConnectWallet modalSize="compact" />
  ```

  ### New default wallets

  - MetaMask
  - Coinbase Wallet
  - WalletConnect
  - Trust Wallet
  - Rainbow
  - Zerion Wallet
  - Phantom

  ### Theme Customization

  `ConnectWallet`, `Web3Button` and `ThirdwebProvider`'s `theme` prop now also takes an object which you can use to create a custom theme.

  To do this, there are two new functions `darkTheme()` and `lightTheme()` to create this theme object

  ```ts
  import { darkTheme } from '@thirdweb-dev/react'

  const customDarkTheme = darkTheme({
    fontFamily: 'Inter, sans-serif',
    color: {
      modalBg: 'black',
      accentText: 'red',
      // ...etc
    }
  })

  <ConnectWallet theme={customDarkTheme} />
  ```

  ### Show a wallet as “recommended”

  call the wallet configurator function with `{ recommended: true }`

  recommended wallets are shown at the top of the list

  ```tsx
  <ThirdwebProvider
    supportedWallets={[
      metamaskWallet({
        recommended: true,
      }),
      coinbaseWalletWallet({
        recommended: true,
      }),
    ]}
  >
    <App />
  </ThirdwebProvider>
  ```

  ### Show Terms of Service and/or Privacy policy links

  ```tsx
  <ConnectWallet
    termsOfServiceUrl="https://...."
    privacyPolicyUrl="https://...."
  />
  ```

  ### Customize the “Welcome Screen” or Render your own

  The "wide" ConnectWallet modal renders a default welcome screen on the right side which you can customize the texts and image of or completely replace with your own component.

  ```tsx
  // Customize texts and logo

  <ConnectWallet
    welcomeScreen={{
      title: "YOUR TITLE",
      subtitle: "YOUR SUBTITLE",
      img: {
        src: "https://...",
        width: 300,
        height: 50,
      },
    }}
  />

  // or render your own component

  <ConnectWallet
  	welcomeScreen={() => {
  		return <div> ... </div>
  	}}
  />
  ```

  ### ConnectWallet’s props are exposed to Web3Button as well

  `Web3Button`` renders a `ConnectWallet``component when the user is not connected, now you can customize that`ConnectWallet`by passing props for it via`connectWallet` object

  ```tsx
  <Web3Button
    connectWallet={{
      modalTitle: "Login",
      modalSize: "compact", // etc..
    }}
  />
  ```

### Patch Changes

- [#1615](https://github.com/thirdweb-dev/js/pull/1615) [`f5991387`](https://github.com/thirdweb-dev/js/commit/f5991387efad368a268f856f56b8a407340807f4) Thanks [@MananTank](https://github.com/MananTank)! - Code cleanup

- [#1621](https://github.com/thirdweb-dev/js/pull/1621) [`bab39980`](https://github.com/thirdweb-dev/js/commit/bab39980e777be7ec307c2a592bb7966bad1623a) Thanks [@MananTank](https://github.com/MananTank)! - ConnectWallet minor UI fixes

- Updated dependencies [[`3fd39cea`](https://github.com/thirdweb-dev/js/commit/3fd39cea0df71f80255106329db62660f2fd6e3a), [`3f3c63c0`](https://github.com/thirdweb-dev/js/commit/3f3c63c01e34242ae1f074e62b51787b305c059e), [`48295c06`](https://github.com/thirdweb-dev/js/commit/48295c060499371035980d08e362d9858d0fc18b), [`48295c06`](https://github.com/thirdweb-dev/js/commit/48295c060499371035980d08e362d9858d0fc18b)]:
  - @thirdweb-dev/sdk@3.10.61
  - @thirdweb-dev/wallets@1.2.1
  - @thirdweb-dev/react-core@3.15.0
  - @thirdweb-dev/chains@0.1.52

## 3.14.41

### Patch Changes

- [#1587](https://github.com/thirdweb-dev/js/pull/1587) [`4a7f41b3`](https://github.com/thirdweb-dev/js/commit/4a7f41b3ee15914000ea23c3136c24b26290e8dd) Thanks [@iketw](https://github.com/iketw)! - Remove signer from ThirdwebProvider as it is not being used

  The idea of the React/RN ThirdwebProvider is to provider support for wallets. If devs want to pass their own signer they can directly use ThirdwebSDKProvider

- [#1597](https://github.com/thirdweb-dev/js/pull/1597) [`f9042765`](https://github.com/thirdweb-dev/js/commit/f90427650c037b2c437685734ddc3398ad3e2612) Thanks [@ElasticBottle](https://github.com/ElasticBottle)! - chore(wallets,react): add ability to use thirdweb's client ID with paperWallet

- [#1588](https://github.com/thirdweb-dev/js/pull/1588) [`0307671c`](https://github.com/thirdweb-dev/js/commit/0307671c63e0986977ed892d4b404c79a72227a0) Thanks [@MananTank](https://github.com/MananTank)! - Fix SmartWallet and Safe connection issues

- [#1577](https://github.com/thirdweb-dev/js/pull/1577) [`d37c3a75`](https://github.com/thirdweb-dev/js/commit/d37c3a75e7beba4e306db66edc7a1f0185a9b6c0) Thanks [@MananTank](https://github.com/MananTank)! - Fix Rainbow wallet connection in mobile

- [#1596](https://github.com/thirdweb-dev/js/pull/1596) [`931ee793`](https://github.com/thirdweb-dev/js/commit/931ee7930f16c25e4d775d2d93538a5cfe770353) Thanks [@nheingit](https://github.com/nheingit)! - Add phantom wallet

- Updated dependencies [[`c0070c2c`](https://github.com/thirdweb-dev/js/commit/c0070c2cc08f23ffe50991d9d3090fcdcd1e720c), [`f55fd291`](https://github.com/thirdweb-dev/js/commit/f55fd291bf751c44608dd9ef6b3a29fb36c2de93), [`2a873d2f`](https://github.com/thirdweb-dev/js/commit/2a873d2f80271208819bac88b32cea0b48761c8d), [`d50863f4`](https://github.com/thirdweb-dev/js/commit/d50863f455ffbfd433924da8fe94394c42408bdc), [`f9042765`](https://github.com/thirdweb-dev/js/commit/f90427650c037b2c437685734ddc3398ad3e2612), [`6df24a2e`](https://github.com/thirdweb-dev/js/commit/6df24a2eb9b922a31bdcb0ccb260d99bdcbb1f17), [`8b73abfd`](https://github.com/thirdweb-dev/js/commit/8b73abfd83c7a8235f5d65f07dc3ad1296b40ae0), [`3056c34c`](https://github.com/thirdweb-dev/js/commit/3056c34c646e1a8c80f1323899c163e0fa867fd1), [`defe5fce`](https://github.com/thirdweb-dev/js/commit/defe5fced3fd738157616a9f1644c5092dcaa5a8), [`2f187d13`](https://github.com/thirdweb-dev/js/commit/2f187d13754f571b7205fc1b743efde767b1b1c8), [`7e564163`](https://github.com/thirdweb-dev/js/commit/7e564163cef43f9196250156373de9bf9fdbf334), [`931ee793`](https://github.com/thirdweb-dev/js/commit/931ee7930f16c25e4d775d2d93538a5cfe770353)]:
  - @thirdweb-dev/sdk@3.10.60
  - @thirdweb-dev/wallets@1.2.0
  - @thirdweb-dev/chains@0.1.51
  - @thirdweb-dev/react-core@3.14.41

## 3.14.40

### Patch Changes

- Updated dependencies [[`a00cbaf7`](https://github.com/thirdweb-dev/js/commit/a00cbaf78c05ea43d3814ba9f9ec8e667f0ddb25), [`a023cb8c`](https://github.com/thirdweb-dev/js/commit/a023cb8cf1e4f08be56a2e33c146c8d307c80f40), [`2088de1c`](https://github.com/thirdweb-dev/js/commit/2088de1cacbc903d4f18a84c21a8f27af8d06b29), [`1e6f9dcc`](https://github.com/thirdweb-dev/js/commit/1e6f9dcc04022c6a8a39d490123a3e22e52b5e0b)]:
  - @thirdweb-dev/sdk@3.10.59
  - @thirdweb-dev/wallets@1.1.23
  - @thirdweb-dev/react-core@3.14.40

## 3.14.39

### Patch Changes

- Updated dependencies [[`926dd7b0`](https://github.com/thirdweb-dev/js/commit/926dd7b03f38ed25ca303dc23d3323d5edd28005), [`e00dd123`](https://github.com/thirdweb-dev/js/commit/e00dd123579f75752b6fe4fcf613d2cae5419e19)]:
  - @thirdweb-dev/chains@0.1.50
  - @thirdweb-dev/sdk@3.10.58
  - @thirdweb-dev/react-core@3.14.39
  - @thirdweb-dev/wallets@1.1.22

## 3.14.38

### Patch Changes

- [#1532](https://github.com/thirdweb-dev/js/pull/1532) [`b29ec675`](https://github.com/thirdweb-dev/js/commit/b29ec675f9c41c49c015af2427d5402367c06c73) Thanks [@MananTank](https://github.com/MananTank)! - Export ConnectModalInline component

- [#1544](https://github.com/thirdweb-dev/js/pull/1544) [`eb463735`](https://github.com/thirdweb-dev/js/commit/eb463735e2f784cd1d212a982835af95cf60766b) Thanks [@iketw](https://github.com/iketw)! - Adds support for Rainbow's new browser extension

- Updated dependencies [[`eb463735`](https://github.com/thirdweb-dev/js/commit/eb463735e2f784cd1d212a982835af95cf60766b), [`adec589e`](https://github.com/thirdweb-dev/js/commit/adec589ead8ceff1b57169e05a3e6733b4652cc7), [`b30566c6`](https://github.com/thirdweb-dev/js/commit/b30566c68436ad94ddc938a380eccc13a8a7147d), [`0f027069`](https://github.com/thirdweb-dev/js/commit/0f027069064bebe647f9235fa86ef7f165ffc7b3), [`f5aed34d`](https://github.com/thirdweb-dev/js/commit/f5aed34d3c71065c3f45df2c1eb84ba9c36162d5)]:
  - @thirdweb-dev/wallets@1.1.21
  - @thirdweb-dev/sdk@3.10.57
  - @thirdweb-dev/chains@0.1.49
  - @thirdweb-dev/react-core@3.14.38

## 3.14.37

### Patch Changes

- Updated dependencies [[`f59b729f`](https://github.com/thirdweb-dev/js/commit/f59b729f8b09aa86655b8e8a70fba644fc52009b), [`911e14fc`](https://github.com/thirdweb-dev/js/commit/911e14fcac743b07fa1a66440c72d662c08e971c), [`cd6b07b5`](https://github.com/thirdweb-dev/js/commit/cd6b07b591606d2671794cebebf8edcb59076c32)]:
  - @thirdweb-dev/sdk@3.10.56
  - @thirdweb-dev/chains@0.1.48
  - @thirdweb-dev/react-core@3.14.37
  - @thirdweb-dev/wallets@1.1.20

## 3.14.36

### Patch Changes

- [#1522](https://github.com/thirdweb-dev/js/pull/1522) [`088547f7`](https://github.com/thirdweb-dev/js/commit/088547f763294f1641c01ffe1aabac585f255dc0) Thanks [@MananTank](https://github.com/MananTank)! - - New prop `switchToActiveChain` added to `ConnectWallet`` component to show "Switch Network" button if wallet is not connected to the `activeChain`passed to the`ThirdwebProvider`
  - Add max-height on `ConnectWallet` modal
  - Local Wallet UI adjustments
- Updated dependencies [[`586e91db`](https://github.com/thirdweb-dev/js/commit/586e91dbe610588cc7b24fade59172fed6481074), [`34a3bb8a`](https://github.com/thirdweb-dev/js/commit/34a3bb8ae3c1d7a506e5568a9e79ab7e469557a8), [`91f0245b`](https://github.com/thirdweb-dev/js/commit/91f0245be78ae523e1faea26b1032bfb283467d9), [`5a373a75`](https://github.com/thirdweb-dev/js/commit/5a373a75090da7e1e05724ed1a3a3a6aa9f7fd21), [`ae74b8ef`](https://github.com/thirdweb-dev/js/commit/ae74b8ef6200dba8affa8b52e7d834c5552350d0), [`bc003c2f`](https://github.com/thirdweb-dev/js/commit/bc003c2fef33fcf7ce5981d8634911ac4bcaa927), [`447d9846`](https://github.com/thirdweb-dev/js/commit/447d984653f77af6860ae907072e768b584b263d), [`f65578d6`](https://github.com/thirdweb-dev/js/commit/f65578d637decc8b87cada5b5b0c8c504064d9d5), [`088547f7`](https://github.com/thirdweb-dev/js/commit/088547f763294f1641c01ffe1aabac585f255dc0)]:
  - @thirdweb-dev/sdk@3.10.55
  - @thirdweb-dev/chains@0.1.47
  - @thirdweb-dev/react-core@3.14.36
  - @thirdweb-dev/wallets@1.1.19

## 3.14.35

### Patch Changes

- Updated dependencies [[`184c325a`](https://github.com/thirdweb-dev/js/commit/184c325ab2ef028022a050c4274f2ab12b1a3a7f), [`c12f0874`](https://github.com/thirdweb-dev/js/commit/c12f0874b4dac43c263c7edb20d0343c16381c34)]:
  - @thirdweb-dev/chains@0.1.46
  - @thirdweb-dev/react-core@3.14.35
  - @thirdweb-dev/sdk@3.10.54
  - @thirdweb-dev/wallets@1.1.18

## 3.14.34

### Patch Changes

- Updated dependencies [[`f97ddf4c`](https://github.com/thirdweb-dev/js/commit/f97ddf4c7f14854f3b204ad9741b52ddb8dac736)]:
  - @thirdweb-dev/chains@0.1.45
  - @thirdweb-dev/react-core@3.14.34
  - @thirdweb-dev/sdk@3.10.53
  - @thirdweb-dev/wallets@1.1.17

## 3.14.33

### Patch Changes

- Updated dependencies [[`e1962641`](https://github.com/thirdweb-dev/js/commit/e19626417218767a0e44c00f440761d7b86d02eb), [`bd1fcbae`](https://github.com/thirdweb-dev/js/commit/bd1fcbae327e788124f5635673511f0b72e9d7ab)]:
  - @thirdweb-dev/sdk@3.10.52
  - @thirdweb-dev/react-core@3.14.33
  - @thirdweb-dev/wallets@1.1.16

## 3.14.32

### Patch Changes

- Updated dependencies [[`07fb1b5f`](https://github.com/thirdweb-dev/js/commit/07fb1b5ffa4c170e252df31070852ddb9a81dec9), [`300a3c6f`](https://github.com/thirdweb-dev/js/commit/300a3c6f04d0ea7e25dfdb0a4c28b3a5796fcadf), [`d248aa2c`](https://github.com/thirdweb-dev/js/commit/d248aa2c5a89a297dd2623c961793026de1de346), [`8f3b685a`](https://github.com/thirdweb-dev/js/commit/8f3b685ad2bd73cb4d5d8c8aa25c04ffc10fb7cf), [`28975765`](https://github.com/thirdweb-dev/js/commit/2897576513eb6f497a9f92e3e473182b4fc9681b), [`b91d3e99`](https://github.com/thirdweb-dev/js/commit/b91d3e990198b77dc1358e738c11dc4acaa67491)]:
  - @thirdweb-dev/react-core@3.14.32
  - @thirdweb-dev/wallets@1.1.15
  - @thirdweb-dev/sdk@3.10.51
  - @thirdweb-dev/chains@0.1.44

## 3.14.31

### Patch Changes

- Updated dependencies [[`39e2af6f`](https://github.com/thirdweb-dev/js/commit/39e2af6f2f4d933dca1b3de4a37de76375bafd74), [`a5ba9e4f`](https://github.com/thirdweb-dev/js/commit/a5ba9e4fbfee228e5b9ac27cd0157187e3a50117), [`39e2af6f`](https://github.com/thirdweb-dev/js/commit/39e2af6f2f4d933dca1b3de4a37de76375bafd74)]:
  - @thirdweb-dev/wallets@1.1.14
  - @thirdweb-dev/sdk@3.10.50
  - @thirdweb-dev/react-core@3.14.31

## 3.14.30

### Patch Changes

- Updated dependencies [[`34b31599`](https://github.com/thirdweb-dev/js/commit/34b315993c0abaccb9640a5d5804c2c93af569c2), [`7f531122`](https://github.com/thirdweb-dev/js/commit/7f5311222b14da04877df056baae36409dff4696)]:
  - @thirdweb-dev/wallets@1.1.13
  - @thirdweb-dev/sdk@3.10.49
  - @thirdweb-dev/react-core@3.14.30

## 3.14.29

### Patch Changes

- [#1458](https://github.com/thirdweb-dev/js/pull/1458) [`588b2106`](https://github.com/thirdweb-dev/js/commit/588b21060139a7c0bf5805e2c629a16792ed2c76) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Add `hideTestnetFaucet` to hide the "Request Testnet funds" button in ConnectWallet details dropdown in `@thirdweb-dev/react-native` and `@thirdweb-dev/react`.

  ```ts
  <ConnectWallet hideTestnetFaucet={true} />
  ```

- Updated dependencies [[`73462ef1`](https://github.com/thirdweb-dev/js/commit/73462ef10800aeeb5976634e2bc6fb5d3e8501e4), [`cb1c9937`](https://github.com/thirdweb-dev/js/commit/cb1c9937fadb2d06eb148cf9819f2b3601376308), [`70c4a119`](https://github.com/thirdweb-dev/js/commit/70c4a119d691a37ec999d9f6087902d532cc82ed), [`a1732663`](https://github.com/thirdweb-dev/js/commit/a17326634e758c3bf42f0cc3869b8792f1e18cc9), [`f0443bd9`](https://github.com/thirdweb-dev/js/commit/f0443bd989dbba50d0836d1cf274bfb2f44a53fd), [`cb1c9937`](https://github.com/thirdweb-dev/js/commit/cb1c9937fadb2d06eb148cf9819f2b3601376308), [`588b2106`](https://github.com/thirdweb-dev/js/commit/588b21060139a7c0bf5805e2c629a16792ed2c76), [`269e68c0`](https://github.com/thirdweb-dev/js/commit/269e68c0a15e8f78cb5b68c9456ca8094b9e1f30)]:
  - @thirdweb-dev/wallets@1.1.12
  - @thirdweb-dev/sdk@3.10.48
  - @thirdweb-dev/chains@0.1.43
  - @thirdweb-dev/react-core@3.14.29

## 3.14.28

### Patch Changes

- Updated dependencies [[`4b0e63dc`](https://github.com/thirdweb-dev/js/commit/4b0e63dcc0ca871ce9cef76f8a41ff290316741c)]:
  - @thirdweb-dev/react-core@3.14.28
  - @thirdweb-dev/wallets@1.1.11
  - @thirdweb-dev/sdk@3.10.47

## 3.14.27

### Patch Changes

- Updated dependencies [[`262edc6a`](https://github.com/thirdweb-dev/js/commit/262edc6a46792da88f49ff6ef0a756a932a6a0cf), [`262edc6a`](https://github.com/thirdweb-dev/js/commit/262edc6a46792da88f49ff6ef0a756a932a6a0cf), [`dfd120a3`](https://github.com/thirdweb-dev/js/commit/dfd120a3a9d1582c8b174265c92bf43dbbaf5c86)]:
  - @thirdweb-dev/chains@0.1.42
  - @thirdweb-dev/sdk@3.10.46
  - @thirdweb-dev/react-core@3.14.27
  - @thirdweb-dev/wallets@1.1.10

## 3.14.26

### Patch Changes

- Updated dependencies [[`2a91113a`](https://github.com/thirdweb-dev/js/commit/2a91113a760733fcff2aec90041f69e15de33905)]:
  - @thirdweb-dev/sdk@3.10.45
  - @thirdweb-dev/react-core@3.14.26
  - @thirdweb-dev/wallets@1.1.9

## 3.14.25

### Patch Changes

- [#1429](https://github.com/thirdweb-dev/js/pull/1429) [`ab36d84f`](https://github.com/thirdweb-dev/js/commit/ab36d84f1ce5647fa52475b4a35ea29d5007ad9b) Thanks [@iketw](https://github.com/iketw)! - Pass secretKey in the React SDK for server-side rendering

- [#1430](https://github.com/thirdweb-dev/js/pull/1430) [`a9f2ff73`](https://github.com/thirdweb-dev/js/commit/a9f2ff73c9f83f05c3e2d3c53b23b2843e8a2576) Thanks [@MananTank](https://github.com/MananTank)! - - Add base-gor as a valid safe address prefix
  - Log failed to autoconnect error on react-core too
- Updated dependencies [[`a5d0be93`](https://github.com/thirdweb-dev/js/commit/a5d0be939a143095e769b68cf86360bfe4720744), [`c0a6d2f1`](https://github.com/thirdweb-dev/js/commit/c0a6d2f18231310d143c9b0cb1b2ff59315087a4), [`a9f2ff73`](https://github.com/thirdweb-dev/js/commit/a9f2ff73c9f83f05c3e2d3c53b23b2843e8a2576), [`fd981655`](https://github.com/thirdweb-dev/js/commit/fd9816556fe595b0c764e34dbcf15b0ad1677edb), [`becbb637`](https://github.com/thirdweb-dev/js/commit/becbb637367285ed3d8d7d131e1020bf23e38298), [`2283d210`](https://github.com/thirdweb-dev/js/commit/2283d21027503e047c25df5ebb21bdde0734be9e), [`fd981655`](https://github.com/thirdweb-dev/js/commit/fd9816556fe595b0c764e34dbcf15b0ad1677edb), [`ab36d84f`](https://github.com/thirdweb-dev/js/commit/ab36d84f1ce5647fa52475b4a35ea29d5007ad9b), [`c9bf4f05`](https://github.com/thirdweb-dev/js/commit/c9bf4f05c161707c6eb799ecef82f462e4a82405), [`67b145b9`](https://github.com/thirdweb-dev/js/commit/67b145b94dafb2fb1d90553ed4829f0ed22e2907), [`5ee700e8`](https://github.com/thirdweb-dev/js/commit/5ee700e80438650fa253c25c0bee6658ce68d2cf), [`9f5adc5c`](https://github.com/thirdweb-dev/js/commit/9f5adc5c5c2782ffb878759df481e5fb1e1740e5)]:
  - @thirdweb-dev/sdk@3.10.44
  - @thirdweb-dev/wallets@1.1.8
  - @thirdweb-dev/react-core@3.14.25
  - @thirdweb-dev/chains@0.1.41

## 3.14.24

### Patch Changes

- Updated dependencies [[`3b6b0746`](https://github.com/thirdweb-dev/js/commit/3b6b0746b3fc792f4c5092814a7abfabcbc9801e), [`b0ec1d80`](https://github.com/thirdweb-dev/js/commit/b0ec1d80839efccad11b50afbf2216c2c132cf7e)]:
  - @thirdweb-dev/wallets@1.1.7
  - @thirdweb-dev/sdk@3.10.43
  - @thirdweb-dev/react-core@3.14.24

## 3.14.23

### Patch Changes

- Updated dependencies [[`fbde927a`](https://github.com/thirdweb-dev/js/commit/fbde927a0cb36a6269e045d8e577536f23164ef7)]:
  - @thirdweb-dev/wallets@1.1.6
  - @thirdweb-dev/react-core@3.14.23

## 3.14.22

### Patch Changes

- [#1415](https://github.com/thirdweb-dev/js/pull/1415) [`256ee0d5`](https://github.com/thirdweb-dev/js/commit/256ee0d5ec9c8598aa79cd4cb1fd839c6cc7d390) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Downgrade preconstruct to 2.7.0

- Updated dependencies [[`256ee0d5`](https://github.com/thirdweb-dev/js/commit/256ee0d5ec9c8598aa79cd4cb1fd839c6cc7d390)]:
  - @thirdweb-dev/react-core@3.14.22
  - @thirdweb-dev/wallets@1.1.5
  - @thirdweb-dev/chains@0.1.40
  - @thirdweb-dev/sdk@3.10.42

## 3.14.21

### Patch Changes

- [#1396](https://github.com/thirdweb-dev/js/pull/1396) [`9a329178`](https://github.com/thirdweb-dev/js/commit/9a329178ef750235ebceda07b55aad7a49deab66) Thanks [@MananTank](https://github.com/MananTank)! - Auto select localWallet if that's the only option for Safe/Smart wallet in ConnectWallet Modal

- [#1361](https://github.com/thirdweb-dev/js/pull/1361) [`06b4f298`](https://github.com/thirdweb-dev/js/commit/06b4f2983161fc9ff5913fd05dacf17260902576) Thanks [@q20274982](https://github.com/q20274982)! - [Wallets/React] Add Blocto Wallet

  ```javascript
  import { ThirdwebProvider, bloctoWallet } from "@thirdweb-dev/react";
  import { Polygon } from "@thirdweb-dev/chains";

  <ThirdwebProvider activeChain={Polygon} supportedWallets={[bloctoWallet()]}>
    <App />
  </ThirdwebProvider>;
  ```

- [#1409](https://github.com/thirdweb-dev/js/pull/1409) [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#1334](https://github.com/thirdweb-dev/js/pull/1334) [`9acf6854`](https://github.com/thirdweb-dev/js/commit/9acf6854dfdc5c0be768e660c1f174e017b06a9c) Thanks [@MananTank](https://github.com/MananTank)! - Add social login support in Magic wallet

- [#1379](https://github.com/thirdweb-dev/js/pull/1379) [`60fbb767`](https://github.com/thirdweb-dev/js/commit/60fbb767c18ffe1e49792c6ac8e808792acf594c) Thanks [@MananTank](https://github.com/MananTank)! - Set theme in Coinbase Native modal to match ConnectWallet component

- [#1295](https://github.com/thirdweb-dev/js/pull/1295) [`277cfd5c`](https://github.com/thirdweb-dev/js/commit/277cfd5ce1f3a576d29c95492c735b46a00c164e) Thanks [@MananTank](https://github.com/MananTank)! - - Fix wallet connection on mobile for rainbowWallet(), trustWallet(), zerionWallet()
  - update @WalletConnect packages
- Updated dependencies [[`09b3b339`](https://github.com/thirdweb-dev/js/commit/09b3b339e65a6a9a1cfa32bab9e61e57532e7dbe), [`0a5eb19d`](https://github.com/thirdweb-dev/js/commit/0a5eb19d672909027bb6c7e79ea76d431535559c), [`98009cb3`](https://github.com/thirdweb-dev/js/commit/98009cb3ca6f1c2221a6a74ffa7df8d7ddac2c60), [`06b4f298`](https://github.com/thirdweb-dev/js/commit/06b4f2983161fc9ff5913fd05dacf17260902576), [`72fa3d22`](https://github.com/thirdweb-dev/js/commit/72fa3d22254d0415b9d264b3897173bd400cd948), [`b1e8c8e2`](https://github.com/thirdweb-dev/js/commit/b1e8c8e231013182eb46c16d0c441ee0f3bdfdb2), [`2025b8cb`](https://github.com/thirdweb-dev/js/commit/2025b8cb8d5157c03314e5db47a0d50382519c41), [`cbf486c2`](https://github.com/thirdweb-dev/js/commit/cbf486c21088ec1656933961e653e1d161939f63), [`01cc5408`](https://github.com/thirdweb-dev/js/commit/01cc54087b9d276968cb6dd3ceafa07c30bc2242), [`53400858`](https://github.com/thirdweb-dev/js/commit/53400858232ceb998d68da8a75a6d493668fcf0f), [`385895ca`](https://github.com/thirdweb-dev/js/commit/385895ca928a5276586f0a370fabdcece7620d83), [`9acf6854`](https://github.com/thirdweb-dev/js/commit/9acf6854dfdc5c0be768e660c1f174e017b06a9c), [`48ca58b7`](https://github.com/thirdweb-dev/js/commit/48ca58b7aa45348b928932b9c7b76b3dc233e429), [`aface46d`](https://github.com/thirdweb-dev/js/commit/aface46d7469ca2c1e45895e311a74363ceb8611), [`60fbb767`](https://github.com/thirdweb-dev/js/commit/60fbb767c18ffe1e49792c6ac8e808792acf594c), [`3152d4e9`](https://github.com/thirdweb-dev/js/commit/3152d4e9b42e2777316b1b58513657f4430cb79a), [`5fe3cec8`](https://github.com/thirdweb-dev/js/commit/5fe3cec894b98a2361d21bb72a5da843ec2a4d9b), [`8e6e55b1`](https://github.com/thirdweb-dev/js/commit/8e6e55b154ecdc4b09ded31387707571ff963fb7), [`aa6bdd08`](https://github.com/thirdweb-dev/js/commit/aa6bdd0809d1d5536c837c59b2d407ee974c1f9c), [`277cfd5c`](https://github.com/thirdweb-dev/js/commit/277cfd5ce1f3a576d29c95492c735b46a00c164e), [`75587c8b`](https://github.com/thirdweb-dev/js/commit/75587c8b38bbbcf68d2101526e9792349cce728f), [`2025b8cb`](https://github.com/thirdweb-dev/js/commit/2025b8cb8d5157c03314e5db47a0d50382519c41), [`cc5e2ec5`](https://github.com/thirdweb-dev/js/commit/cc5e2ec51fce09af05be33811eb46980825829ee), [`a9f9a403`](https://github.com/thirdweb-dev/js/commit/a9f9a403457b9e683bcfdb61034ee9c9ee08bbf8), [`7ae9f4cd`](https://github.com/thirdweb-dev/js/commit/7ae9f4cda1a2009dd414f836757bec8202c83172), [`5a02c5ec`](https://github.com/thirdweb-dev/js/commit/5a02c5ec0288fd6dfb2b765ef70bb18e714aca19)]:
  - @thirdweb-dev/sdk@3.10.41
  - @thirdweb-dev/chains@0.1.39
  - @thirdweb-dev/wallets@1.1.4
  - @thirdweb-dev/react-core@3.14.21

## 3.14.20

### Patch Changes

- Updated dependencies [[`7cb55e70`](https://github.com/thirdweb-dev/js/commit/7cb55e7051617268bba1b80146865c606ff6e66d)]:
  - @thirdweb-dev/chains@0.1.38
  - @thirdweb-dev/react-core@3.14.20
  - @thirdweb-dev/sdk@3.10.40
  - @thirdweb-dev/wallets@1.1.3

## 3.14.19

### Patch Changes

- Updated dependencies [[`d665954f`](https://github.com/thirdweb-dev/js/commit/d665954fee0554985055bf06abbed8d7b8d5bc38)]:
  - @thirdweb-dev/chains@0.1.37
  - @thirdweb-dev/react-core@3.14.19
  - @thirdweb-dev/sdk@3.10.39
  - @thirdweb-dev/wallets@1.1.2

## 3.14.18

### Patch Changes

- Updated dependencies [[`02ab92cc`](https://github.com/thirdweb-dev/js/commit/02ab92cc5c97f475e3b5642e5a7bdbe63ca136ee), [`6cc4b8d2`](https://github.com/thirdweb-dev/js/commit/6cc4b8d28b982c5be3e1cd17d2a9a947001d1608)]:
  - @thirdweb-dev/chains@0.1.36
  - @thirdweb-dev/react-core@3.14.18
  - @thirdweb-dev/sdk@3.10.38
  - @thirdweb-dev/wallets@1.1.1

## 3.14.17

### Patch Changes

- [#1316](https://github.com/thirdweb-dev/js/pull/1316) [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b) Thanks [@iketw](https://github.com/iketw)! - Adds new `clientId` prop to access thirdweb's services.

  You can create a _free_ `clientId` [on the thirdweb Dashboard](https://thirdweb.com/dashboard)

  ```javascript
  <ThirdwebProvider clientId="your-client-id" />
  ```

- Updated dependencies [[`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b), [`d8447146`](https://github.com/thirdweb-dev/js/commit/d8447146092c1962f410155ab2047225453aaa2b)]:
  - @thirdweb-dev/sdk@3.10.37
  - @thirdweb-dev/react-core@3.14.17
  - @thirdweb-dev/chains@0.1.35
  - @thirdweb-dev/wallets@1.1.0

## 3.14.16

### Patch Changes

- [#1350](https://github.com/thirdweb-dev/js/pull/1350) [`b96a2282`](https://github.com/thirdweb-dev/js/commit/b96a2282730582b684cc96802649a96851af5220) Thanks [@MananTank](https://github.com/MananTank)! - Disable autofocus for the Paper/Magic email/phone input in Connect Wallet Modal to avoid keyboard popup on mobile

- Updated dependencies [[`7a6534d1`](https://github.com/thirdweb-dev/js/commit/7a6534d1a98cab1eb47cf88d13e2b7ec04037e42), [`dac8fa7d`](https://github.com/thirdweb-dev/js/commit/dac8fa7d98b6952acf8d13e173099889c1d47da8), [`c5761b99`](https://github.com/thirdweb-dev/js/commit/c5761b99e9797772481506e90cbfa5c35a05bd1d), [`b96a2282`](https://github.com/thirdweb-dev/js/commit/b96a2282730582b684cc96802649a96851af5220)]:
  - @thirdweb-dev/react-core@3.14.16
  - @thirdweb-dev/sdk@3.10.36
  - @thirdweb-dev/wallets@1.0.12

## 3.14.15

### Patch Changes

- Updated dependencies [[`8dd7540c`](https://github.com/thirdweb-dev/js/commit/8dd7540c455aa70534f6d29986537592fd12169b)]:
  - @thirdweb-dev/chains@0.1.34
  - @thirdweb-dev/react-core@3.14.15
  - @thirdweb-dev/sdk@3.10.35
  - @thirdweb-dev/wallets@1.0.11

## 3.14.14

### Patch Changes

- Updated dependencies [[`0407b2c2`](https://github.com/thirdweb-dev/js/commit/0407b2c2f39b5f3fa06e613e671623b5644b3a28)]:
  - @thirdweb-dev/chains@0.1.33
  - @thirdweb-dev/react-core@3.14.14
  - @thirdweb-dev/sdk@3.10.34
  - @thirdweb-dev/wallets@1.0.10

## 3.14.13

### Patch Changes

- Updated dependencies [[`a9093bcf`](https://github.com/thirdweb-dev/js/commit/a9093bcf287c01e3335fd780e2ccbfdb3380bf95)]:
  - @thirdweb-dev/chains@0.1.32
  - @thirdweb-dev/react-core@3.14.13
  - @thirdweb-dev/sdk@3.10.33
  - @thirdweb-dev/wallets@1.0.9

## 3.14.12

### Patch Changes

- Updated dependencies [[`4393b228`](https://github.com/thirdweb-dev/js/commit/4393b2280505fd0b2284555d64eae6567e8401a5)]:
  - @thirdweb-dev/chains@0.1.31
  - @thirdweb-dev/react-core@3.14.12
  - @thirdweb-dev/sdk@3.10.32
  - @thirdweb-dev/wallets@1.0.8

## 3.14.11

### Patch Changes

- Updated dependencies [[`40682191`](https://github.com/thirdweb-dev/js/commit/40682191450de08ad40b9d2957afced248657af2)]:
  - @thirdweb-dev/chains@0.1.30
  - @thirdweb-dev/react-core@3.14.11
  - @thirdweb-dev/sdk@3.10.31
  - @thirdweb-dev/wallets@1.0.7

## 3.14.10

### Patch Changes

- [#1310](https://github.com/thirdweb-dev/js/pull/1310) [`3df86ad1`](https://github.com/thirdweb-dev/js/commit/3df86ad16f3daf1a0382d5b860ef6f24a69cc8d0) Thanks [@MananTank](https://github.com/MananTank)! - ConnectWallet UI fixes

  - Hide Back button when not required
  - Fix Rainbow wallet meta
  - Fix backbutton not working on get-started screen when there's a single supported wallet
  - Remove switchAccount button on mobile for metamask

- Updated dependencies [[`db68bd04`](https://github.com/thirdweb-dev/js/commit/db68bd04cd8bb3ee6bff051d1d5b5a872353fde0), [`fd74d791`](https://github.com/thirdweb-dev/js/commit/fd74d7918072cda03b52f852ebb3f8dccb84074d), [`35f20ceb`](https://github.com/thirdweb-dev/js/commit/35f20ceb4f943e95d9566105096f06412978da7a)]:
  - @thirdweb-dev/sdk@3.10.30
  - @thirdweb-dev/chains@0.1.29
  - @thirdweb-dev/react-core@3.14.10
  - @thirdweb-dev/wallets@1.0.6

## 3.14.9

### Patch Changes

- [#1309](https://github.com/thirdweb-dev/js/pull/1309) [`4961b597`](https://github.com/thirdweb-dev/js/commit/4961b597a098dae0a4eff01a9ef268a65fe1a352) Thanks [@jnsdls](https://github.com/jnsdls)! - unblock storage domains

- Updated dependencies [[`7e044c66`](https://github.com/thirdweb-dev/js/commit/7e044c664d8a034f5324b859ac3596860c86f9a5), [`72ada475`](https://github.com/thirdweb-dev/js/commit/72ada47596d5d5c08736c33215faeec636b7156a), [`2c0bb078`](https://github.com/thirdweb-dev/js/commit/2c0bb0789955f6cd397b6fdb8e990a505251c631), [`b5c6eedb`](https://github.com/thirdweb-dev/js/commit/b5c6eedb38aa3c52eb97f3d25ad83e38c55afe61), [`10b3a717`](https://github.com/thirdweb-dev/js/commit/10b3a717da606632a05769ac821bdd21d6b63a03), [`b4aee9b5`](https://github.com/thirdweb-dev/js/commit/b4aee9b59121bab5f9b3d9b7ecdc4bcb4cd66f58), [`4961b597`](https://github.com/thirdweb-dev/js/commit/4961b597a098dae0a4eff01a9ef268a65fe1a352)]:
  - @thirdweb-dev/chains@0.1.28
  - @thirdweb-dev/sdk@3.10.29
  - @thirdweb-dev/wallets@1.0.5
  - @thirdweb-dev/react-core@3.14.9

## 3.14.8

### Patch Changes

- [#1282](https://github.com/thirdweb-dev/js/pull/1282) [`7054f9f0`](https://github.com/thirdweb-dev/js/commit/7054f9f01691e1c942ffbec3ee8042218aadd126) Thanks [@kien-ngo](https://github.com/kien-ngo)! - Fix issue #1201 - MediaRenderer HTML MimeType

- [#1278](https://github.com/thirdweb-dev/js/pull/1278) [`8a389f12`](https://github.com/thirdweb-dev/js/commit/8a389f1295d2bf726059997ea0ca10cf0424f2a2) Thanks [@jnsdls](https://github.com/jnsdls)! - updated various dependencies

- Updated dependencies [[`8a389f12`](https://github.com/thirdweb-dev/js/commit/8a389f1295d2bf726059997ea0ca10cf0424f2a2), [`a3bb17cb`](https://github.com/thirdweb-dev/js/commit/a3bb17cb33f033846fb3b4c8a0a4809ba76cab96)]:
  - @thirdweb-dev/react-core@3.14.8
  - @thirdweb-dev/wallets@1.0.4
  - @thirdweb-dev/chains@0.1.27
  - @thirdweb-dev/sdk@3.10.28

## 3.14.7

### Patch Changes

- [#1210](https://github.com/thirdweb-dev/js/pull/1210) [`d794b8f9`](https://github.com/thirdweb-dev/js/commit/d794b8f9f41dbd7e461ef07d0808c5b6d2f85515) Thanks [@konojunya](https://github.com/konojunya)! - Add zerion to useInstalledWallets

- [#1269](https://github.com/thirdweb-dev/js/pull/1269) [`998e5217`](https://github.com/thirdweb-dev/js/commit/998e521733efd6a67e42f9bf0beab5fbdccf08ae) Thanks [@MananTank](https://github.com/MananTank)! - - Expose `advancedOptions` and `styles` for paper wallet
  - Allow using "+" in paper email
  - Allow using "+" in magic email
  - Update Paper SDK version
- Updated dependencies [[`2b113539`](https://github.com/thirdweb-dev/js/commit/2b113539098384f910b3c4d54e1fde9d35a6f053), [`c9535715`](https://github.com/thirdweb-dev/js/commit/c95357158819abd42d4b0900ecc2fa40fcb957f8), [`be606dd3`](https://github.com/thirdweb-dev/js/commit/be606dd3c93c1514834c1d970e864d7f949a07ab), [`edcd22d6`](https://github.com/thirdweb-dev/js/commit/edcd22d61236edb2832f9b2f9796e891d58cb145), [`5882091e`](https://github.com/thirdweb-dev/js/commit/5882091eab65978009a5a5305701f121851b10ad), [`998e5217`](https://github.com/thirdweb-dev/js/commit/998e521733efd6a67e42f9bf0beab5fbdccf08ae)]:
  - @thirdweb-dev/wallets@1.0.3
  - @thirdweb-dev/sdk@3.10.27
  - @thirdweb-dev/react-core@3.14.7
  - @thirdweb-dev/chains@0.1.26

## 3.14.6

### Patch Changes

- Updated dependencies [[`ed711c8c`](https://github.com/thirdweb-dev/js/commit/ed711c8cb2ed6a0deb1b2a5eeec06df1d4edc5e8), [`05a7495a`](https://github.com/thirdweb-dev/js/commit/05a7495a132aabab5f48abbdb80a468ff6f65df8), [`e78da6b3`](https://github.com/thirdweb-dev/js/commit/e78da6b36cfa6d954234820563201bf760186ed1)]:
  - @thirdweb-dev/wallets@1.0.2
  - @thirdweb-dev/react-core@3.14.6

## 3.14.5

### Patch Changes

- Updated dependencies [[`efb3546e`](https://github.com/thirdweb-dev/js/commit/efb3546ec8268156be00301af28b9d83ecd5ab08)]:
  - @thirdweb-dev/wallets@1.0.1
  - @thirdweb-dev/react-core@3.14.5

## 3.14.4

### Patch Changes

- [#1215](https://github.com/thirdweb-dev/js/pull/1215) [`3c5dc480`](https://github.com/thirdweb-dev/js/commit/3c5dc4804abc56b933ec45e9e1da11eb182296cc) Thanks [@iketw](https://github.com/iketw)! - Migrate wallets to WCV2 and remove WCV1 support.

  Please, check our changelogs for more info: https://blog.thirdweb.com/changelog/

- Updated dependencies [[`ef4cb092`](https://github.com/thirdweb-dev/js/commit/ef4cb092192c58c9b292b29590b888f45f9fd23d), [`06ca1c40`](https://github.com/thirdweb-dev/js/commit/06ca1c407dfee9d3d1fdaed1b6223ad0f9b8857b), [`620e89dc`](https://github.com/thirdweb-dev/js/commit/620e89dc25c91557e2164a602c7aedd733525087), [`ac3e019c`](https://github.com/thirdweb-dev/js/commit/ac3e019cd1776dbdb0d06b213420ad17586f678e), [`30ac3aef`](https://github.com/thirdweb-dev/js/commit/30ac3aef840bde51a61acf786c709cffd3c47354), [`3c5dc480`](https://github.com/thirdweb-dev/js/commit/3c5dc4804abc56b933ec45e9e1da11eb182296cc), [`ad7dae3b`](https://github.com/thirdweb-dev/js/commit/ad7dae3b163e61c7a6eb57f654885a7fdaa4cbb6), [`620e89dc`](https://github.com/thirdweb-dev/js/commit/620e89dc25c91557e2164a602c7aedd733525087), [`0fd8aa04`](https://github.com/thirdweb-dev/js/commit/0fd8aa04a9424497758d13a51a72363edcc30e19)]:
  - @thirdweb-dev/sdk@3.10.26
  - @thirdweb-dev/react-core@3.14.4
  - @thirdweb-dev/wallets@1.0.0
  - @thirdweb-dev/chains@0.1.25

## 3.14.3

### Patch Changes

- [#1238](https://github.com/thirdweb-dev/js/pull/1238) [`6e1fe6e5`](https://github.com/thirdweb-dev/js/commit/6e1fe6e582d4178884fc1793b330a9e477df5b4d) Thanks [@iketw](https://github.com/iketw)! - '[React] Adds Rainbow and Trust wallets hooks'

  ```javascript
  import { useRainbowWallet, useTrustWallet } from "@thirdweb-dev/react";

  const connectWithRainbow = useRainbowWallet();

  const connectWithTrust = useTrustWallet();
  ```

- [#1237](https://github.com/thirdweb-dev/js/pull/1237) [`536b0f12`](https://github.com/thirdweb-dev/js/commit/536b0f1240ab446aac22cf547a4e09e73ee6bf7b) Thanks [@iketw](https://github.com/iketw)! - [React] Add Rainbow Wallet (implementing the WalletConnect wallet)

  ```javascript
  import { ThirdwebProvider, rainbowWallet } from "@thirdweb-dev/react";

  const activeChain = "ethereum";

  <ThirdwebProvider
    activeChain={activeChain}
    supportedWallets={[rainbowWallet()]}
  >
    <App />
  </ThirdwebProvider>;
  ```

- [#1236](https://github.com/thirdweb-dev/js/pull/1236) [`b626782b`](https://github.com/thirdweb-dev/js/commit/b626782b0e8c6b76673472d3aee1c802dfb11b5f) Thanks [@iketw](https://github.com/iketw)! - [Wallets/React] Add Trust Wallet

  ```javascript
  import { ThirdwebProvider, trustWallet } from "@thirdweb-dev/react";

  const activeChain = "mumbai";

  <ThirdwebProvider
    activeChain={activeChain}
    autoSwitch={true}
    supportedWallets={[trustWallet()]}
  >
    <App />
  </ThirdwebProvider>;
  ```

- Updated dependencies [[`536b0f12`](https://github.com/thirdweb-dev/js/commit/536b0f1240ab446aac22cf547a4e09e73ee6bf7b), [`1d76334d`](https://github.com/thirdweb-dev/js/commit/1d76334dd3884703629835422f241d2825128f6f), [`b626782b`](https://github.com/thirdweb-dev/js/commit/b626782b0e8c6b76673472d3aee1c802dfb11b5f), [`d498c79a`](https://github.com/thirdweb-dev/js/commit/d498c79a911d478077dfb8a2490eb1bf91523186), [`9af346ee`](https://github.com/thirdweb-dev/js/commit/9af346eeada1037be27c8d3c9e1777f7be11a8ea)]:
  - @thirdweb-dev/wallets@0.3.3
  - @thirdweb-dev/react-core@3.14.3
  - @thirdweb-dev/sdk@3.10.25
  - @thirdweb-dev/chains@0.1.24

## 3.14.2

### Patch Changes

- [#1226](https://github.com/thirdweb-dev/js/pull/1226) [`a388d07a`](https://github.com/thirdweb-dev/js/commit/a388d07a3d449e56dc53fed9600931022f4a15e1) Thanks [@MananTank](https://github.com/MananTank)! - Add Magic Connect support

- Updated dependencies [[`6816219a`](https://github.com/thirdweb-dev/js/commit/6816219ac13ae571a0c90db6ab389c319bc1f052), [`48065bcd`](https://github.com/thirdweb-dev/js/commit/48065bcd91c13e1f44d54343b5c6c2646b9e86e4), [`3cb298ac`](https://github.com/thirdweb-dev/js/commit/3cb298ac4b04d295899b5ac77c7fc5869ec2f5f2), [`b5e1d3bb`](https://github.com/thirdweb-dev/js/commit/b5e1d3bb2b82785d6d3e5c899d27691bdb638625), [`6aa6f7e0`](https://github.com/thirdweb-dev/js/commit/6aa6f7e0bd2313e2e1ad96dd41aad91e6694d380), [`f7f4f207`](https://github.com/thirdweb-dev/js/commit/f7f4f20737ac5d78424ca9c91220f00b85adde6b), [`3ce5f9a0`](https://github.com/thirdweb-dev/js/commit/3ce5f9a0c3fc7e99b5abf691a87048ab8475f6b1), [`d4d95507`](https://github.com/thirdweb-dev/js/commit/d4d95507130b2b5408bfaa73ef3b708ca00c773e), [`a388d07a`](https://github.com/thirdweb-dev/js/commit/a388d07a3d449e56dc53fed9600931022f4a15e1), [`1ce8558d`](https://github.com/thirdweb-dev/js/commit/1ce8558df47186bcba5ee8564fdb04583bf115dd), [`483e2b91`](https://github.com/thirdweb-dev/js/commit/483e2b910934d75276a68bae64d04c47cd7d57e3), [`c08e6ba9`](https://github.com/thirdweb-dev/js/commit/c08e6ba988ad97aa27d5868cec8abe3498d07a0a), [`60fb1889`](https://github.com/thirdweb-dev/js/commit/60fb18894372f14d9cd815fa9a239926d31bb273), [`3d615a62`](https://github.com/thirdweb-dev/js/commit/3d615a62d0a6801f6fb0e63f9b95c2f98446add1)]:
  - @thirdweb-dev/chains@0.1.23
  - @thirdweb-dev/sdk@3.10.24
  - @thirdweb-dev/wallets@0.3.2
  - @thirdweb-dev/react-core@3.14.2

## 3.14.1

### Patch Changes

- [#1206](https://github.com/thirdweb-dev/js/pull/1206) [`3d62278a`](https://github.com/thirdweb-dev/js/commit/3d62278aba79101ae1158fb726d6ddfed505c939) Thanks [@MananTank](https://github.com/MananTank)! - Add eslint-plugin-better-tree-shaking

- Updated dependencies [[`d9b7360d`](https://github.com/thirdweb-dev/js/commit/d9b7360d1d78abcdaca89aa35e66388cbc5eb26c), [`8a2d9204`](https://github.com/thirdweb-dev/js/commit/8a2d92046a416c99c6bfecf63a6fdb6cc02ea175), [`990c665d`](https://github.com/thirdweb-dev/js/commit/990c665de9e5c1070dc80fe0f1b434e251f70a94), [`3d62278a`](https://github.com/thirdweb-dev/js/commit/3d62278aba79101ae1158fb726d6ddfed505c939), [`c6f44722`](https://github.com/thirdweb-dev/js/commit/c6f44722f9d123db4e7c4c799fe8e0374a02107c), [`45ae105e`](https://github.com/thirdweb-dev/js/commit/45ae105ed3e48bfbf6be84aa12ecb0fb55a917b7), [`f41f1a29`](https://github.com/thirdweb-dev/js/commit/f41f1a2958a2cedcf0496c9a3ca284d0b98f1b89), [`bb7ca20e`](https://github.com/thirdweb-dev/js/commit/bb7ca20e49c5c374b12a4ed746a2ac3db488abd9), [`23d61cfe`](https://github.com/thirdweb-dev/js/commit/23d61cfeff2e5a885c511416d7491e7933ed404a), [`8941b226`](https://github.com/thirdweb-dev/js/commit/8941b22682d1b15a6e0d311b1e8548b95d6cfadf), [`e0ce4a37`](https://github.com/thirdweb-dev/js/commit/e0ce4a37596a91a072f8551e323fce6723113dcb)]:
  - @thirdweb-dev/sdk@3.10.23
  - @thirdweb-dev/react-core@3.14.1
  - @thirdweb-dev/wallets@0.3.1
  - @thirdweb-dev/chains@0.1.22

## 3.14.0

### Minor Changes

- [#1160](https://github.com/thirdweb-dev/js/pull/1160) [`654b8ab3`](https://github.com/thirdweb-dev/js/commit/654b8ab35184e02127a5a47f05d78606dd5b29ca) Thanks [@zerts](https://github.com/zerts)! - Add Zerion Wallet

### Patch Changes

- [#1000](https://github.com/thirdweb-dev/js/pull/1000) [`329bccec`](https://github.com/thirdweb-dev/js/commit/329bccec4b88b02db5bac6c1415158928843376a) Thanks [@goosewobbler](https://github.com/goosewobbler)! - '[Wallets/React] Adds Frame as a supported wallet.'

  You can now use Frame by adding `frameWallet()` in the ThirdwebProvider's `supportedWallets` prop.

  ```javascript
  import {
    ThirdwebProvider,
    localWallet,
    frameWallet,
  } from "@thirdweb-dev/react";

  <ThirdwebProvider
    activeChain={activeChain}
    supportedWallets={[frameWallet(), localWallet()]}
  >
    <App />
  </ThirdwebProvider>;
  ```

- [#1172](https://github.com/thirdweb-dev/js/pull/1172) [`ecdcf82c`](https://github.com/thirdweb-dev/js/commit/ecdcf82cf3ad4090b7c9da97a1a13e4987425b38) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add data-test to passworrd inputs

- [#1164](https://github.com/thirdweb-dev/js/pull/1164) [`a5578abf`](https://github.com/thirdweb-dev/js/commit/a5578abf664349bc608f3dcd9404ba103f7d8d43) Thanks [@kienngo98](https://github.com/kienngo98)! - reduce circular dependencies

- Updated dependencies [[`cc20f93e`](https://github.com/thirdweb-dev/js/commit/cc20f93e178d86ee2b3f39102bbb0811de211f05), [`08403dd9`](https://github.com/thirdweb-dev/js/commit/08403dd9da7284054173aaba6ef06ac39f560c08), [`654b8ab3`](https://github.com/thirdweb-dev/js/commit/654b8ab35184e02127a5a47f05d78606dd5b29ca), [`a430160e`](https://github.com/thirdweb-dev/js/commit/a430160e6b4771c03d97f6ede91f1aeaa043e50e), [`12b07aad`](https://github.com/thirdweb-dev/js/commit/12b07aad9ae3176daf9d05864247d4806a16c9d2), [`d60e544a`](https://github.com/thirdweb-dev/js/commit/d60e544a240b93312743e62096ee2dc77d0c1bd1), [`7d2a446e`](https://github.com/thirdweb-dev/js/commit/7d2a446ecef9c6c14959d31e9a66537783b9adac), [`088f2567`](https://github.com/thirdweb-dev/js/commit/088f2567f615360edd44776b20ae0bedff250f43), [`8e28b0f5`](https://github.com/thirdweb-dev/js/commit/8e28b0f5e75596d29273ed80269bcee6d209adb4), [`01293857`](https://github.com/thirdweb-dev/js/commit/01293857fac8531bd94764203cd24b3daa4db51f), [`329bccec`](https://github.com/thirdweb-dev/js/commit/329bccec4b88b02db5bac6c1415158928843376a), [`20bbad1a`](https://github.com/thirdweb-dev/js/commit/20bbad1abcb1ec573318d326b09278492a488abd), [`36f3191f`](https://github.com/thirdweb-dev/js/commit/36f3191f3e8819c878685de8caa393b71be8e65c)]:
  - @thirdweb-dev/chains@0.1.21
  - @thirdweb-dev/react-core@3.14.0
  - @thirdweb-dev/wallets@0.3.0
  - @thirdweb-dev/sdk@3.10.22

## 3.13.1

### Patch Changes

- [#1151](https://github.com/thirdweb-dev/js/pull/1151) [`2a0294d8`](https://github.com/thirdweb-dev/js/commit/2a0294d8e67bbc08dcf59c79174a7626deb0e90a) Thanks [@MananTank](https://github.com/MananTank)! - Fix wrong balance in ConnectWallet

- [#1149](https://github.com/thirdweb-dev/js/pull/1149) [`65ecf072`](https://github.com/thirdweb-dev/js/commit/65ecf072eb810eaf850c0af94f3db5af51de8a28) Thanks [@MananTank](https://github.com/MananTank)! - Improve rendering of long network list in ConnectWallet Modal

- [#1144](https://github.com/thirdweb-dev/js/pull/1144) [`9ce3eb6a`](https://github.com/thirdweb-dev/js/commit/9ce3eb6aad957aff38fb4a25383ed17ff58e988f) Thanks [@MananTank](https://github.com/MananTank)! - Remove WalletConfig.config object from wallets

- Updated dependencies [[`2a443365`](https://github.com/thirdweb-dev/js/commit/2a443365bdc3d47d0f41fc895f70256dcde423f5), [`3bf7f375`](https://github.com/thirdweb-dev/js/commit/3bf7f375933cbd7dd8c682a66e8c67bbcb268bf7), [`6a194262`](https://github.com/thirdweb-dev/js/commit/6a19426200297b8da158c7d860d31efcc8c15822), [`16232de9`](https://github.com/thirdweb-dev/js/commit/16232de9eab9966e24e335929b2a3919346af265), [`54cfd6d8`](https://github.com/thirdweb-dev/js/commit/54cfd6d8916c42d87b6aa438e607ce525766b686), [`8687d6ac`](https://github.com/thirdweb-dev/js/commit/8687d6ac3a363eae63eeb1959a953cbcd282d353), [`645b0303`](https://github.com/thirdweb-dev/js/commit/645b0303cc1a9cbb0a0e9cbd67d11c3b865e4584), [`522453fd`](https://github.com/thirdweb-dev/js/commit/522453fd568b8c350141a96f9f1c6d5a3ef74493), [`9a015a23`](https://github.com/thirdweb-dev/js/commit/9a015a23cde09c8ba6c36593a84303ffe409a79a), [`6803c3e9`](https://github.com/thirdweb-dev/js/commit/6803c3e97ca74eed19cd90095afde25b02150d51), [`0cba69ca`](https://github.com/thirdweb-dev/js/commit/0cba69ca40a8cf6f106344247d0082212cd169da), [`56f85e57`](https://github.com/thirdweb-dev/js/commit/56f85e57df84bfa93e3230639c95d12466f8aec7), [`197a6838`](https://github.com/thirdweb-dev/js/commit/197a6838f69ae8b9ad46524e7c469fc757d0a2cb), [`6a91b6a0`](https://github.com/thirdweb-dev/js/commit/6a91b6a0253bab5914d4ebdad951dd1c5d141fbc), [`e32faeb5`](https://github.com/thirdweb-dev/js/commit/e32faeb57a5c2193c40cb6129fab92b84069b12d), [`a5f16b6d`](https://github.com/thirdweb-dev/js/commit/a5f16b6dc50b37920a6e5210b60aa6a1682ceb63), [`b6728603`](https://github.com/thirdweb-dev/js/commit/b6728603972ccd6c95108b25e8562807f0f95e19), [`ed47fd53`](https://github.com/thirdweb-dev/js/commit/ed47fd5310d11323080d984bca18a96fdef3a977), [`9ce3eb6a`](https://github.com/thirdweb-dev/js/commit/9ce3eb6aad957aff38fb4a25383ed17ff58e988f)]:
  - @thirdweb-dev/wallets@0.2.26
  - @thirdweb-dev/sdk@3.10.21
  - @thirdweb-dev/react-core@3.13.1
  - @thirdweb-dev/chains@0.1.20

## 3.13.0

### Patch Changes

- [#1115](https://github.com/thirdweb-dev/js/pull/1115) [`b4c95159`](https://github.com/thirdweb-dev/js/commit/b4c95159377dfaa27b4b9625bc9a828b799d0005) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add hooks for smart wallet factory

- [#1116](https://github.com/thirdweb-dev/js/pull/1116) [`356f7aa6`](https://github.com/thirdweb-dev/js/commit/356f7aa6430003bbe8edf9a526bcee77ad5c21ee) Thanks [@MananTank](https://github.com/MananTank)! - - Fix Local wallet connection issue with Safe & Smart Wallet

  - Fix Metamask QR connection issue with Safe & Smart Wallet

- [#1118](https://github.com/thirdweb-dev/js/pull/1118) [`9b20fc9a`](https://github.com/thirdweb-dev/js/commit/9b20fc9ad2d303edc31f44fbd2ea3b4dcf35d11e) Thanks [@MananTank](https://github.com/MananTank)! - - Remove chain restriction in paper wallet

  - Fix Email validation in Paper and Magic wallet

- [#1114](https://github.com/thirdweb-dev/js/pull/1114) [`2283e71a`](https://github.com/thirdweb-dev/js/commit/2283e71acaaf3d15eb2d6121682f1d2a81eec4f3) Thanks [@adam-maj](https://github.com/adam-maj)! - Update ConnectWallet button with new auth

- Updated dependencies [[`ce36322b`](https://github.com/thirdweb-dev/js/commit/ce36322b383af73905894b73f9409a146359ffb0), [`c60658ed`](https://github.com/thirdweb-dev/js/commit/c60658ed8c94867cca831b0d5535006da5b40aa6), [`aa9e952c`](https://github.com/thirdweb-dev/js/commit/aa9e952cb519a47ed112d2905b1f3787863035b6), [`564eaccf`](https://github.com/thirdweb-dev/js/commit/564eaccf480a81f36db43c782392595a5021e5ac), [`6aee0413`](https://github.com/thirdweb-dev/js/commit/6aee0413439b9ca408879bbb3c38c538c89d01af), [`21627c03`](https://github.com/thirdweb-dev/js/commit/21627c03d1bb1658fee19b12d580faa6c7f048d9), [`2283e71a`](https://github.com/thirdweb-dev/js/commit/2283e71acaaf3d15eb2d6121682f1d2a81eec4f3), [`e93aa70e`](https://github.com/thirdweb-dev/js/commit/e93aa70ef0093a2526404e11b7ddae8fb98c213b), [`51bbd3d1`](https://github.com/thirdweb-dev/js/commit/51bbd3d1bccbb92a1405ea50f6c178c091a90f20), [`9b20fc9a`](https://github.com/thirdweb-dev/js/commit/9b20fc9ad2d303edc31f44fbd2ea3b4dcf35d11e)]:
  - @thirdweb-dev/sdk@3.10.20
  - @thirdweb-dev/react-core@3.13.0
  - @thirdweb-dev/wallets@0.2.25

## 3.12.4

### Patch Changes

- Updated dependencies [[`23d90b3e`](https://github.com/thirdweb-dev/js/commit/23d90b3e779a5bfdb7058b8c51349d9c278fcbce), [`cc56037e`](https://github.com/thirdweb-dev/js/commit/cc56037e64560b9e0fc16eb0ac7cc2e47e2c9fdf)]:
  - @thirdweb-dev/sdk@3.10.19
  - @thirdweb-dev/react-core@3.12.4
  - @thirdweb-dev/wallets@0.2.24

## 3.12.3

### Patch Changes

- [#1068](https://github.com/thirdweb-dev/js/pull/1068) [`fd7111d5`](https://github.com/thirdweb-dev/js/commit/fd7111d5449b8315d326c308a021eed335446e19) Thanks [@MananTank](https://github.com/MananTank)! - add `theme` in `WalletConfig.selectUI` to allow creating selection UI that follows the theme of the wallet Modal

- [#1084](https://github.com/thirdweb-dev/js/pull/1084) [`74f898ac`](https://github.com/thirdweb-dev/js/commit/74f898ac2830c532907626f70509820e30304855) Thanks [@MananTank](https://github.com/MananTank)! - Fix Local Wallet Backup throwing error when wallet is not connected

- [#1078](https://github.com/thirdweb-dev/js/pull/1078) [`f5ae61ae`](https://github.com/thirdweb-dev/js/commit/f5ae61aebaa152485b92b6adf60765a7eaf5dbf0) Thanks [@MananTank](https://github.com/MananTank)! - Fixes the issue of Magic Link's "Switch Network" not working with Smart Wallet and Safe

- [#1067](https://github.com/thirdweb-dev/js/pull/1067) [`e21bdd03`](https://github.com/thirdweb-dev/js/commit/e21bdd0328d9c52d58295aa4012fc11cde83b60a) Thanks [@MananTank](https://github.com/MananTank)! - Fix `usePaperWallet` hook's type definition

- Updated dependencies [[`2f1df0b5`](https://github.com/thirdweb-dev/js/commit/2f1df0b5354a8ee55089b2c1e61c058788d890f1), [`189daf02`](https://github.com/thirdweb-dev/js/commit/189daf0280a90ed730200088948526a594da3408), [`afae0873`](https://github.com/thirdweb-dev/js/commit/afae0873b0e3f9741f5a9c44c5d255f38c6a9111), [`bba9767a`](https://github.com/thirdweb-dev/js/commit/bba9767adfe20e41055450b86e4448fcb2119855), [`c6e74ef0`](https://github.com/thirdweb-dev/js/commit/c6e74ef0b00210f52e6778c548061376d3ba7001), [`fd7111d5`](https://github.com/thirdweb-dev/js/commit/fd7111d5449b8315d326c308a021eed335446e19), [`ee4c7de2`](https://github.com/thirdweb-dev/js/commit/ee4c7de25cb63f99f33b90da8e26293bbfbe6f3e), [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a), [`68fa1896`](https://github.com/thirdweb-dev/js/commit/68fa1896f75d3514e00cc380924fd8bc623064f0), [`e21bdd03`](https://github.com/thirdweb-dev/js/commit/e21bdd0328d9c52d58295aa4012fc11cde83b60a), [`f7b352a5`](https://github.com/thirdweb-dev/js/commit/f7b352a585a23726eaa3be116f65db56b005f4d8), [`4a1d7581`](https://github.com/thirdweb-dev/js/commit/4a1d75811058d6974616bdc12a6040cea5444e40), [`bdabbef7`](https://github.com/thirdweb-dev/js/commit/bdabbef71a2421a2dceb384f93bb6a59a3ddf007), [`59206233`](https://github.com/thirdweb-dev/js/commit/59206233e15ccfe3dc32047060055219d35938f2), [`292a321a`](https://github.com/thirdweb-dev/js/commit/292a321a95ed2d847097eed205353dd69eeb8d54), [`98efd090`](https://github.com/thirdweb-dev/js/commit/98efd090f63cfd9dfed7b89b20b6e43db88cf75c), [`8eecf4c2`](https://github.com/thirdweb-dev/js/commit/8eecf4c2d5b0d6447ad5b9cdbf0269818bbb3498), [`bd86661f`](https://github.com/thirdweb-dev/js/commit/bd86661f54ca2f1eb09cbae35c704dc79be1b63a), [`f3b2ae3f`](https://github.com/thirdweb-dev/js/commit/f3b2ae3f6d9c66356c521d3b9c2a6c096dbb4b57), [`d5651006`](https://github.com/thirdweb-dev/js/commit/d565100614d7d4e256554f998b8ce978a566051c), [`4f99ccb4`](https://github.com/thirdweb-dev/js/commit/4f99ccb49c584946de709fbc01017611d2828b76), [`da576108`](https://github.com/thirdweb-dev/js/commit/da5761080288c3b325f54fb56c80f96405a1cb5d), [`c85810ee`](https://github.com/thirdweb-dev/js/commit/c85810eee318b10eee4ada61828adaa51f94ea6c), [`6fd10f94`](https://github.com/thirdweb-dev/js/commit/6fd10f94b469dc5659e2ff4ce92a5aff86f3c89d), [`5f1e6abb`](https://github.com/thirdweb-dev/js/commit/5f1e6abb391f5c58dbdb207f569b3dd0b5d4729c), [`a034b032`](https://github.com/thirdweb-dev/js/commit/a034b0321fd0113ed51d95d538b5c3020615c227), [`35984362`](https://github.com/thirdweb-dev/js/commit/35984362b0a60e5b9c3d3c9731450a8f47deb1c4)]:
  - @thirdweb-dev/sdk@3.10.18
  - @thirdweb-dev/wallets@0.2.23
  - @thirdweb-dev/react-core@3.12.3
  - @thirdweb-dev/chains@0.1.19

## 3.12.2

### Patch Changes

- Updated dependencies [[`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c), [`30e5593d`](https://github.com/thirdweb-dev/js/commit/30e5593dd1ce9abd809ad216a1cfce77b897093c)]:
  - @thirdweb-dev/wallets@0.2.22
  - @thirdweb-dev/chains@0.1.18
  - @thirdweb-dev/react-core@3.12.2
  - @thirdweb-dev/sdk@3.10.17

## 3.12.1

### Patch Changes

- [#1030](https://github.com/thirdweb-dev/js/pull/1030) [`61212d27`](https://github.com/thirdweb-dev/js/commit/61212d27d7203112a0278893cb67ec94a20408c7) Thanks [@adam-maj](https://github.com/adam-maj)! - Add ability to configure gatewayUrl and pull gatewayUrl from storage in MediaRenderer

- Updated dependencies [[`b6f48e10`](https://github.com/thirdweb-dev/js/commit/b6f48e1088b5d36a51103de4afda53179029faaf), [`d5123044`](https://github.com/thirdweb-dev/js/commit/d51230441a097734be092c42b45dea07629e65fa), [`3c8c5d56`](https://github.com/thirdweb-dev/js/commit/3c8c5d56f2a21c0918fede71061c6745f2956f83), [`907d97be`](https://github.com/thirdweb-dev/js/commit/907d97bedef7331148bdfe8b9bf1e19459282e4c)]:
  - @thirdweb-dev/wallets@0.2.21
  - @thirdweb-dev/react-core@3.12.1
  - @thirdweb-dev/chains@0.1.17
  - @thirdweb-dev/sdk@3.10.16

## 3.12.0

### Minor Changes

- [#993](https://github.com/thirdweb-dev/js/pull/993) [`b1ede491`](https://github.com/thirdweb-dev/js/commit/b1ede491fbfbeca0ff3d6f5a6162546671bf8b99) Thanks [@0xfrosty](https://github.com/0xfrosty)! - Add React hook useBuyDirectListing() to buy a direct listing in a MarketplaceV3 contract

### Patch Changes

- [#1001](https://github.com/thirdweb-dev/js/pull/1001) [`2b0fb9d2`](https://github.com/thirdweb-dev/js/commit/2b0fb9d22f8590603379b799c8431416a16086f9) Thanks [@MananTank](https://github.com/MananTank)! - Fix Flaky coinbase QR code scan

- [#1015](https://github.com/thirdweb-dev/js/pull/1015) [`39bd9630`](https://github.com/thirdweb-dev/js/commit/39bd963015ac00a1e4da2d0b4c9d85b334c7ad46) Thanks [@MananTank](https://github.com/MananTank)! - - add `selectUI` api in `WalletConfig` to allow rendering a custom UI for selecting a wallet

  - Render an input for paper wallet and magic link using `selectUI` api
  - add prop `modalTitle` on `ConnectWallet` to configure a custom title for the modal
  - add props `selectionData`, `setSelectionData` and `supportedWallets` on `connectUI`

- [#996](https://github.com/thirdweb-dev/js/pull/996) [`c3645c45`](https://github.com/thirdweb-dev/js/commit/c3645c451b5e9a0fcf651fa07eb0e31ebf1882ca) Thanks [@MananTank](https://github.com/MananTank)! - - add `theme` in `ConfiguredWallet.connectUI`'s props - to use theme aware UI for wallets

  - add `useWalletConfig` hook to get the `ConfiguredWallet` object for active wallet
  - add hooks `useSetConnectedWallet`, `useSetConnectionStatus`
  - rename `useActiveChain` to `useChain` - keep the `useActiveChain` also with deprecated tag
  - make `useSafe` hook await-able by returning the promise of connect() call
  - add hook `useSmartWallet`
  - allow rendering custom wallet details button via `<ConnectWallet detailsButton={} />` prop
  - Rename "Export" to "Backup" in local wallet UI

- [#1011](https://github.com/thirdweb-dev/js/pull/1011) [`470e0a14`](https://github.com/thirdweb-dev/js/commit/470e0a144db6aa03e7789e231bbdfae43144f0e0) Thanks [@MananTank](https://github.com/MananTank)! - rename ConfiguredWallet to WalletConfig

  ```diff
  - import { ConfiguredWallet } from '@thirdweb-dev/react';
  + import { WalletConfig } from '@thirdweb-dev/react';
  ```

- [#1022](https://github.com/thirdweb-dev/js/pull/1022) [`738c0ec6`](https://github.com/thirdweb-dev/js/commit/738c0ec6c4190aa2252233c1382aed5d982cc7b8) Thanks [@mmeigooni](https://github.com/mmeigooni)! - Update Paper SDK version

- [#1002](https://github.com/thirdweb-dev/js/pull/1002) [`d495a4b8`](https://github.com/thirdweb-dev/js/commit/d495a4b8a6e0599e5b4611620f3fded80a411173) Thanks [@MananTank](https://github.com/MananTank)! - Expose Web3Modal QRModalOptions in WalletConnect V2

- [#989](https://github.com/thirdweb-dev/js/pull/989) [`8db78299`](https://github.com/thirdweb-dev/js/commit/8db78299ea6cfb51d93b91bb1a351644a83c73d2) Thanks [@iketw](https://github.com/iketw)! - [React/ReactNative] Updated useThirdwebWallet to useWalletContext

- [#998](https://github.com/thirdweb-dev/js/pull/998) [`4f843833`](https://github.com/thirdweb-dev/js/commit/4f8438335e3e3731b67ae271cb34c383832242a0) Thanks [@MananTank](https://github.com/MananTank)! - - skip wallet-selector screen if there's a single wallet
  - Fix "Can't close Safe screen" issue
  - Fix magicSdkConfiguration type
- Updated dependencies [[`e9b69300`](https://github.com/thirdweb-dev/js/commit/e9b69300d15b233609f1ed897256ec9a1eef3e28), [`39bd9630`](https://github.com/thirdweb-dev/js/commit/39bd963015ac00a1e4da2d0b4c9d85b334c7ad46), [`49ec2d17`](https://github.com/thirdweb-dev/js/commit/49ec2d171ecb1c9240398b7b486a452eb9429979), [`799d98e8`](https://github.com/thirdweb-dev/js/commit/799d98e86258677ab72931fa8397aee653fe8b34), [`c3645c45`](https://github.com/thirdweb-dev/js/commit/c3645c451b5e9a0fcf651fa07eb0e31ebf1882ca), [`470e0a14`](https://github.com/thirdweb-dev/js/commit/470e0a144db6aa03e7789e231bbdfae43144f0e0), [`b1ede491`](https://github.com/thirdweb-dev/js/commit/b1ede491fbfbeca0ff3d6f5a6162546671bf8b99), [`738c0ec6`](https://github.com/thirdweb-dev/js/commit/738c0ec6c4190aa2252233c1382aed5d982cc7b8), [`d495a4b8`](https://github.com/thirdweb-dev/js/commit/d495a4b8a6e0599e5b4611620f3fded80a411173), [`482f6d1b`](https://github.com/thirdweb-dev/js/commit/482f6d1b58ac99b331fc750d3eeb6082556fd526), [`e4356e76`](https://github.com/thirdweb-dev/js/commit/e4356e76d1506624afe2eb6feeaf57dc376f372f), [`9886c858`](https://github.com/thirdweb-dev/js/commit/9886c858d9c8d0f677aba6572dbf5cc6c876edf2), [`8db78299`](https://github.com/thirdweb-dev/js/commit/8db78299ea6cfb51d93b91bb1a351644a83c73d2), [`4f843833`](https://github.com/thirdweb-dev/js/commit/4f8438335e3e3731b67ae271cb34c383832242a0)]:
  - @thirdweb-dev/sdk@3.10.15
  - @thirdweb-dev/react-core@3.12.0
  - @thirdweb-dev/chains@0.1.16
  - @thirdweb-dev/wallets@0.2.20

## 3.11.11

### Patch Changes

- Updated dependencies [[`32908b76`](https://github.com/thirdweb-dev/js/commit/32908b76832c60e91a0a6e40dbdb1c8f56e9e5be), [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff), [`6a4aab0b`](https://github.com/thirdweb-dev/js/commit/6a4aab0b8a2e0f6ff1b47992a3c1e5426a74f7ff)]:
  - @thirdweb-dev/sdk@3.10.14
  - @thirdweb-dev/wallets@0.2.19
  - @thirdweb-dev/chains@0.1.15
  - @thirdweb-dev/react-core@3.11.11

## 3.11.10

### Patch Changes

- [#967](https://github.com/thirdweb-dev/js/pull/967) [`7d7685e3`](https://github.com/thirdweb-dev/js/commit/7d7685e3fab5780b3c1d26b8ef431b96f8486972) Thanks [@MananTank](https://github.com/MananTank)! - - Fix type of connect() for magic wallet

  - enforce smsLogin, emailLogin restriction for magic wallet
  - update the icon for local wallet

- [#966](https://github.com/thirdweb-dev/js/pull/966) [`87021cee`](https://github.com/thirdweb-dev/js/commit/87021cee45e81a6504e4e2279e6d2abb10cab8ec) Thanks [@MananTank](https://github.com/MananTank)! - Connect Wallet UI improvements

  - Allow from EOA => smart wallet / safe
  - Add warning to backup wallet for guest wallet
  - Show "Guest" instead of address for guest wallet

- [#977](https://github.com/thirdweb-dev/js/pull/977) [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf) Thanks [@MananTank](https://github.com/MananTank)! - Fix Connect Wallet Open/Close issues

- Updated dependencies [[`93bdec06`](https://github.com/thirdweb-dev/js/commit/93bdec061dc05ab133e79f5f739dcae9b5393f53), [`ea0f9479`](https://github.com/thirdweb-dev/js/commit/ea0f9479a38d442201e367fce1234c130228fde6), [`05ebbc15`](https://github.com/thirdweb-dev/js/commit/05ebbc15a012855735fba2aa93887b88e14295d1), [`5305b42d`](https://github.com/thirdweb-dev/js/commit/5305b42db554b69f903b3d95f3ba0eeddabd6114), [`4ca557ae`](https://github.com/thirdweb-dev/js/commit/4ca557ae4ab225e39decc3b7a01a04c0d8e464c7), [`7d7685e3`](https://github.com/thirdweb-dev/js/commit/7d7685e3fab5780b3c1d26b8ef431b96f8486972), [`87021cee`](https://github.com/thirdweb-dev/js/commit/87021cee45e81a6504e4e2279e6d2abb10cab8ec), [`eb521d24`](https://github.com/thirdweb-dev/js/commit/eb521d240ae7102d44fe2c5223b0a18d867e09ad), [`af4b5356`](https://github.com/thirdweb-dev/js/commit/af4b5356372ffa084c8d0e747d8def46c2ff892c), [`93bd5733`](https://github.com/thirdweb-dev/js/commit/93bd57337b7d2c2fcd252987d10df3206c839daf), [`a2df187b`](https://github.com/thirdweb-dev/js/commit/a2df187bc1867beb2e90853da70dac271f604f12), [`aa9b6acc`](https://github.com/thirdweb-dev/js/commit/aa9b6acc3f5a118c2b5fe9e46732e72c0fc69376)]:
  - @thirdweb-dev/wallets@0.2.18
  - @thirdweb-dev/react-core@3.11.10
  - @thirdweb-dev/chains@0.1.14
  - @thirdweb-dev/sdk@3.10.13

## 3.11.9

### Patch Changes

- [#941](https://github.com/thirdweb-dev/js/pull/941) [`5d67b280`](https://github.com/thirdweb-dev/js/commit/5d67b2807f2504add4c202d2eb18897415662fb6) Thanks [@MananTank](https://github.com/MananTank)! - Add Magic Link

- [#955](https://github.com/thirdweb-dev/js/pull/955) [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392) Thanks [@MananTank](https://github.com/MananTank)! - Local wallet UI refactor and other fixes

- [#930](https://github.com/thirdweb-dev/js/pull/930) [`e22e4a47`](https://github.com/thirdweb-dev/js/commit/e22e4a47d73e1bbc6e3f0ae7ed56717b44e5ffcd) Thanks [@MananTank](https://github.com/MananTank)! - suggest first supportedWallet for getting started in ConnectWallet

- [#942](https://github.com/thirdweb-dev/js/pull/942) [`1e4ac672`](https://github.com/thirdweb-dev/js/commit/1e4ac672720c2fb01046bec195877a074ffbda06) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Simplify and generalize SmartWallet API

- [#960](https://github.com/thirdweb-dev/js/pull/960) [`5ffb1cba`](https://github.com/thirdweb-dev/js/commit/5ffb1cba038b95bccdcbfc96f398a9ff866333f7) Thanks [@frogeth](https://github.com/frogeth)! - Added a onLogout Function to the connect wallet button

- [#927](https://github.com/thirdweb-dev/js/pull/927) [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa) Thanks [@MananTank](https://github.com/MananTank)! - safe, deviceWallet and smartWallet autoconnect

- [#940](https://github.com/thirdweb-dev/js/pull/940) [`a8b79065`](https://github.com/thirdweb-dev/js/commit/a8b790652ccf37ee2dbac483aae26a43f0f698d8) Thanks [@0xHendrix](https://github.com/0xHendrix)! - Added onLogin callback to ConnectWallet authOptions props

- Updated dependencies [[`7012513b`](https://github.com/thirdweb-dev/js/commit/7012513bc20f283b2cde46c0b938af33fe3a1a20), [`5d67b280`](https://github.com/thirdweb-dev/js/commit/5d67b2807f2504add4c202d2eb18897415662fb6), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`5a67d5d8`](https://github.com/thirdweb-dev/js/commit/5a67d5d89474eac9a638ffaddba139b62965deff), [`d2c7f6d7`](https://github.com/thirdweb-dev/js/commit/d2c7f6d758787fab102ecc0cec16ac74f3c87a1f), [`c7c2530c`](https://github.com/thirdweb-dev/js/commit/c7c2530c7f2ef412f1e40428391e85decf504392), [`f12a80a4`](https://github.com/thirdweb-dev/js/commit/f12a80a4758aa91c43084acedb212de9f36a7371), [`bf6df267`](https://github.com/thirdweb-dev/js/commit/bf6df2671131d7ed38650e2bed806081b32dc244), [`e22e4a47`](https://github.com/thirdweb-dev/js/commit/e22e4a47d73e1bbc6e3f0ae7ed56717b44e5ffcd), [`1e4ac672`](https://github.com/thirdweb-dev/js/commit/1e4ac672720c2fb01046bec195877a074ffbda06), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a), [`4a69f8c8`](https://github.com/thirdweb-dev/js/commit/4a69f8c85dec420615e9eda8d1ad5b5ef0b87713), [`26cd91ff`](https://github.com/thirdweb-dev/js/commit/26cd91ffe18dad37133a18988f21185c13d64cfb), [`8f962bc1`](https://github.com/thirdweb-dev/js/commit/8f962bc15c35da52ed5bc4025bb4cd18b69079e3), [`28b5d1eb`](https://github.com/thirdweb-dev/js/commit/28b5d1eb6d0142d3ebefb8bd078c30949f77fe61), [`0186721b`](https://github.com/thirdweb-dev/js/commit/0186721bc455aa1f8454839a1a25fa4062b45102), [`0bf29745`](https://github.com/thirdweb-dev/js/commit/0bf29745b0e842763c271ad8773312f0836ea00f), [`f0279c22`](https://github.com/thirdweb-dev/js/commit/f0279c228829b86ff1f828219bcef4fe16901f67), [`1e9fad77`](https://github.com/thirdweb-dev/js/commit/1e9fad779f3ebe535d32c0ce76905a3a8033f2fa), [`7af99d9a`](https://github.com/thirdweb-dev/js/commit/7af99d9a6d54492a29a90288a25b30773a8a10a7), [`00d0d01e`](https://github.com/thirdweb-dev/js/commit/00d0d01e619ff5c60b9f31386f51a55b5e466efa), [`fc96e147`](https://github.com/thirdweb-dev/js/commit/fc96e14750175b19cb66fa7d50cdbad65b42153a), [`8cfb4f38`](https://github.com/thirdweb-dev/js/commit/8cfb4f38ed89c26ad04f19d27c65c24cefa976b6)]:
  - @thirdweb-dev/react-core@3.11.9
  - @thirdweb-dev/wallets@0.2.17
  - @thirdweb-dev/chains@0.1.13
  - @thirdweb-dev/sdk@3.10.12

## 3.11.8

### Patch Changes

- [#892](https://github.com/thirdweb-dev/js/pull/892) [`4acb2b55`](https://github.com/thirdweb-dev/js/commit/4acb2b5561118dde5c7372400d4d754b879aef2e) Thanks [@MananTank](https://github.com/MananTank)! - Add Switch Account button for MetaMask

- [#919](https://github.com/thirdweb-dev/js/pull/919) [`81770647`](https://github.com/thirdweb-dev/js/commit/81770647ab2b3b621c663dadd9878ed0ee0da8cb) Thanks [@MananTank](https://github.com/MananTank)! - improved device wallet password input autocomplete

- [#914](https://github.com/thirdweb-dev/js/pull/914) [`ec36df5f`](https://github.com/thirdweb-dev/js/commit/ec36df5f754f35c0c9ee0a3794046f4de46c254d) Thanks [@MananTank](https://github.com/MananTank)! - Add "Request Testnet funds" for LocalHost

- [#895](https://github.com/thirdweb-dev/js/pull/895) [`06cc1df3`](https://github.com/thirdweb-dev/js/commit/06cc1df3b7906584c9e2e69fddc4a2d831c237f9) Thanks [@MananTank](https://github.com/MananTank)! - Fix supportedChains not having the activeChain for wallets

- [#887](https://github.com/thirdweb-dev/js/pull/887) [`430a5f79`](https://github.com/thirdweb-dev/js/commit/430a5f793419173775a434e0b2a21f70223e3813) Thanks [@MananTank](https://github.com/MananTank)! - export Configurable NetworkSelector

- [#918](https://github.com/thirdweb-dev/js/pull/918) [`26644d63`](https://github.com/thirdweb-dev/js/commit/26644d63b5773124d4c6be41be609f27167940af) Thanks [@MananTank](https://github.com/MananTank)! - Fix Connect Wallet Modal width on tablet size viewport

- [#917](https://github.com/thirdweb-dev/js/pull/917) [`09fae984`](https://github.com/thirdweb-dev/js/commit/09fae984e7f954628d717b25e2269b853c0c17fc) Thanks [@MananTank](https://github.com/MananTank)! - Device Wallet and other Connect Wallet UI improvements

- [#920](https://github.com/thirdweb-dev/js/pull/920) [`3010d845`](https://github.com/thirdweb-dev/js/commit/3010d845951735a7ce1aa85cb5959eddcc54bf6c) Thanks [@MananTank](https://github.com/MananTank)! - Improved autocomplete for imported device wallet

- [#910](https://github.com/thirdweb-dev/js/pull/910) [`c2fec930`](https://github.com/thirdweb-dev/js/commit/c2fec930520e2df89532ec0027ead4563c7708cf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Allow passing any EVMWallet to SafeWallet as personal signer

- [#909](https://github.com/thirdweb-dev/js/pull/909) [`d8b54a6f`](https://github.com/thirdweb-dev/js/commit/d8b54a6f91d5943bd7c0720b0e0bff05c4be89e5) Thanks [@MananTank](https://github.com/MananTank)! - Add back device wallet UI

- Updated dependencies [[`abe88599`](https://github.com/thirdweb-dev/js/commit/abe88599b634699aa3b876fe344bfddc6c1a92d4), [`49922de9`](https://github.com/thirdweb-dev/js/commit/49922de9d9c1258e58a3a05e656b229db469b1dd), [`4acb2b55`](https://github.com/thirdweb-dev/js/commit/4acb2b5561118dde5c7372400d4d754b879aef2e), [`82bea3fa`](https://github.com/thirdweb-dev/js/commit/82bea3fa10294eb3c5c7327fb047e3d1b2c62ff9), [`ea04edf4`](https://github.com/thirdweb-dev/js/commit/ea04edf47867617ff74f0aca1471a40b8d9c9f7c), [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633), [`c9ee9b32`](https://github.com/thirdweb-dev/js/commit/c9ee9b32f0a275f7c03d50243f23a7332f148ae5), [`00f4355f`](https://github.com/thirdweb-dev/js/commit/00f4355f1aa8843bb534b173e4d8e0a19dd18b47), [`a6610f12`](https://github.com/thirdweb-dev/js/commit/a6610f1211e9359885b948bf69a66d834707ec07), [`06cc1df3`](https://github.com/thirdweb-dev/js/commit/06cc1df3b7906584c9e2e69fddc4a2d831c237f9), [`29146e00`](https://github.com/thirdweb-dev/js/commit/29146e009db655304f5753904ae7f8569c12f4ca), [`77224646`](https://github.com/thirdweb-dev/js/commit/77224646d542db3171394d744b455497cd057633), [`430a5f79`](https://github.com/thirdweb-dev/js/commit/430a5f793419173775a434e0b2a21f70223e3813), [`664d1cd0`](https://github.com/thirdweb-dev/js/commit/664d1cd0dd03f32337c2cf532f0ad860e5aa5ea8), [`bfdd8493`](https://github.com/thirdweb-dev/js/commit/bfdd84939d7cf9c6635b83c971bcc8967b52538c), [`c2fec930`](https://github.com/thirdweb-dev/js/commit/c2fec930520e2df89532ec0027ead4563c7708cf), [`477324ec`](https://github.com/thirdweb-dev/js/commit/477324ec85b800dcbc54b709430c77fb63b16537)]:
  - @thirdweb-dev/sdk@3.10.11
  - @thirdweb-dev/react-core@3.11.8
  - @thirdweb-dev/wallets@0.2.16
  - @thirdweb-dev/chains@0.1.12

## 3.11.7

### Patch Changes

- [#859](https://github.com/thirdweb-dev/js/pull/859) [`229a4741`](https://github.com/thirdweb-dev/js/commit/229a47413e422952ad946b8c09af32cc1fcdc7f0) Thanks [@MananTank](https://github.com/MananTank)! - Fix Error when connecting to Safe in Vite

- [#879](https://github.com/thirdweb-dev/js/pull/879) [`59434aac`](https://github.com/thirdweb-dev/js/commit/59434aac4f1ca6d16a212c5379cf29fd346baf26) Thanks [@MananTank](https://github.com/MananTank)! - [react] add style prop on ConnectWallet and Web3Button

- Updated dependencies [[`ac8fa0b3`](https://github.com/thirdweb-dev/js/commit/ac8fa0b34545a2bc0b489a0551d476a9f560e851), [`b616dca7`](https://github.com/thirdweb-dev/js/commit/b616dca7eb861cd1d2adba3f3d1fe9c3b50f259e), [`2545a440`](https://github.com/thirdweb-dev/js/commit/2545a440dc272690cacbc23023f7b0a68f390c6e), [`b75bcef5`](https://github.com/thirdweb-dev/js/commit/b75bcef55bfdedc260b5b62bb4aff10a7d5c47b6), [`229a4741`](https://github.com/thirdweb-dev/js/commit/229a47413e422952ad946b8c09af32cc1fcdc7f0), [`c9027fce`](https://github.com/thirdweb-dev/js/commit/c9027fced0fffbf757bf0080bc4a49f5464df647), [`0db0cc75`](https://github.com/thirdweb-dev/js/commit/0db0cc756436dba8f9df0cf8678b87c009acc283)]:
  - @thirdweb-dev/sdk@3.10.10
  - @thirdweb-dev/wallets@0.2.15
  - @thirdweb-dev/react-core@3.11.7

## 3.11.6

### Patch Changes

- Updated dependencies [[`b3d57949`](https://github.com/thirdweb-dev/js/commit/b3d57949bd047831fda7e600b4872200340903b5), [`602d8cbc`](https://github.com/thirdweb-dev/js/commit/602d8cbcfaa7c1e117c01f842f89508f7333fcfe)]:
  - @thirdweb-dev/sdk@3.10.9
  - @thirdweb-dev/react-core@3.11.6

## 3.11.5

### Patch Changes

- Updated dependencies [[`1547d76c`](https://github.com/thirdweb-dev/js/commit/1547d76cce52265076c347599014f578c1de6152), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d), [`b5648aee`](https://github.com/thirdweb-dev/js/commit/b5648aee83b299d07a8eed7773bd32bcceef9657), [`1b8f812f`](https://github.com/thirdweb-dev/js/commit/1b8f812fb8c910d91fb7535d6446a0b6fc6b2310), [`235eb046`](https://github.com/thirdweb-dev/js/commit/235eb0460ae0638f63acf82957bcfea41b9e955d)]:
  - @thirdweb-dev/sdk@3.10.8
  - @thirdweb-dev/react-core@3.11.5
  - @thirdweb-dev/wallets@0.2.14
  - @thirdweb-dev/chains@0.1.11

## 3.11.4

### Patch Changes

- [#851](https://github.com/thirdweb-dev/js/pull/851) [`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc) Thanks [@MananTank](https://github.com/MananTank)! - Fix wallet autoconnect issues

  ### Fixes

  - infinite loading spinner on connect wallet button when wallet is locked or connection to app is closed
  - network switch popup on page load when wallet is connected to different network than it was previously connected
  - removed autoconnect timeout - don't need it anymore

- [#855](https://github.com/thirdweb-dev/js/pull/855) [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48) Thanks [@MananTank](https://github.com/MananTank)! - Add auth in Connect Wallet button

- Updated dependencies [[`c5c2d947`](https://github.com/thirdweb-dev/js/commit/c5c2d9478acd4d4a4e6ce814716bdf1b6e51eafc), [`2dd192a5`](https://github.com/thirdweb-dev/js/commit/2dd192a5676f1b6d3c310ec796bf331252098d48)]:
  - @thirdweb-dev/react-core@3.11.4
  - @thirdweb-dev/wallets@0.2.13
  - @thirdweb-dev/sdk@3.10.7

## 3.11.3

### Patch Changes

- [#844](https://github.com/thirdweb-dev/js/pull/844) [`48fe2ce5`](https://github.com/thirdweb-dev/js/commit/48fe2ce5ed7c8fec0f737ac5ac0637a3c7b43b97) Thanks [@MananTank](https://github.com/MananTank)! - connect wallet UI and text adjustments

- Updated dependencies [[`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00), [`1137a20d`](https://github.com/thirdweb-dev/js/commit/1137a20de44603d35e71eae2f2b6fec79febec00)]:
  - @thirdweb-dev/chains@0.1.10
  - @thirdweb-dev/react-core@3.11.3
  - @thirdweb-dev/sdk@3.10.7
  - @thirdweb-dev/wallets@0.2.12

## 3.11.2

### Patch Changes

- Updated dependencies [[`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910), [`b7fcae6e`](https://github.com/thirdweb-dev/js/commit/b7fcae6e40dade7a239b1a6afb1cd996c8f89910), [`1f2df55b`](https://github.com/thirdweb-dev/js/commit/1f2df55b673fefb0106778dca7a13406cfbcfc90), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d), [`839fce1f`](https://github.com/thirdweb-dev/js/commit/839fce1f6f2747d6102033b26c292294e908f75d)]:
  - @thirdweb-dev/react-core@3.11.2
  - @thirdweb-dev/sdk@3.10.6
  - @thirdweb-dev/chains@0.1.9
  - @thirdweb-dev/wallets@0.2.11

## 3.11.1

### Patch Changes

- Updated dependencies [[`e2581f21`](https://github.com/thirdweb-dev/js/commit/e2581f211e4419105d6169d84a60a4d69759eda9), [`9b303829`](https://github.com/thirdweb-dev/js/commit/9b3038291d1c9f4eb243718a6070e3dac829a354)]:
  - @thirdweb-dev/react-core@3.11.1
  - @thirdweb-dev/chains@0.1.8
  - @thirdweb-dev/sdk@3.10.5
  - @thirdweb-dev/wallets@0.2.10

## 3.11.0

### Minor Changes

- [#584](https://github.com/thirdweb-dev/js/pull/584) [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db) Thanks [@MananTank](https://github.com/MananTank)! - [Wallets, RN, React, ReactCore] New Wallets SDK implementation

  #### Breaking changes:

  ### React and React Native

  1. Replaced `walletConnectors` with `supportedWallets` in the ThirdwebProvider.

  ```diff
    import { coinbaseWallet, metamaskWallet, ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    - return <ThirdwebProvider walletConnectors={["metamask", "coinbaseWallet"]}>{...}</ThirdwebProvider>
    + return <ThirdwebProvider supportedWallets={[metamaskWallet(), coinbaseWallet()]}>{...}</ThirdwebProvider>
    }
  ```

  2. `magicLinkConnector` not yet implemented in this version

  3. Removed `desiredChainId`, use `activeChain` instead

  4. `DAppMetaData` type now requires the `url` field to be passed in

  5. Removed `chainRpc` prop from the ThirdwebProvider. You can pass custom rpcs in the Chain object through the `activeChain` and `supportedChains` props.

  6. Replaced the `useNetwork` hook for `useChain` and `useSwitchChain`

  7. Updated `ConnectWallet` button in React:

  - Removed `accentColor` and `colorMode`
  - Added a `theme` prop with `dark` and `light` values

  8. Updated the `Web3Button` button in React:

  - Removed `accentColor` and `colorMode`
  - Added a `theme` prop with `dark` and `light` values

  ### Patch Changes

  - You can now pass a `theme` prop to the ThirdwebProvider. Values are `light` and `dark`

  ```
    import { ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    return <ThirdwebProvider theme='light'>{...}</ThirdwebProvider>
    }
  ```

  - New wallet hooks added

    - useWallet()
    - useConenct()
    - useConnectionStatus()
    - useSwitchChain()

  - Removed `wagmi` dependency from the `react-native-compat` package and updated shims

  - New `ConnectWallet` and `Web3Button` components in React Native

  - New wallets package with support for the most common wallets. MetaMask, Coinbase, WalletConnect V1 and V2 and PaperWallet

  - Added `autoSwitch` prop to the ThirdwebProvider to control whether or not to automatically switch to wallet's network to active chain

  ```
    import { ThirdwebProvider } from "@thirdweb-dev/react";

    const App = () => {
    return <ThirdwebProvider autoSwitch>{...}</ThirdwebProvider>
    }
  ```

### Patch Changes

- [#794](https://github.com/thirdweb-dev/js/pull/794) [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406) Thanks [@shift4id](https://github.com/shift4id)! - Minor copy changes

- [#757](https://github.com/thirdweb-dev/js/pull/757) [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d) Thanks [@iketw](https://github.com/iketw)! - switch to `thirdwebcdn.com` for default IPFS gateway

- [#829](https://github.com/thirdweb-dev/js/pull/829) [`3ff8eecf`](https://github.com/thirdweb-dev/js/commit/3ff8eecf18b9606f6b4f2164745448b7f2031fb3) Thanks [@MananTank](https://github.com/MananTank)! - use `authConfig` provided in `useLogin()` hook

- [#825](https://github.com/thirdweb-dev/js/pull/825) [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb) Thanks [@iketw](https://github.com/iketw)! - [Core,React,RN,Wallets] Allow for wallets to be created without props where possible

  You can now create wallets without having to worry about it's params. We provide sensible defaults.

  ```
  const w = new WalletConnectV1();
    w.connect();

  const w1 = new WalletConnect();
  w1.connect();

  const cb = new CoinbaseWallet()
  w1.connect();

  const safe = new SafeWallet();

  const device = new DeviceBrowserWallet();
  ```

- [#681](https://github.com/thirdweb-dev/js/pull/681) [`5f0493d0`](https://github.com/thirdweb-dev/js/commit/5f0493d0fb291b4072cc433412883d352588c397) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for ENS

- [#702](https://github.com/thirdweb-dev/js/pull/702) [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682) Thanks [@jnsdls](https://github.com/jnsdls)! - enable `browser` export

- [#708](https://github.com/thirdweb-dev/js/pull/708) [`aad57a56`](https://github.com/thirdweb-dev/js/commit/aad57a566b74890ebd82d5369c66d2d0196f6edc) Thanks [@ThianHooi](https://github.com/ThianHooi)! - Fix unable to override chain config value in ThirdwebProvider

- [#735](https://github.com/thirdweb-dev/js/pull/735) [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3) Thanks [@jnsdls](https://github.com/jnsdls)! - <br />

  ### New Hooks

  <details>
  <summary>
  <code>useWatchTransactions()</code> - watch for transactions on the blockchain (real-time)
  </summary>
  <br />

  **Example:** Listen to all transactions on USD Coin (USDC) contract address.

  ```jsx
  import { useWatchTransactions } from "@thirdweb-dev/react";

  const MyComponent = () => {
    const transactions = useWatchTransactions({
      network: "ethereum",
      contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    });

    if (!transactions.length) {
      return <div>No transactions, yet.</div>;
    }

    return (
      <div>
        {transactions.map((transaction) => (
          <div key={transaction.hash}>
            <div>Hash: {transaction.hash}</div>
            <div>From: {transaction.from}</div>
            <div>To: {transaction.to}</div>
            <div>Value: {transaction.value}</div>
          </div>
        ))}
      </div>
    );
  };
  ```

  > **Note**
  >
  > This hook is available in `@thirdweb-dev/react`, `@thirdweb-dev/react-native` and `@thirdweb-dev/react-core` packages, the usage is the same. (The only difference is the import path.)

  </details>

- [#764](https://github.com/thirdweb-dev/js/pull/764) [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a) Thanks [@MananTank](https://github.com/MananTank)! - paper wallet, do not save device wallet password

- [#832](https://github.com/thirdweb-dev/js/pull/832) [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94) Thanks [@MananTank](https://github.com/MananTank)! - - Fix `wallet.addListener` "connect", "disconnect" event emit issue

  - update the paper sdk

- [#786](https://github.com/thirdweb-dev/js/pull/786) [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8) Thanks [@MananTank](https://github.com/MananTank)! - Gnosis Safe

- [#799](https://github.com/thirdweb-dev/js/pull/799) [`49eceaa0`](https://github.com/thirdweb-dev/js/commit/49eceaa08e642a72bb6e21d7b68a1177ae37aec5) Thanks [@iketw](https://github.com/iketw)! - [React] update provider props

- Updated dependencies [[`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`6e9b9dba`](https://github.com/thirdweb-dev/js/commit/6e9b9dba1dfb9e828e6927f441e7223baa5bcc76), [`93eca1de`](https://github.com/thirdweb-dev/js/commit/93eca1de7d23d66a129418aee72a41e394cbec16), [`a6fce0f6`](https://github.com/thirdweb-dev/js/commit/a6fce0f691ffeb2b7ec1355b1c55fa7e58700406), [`9ea43969`](https://github.com/thirdweb-dev/js/commit/9ea439692da94f84297bf6a9d04487a1cb74796d), [`3ff8eecf`](https://github.com/thirdweb-dev/js/commit/3ff8eecf18b9606f6b4f2164745448b7f2031fb3), [`2ec28021`](https://github.com/thirdweb-dev/js/commit/2ec2802119a3c375a1adaed1263ae1eae1384865), [`4bdeefe6`](https://github.com/thirdweb-dev/js/commit/4bdeefe6cb343a979b336dcd99197d895c2ae1fb), [`805896c7`](https://github.com/thirdweb-dev/js/commit/805896c78d5ecbbe1866408fbb73d060f7404146), [`b56511e2`](https://github.com/thirdweb-dev/js/commit/b56511e22d5eb2adf306d5675f1e52ff97a64f3a), [`8ef5a6f2`](https://github.com/thirdweb-dev/js/commit/8ef5a6f21735e6ac235937f6c34495a74c9da364), [`4cbbad98`](https://github.com/thirdweb-dev/js/commit/4cbbad98b303d872c09efedbece179445c7adc9c), [`e3161e59`](https://github.com/thirdweb-dev/js/commit/e3161e5986e1831c6dae517889b6a6ba181ccd36), [`d6ae520a`](https://github.com/thirdweb-dev/js/commit/d6ae520aaf272bdd9d235858701ea67c2c1fd796), [`5f0493d0`](https://github.com/thirdweb-dev/js/commit/5f0493d0fb291b4072cc433412883d352588c397), [`71532e5a`](https://github.com/thirdweb-dev/js/commit/71532e5a9fb5b116ba342465ef82e795ca8cc011), [`33d1cc7f`](https://github.com/thirdweb-dev/js/commit/33d1cc7f92cd982e9e55130472c0006bb999f682), [`de7b6196`](https://github.com/thirdweb-dev/js/commit/de7b6196766d709deeac148a24dd8dd38b3e924a), [`6b145d4b`](https://github.com/thirdweb-dev/js/commit/6b145d4b36d2706f8a2dcad4b8f680c41606a556), [`83e99dbf`](https://github.com/thirdweb-dev/js/commit/83e99dbf289c7b8b8991c58383f8bc2a63f5a702), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`52d37f01`](https://github.com/thirdweb-dev/js/commit/52d37f01873c649b36c7d77df6c525a666245132), [`485abd06`](https://github.com/thirdweb-dev/js/commit/485abd06aa972a4f43f71b98f9666f113b932fb3), [`95bcfa6d`](https://github.com/thirdweb-dev/js/commit/95bcfa6df84c48cb5d590f47489f275d22bd660a), [`682f1c67`](https://github.com/thirdweb-dev/js/commit/682f1c673f4b02acab3986031942dbd3d67a87fa), [`4d07b4b4`](https://github.com/thirdweb-dev/js/commit/4d07b4b4e7bdc6244d399f287611fd5eb5d39cac), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`d8c1c943`](https://github.com/thirdweb-dev/js/commit/d8c1c9433e8dc48a70a1c93a0c1467c12ad79701), [`08507611`](https://github.com/thirdweb-dev/js/commit/085076117b18a615aa2b1b8f086d434cab3a4e4e), [`e2ec70c4`](https://github.com/thirdweb-dev/js/commit/e2ec70c49264737fbd2afb1cacabded82262bc6c), [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3), [`6b31a9bc`](https://github.com/thirdweb-dev/js/commit/6b31a9bcd3898cf56ee3b774a44b7481738c8e60), [`04775954`](https://github.com/thirdweb-dev/js/commit/04775954a0af787313ed667cc5ef5d2212e1df36), [`4b77bc9b`](https://github.com/thirdweb-dev/js/commit/4b77bc9b88a218647e6c32c7002880f07347f32a), [`d01b135d`](https://github.com/thirdweb-dev/js/commit/d01b135d26efe6cebd84110b1a8eacee5c1b98db), [`1baed0b1`](https://github.com/thirdweb-dev/js/commit/1baed0b1d83b4c92dac44430af5436d04727d92f), [`8463a176`](https://github.com/thirdweb-dev/js/commit/8463a1761ff4741b55a72e6994a29f7dd50b54e1), [`e47ceafe`](https://github.com/thirdweb-dev/js/commit/e47ceafeae950c22860ca4c7dffba7d573e04a94), [`4d5fdda9`](https://github.com/thirdweb-dev/js/commit/4d5fdda907af0451507d5e2812ec91fbd513a11c), [`6c0c6538`](https://github.com/thirdweb-dev/js/commit/6c0c65389fb5b990a6e780e7d3f7dbd403fe950d), [`208d97e6`](https://github.com/thirdweb-dev/js/commit/208d97e6a892942171c056768876b3e33399d275), [`ddc1c33a`](https://github.com/thirdweb-dev/js/commit/ddc1c33a531dd063158ec736f43dd65b423c21e8), [`49eceaa0`](https://github.com/thirdweb-dev/js/commit/49eceaa08e642a72bb6e21d7b68a1177ae37aec5), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`ba9f593b`](https://github.com/thirdweb-dev/js/commit/ba9f593be8e10289040b466bdcf98ff251f412a3), [`2221f97d`](https://github.com/thirdweb-dev/js/commit/2221f97ddc997d864db3a5f00e82862ece574922), [`9fa628f8`](https://github.com/thirdweb-dev/js/commit/9fa628f89492633e4f7ea2b7c542e1587ea17a86), [`5c7c0923`](https://github.com/thirdweb-dev/js/commit/5c7c0923e45b3f0ee27c83a9c4c691ce9bbb8539), [`abf609a4`](https://github.com/thirdweb-dev/js/commit/abf609a40114a509fe07a04bfb0793dc44c9e39d), [`9a4a542c`](https://github.com/thirdweb-dev/js/commit/9a4a542ce9650605d48745a40126ca6b52a16722), [`b2d0ffb0`](https://github.com/thirdweb-dev/js/commit/b2d0ffb049208de9f9212eae7059212aed74fec4), [`bd40bc2e`](https://github.com/thirdweb-dev/js/commit/bd40bc2ef1e90490400a5f03fdfd178578844244)]:
  - @thirdweb-dev/react-core@3.11.0
  - @thirdweb-dev/wallets@0.2.9
  - @thirdweb-dev/chains@0.1.7
  - @thirdweb-dev/sdk@3.10.4

## 3.10.3

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.10.3

## 3.10.2

### Patch Changes

- Updated dependencies [[`d30e3f4d`](https://github.com/thirdweb-dev/js/commit/d30e3f4db3d74589429e17da1a56e89e9e1082ab), [`31a252a0`](https://github.com/thirdweb-dev/js/commit/31a252a0ecafe338d1fbb3000b5dec55274a2d84)]:
  - @thirdweb-dev/wallets@0.2.8
  - @thirdweb-dev/react-core@3.10.2

## 3.10.1

### Patch Changes

- Updated dependencies [[`9efeba38`](https://github.com/thirdweb-dev/js/commit/9efeba38f06783b78e2c947ad878350173f4e07a)]:
  - @thirdweb-dev/react-core@3.10.1

## 3.10.0

### Patch Changes

- [#651](https://github.com/thirdweb-dev/js/pull/651) [`1bdb44d3`](https://github.com/thirdweb-dev/js/commit/1bdb44d36b7ae0dd2cdc1feacb090e3d83a78130) Thanks [@adam-maj](https://github.com/adam-maj)! - Fix onError on Web3Bbutton

- [#668](https://github.com/thirdweb-dev/js/pull/668) [`8f46a2ee`](https://github.com/thirdweb-dev/js/commit/8f46a2eef59d2b21b68e38338ed2b3a820421501) Thanks [@jnsdls](https://github.com/jnsdls)! - FIX signer being updated

- [#643](https://github.com/thirdweb-dev/js/pull/643) [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6) Thanks [@jnsdls](https://github.com/jnsdls)! - invalidate queries for `Web3Button`

- [#665](https://github.com/thirdweb-dev/js/pull/665) [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75) Thanks [@shift4id](https://github.com/shift4id)! - Fix spelling throughout all packages

- Updated dependencies [[`6ae39277`](https://github.com/thirdweb-dev/js/commit/6ae39277a1d2ea507cedcde7ae62439758e4d6e0), [`8f46a2ee`](https://github.com/thirdweb-dev/js/commit/8f46a2eef59d2b21b68e38338ed2b3a820421501), [`8d5b418e`](https://github.com/thirdweb-dev/js/commit/8d5b418e78fcf692f72aed5fe49358e40720d80c), [`7832041c`](https://github.com/thirdweb-dev/js/commit/7832041c0fb25852489c73453c2b26e844d94582), [`6ef52dc9`](https://github.com/thirdweb-dev/js/commit/6ef52dc916251d72416ba5a8b63b428770f54e75), [`85250cf7`](https://github.com/thirdweb-dev/js/commit/85250cf71190092b61023d56d1e786d395a008a6), [`2676fc01`](https://github.com/thirdweb-dev/js/commit/2676fc01f4d8eabc90e71fad1f14b4b29806d2bd), [`e33bd2a8`](https://github.com/thirdweb-dev/js/commit/e33bd2a856bbc2e2f6b0c90b46be5166281875ae), [`e50911bc`](https://github.com/thirdweb-dev/js/commit/e50911bc065dda99945d906d8b166f49d7a89677), [`4355518a`](https://github.com/thirdweb-dev/js/commit/4355518afea68cd8026d3ab8a0144c15d66b9e24), [`3740a0bf`](https://github.com/thirdweb-dev/js/commit/3740a0bf5db1301dbd93a97ab4c9343429a4e12d), [`91f5a2fd`](https://github.com/thirdweb-dev/js/commit/91f5a2fd5cb2f5aed6498defdb1feeabb283db6c), [`23cd88ec`](https://github.com/thirdweb-dev/js/commit/23cd88ec3a2af86eafeac258fdc8c5b4ce3196f2), [`87a101ad`](https://github.com/thirdweb-dev/js/commit/87a101ad56430e793c9f22b583fea204dfed0554)]:
  - @thirdweb-dev/react-core@3.10.0
  - @thirdweb-dev/chains@0.1.6
  - @thirdweb-dev/wallets@0.2.7

## 3.9.5

### Patch Changes

- Updated dependencies [[`d7deaa4`](https://github.com/thirdweb-dev/js/commit/d7deaa48f2f943deb8f2ad7459d17de930c00517), [`b7a5b45`](https://github.com/thirdweb-dev/js/commit/b7a5b454415596316f58a75f14472631242cc115)]:
  - @thirdweb-dev/chains@0.1.5
  - @thirdweb-dev/react-core@3.9.5
  - @thirdweb-dev/wallets@0.2.6

## 3.9.4

### Patch Changes

- Updated dependencies [[`a3472a1`](https://github.com/thirdweb-dev/js/commit/a3472a133175826d052ee986907de014e3cf3ad9), [`5712650`](https://github.com/thirdweb-dev/js/commit/5712650074e2415bbea4173a0bb68d727ff2db90)]:
  - @thirdweb-dev/chains@0.1.4
  - @thirdweb-dev/react-core@3.9.4
  - @thirdweb-dev/wallets@0.2.5

## 3.9.3

### Patch Changes

- [#608](https://github.com/thirdweb-dev/js/pull/608) [`3d644fb`](https://github.com/thirdweb-dev/js/commit/3d644fb8cbae8bc3ee624505831b9f5c6996898a) Thanks [@jnsdls](https://github.com/jnsdls)! - `<MediaRenderer />` now accepts an optional mime type prop

- Updated dependencies [[`3d644fb`](https://github.com/thirdweb-dev/js/commit/3d644fb8cbae8bc3ee624505831b9f5c6996898a)]:
  - @thirdweb-dev/chains@0.1.3
  - @thirdweb-dev/react-core@3.9.3
  - @thirdweb-dev/wallets@0.2.4

## 3.9.2

### Patch Changes

- [#601](https://github.com/thirdweb-dev/js/pull/601) [`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19) Thanks [@jnsdls](https://github.com/jnsdls)! - upgrade dependencies

- Updated dependencies [[`66cf1fb`](https://github.com/thirdweb-dev/js/commit/66cf1fb5c2e8deb486543ee028d786bb8eef6c19)]:
  - @thirdweb-dev/react-core@3.9.2
  - @thirdweb-dev/wallets@0.2.3
  - @thirdweb-dev/chains@0.1.2

## 3.9.1

### Patch Changes

- [#599](https://github.com/thirdweb-dev/js/pull/599) [`f580b8a`](https://github.com/thirdweb-dev/js/commit/f580b8ac06534df24b0194cbc632b4a8fd447611) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix readonly chain mismatch

- [#588](https://github.com/thirdweb-dev/js/pull/588) [`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e) Thanks [@adam-maj](https://github.com/adam-maj)! - Update to use new Auth

- Updated dependencies [[`f0de81d`](https://github.com/thirdweb-dev/js/commit/f0de81d4b1ba33b2ac73ed16cfdea8fd4eb5da9e), [`f580b8a`](https://github.com/thirdweb-dev/js/commit/f580b8ac06534df24b0194cbc632b4a8fd447611)]:
  - @thirdweb-dev/react-core@3.9.1
  - @thirdweb-dev/chains@0.1.1
  - @thirdweb-dev/wallets@0.2.2

## 3.9.0

### Minor Changes

- [`af8cf40`](https://github.com/thirdweb-dev/js/commit/af8cf40e4e1dab6afcc7622f7f9bbcfc6e8534d8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - ## Now supports Any EVM - Any Contract!

  - no longer requires `desiredChainId` to be passed to `ThirdwebProvider`
  - apps can now pass `activeChain` to `ThirdwebProvider` to define the chain to connect to (can be a chainId or a fully defined chain object from `@thirdweb-dev/chains`)
  - if no `activeChain` is passed but a wallet is connected the SDK will be initialized with the chain of the connected wallet
  - (advanced) apps can now define the chains they want to support by passing `supportedChains` to `ThirdwebProvider`

  ### Deprecated options

  - `desiredChainId` is now deprecated and will be removed in the next major version. Please use `activeChain` instead.
  - `chainRPC` is now deprecated and will be removed in the next major version. Please use `supportedChains` instead.

  ### Basic Setup

  ```diff
  import { ThirdwebProvider } from "@thirdweb-dev/react";
  - import { ChainId } from "@thirdweb-dev/sdk";

  const App = () => {
  - return <ThirdwebProvider desiredChainId={ChainId.Ethereum}>{...}</ThirdwebProvider>
  + return <ThirdwebProvider>{...}</ThirdwebProvider>
  }
  ```

  ### Use a specific chain

  ```js
  import { ThirdwebProvider } from "@thirdweb-dev/react";

  const App = () => {
    // Polygon is a default chain, so you can pass the chain name without needing to define "supportedChains"
    return (
      <ThirdwebProvider activeChain="polygon">{/* {...} */}</ThirdwebProvider>
    );
  };
  ```

  ### Use a non-default chain

  ```js
  import { Sepolia } from "@thirdweb-dev/chains";
  import { ThirdwebProvider } from "@thirdweb-dev/react";

  const App = () => {
    // since there is only one supported chain defined this will automatically default the SDK to Sepolia
    return (
      <ThirdwebProvider activeChain={Sepolia}>{/* {...} */}</ThirdwebProvider>
    );
  };
  ```

### Patch Changes

- [`818048d`](https://github.com/thirdweb-dev/js/commit/818048d52fdef43536929f3b4df5b4c255b97389) Thanks [@jnsdls](https://github.com/jnsdls)! - enable passing of apiKeys to the provider

- [#582](https://github.com/thirdweb-dev/js/pull/582) [`8694d5a`](https://github.com/thirdweb-dev/js/commit/8694d5a3a18648828d67e785e6321488f9e19b79) Thanks [@adam-maj](https://github.com/adam-maj)! - Update with new auth changes

- [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389) Thanks [@jnsdls](https://github.com/jnsdls)! - fix deprecationWarning bug in react & react-core

- [#578](https://github.com/thirdweb-dev/js/pull/578) [`f3b96e7`](https://github.com/thirdweb-dev/js/commit/f3b96e7120ebb45f837803530962a21f87439661) Thanks [@jnsdls](https://github.com/jnsdls)! - allow `number` and `string` types for `activeChain` prop on `<ThirdwebSDKProvider />` and `<ThirdwebProvider />`

- [#571](https://github.com/thirdweb-dev/js/pull/571) [`cfd2a7c`](https://github.com/thirdweb-dev/js/commit/cfd2a7c9ec8f45fced17e81465adff529444d410) Thanks [@iketw](https://github.com/iketw)! - Remove duplicate dependency

- [#592](https://github.com/thirdweb-dev/js/pull/592) [`37f58b4`](https://github.com/thirdweb-dev/js/commit/37f58b4e68c5f222d58e346fdc50c8472d830410) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix aligment on web3button

- [#583](https://github.com/thirdweb-dev/js/pull/583) [`03e755f`](https://github.com/thirdweb-dev/js/commit/03e755f1df0d8e9750bf67d428f6a857577e5edd) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - No min-width requirement for html types on nft renderer

- Updated dependencies [[`6a50719`](https://github.com/thirdweb-dev/js/commit/6a507194861b0712fd753c49ac63a8af68eb21d5), [`af8cf40`](https://github.com/thirdweb-dev/js/commit/af8cf40e4e1dab6afcc7622f7f9bbcfc6e8534d8), [`61d41db`](https://github.com/thirdweb-dev/js/commit/61d41db7699d999d4f71038b5376dd95e9c0d5a5), [`5d25ee1`](https://github.com/thirdweb-dev/js/commit/5d25ee1ab7abb4bfbded283a18f2d7740bb6995d), [`818048d`](https://github.com/thirdweb-dev/js/commit/818048d52fdef43536929f3b4df5b4c255b97389), [`94b120f`](https://github.com/thirdweb-dev/js/commit/94b120ffd1ae04e6f363c0444480920319491cb8), [`d0bcd2c`](https://github.com/thirdweb-dev/js/commit/d0bcd2c5871ca9480efc8d97e27e337eb9bbf830), [`2b3e94f`](https://github.com/thirdweb-dev/js/commit/2b3e94f90a49bcaccf63ac84fc9fc974506ca70d), [`017b0d5`](https://github.com/thirdweb-dev/js/commit/017b0d56b64651b290440b60789e058afba9f9a5), [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389), [`f3b96e7`](https://github.com/thirdweb-dev/js/commit/f3b96e7120ebb45f837803530962a21f87439661), [`5d25ee1`](https://github.com/thirdweb-dev/js/commit/5d25ee1ab7abb4bfbded283a18f2d7740bb6995d), [`500a0e6`](https://github.com/thirdweb-dev/js/commit/500a0e671b3feb01aedd2c34443b682d0934f389), [`f6ea971`](https://github.com/thirdweb-dev/js/commit/f6ea97185470f91fc73a117827df51cf8e1c99d1), [`bddabe0`](https://github.com/thirdweb-dev/js/commit/bddabe0b42e1f61f49aea555e32ba2747fb94351)]:
  - @thirdweb-dev/chains@0.1.0
  - @thirdweb-dev/react-core@3.9.0
  - @thirdweb-dev/wallets@0.2.1

## 3.8.2

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.8.2

## 3.8.1

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.8.1

## 3.8.0

### Patch Changes

- Updated dependencies [[`440a4ad`](https://github.com/thirdweb-dev/js/commit/440a4ade95874e696c589eaa7aae9f0fecc862be)]:
  - @thirdweb-dev/react-core@3.8.0

## 3.7.4

### Patch Changes

- [#470](https://github.com/thirdweb-dev/js/pull/470) [`b59a31c`](https://github.com/thirdweb-dev/js/commit/b59a31c365380c4dc9aed8d7678d46b4b21a029d) Thanks [@JustinTime42](https://github.com/JustinTime42)! - Added support for displaying 3d model NFTs

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.7.4

## 3.7.3

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.7.3

## 3.7.2

### Patch Changes

- [#527](https://github.com/thirdweb-dev/js/pull/527) [`bdd9ed2`](https://github.com/thirdweb-dev/js/commit/bdd9ed22989f5baa511bec70ef1ae9d88bfb957e) Thanks [@jnsdls](https://github.com/jnsdls)! - fix dependency issues with @zag-js/react

- Updated dependencies []:
  - @thirdweb-dev/react-core@3.7.2

## 3.7.1

### Patch Changes

- [#520](https://github.com/thirdweb-dev/js/pull/520) [`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth and react-core dependencies

- Updated dependencies [[`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1)]:
  - @thirdweb-dev/react-core@3.7.1

## 3.7.0

### Minor Changes

- [#460](https://github.com/thirdweb-dev/js/pull/460) [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab) Thanks [@adam-maj](https://github.com/adam-maj)! - All Auth hooks and configuration have been upgraded along with the major upgrade to Auth. This includes changes in necessary `authConfig` to the `ThirdwebProvider`, as well as usage of the `useLogin`, `useLogout`, and `useUser` hooks.

  ## How to upgrade

  In order to upgrade your frontend setup to account for these changes, you'll need to make the following changes to your app:

  **1. Remove `loginRedirect` from `authConfig`**

  In your `ThirdwebProvider`, you can remove the `loginRedirect` option from the `authConfig` object, as the `login` endpoint no longer uses redirects.

  ```jsx
  export default function MyApp({ Component, pageProps }) {
    return (
      <ThirdwebProvider
        authConfig={{
          domain: "example.com",
          authUrl: "/api/auth",
          // No more loginRedirect
        }}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    );
  }
  ```

  **2. Update `useLogin` and `useLogout` to use object destructuring**

  The `useLogin` and `useLogout` hooks now return an object with a `login` and `logout` function (as well as `isLoading` states), respectively. You'll need to update your usage of these hooks to use object destructuring.

  ```jsx
  import { useLogin, useLogout } from "@thirdweb-dev/react";

  export default function Component() {
    const { login } = useLogin();
    const { logout } = useLogout();

    return (
      <div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  ```

### Patch Changes

- [#514](https://github.com/thirdweb-dev/js/pull/514) [`48893c7`](https://github.com/thirdweb-dev/js/commit/48893c730e565c962d117b1eca579e240dc6a5ec) Thanks [@jnsdls](https://github.com/jnsdls)! - switch to using the new `@thirdweb-dev/react-core` package to power `@thirdweb-dev/react`

- [#493](https://github.com/thirdweb-dev/js/pull/493) [`f37e86b`](https://github.com/thirdweb-dev/js/commit/f37e86b7d21f7da0df6ab549cb903dc99db10a79) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Move solana dependencies to peer dependencies, please install them separately:

  `npm install @thirdweb-dev/sdk @thirdweb-dev/react @metaplex-foundation/js @project-serum/anchor @solana/wallet-adapter-wallets`

- [#512](https://github.com/thirdweb-dev/js/pull/512) [`065c4db`](https://github.com/thirdweb-dev/js/commit/065c4db41b08028d4ac6713cda57eed008e18e20) Thanks [@ikethirdweb](https://github.com/ikethirdweb)! - Updates useClaimedNFTs to only fetch claimed NFTs

- Updated dependencies [[`48893c7`](https://github.com/thirdweb-dev/js/commit/48893c730e565c962d117b1eca579e240dc6a5ec), [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab), [`62b7388`](https://github.com/thirdweb-dev/js/commit/62b7388bb2f2564fff0c5e86f0a468db65992b4e)]:
  - @thirdweb-dev/react-core@3.7.0

## 3.6.11

### Patch Changes

- [#507](https://github.com/thirdweb-dev/js/pull/507) [`5047686`](https://github.com/thirdweb-dev/js/commit/5047686f2afbca4fa32b1bbb6bcf4419bd17cf8d) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Fix ConnectWallet network selector showing all options three times

## 3.6.10

## 3.6.9

## 3.6.8

### Patch Changes

- [#454](https://github.com/thirdweb-dev/js/pull/454) [`c673e39`](https://github.com/thirdweb-dev/js/commit/c673e39f23ef082097d73d62910580e8fad400a0) Thanks [@jnsdls](https://github.com/jnsdls)! - upgraded dependencies

- [#422](https://github.com/thirdweb-dev/js/pull/422) [`08d04fe`](https://github.com/thirdweb-dev/js/commit/08d04fe4dc74ba0d12625d7d4004c23f7dc330a2) Thanks [@yehia67](https://github.com/yehia67)! - Add `btnTitle` prop to the `ConnectWallet` component. Now you can set customized string or child component to the connect button.

## 3.6.7

### Patch Changes

- [#448](https://github.com/thirdweb-dev/js/pull/448) [`7a37e56`](https://github.com/thirdweb-dev/js/commit/7a37e564fd5d5a9df84c8da44ecaf6c42f67a0e2) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - allow `useContract` to fail faster to enable the import case

## 3.6.6

### Patch Changes

- [#443](https://github.com/thirdweb-dev/js/pull/443) [`8c6cdaa`](https://github.com/thirdweb-dev/js/commit/8c6cdaa2887fb2cc40d3ee6991233d195d103805) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix magic link connector not connecting to the right chain

## 3.6.5

## 3.6.4

### Patch Changes

- [#425](https://github.com/thirdweb-dev/js/pull/425) [`f545a67`](https://github.com/thirdweb-dev/js/commit/f545a67e9fb597d27bb39ca515d24d306fbb121a) Thanks [@adam-maj](https://github.com/adam-maj)! - Add sameSite none and include credentials

- [#420](https://github.com/thirdweb-dev/js/pull/420) [`639e535`](https://github.com/thirdweb-dev/js/commit/639e535ed55280ad9d081001aab3f5af72bb3e45) Thanks [@jnsdls](https://github.com/jnsdls)! - update deps

## 3.6.3

## 3.6.2

### Patch Changes

- [#405](https://github.com/thirdweb-dev/js/pull/405) [`ccb7db4`](https://github.com/thirdweb-dev/js/commit/ccb7db48739b8dddcb2c032b3b6e3e5200485715) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add updateAll param to creators and royalty update hooks for Solana

## 3.6.1

### Patch Changes

- [#392](https://github.com/thirdweb-dev/js/pull/392) [`846022e`](https://github.com/thirdweb-dev/js/commit/846022e2cfb12b846aae029b85899fb72fd2c9ad) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Fix unlimited price for useActiveClaimConditionForWallet

- [#388](https://github.com/thirdweb-dev/js/pull/388) [`7c0744a`](https://github.com/thirdweb-dev/js/commit/7c0744a006e78987ad8b271b2c64f4bac7759510) Thanks [@adam-maj](https://github.com/adam-maj)! - Add support for total supply and pagination on get all

## 3.6.0

### Patch Changes

- [#386](https://github.com/thirdweb-dev/js/pull/386) [`612bcdd`](https://github.com/thirdweb-dev/js/commit/612bcdd16fc242d8b04bc70d609e44b0df47ed3f) Thanks [@jnsdls](https://github.com/jnsdls)! - [Gnosis Connector] - switch to safe.global hostname & add support for bsc and optimism chains

- [#364](https://github.com/thirdweb-dev/js/pull/364) [`7cb8e59`](https://github.com/thirdweb-dev/js/commit/7cb8e59be48dc923316eb36ab43a1bef7364f6b1) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add experimental `useActiveClaimConditionForWallet()` hook

## 3.5.2

### Patch Changes

- [#369](https://github.com/thirdweb-dev/js/pull/369) [`2d3fca5`](https://github.com/thirdweb-dev/js/commit/2d3fca52373046c88392139922e9c9da79f9a2d4) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add useClaimerProofs hook

- [#378](https://github.com/thirdweb-dev/js/pull/378) [`32d91ef`](https://github.com/thirdweb-dev/js/commit/32d91ef709c8fb92a903e52c65b27538a80ea4eb) Thanks [@mykcryptodev](https://github.com/mykcryptodev)! - round borders for buttons and menus on safari

- [#377](https://github.com/thirdweb-dev/js/pull/377) [`b79dc18`](https://github.com/thirdweb-dev/js/commit/b79dc18f7ab5155bbf4af02dc1a953546160bad0) Thanks [@adam-maj](https://github.com/adam-maj)! - Add event filters

## 3.5.1

## 3.5.0

## 3.4.5

## 3.4.4

### Patch Changes

- [#356](https://github.com/thirdweb-dev/js/pull/356) [`cc4613b`](https://github.com/thirdweb-dev/js/commit/cc4613b5fd69840f4f9cfd0ac1c4e6743e62fe52) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add Pack and Multiwrap as NFTContract types

## 3.4.3

### Patch Changes

- [#353](https://github.com/thirdweb-dev/js/pull/353) [`1c24c3c`](https://github.com/thirdweb-dev/js/commit/1c24c3c3c48476a824f817e09e7bf0fbe67c1db5) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add useUpdateCreators hook, fix CreatorInput schema

## 3.4.2

### Patch Changes

- [#348](https://github.com/thirdweb-dev/js/pull/348) [`7d9a4c6`](https://github.com/thirdweb-dev/js/commit/7d9a4c6abcad1b4f43e431ce7b0b38db9016ea9a) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - [SOL] - add `useUpdateRoyaltySettings()` hook
  [SOL] - change `useRoyalty()` hook -> `useRoyaltySettings()` for consistency

- [#352](https://github.com/thirdweb-dev/js/pull/352) [`3522917`](https://github.com/thirdweb-dev/js/commit/352291791ee900e1500f84f095290497934d2f60) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - expose useExecuteAuctionSale and useAcceptDirectListingOffer

- [#351](https://github.com/thirdweb-dev/js/pull/351) [`aabbb14`](https://github.com/thirdweb-dev/js/commit/aabbb149e81d6824015a4797b2b6c929ca359545) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - fix wallet connection during dev (hot reload)

## 3.4.1

### Patch Changes

- [#343](https://github.com/thirdweb-dev/js/pull/343) [`72227b2`](https://github.com/thirdweb-dev/js/commit/72227b2e166a3a68bbb41cf2b389322f5b7547a2) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose new useOffers and useMakeOffer hooks

## 3.4.0

### Minor Changes

- [#327](https://github.com/thirdweb-dev/js/pull/327) [`ef27aad`](https://github.com/thirdweb-dev/js/commit/ef27aad0aafc4577e85f44dc77dfbe880bd239b5) Thanks [@jnsdls](https://github.com/jnsdls)! - Gnosis Safe and Magic Link connectors are no longer included in the default export. They are now available as named exports instead.

  ## Gnosis Safe

  ### Connector

  ```diff
  - import { GnosisSafeConnector } from "@thirdweb-dev/react";
  + import { GnosisSafeConnector } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
  ```

  ### Hook

  ```diff
  - import { useGnosis } from "@thirdweb-dev/react";
  + import { useGnosis } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
  ```

  ## Magic Link

  ### Connector

  ```diff
  - import { MagicLink } from "@thirdweb-dev/react";
  + import { MagicConnector } from "@thirdweb-dev/react/evm/connectors/magic";
  ```

  ### Hook

  ```diff
  - import { useMagic } from "@thirdweb-dev/react";
  + import { useMagic } from "@thirdweb-dev/react/evm/connectors/magic";
  ```

### Patch Changes

- [#339](https://github.com/thirdweb-dev/js/pull/339) [`b03a902`](https://github.com/thirdweb-dev/js/commit/b03a9021451b79f802f682f66e5ae8e9355d7e6f) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Fix docs for some functions

## 3.3.1

## 3.3.0

## 3.2.6

### Patch Changes

- [#316](https://github.com/thirdweb-dev/js/pull/316) [`6ae5266`](https://github.com/thirdweb-dev/js/commit/6ae52664e5865564cd4fc2e00e3120675b9e0ca3) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix SIWE when using an external signer

- [#310](https://github.com/thirdweb-dev/js/pull/310) [`9727502`](https://github.com/thirdweb-dev/js/commit/9727502eb30ac139382b7c7c8e8fc0967cbfbcf1) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - [SOL] - add useMintNFTSupply hook in react and accomodate inputs for it in SDK

- [#319](https://github.com/thirdweb-dev/js/pull/319) [`2f8ec89`](https://github.com/thirdweb-dev/js/commit/2f8ec89c4c83ae577092c840c198e6fcfb114e69) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose total claimed and unclaimed supply for erc721 drop contracts

- [#318](https://github.com/thirdweb-dev/js/pull/318) [`bb1b4e6`](https://github.com/thirdweb-dev/js/commit/bb1b4e6ac39d98cc68b8e31e659cd68be3a5b967) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add useMinimumNextBid hook and change invariant for other marketplace hooks

## 3.2.5

## 3.2.4

### Patch Changes

- [#301](https://github.com/thirdweb-dev/js/pull/301) [`86f0cef`](https://github.com/thirdweb-dev/js/commit/86f0ceff46f72df8ebd81f843e3c66a245f23992) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Remove useAddress hook for now

## 3.2.3

### Patch Changes

- [#299](https://github.com/thirdweb-dev/js/pull/299) [`b1218cb`](https://github.com/thirdweb-dev/js/commit/b1218cbd7d97ca7949d94a7e4ab93fef4ffbacd5) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Recreate SDK on wallet changes for hook propagation

## 3.2.2

### Patch Changes

- [#289](https://github.com/thirdweb-dev/js/pull/289) [`521a49c`](https://github.com/thirdweb-dev/js/commit/521a49c6ec6a73068adcfbc1d94d2f3f17afae86) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Standarize useClaimNFT to evm

- [#274](https://github.com/thirdweb-dev/js/pull/274) [`ad06c5b`](https://github.com/thirdweb-dev/js/commit/ad06c5b28902422f9b416d65255c64c937a5e046) Thanks [@adam-maj](https://github.com/adam-maj)! - Add solana auth support and plugins for react and auth package

- [#269](https://github.com/thirdweb-dev/js/pull/269) [`b2cadf1`](https://github.com/thirdweb-dev/js/commit/b2cadf164cfe9fb27081df7530356baf70ec2b3a) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - remove deprecated chains from support

- [#272](https://github.com/thirdweb-dev/js/pull/272) [`2bdf198`](https://github.com/thirdweb-dev/js/commit/2bdf1984cb97121c447cffd27aa6a5f4f92679b3) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add claim conditions hook for Solana

- [#291](https://github.com/thirdweb-dev/js/pull/291) [`86f6083`](https://github.com/thirdweb-dev/js/commit/86f608390a7848cda82c0f7e8913ca60f7d3901f) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - expose `.program` on `useProgram()` return type to mirror `.contract` on EVM

- [#292](https://github.com/thirdweb-dev/js/pull/292) [`492a818`](https://github.com/thirdweb-dev/js/commit/492a818079aff67c7f88bc43666c87c3714cc957) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] expose `useAddress()` hook that returns the connected wallet address in base58

- [#290](https://github.com/thirdweb-dev/js/pull/290) [`8096c78`](https://github.com/thirdweb-dev/js/commit/8096c78b466a7f5f9c2aac6e2c56a06f9d3a25d6) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - `useClaimNFT()` allow claiming to connected wallet without passing address explicitly
  [EVM] - `useClaimNFT()` allow claiming to connected wallet without passing address explicitly

- [#298](https://github.com/thirdweb-dev/js/pull/298) [`e8c25ed`](https://github.com/thirdweb-dev/js/commit/e8c25ed0f28d566203d70bf59a8908e59216334a) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - fix useBalance

- [#263](https://github.com/thirdweb-dev/js/pull/263) [`d6bb61b`](https://github.com/thirdweb-dev/js/commit/d6bb61b7fac759fff7d6293edd46f693f5a7889c) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - add chainId getter on contracts

- [#266](https://github.com/thirdweb-dev/js/pull/266) [`3b7d10e`](https://github.com/thirdweb-dev/js/commit/3b7d10ed93d8e3b698e9f905c93ba79863b35325) Thanks [@adam-maj](https://github.com/adam-maj)! - Add storage hooks to react

- [#282](https://github.com/thirdweb-dev/js/pull/282) [`1f41adb`](https://github.com/thirdweb-dev/js/commit/1f41adbd2ccfbc367757620e0842ef32bc783a08) Thanks [@jarrodwatts](https://github.com/jarrodwatts)! - Fix useActiveClaimCondition invariant failing for token ID 0

- [#296](https://github.com/thirdweb-dev/js/pull/296) [`cf88795`](https://github.com/thirdweb-dev/js/commit/cf88795376d3110f9d3aa839928d22276904b15a) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - add `useBalance` hook

## 3.2.1

### Patch Changes

- [#264](https://github.com/thirdweb-dev/js/pull/264) [`f669d3e`](https://github.com/thirdweb-dev/js/commit/f669d3ef4a84368c23f0359aec304f66a4063042) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Standarize data between evm/solana for useLazyMint hook

## 3.2.0

### Patch Changes

- [#261](https://github.com/thirdweb-dev/js/pull/261) [`c8261b7`](https://github.com/thirdweb-dev/js/commit/c8261b74b5828ac66ea3a6d7636aa57e40ea1a14) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - align behavior of `useContract()` and `getContract()` across react & sdk to both allow passing optional second params of contract types or ABIs

- [#236](https://github.com/thirdweb-dev/js/pull/236) [`cac373b`](https://github.com/thirdweb-dev/js/commit/cac373b010ce3be3615a36671b66815a27785061) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - do not require a connection, instead handle a network directly

- [#251](https://github.com/thirdweb-dev/js/pull/251) [`ea41231`](https://github.com/thirdweb-dev/js/commit/ea41231b3ec4a2aef6a203db195d0e450c45ef56) Thanks [@jnsdls](https://github.com/jnsdls)! - fix missing Buffer implementation for WalletConnect and CoinbaseWallet connectors

- [#253](https://github.com/thirdweb-dev/js/pull/253) [`b6fc298`](https://github.com/thirdweb-dev/js/commit/b6fc298d0cf63bc7129104f7779cc9d84e405093) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - allow passing contractType as second param to `useContract()`

- [#243](https://github.com/thirdweb-dev/js/pull/243) [`1136d95`](https://github.com/thirdweb-dev/js/commit/1136d959baf936c166e5f7c051d5173d68d9eb9b) Thanks [@jnsdls](https://github.com/jnsdls)! - fix persister logic

- [#258](https://github.com/thirdweb-dev/js/pull/258) [`ac232b5`](https://github.com/thirdweb-dev/js/commit/ac232b5affe31780ef1c10ec76edb21596850e7e) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Accept SmartContract instead of erc20 instance

- [#245](https://github.com/thirdweb-dev/js/pull/245) [`1972f3e`](https://github.com/thirdweb-dev/js/commit/1972f3ec0d511fbc17642b2a30852a177092a09e) Thanks [@jnsdls](https://github.com/jnsdls)! - [SOL] - expose `useBurnNFT` hook

- [#255](https://github.com/thirdweb-dev/js/pull/255) [`9b92697`](https://github.com/thirdweb-dev/js/commit/9b92697fb77d3072e3e53b451f9b348595ae410e) Thanks [@jnsdls](https://github.com/jnsdls)! - [EVM] - `useContract()` and `<Web3Button />` can now accept an optional ABI directly and will return a `SmartContract` based on it

## 3.1.2

### Patch Changes

- [#229](https://github.com/thirdweb-dev/js/pull/229) [`9c8a3fb`](https://github.com/thirdweb-dev/js/commit/9c8a3fb6d4520dd6cdf2d1c17f33b764e871599e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - [SOL] Expose useClaimNFT hook

## 3.1.1

### Patch Changes

- [#221](https://github.com/thirdweb-dev/js/pull/221) [`c295a47`](https://github.com/thirdweb-dev/js/commit/c295a47144cd722c6f8861c1ec567b53a05ea0bf) Thanks [@jnsdls](https://github.com/jnsdls)! - fix esm exports

## 3.1.0

### Minor Changes

- [#213](https://github.com/thirdweb-dev/js/pull/213) [`e187d21`](https://github.com/thirdweb-dev/js/commit/e187d21e123a506fac0459da18f2d4fc94abae29) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New @thirdweb-dev/react/solana entrypoint

### Patch Changes

- [#208](https://github.com/thirdweb-dev/js/pull/208) [`7c86bab`](https://github.com/thirdweb-dev/js/commit/7c86babb86e02f08a630ed7578036202eb3dbe66) Thanks [@jnsdls](https://github.com/jnsdls)! - add a bunch of initial solana hooks

- [#218](https://github.com/thirdweb-dev/js/pull/218) [`1eaedc2`](https://github.com/thirdweb-dev/js/commit/1eaedc262f0665de2a6a0446402b570371136e05) Thanks [@jnsdls](https://github.com/jnsdls)! - allow both `null` and `undefined` to be passed as a `RequiredParam`

- [#220](https://github.com/thirdweb-dev/js/pull/220) [`37a707f`](https://github.com/thirdweb-dev/js/commit/37a707f98c00140ddedb1d876a4b2f99fe25556a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix chakra zag-menu breaking update

## 3.0.8

### Patch Changes

- [#209](https://github.com/thirdweb-dev/js/pull/209) [`1bda83b`](https://github.com/thirdweb-dev/js/commit/1bda83b1142406892acfb64576fce25d2647afa7) Thanks [@jnsdls](https://github.com/jnsdls)! - fix useLayoutEffect during SSR warning

- Updated dependencies [[`ce05bfd`](https://github.com/thirdweb-dev/js/commit/ce05bfd8615a9c79664856bce53de8b43bed5c87)]:
  - @thirdweb-dev/sdk@3.0.8

## 3.0.7

### Patch Changes

- [#197](https://github.com/thirdweb-dev/js/pull/197) [`f4f05bd`](https://github.com/thirdweb-dev/js/commit/f4f05bd9a4ec98e9abc6716006353f330b7be055) Thanks [@jnsdls](https://github.com/jnsdls)! - make it obvious when the <Web3Button /> will trigger a network switch

- Updated dependencies [[`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c), [`5f5ab01`](https://github.com/thirdweb-dev/js/commit/5f5ab015e1dd3c471d6affe995ef36ec88932b3c)]:
  - @thirdweb-dev/sdk@3.0.7
  - @thirdweb-dev/solana@0.2.15

## 3.0.6

### Patch Changes

- [#179](https://github.com/thirdweb-dev/js/pull/179) [`63258bc`](https://github.com/thirdweb-dev/js/commit/63258bc9c3443db7d12fc1dc6fbd483926c92d3e) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Expose simple provider and useSDK hooks for Solana

- Updated dependencies [[`a80fc97`](https://github.com/thirdweb-dev/js/commit/a80fc97b6a1e72ed46a400b4b602e180947fb870)]:
  - @thirdweb-dev/sdk@3.0.6
  - @thirdweb-dev/solana@0.2.14

## 3.0.5

### Patch Changes

- [#167](https://github.com/thirdweb-dev/js/pull/167) [`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Syntax changes for react native support

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - use internals wherever possible to allow wider usecases with `<ThirdwebSDKProvider>` & add invariants to catch improper use of functionality that requires the full `<ThirdwebProvider` earlier

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - fix case where `<ConnectWallet />` button would get stuck when user cancels connection

- [#168](https://github.com/thirdweb-dev/js/pull/168) [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9) Thanks [@jnsdls](https://github.com/jnsdls)! - allow passing `className` to `<ConnectWallet />` and `<Web3Button />` for possible style overrides

- Updated dependencies [[`4169b94`](https://github.com/thirdweb-dev/js/commit/4169b9428f9001b7cad259a4e56fe610316cd191), [`3b877ba`](https://github.com/thirdweb-dev/js/commit/3b877ba221acfd85f80b99e1bc382055217f0a39), [`b54f95d`](https://github.com/thirdweb-dev/js/commit/b54f95dc906928ff2f9251748f254a16fe1f2cee), [`f8ab477`](https://github.com/thirdweb-dev/js/commit/f8ab4779bb2d6d66200e1e8fd558e0ac069a2f54), [`772f843`](https://github.com/thirdweb-dev/js/commit/772f8431e3a62d0ded62dae90a43e9a7edd5b1a2), [`a9ec190`](https://github.com/thirdweb-dev/js/commit/a9ec190ff99d2714cef2500d20ea0f3f73f07be3), [`208b038`](https://github.com/thirdweb-dev/js/commit/208b0389a50ea48bbb9600fec60fec2f1671d4b9), [`5345479`](https://github.com/thirdweb-dev/js/commit/534547992243bdd3a77e34ec2b2487b5adab366a)]:
  - @thirdweb-dev/sdk@3.0.5

## 3.0.4

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/sdk@3.0.4

## 3.0.3

### Patch Changes

- [#143](https://github.com/thirdweb-dev/js/pull/143) [`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Fix using external signers with ThirdwebSDKProvider

- Updated dependencies [[`51dde28`](https://github.com/thirdweb-dev/js/commit/51dde28224209f1b8b26f436c204a5e702281564), [`9d74a43`](https://github.com/thirdweb-dev/js/commit/9d74a43aac21448beba63ba4e2637945965a3634), [`b234c58`](https://github.com/thirdweb-dev/js/commit/b234c58d44d8322e44b2d2ba87ad4ec7d699e961)]:
  - @thirdweb-dev/sdk@3.0.3

## 3.0.2

### Patch Changes

- Updated dependencies [[`42c79e9`](https://github.com/thirdweb-dev/js/commit/42c79e93dc958ca46a55d705aeea44ffdbbcc5f6), [`fe8751e`](https://github.com/thirdweb-dev/js/commit/fe8751eeae7ad013b890a8092ddbd091ecbd6708)]:
  - @thirdweb-dev/sdk@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [[`98dd64a`](https://github.com/thirdweb-dev/js/commit/98dd64a375c302a879aab3c628ecfb84b4dd19da)]:
  - @thirdweb-dev/sdk@3.0.1

## 3.0.0

### Major Changes

- [#19](https://github.com/thirdweb-dev/js/pull/19) [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - 3.0.0 update

  ## _MAJOR VERSION CHANGE_

  - 85% reduction in package size!
  - Custom contracts are now first class citizens

  [Full changelog](https://blog.thirdweb.com/sdk-major-update/)

  #### Breaking changes:

  1. Hooks now accept custom contracts direclty and handle the logic internally

  before

  ```javascript
  const { contract } = useContract(...)
  const { data: nfts } = useNFTs(contract?.nft)
  const { mutation: claim } = useClaimNFT(contract?.nft)
  ```

  after

  ```javascript
  const { contract } = useContract(...)
  // works with any ERC721/ERC1155 contract
  const { data: nfts} = useNFTs(contract)
  const { mutation: claim } = useClaimNFT(contract)
  ```

  2. Custom contract hooks for reading and writing have been renamed:

  before

  ```javascript
  const { contract } = useContract(...)
  const { data } = useContractData(contract, "myReadFunction", ...args);
  const { mutate: myFunction } = useContractCall(contract, "myWriteFunction");
  ```

  after

  ```javascript
  const { contract } = useContract(...)
  const { data } = useContractRead(contract, "myReadFunction", ...args);
  const { mutate: myFunction } = useContractWrite(contract, "myWriteFunction");
  ```

  3. Web3Button benefits from the new Extension detection API:

  before

  ```jsx
  <Web3Button
    contractAddress={...}
    action={(contract) => contract.nft?.drop?.claim?.to(...)}
    >
    Claim
    </Web3Button>
  ```

  after

  ```jsx
  <Web3Button
    contractAddress={...}
    action={(contract) => contract.erc721.claim(...) }
    >
    Claim
    </Web3Button>
  ```

### Minor Changes

- [#106](https://github.com/thirdweb-dev/js/pull/106) [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe) Thanks [@jnsdls](https://github.com/jnsdls)! - switch all contracts to a new, universal `useContract()` hook

### Patch Changes

- [#109](https://github.com/thirdweb-dev/js/pull/109) [`f7ccc30`](https://github.com/thirdweb-dev/js/commit/f7ccc30f9da9bda8759c66e53bf2efdb4f975bf9) Thanks [@adam-maj](https://github.com/adam-maj)! - Add enabled check to useUser

- [#114](https://github.com/thirdweb-dev/js/pull/114) [`1df2dea`](https://github.com/thirdweb-dev/js/commit/1df2dea18f85f6760040c9000f2eb8aee8a6011b) Thanks [@jnsdls](https://github.com/jnsdls)! - only show deprecation method once & add optimism kovan and arbitrum rinkeby to deprecated networks

- [#91](https://github.com/thirdweb-dev/js/pull/91) [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397) Thanks [@kumaryash90](https://github.com/kumaryash90)! - Add arbitrum and optimism goerli; rename testnets

- Updated dependencies [[`a70b590`](https://github.com/thirdweb-dev/js/commit/a70b590be1efa7c0ad93a724afb24870439558ed), [`a37bc00`](https://github.com/thirdweb-dev/js/commit/a37bc00991bf1a359f5f8aa8e24e2c388dcd99d8), [`b442c97`](https://github.com/thirdweb-dev/js/commit/b442c970808f6cb7457d29542bd826dba711579c), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`2adb8ff`](https://github.com/thirdweb-dev/js/commit/2adb8ff6673768a91fa411c2d069245190ad9397), [`5a5bc36`](https://github.com/thirdweb-dev/js/commit/5a5bc361507bd8707dc12e9000bb9a218221cf61), [`820a519`](https://github.com/thirdweb-dev/js/commit/820a5191b5e7af5aba5e4d1cc90cd895c0dade11), [`0fa6f3f`](https://github.com/thirdweb-dev/js/commit/0fa6f3fcfbd571579baf9d2a0dbeee556ddbd5fe), [`82627ea`](https://github.com/thirdweb-dev/js/commit/82627ea0311f612119d0596ed0f568267a7af16b)]:
  - @thirdweb-dev/sdk@3.0.0

## 2.9.7

### Patch Changes

- Updated dependencies [[`baa87a1`](https://github.com/thirdweb-dev/js/commit/baa87a1fbd7eee24ce9a95e16028de8435f85e69), [`f2bdf47`](https://github.com/thirdweb-dev/js/commit/f2bdf47b4fd06433be367c9aac6d11a8dbbf1a1a), [`4079326`](https://github.com/thirdweb-dev/js/commit/407932680fb024f17f12f578aa22c7f8c0c13339), [`05353fd`](https://github.com/thirdweb-dev/js/commit/05353fd8da82f77fb642bb38a533fb99801aed30)]:
  - @thirdweb-dev/sdk@2.4.9
  - @thirdweb-dev/storage@0.2.8

## 2.9.6

### Patch Changes

- [#61](https://github.com/thirdweb-dev/js/pull/61) [`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6) Thanks [@jnsdls](https://github.com/jnsdls)! - fix versions in dependencies before releasing stable

- Updated dependencies [[`3287c2b`](https://github.com/thirdweb-dev/js/commit/3287c2b0f233332fe4a095f973deed8efab91db6)]:
  - @thirdweb-dev/sdk@2.4.8
  - @thirdweb-dev/storage@0.2.7

## 2.9.5

### Patch Changes

- Updated dependencies [[`6ba9cad`](https://github.com/thirdweb-dev/js/commit/6ba9cad8d8b933256599dc3b147601cd4828c89b)]:
  - @thirdweb-dev/sdk@2.4.7

## 2.9.4

### Patch Changes

- [`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117) Thanks [@jnsdls](https://github.com/jnsdls)! - bump versions again

- Updated dependencies [[`5644ccd`](https://github.com/thirdweb-dev/js/commit/5644ccd3ee2ff330e4e5840d3266033376750117)]:
  - @thirdweb-dev/sdk@2.4.6
  - @thirdweb-dev/storage@0.2.6

## 2.9.3

### Patch Changes

- [`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c) Thanks [@jnsdls](https://github.com/jnsdls)! - release-all-packages

- Updated dependencies [[`091f175`](https://github.com/thirdweb-dev/js/commit/091f1758604d40e825ea28a13c2699d67bc75d8c)]:
  - @thirdweb-dev/sdk@2.4.5
  - @thirdweb-dev/storage@0.2.5

## 2.9.2

### Patch Changes

- Updated dependencies [[`924247a`](https://github.com/thirdweb-dev/js/commit/924247a8ed5ef1867dccfad9479b00f71795ebf6)]:
  - @thirdweb-dev/storage@0.2.4
  - @thirdweb-dev/sdk@2.4.4

## 2.9.1

### Patch Changes

- [#50](https://github.com/thirdweb-dev/js/pull/50) [`c903ca8`](https://github.com/thirdweb-dev/js/commit/c903ca8af97a57a5f549d858ad7192388615730c) Thanks [@jnsdls](https://github.com/jnsdls)! - apply (sane) sandboxing to `<MediaRenderer />`

- Updated dependencies [[`e59735b`](https://github.com/thirdweb-dev/js/commit/e59735b6a2cdcfb660d7bdb16a038f64bd28ca74), [`2eb7e94`](https://github.com/thirdweb-dev/js/commit/2eb7e945b14fd47fc46408d90499888c1f87ca94)]:
  - @thirdweb-dev/sdk@2.4.3

## 2.9.0

### Minor Changes

- [#42](https://github.com/thirdweb-dev/js/pull/42) [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851) Thanks [@jnsdls](https://github.com/jnsdls)! - remove `functionName` + `params` option from `<Web3Button>` - use `action={...}` instead

### Patch Changes

- [#45](https://github.com/thirdweb-dev/js/pull/45) [`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19) Thanks [@jnsdls](https://github.com/jnsdls)! - switch back to preconstruct for building

- [#46](https://github.com/thirdweb-dev/js/pull/46) [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83) Thanks [@jnsdls](https://github.com/jnsdls)! - imrprove babel & tsconfig settings

- [#42](https://github.com/thirdweb-dev/js/pull/42) [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851) Thanks [@jnsdls](https://github.com/jnsdls)! - switch build to tsup

- [#34](https://github.com/thirdweb-dev/js/pull/34) [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95) Thanks [@jnsdls](https://github.com/jnsdls)! - add e2e tests

- Updated dependencies [[`ed639d6`](https://github.com/thirdweb-dev/js/commit/ed639d659d9d746321fb8858212d22cc16d9cd19), [`349b5c1`](https://github.com/thirdweb-dev/js/commit/349b5c1e028a06616d40de84257fd8d1cf05df83), [`46ad691`](https://github.com/thirdweb-dev/js/commit/46ad691a1636dbc7915ade22067ccfa1d39f7851), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95), [`5731ac2`](https://github.com/thirdweb-dev/js/commit/5731ac2f50ef63c243d3a6c2516e85920c325a95)]:
  - @thirdweb-dev/sdk@2.4.2
  - @thirdweb-dev/storage@0.2.3

## 2.8.1

### Patch Changes

- 02c2b52: force version
- Updated dependencies [02c2b52]
  - @thirdweb-dev/sdk@2.4.1
  - @thirdweb-dev/storage@0.2.2

## 2.8.0

### Minor Changes

- 3abe26c: initialze monorepo packages

### Patch Changes

- Updated dependencies [3abe26c]
  - @thirdweb-dev/sdk@2.4.0
  - @thirdweb-dev/storage@0.2.0

## 2.7.5

### Patch Changes

- d0a7368: mark old contract hooks as deprecated (use `useContract()` instead)
- d4abb09: Add support for Binance chains (BSC)
- 86e3b58: use storage helpers from @thirdweb-dev/storage
- cb439a9: useTotalCount always returns unclaimed and claimed tokens
- 7fa920e: `<Web3Button />` now accepts `action` instead of `callable`
- Updated dependencies [d4abb09]
- Updated dependencies [274afb5]
- Updated dependencies [86e3b58]
- Updated dependencies [86e3b58]
- Updated dependencies [0c78b16]
  - @thirdweb-dev/sdk@2.3.43
  - @thirdweb-dev/storage@0.1.1
