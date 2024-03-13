import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import { BinanceWallet } from "@thirdweb-dev/wallets";
import { getInjectedBinanceProvider } from "@thirdweb-dev/wallets";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";
import { handelWCSessionRequest } from "../handleWCSessionRequest";

const binanceWalletUris = {
  ios: "bnc://",
  android: "bnc://",
  other: "bnc://",
};

/**
 * @wallet
 */
export type BinanceWalletConfigOptions = {
  /**
   * When connecting Binance wallet using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;
  /**
   * If `true`, the wallet will be tagged as "recommended" in ConnectWallet Modal. Default is `false`
   */
  recommended?: boolean;
};

/**
 * A wallet configurator for [Phantom Wallet](https://phantom.app/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * phantomWallet({
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional configuration options for the wallet
 *
 * ### recommended (optional)
 * If `true`, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI. Default is `false`
 *
 * @wallet
 */
export const binanceWallet = (
  options?: BinanceWalletConfigOptions,
): WalletConfig<BinanceWallet> => {
  return {
    recommended: options?.recommended,
    id: BinanceWallet.id,
    meta: {
      name: "Binance Wallet",
      urls: {
        android:
          "https://play.google.com/store/apps/details?id=com.binance.dev",
        ios: "https://apps.apple.com/vn/app/binance-buy-bitcoin-crypto/id1436799971",
      },
      iconURL:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAAGB5JREFUeF7tXfmTFNd9/7ye2Zmea7kEu+iI/VOqkr8gVmKLW0Z2qlKVCiWJZRdJLJcQEkICCZC4FxDCBglkCSOOBWRZlpTYsS1A5lQsJb87TiWlIxaWJQsEuzO7c+xMd8ff9/pNv+7pOWBnZ3ed7SpqYaenu9/38/1+vudrGCoc8fHjp9HHhsE20k/GwP89dlSWgGXhAmPsIp2VTl7bVOls5vchCZ6EPibweqka21wOiBIASPimyc7X69Zj11ElUAqEC4Bo88RNgMXpZuwYKgm4QSgCMCb8oRJ46XU1zZre19NzgftV+XG0eYLVuEcYu5MEgQMwpv2NVwiKlDKp69NtAMa0v/EQAGQFbKRrP2MMluXPjvRb3zh6OKR5E/ccFQCIBNANgmlZ0JgUvQlAg/o7AoxBA9jIdms8YYskJpwf6QlXOU3PJA2ud5HmQIn+jQbr4ACMpuiHa7at+elkDm+8/Bdc8POWfopoc7gIgrQY9fybYIiGfGVUAOBoM9ENkE7l0f3iHWi7ezynnxOnr6H9kcuIJggEQUmjwQI4vY50C+CCtFiRz0nzu/eT8CcinylwYTdFbBBWXHZZwmgAYcQDoPJAOpnF0RduR/vcW5DPCGuQB4HQ/c5VLFz5e0Sb9YbQRz1uMioA0CwTfUQ7B25D2xyv8CUQbkuIJ8IwR0GMOgIAEJxd6SDaOf7C7Wj79iTkMiLykUfR4WoMzLQQjgRw4tRXWLCS6KiaJVS/dz20vNI1RgAA4vFUvlb/TsI/+sJt6Lh7EnJZ4vxS4XsXSCAcO3UNC1d+htg43ZXIjTS/MCIAKBcuppN5HH+xFW1zJnLNNzUGrUxuRXRT/MyyLeHMNSx45AtEm5tKkrmREqKOCAD8TDSdHMDxF6cWhU/9UG4pdi5A/6LslyiI/i5xkZ9bMKHrQZxQQBhqOrmZ6w87AKS1luYuNZDmH9vbiva5E5HNGCXaeyML1SMBdL9zDR2PCUuQB913JDjpYQeABKLWely0kzVJ5YV/UOpBUuvJAmo5CARpCZFEsJhN1/LdoT5nRAAgF8mFv68FbXMnIGvH+TJOsUtuZSMmzQD3EbwAJ7+kJHB6iOHEmR60P/Yl9HhgxIAwYgAgzj+2bzLa50xCljS/KEXSfg2W5U68BGhODuBwC4NlmPw7jmcQiOi6hu4zX6Hj0asuOhpqLR/mMNSEZbGKGpdOFnB83xRe28mkhVDJ54o+gJNNid8JOqKYX3K4BQ0ao/tQjkDaDTBTcDzjv9d4hET/jkQ1nDzTi7aVbp/gEpLFQE5cFv6GEqCGWoAUguoAiXa6X2hB2+xxRdohzWYswAGgP5omErVyjRnHGmRCp8ZFpeLTqXb07nW0r7yCeKLJ5Ywb7ZwbCkBRFDY382jn+5PRfvcEpDN5D7+XF2KlLplKXZU0N0rR0enr6Fh1BRHKE5STGwnCkANQbjFc8/dOQdusZmRylaIZClEFHajJUwAMlkbkA1gmg2FnAsU8wCmglsUhEmZ47Vc9aHts+HzCkAPgrN6pu5DwT+y9BfNnT0CaO1zPQdGMWR4UEn5QB5588Y/8i7sfaUEhiyIInK5qAIDOi+oaTr57nYOg0lGjShYNBEBELemkIWhnznikeW3HXYgr182SZQb6vCnCsP6lP2LngT4u6TUr49ixdAryGQsFbi0kPvW6bjrzUhiB0H2mBx2ryBKCQ+lzS67dOAD+JKh0akBo/hyKdkRhjYRhcmExaGYBpmbH6GYBFhO9XmYZ/O8aTIQiATy1/0s8/1If7wXT9zO9BaxeHsfOFVMwYFdLJRUZvFxBQiW6osRO405XUiN38hYQiVF0JOjI6xOGEpGGAEALpHq+oJ1mZLMW520eKxYPu5Vo13e8hWISdCjMsO6VL/Dci9mSRjw16Nc8HEHXshbksxREWjwnIyqyKGytkjWT1eh6ACffTaLtsS9FZ61WHhsEQnUHwOt0SXDp3gKOfW88FlCc78lwBVtQuEm5gvipHpIu9IiFdT+4jl37hearIWmxUZ8y8NTDUWwnOiKQi2AaYJYdynLQFXqyNJANyttGIhqOn+7Bwsd7oHumLYYiOqoLAFyGPgNUJIBsCti/I47l/zAJmX5KlEwuDLFgNZMVvxcO1LEMEk8oEsTaA1ew56U+Ryi2dgqhOEIlS3hiaQy7HpmIgQyRjtLAUWrWPMcgZy/wt5MuyrgtnqwdOdWLhx7vhZ6QnzlqwWmTzx4N/hg0AN5owasl6RzAcgY+vtiC2xNNKBTloZWpcgptpKxWQxNCEWDdy9fwnK35Utv9kjJuLSaQSRWwZkUc25dM4pbgPuT1ySeQCL1BgIW+golvdHyBD//bQqTZEbN3bfWIlAYNQOWkSCxdDlBdfq8Vk2NBGAVezeeL5+ZfrHbK33O9RChiYj0J/0DG5nw3ffjRnQSG7rmWQFg6Ebm0QF3SnHgqskJhdYZWQMAMghJuEv7kv/mcn+Gn/X70OBg7GDQA6s1JIAb5Vp8nyiRJzCY+vTQVU6KMW4K31qKCGYpoePrANex5uR96IsirnEWNs+nHoT7qGdilC6V6RCCsXhbBzuVER/SBiIK8B68taRaSOQstd37BP+aa73HCdL9AnfsIdQWgmiZIEC5fvA2TYiIS8rOgsK5h/UHH4Va7rvzcr81Ihb6nViSwffEE5GTSZwPB7w2D15p6Mgam/t2XjvCV7lut97+Z8+oKAAlY5Uw//9Cfsrjpf3axFROjmghHixI0EIo2YcMrX2HX/rQ71LRo3NapgHJqGxDliShFjIJjilYlEze6vB8d0encAwQZerMmWu78A6cl9fn5JT0T2N413ozQXTRWn8k4E/Rg372nCT//pSG4s8J0MkVG5GQvX2zB5FgIBUO0HSnOf/oH1/H8y/2+A7dqoY3uF5qg8Vh/oNfi96zUaOfR0bIIdiydjIGc8AlaAFz4rX9LnK8I3xv/2+Vpeu7v3hPAz3+Zt4GqPE5TCzhVLcDfybqdIS2ue884tN0Tw9ZDPdi4x629kut5DZ/0jlkcMDL/P1xqwaRwAIEwsO7gdex+qTTJ8mpiuo9U08Dvzk7ha/z6DKIODbEEK+nzukrfKQNrlunY2TkJA0YBvRkLrd+8yi1BV6IdDo5lwuRNHXHQ8z6xrAnPrZiINy+kMe/h3jJKUovYnXOqAlDtcvRgR3fH0TYnzhvo1H/deqQHm/f1g/qvlZIX6RM+//VkHHi9H9v356DHfapo6mxoH/lSAx+fm4xb7dbi56k8vj7jqg8I7uxaCnLdijBW3p9Ay51XQDMVXtrxrpmec/XSEHfmFFFF9QB+8m/9mLeiR6kdeTJ51x6G8lKsDoCyeB7lUIpvZ6yZlIHu58dh/mwhfHmQE+063otn9/RXLW6lMwDL86si2lxlQs4W/ifnp2BqNMALb1xbNYYr/Qa+Nv0Kj4aIjopuRdmswZUBDJmUaHlaQQ2RiDsa89IYCX/N0jC2LRuPAWUeNRLW8Nb7ffinh5P2Gt2sUOvcUVUAvBos/81p5/lmtM2KI511hM8zXBoRjAawo7sXG/cQpaiOVmq4/cAypKy0q4UKef1U2yng47NTcGssWBS+FHRQY7iasXDHtKvcF3AQlJkh+QSl7Ux32CzXRyXvvqSJJ5eHsLNzAjK50rI5KdpblzK4d2WPoKObqB1VBUDwLxmqE4eT8I/uTqBtTsJV1eTnKpFIWAe2He3D5r2USPmEnK5ygtNCd+ASIBHnc9r51S24tTmIgt0rKDZf+D2BoKbhSrqAO6Zd47i4IjLRTHZFSl5ikBGPFD6nnaU0oUGVW/fzS98YjTC8fj6N+atSiCUCNzxrVBWA0jDMwLE9cbTNjCHNTZJKxlQu9m7JEjV4PQp0daewcc9AKdf6aYz9O7lAKfxPzk3A1HgAecr0+CHuKw75O4uDcDVjKCB4ewNusfv5KKKdtctC2LaE+tTFmTvlXkIqfFJDY4jT3NHZFNofF9FbLdUB+RRVASieKKuauxOYPyuMTNad77q10a0tYZ1h+4lebNqTLfqEWuooooSh4aN3x9maXxpq+mEY1Ex8lbZw+/SeEksQcPGMwtczSuFv6UxgIGfDa5eyqaytWrlaj4pGgNfOZrHgiVRVv6feuDYAeDPFwBv7YvjHb+kgx0nu0m8JjkAIBLIKSrwYIrqFvT9J4okuE5HmMu1GRZqUZEUjFn775ni0xIGCKSqVzlF58iGogWe3M5b24r8+AqJRITy15O3WfsplGLY8HsLaBVHkM4BBz6OR79FE79nuK/hDBxAIb1zK4v5Hye/VNrVXAwCCh0kzfrwvWgRArMZdW5EOWMT9QkByrMQLQKUogZex8xoH4D/fHI/WOBTqkV00Uc30H1VhCFJtZ8DAzKV9+M3/GByASlYn+hYmtq3SsXZBBLkslQnLK5pLi+1SPAHw9ns5zFtJVOQeIvA1t1r3iKmRz7HdMcyfoSOdq1INZyY0av8BCEdM7Djej03fkxlkucdxp/6kkVS2+N+z49BKBTxLacRw8AN2nuHWNtL+3lwBU+9KllKQt8CmBA2if6HhyeVBbOuMIZ8RIKgHNwoF+ABjoLZnNGzh5LkBdDyZshtGokBY7ajBAtyXIF4mEO6fqZf4AaIbPp/J+7jCQmj0o+t4Ghu/nyurFV6npVmU0QqhchBg4NNz4zE5Ag5CsZVJ3Sy7XywtMmgx9OWByXddKyZZTqNfCKVccigntckS1i4LYsvihAsEPu5oirKJCkw8wnDsTB8eWCvWSEet3bMbBMAEMxkPCw/vDKF9ThTZNHG8dze7PYsZZth6oh9b9tqaL/t+tnBrbXCIsoWFy2fHYXJMQ8Hw51eq56eyQOv062IW1KebpdKQCrxXCdKUAywOoWtJDIW0BcOVIzoeMKYzHD6VwaL1OUTHef1UNf2vYZuqX59WaKaF7l067psVRjbrMVPaoaIz7DyZLWq+N05VF+zHza7OlyWzV+DTs824JcpgeLghoAHJLDB1ei/nev/ygpqtetv+zhqkf+JZ8OIgti6OIZ8VeZYTegQRiVg4/E4ai9cPIJIQr0a4kRCUM0Wt1VCvkKTTIhDun60jY8fL1HWiB+s6QbSTL2ohcXnAFCMh6rUo2oFdp6+lJkMP/fuzCUyMBGFYYq6IhJ+iZso0H873KqECJpooOlMSGI9/IOXr72VYuzjgAQHgmv+LDBY9mysK/0aoRz5WTQCUj1hE6HZkVwQLZoc5CKT5244rtFPBCnlV02T43bkoTv4ii/V7Ci4/US5JEiCMw6SYiDRI81un99oOt3LiRdSybnkIj96ro+VbSe5QvZVQqSDyZyZpYnVnE3aQJQyQgjEc+lkaizc5nF+dbPzPqAmAShenh8wSHT0XQtu3I9hyuB8b9+ZrLKxZ+PB0DLcnNGghhh0nM9xqeAhnlz9cEYglnKhM0D471wxKulqmEZKltEMJF+NlZTGrSEU4opRtS2LI500k0xamzvD/bvG+xUFiE2sXN2HHw1Ec+Vkai54RyiIPr5J6G0TlZDhoADiP2TH038/V8K/vUKLl9FPVurrUKKH5Jj46HcPUhAbDdqp6hGFbdxpbXrCvUQF54ue//kuABRl+81uzOuApC6sfYuhaEseATXncaecIhHQRwGrl829+I4D3PqDOX22JVjXLqAsATp5giUiA7lpmEk3Udix8fDqKW2MaBpTzuPOMMGw/nsPmfU7O4OfY6NxMWgjBm2Q5ZXOhodyZLtGwdVGs2BeW1+STEHkLrdMcEFxWp1aa7DmnoubfRPXTC8jgAajyEEXTJAqgNRrAh6d13BbXkC8zAU1l3q3H+rFtf6klVKwhecJcVfhbOsPIZ90TdVIYqiWIfoJ/saFEEUYCANWKalQwDDCgr580n+GjU2Hc1hzEgB1HEkBU/lWn20gwYd3EliN5bH/JzbV+Ju3VeLonCYs4f3Wnhq7FVFqQ3xS7b0yq89FckF1g45Zg05EaxvLkjBIw3oSqD+2oaxi0BXAAlDkdtUDB60AsgP4+SuAsfHJKR0ucIe/aoEuDWWJGTRzOuCL5hM2Hs+j6AVFb6RYlauzzeSCfd8fJGH7LolBR+MIapRA1MSPEnBH5INOQyhtonUFDRM5gVrmcpZryVeN/7j9rzQNquRidI/2B/ClGEy2u+VNjlEC5245O9KAkRlwwInqJhk1sOJLHrpeNsr1b3zbi4iC2PxhClneyfFqdtvCdOVWxwkDA4s36v5qXwfUUE1VU2aMwaZ5UDhJXLu7VKq+6AuCX5pMmHtgUwNLvhJEWfo4fcnRcaKGzBanESVm0J0DDhlcH8NxBQUdFB+oZzKWIqz8FPLGoCV2dpPn+wi916u7zKJE8eb6AjrV5u7wg+hL8qAPv15WCakGakp+jXSG0zQzwZI33ZZVpatM0+aQy3/elVCfVa9PM0IYjOex+pXyIymmnk2FbZxg5wSJCZlQkpJYlFfmI8DSnZsN9AGm2PRBMe4nf/sDCvasoyeI2XbJE7mMGPxIkFLHeFOR92qIT7rNwbEcQ908LlNSOagGRzgnpFp45NIDdh0r7vTQ0RcLf8lATBjzdOuf6oohWtD7FEomKQrqBn/67iXmrCnzGyNCckflan/FGzxtyANQHIg090tWE+TObXGMsLpO0d7WUAGk70DDtkjlkYM+rjk/gczsPBbC9M8CFL51zKZ2pBTUxVScrueGwhX/5wODCr1aTulEhVzq/oQDQg5CwXt3WhI5ZDJmMaLj4mbmqpe4FCE199tU8dv1QRExrO7Uqmi+u4L2mpEFdN/HP75uYt9pANFGPbRe1Q9QAABwBk5Om8W4a0D2yPYj5MxlyOXdyVNtAkwmyhKcOiqmIHUtI8/2KcM69ywEaDjH89D8KZTS/fMm6dhFXPrMBAJS+eph4mCzh0OYmdMzRkPbsYqHtTnILEE2hyElnqbHcifNtTiZ3hpZR+kqbEvqh1iE5YJ4GCF+g68DbHzDc93j1Vmm9BF7yXEPthCs9OIFwcKOGhXdryOYovrbf0kFf4oNU1FMV7wySb8wq1picN3fYb+UQdMQCDFZBRFkU8/D9N3KcxCTACDGL9wHe+rWF+540eJJHWfpwvMCpYRZAoWbpBmrhE364SUP77ICdNLkhK+FtxUmrn/l21aST9Th22k/w5vvAvWsMxONS8IJubrSjNVjLaAgAfhGNOreZSQKvPsvQPpchm5aRSrl5f7eoXX3dihGUcK56mGZ3LLQ9bZSUsBstfG6xw0lBEhjiZXLMBzdoePAehv6svcnaTsr4QBT5BW5FDpxqbcz5vTOm6GUumoT+0QULC9e5d/IMVosH8/1hB0CNejgdPcPQPscA1ZDE/KconqkVAMcZi7diiYEwfpb9di36jlq5ZIjpwOuXgPZ11IKszx7fwQhefnfYAXC2HdmT0EkTh9YzLLwH6FPKCSXRA5/1t6cQlL46f2Vc8f9uENekBvqPLlpo3wBEE064OhyUM6KioHIaRLWjg+s1LPyOpRTwaims2eOQCiAx3cLx8wwPPVPaM65HOXmwVjACLMBZQrGxQrOoKZPTUcfd4D7B7yifLYuzqb35+nkTHc+wYoYrKa/WybXBCrja94cdABcNeFqKPFnbwNAx10K/Usr2TmZL/6D6iRiVlC8AHRuASKLcSwOHPtMd8QBUekAqT6eSBg6uBx6YC/R7/s8AHsbxsrZdr7d7CzRV/dq5IB54lmin/JzQmA9QpO+qAXmaHuQTyDFzS3CBUKrBUe5wmU07qvCdNzFW08pGfj7sFFTrYmkC79BGA+2zDPSXqfe7hd/Yqmat6xgVUVCl6OgQZcyz8rZjptKB6NFK2nlwoxg1HB3iHyGZcE3aY9MSOebDmy3cNz2HTFb0BUn4r18MYeEGynDVTRHD72SrrW0UUFCpEHlnbauJe+8SL/778aUmLNwgdrxXG3uvJpBGfz4KAPAU5ezN17SL5eROUYKe/5R80cbI1/gSHzAq/itDu+omp9jkIsS7Jsptxqj89pRGa7rf/UbN/yUp4331jelyQa6dNCNBqjf0DGwzi48fP8002fkb+l6jTy4zDOXw/ciM8auLabQAUH0lo/KMdPK6aGOMBj8wKiVc8aHZ5nTy2iYOwKigoT8zBEj7uW+T6xoDoZEIC+13AcAzyuaJm/4UvG1s5KP8/7uXI/wSAMZAGFp10DRrel9PzwX1LmVrVmPWUD8wKOEKBKzNXuH7WoD3tgIInlXexRim1e+x/nyvRAKn1ZHQ6aef4OXq/w9YC12DveQQLQAAAABJRU5ErkJggg==",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new BinanceWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: false,
      });
      handelWCSessionRequest(wallet, binanceWalletUris);
      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isBinanceWalletInstalled,
  };
};

function isBinanceWalletInstalled() {
  return !!getInjectedBinanceProvider();
}

function ConnectUI(props: ConnectUIProps<BinanceWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig["meta"]}
      setConnectedWallet={(w) => props.setConnectedWallet(w as BinanceWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={binanceWalletUris}
      walletLocale={locale.wallets.binanceWallet}
      isInstalled={isBinanceWalletInstalled}
    />
  );
}
