import { useQuery } from "@tanstack/react-query";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";

/**
 * @internal
 */
export function useWalletInfo(id: WalletId) {
  return useQuery<WalletInfo>({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      switch (id) {
        // case "local": {
        //   return {
        //     id: "local",
        //     name: "Local Wallet",
        //     homepage: "https://thirdweb.com",
        //     app: {
        //       browser: null,
        //       ios: null,
        //       android: null,
        //       mac: null,
        //       windows: null,
        //       linux: null,
        //       chrome: null,
        //       firefox: null,
        //       safari: null,
        //       edge: null,
        //       opera: null,
        //     },
        //     rdns: null,
        //     mobile: {
        //       native: null,
        //       universal: null,
        //     },
        //     desktop: {
        //       native: null,
        //       universal: null,
        //     },
        //   } as WalletInfo;
        // }
        case "embedded": {
          return {
            id: "embedded",
            name: "Social Login",
            homepage: "https://thirdweb.com",
            app: {
              browser: null,
              ios: null,
              android: null,
              mac: null,
              windows: null,
              linux: null,
              chrome: null,
              firefox: null,
              safari: null,
              edge: null,
              opera: null,
            },
            rdns: null,
            mobile: {
              native: null,
              universal: null,
            },
            desktop: {
              native: null,
              universal: null,
            },
          } as WalletInfo;
        }
        case "smart": {
          return {
            id: "smart",
            name: "SmartWallet",
            homepage: "https://thirdweb.com",
            app: {
              browser: null,
              ios: null,
              android: null,
              mac: null,
              windows: null,
              linux: null,
              chrome: null,
              firefox: null,
              safari: null,
              edge: null,
              opera: null,
            },
            rdns: null,
            mobile: {
              native: null,
              universal: null,
            },
            desktop: {
              native: null,
              universal: null,
            },
          } as WalletInfo;
        }
        default: {
          return getWalletInfo(id, false);
        }
      }
    },
    retry: false,
  });
}

/**
 * @internal
 */
export function useWalletImage(id: WalletId) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      switch (id) {
        // case "local": {
        //   return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzY0KSIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV82NCkiPgo8cGF0aCBkPSJNNTguNzUgMTkuMTY2N0gyMS4yNUMxOC45NTgzIDE5LjE2NjcgMTcuMDgzMyAyMS4wNDE3IDE3LjA4MzMgMjMuMzMzNFY0OC4zMzM0QzE3LjA4MzMgNTAuNjI1IDE4Ljk1ODMgNTIuNSAyMS4yNSA1Mi41SDM1LjgzMzNMMzEuNjY2NyA1OC43NVY2MC44MzM0SDQ4LjMzMzNWNTguNzVMNDQuMTY2NyA1Mi41SDU4Ljc1QzYxLjA0MTcgNTIuNSA2Mi45MTY3IDUwLjYyNSA2Mi45MTY3IDQ4LjMzMzRWMjMuMzMzNEM2Mi45MTY3IDIxLjA0MTcgNjEuMDQxNyAxOS4xNjY3IDU4Ljc1IDE5LjE2NjdaTTU4Ljc1IDQ0LjE2NjdIMjEuMjVWMjMuMzMzNEg1OC43NVY0NC4xNjY3WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfNjQiIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNDRTExQUIiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOTAwQkI1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMV82NCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1IDE1KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";
        // }
        case "embedded": {
          return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzM1ODlfODY0OSkiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSI4IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMzU4OV84NjQ5KSIvPgo8cmVjdCB4PSItMSIgeT0iLTEiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcng9IjkuOCIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzM1ODlfODY0OSkiLz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzM1ODlfODY0OSkiPgo8cGF0aCBkPSJNMjQgMTQuMjVDMTguNjE3MiAxNC4yNSAxNC4yNSAxOC42MTcyIDE0LjI1IDI0QzE0LjI1IDI5LjM4MjggMTguNjE3MiAzMy43NSAyNCAzMy43NUMyNC44OTg4IDMzLjc1IDI1LjYyNSAzNC40NzYyIDI1LjYyNSAzNS4zNzVDMjUuNjI1IDM2LjI3MzggMjQuODk4OCAzNyAyNCAzN0MxNi44MTk1IDM3IDExIDMxLjE4MDUgMTEgMjRDMTEgMTYuODE5NSAxNi44MTk1IDExIDI0IDExQzMxLjE4MDUgMTEgMzcgMTYuODE5NSAzNyAyNFYyNS42MjVDMzcgMjguMzE2NCAzNC44MTY0IDMwLjUgMzIuMTI1IDMwLjVDMzAuNjM3MSAzMC41IDI5LjMwMTYgMjkuODI5NyAyOC40MDc4IDI4Ljc3ODVDMjcuMjUgMjkuODQ0OSAyNS43MDEyIDMwLjUgMjQgMzAuNUMyMC40MDk4IDMwLjUgMTcuNSAyNy41OTAyIDE3LjUgMjRDMTcuNSAyMC40MDk4IDIwLjQwOTggMTcuNSAyNCAxNy41QzI1LjQxNjggMTcuNSAyNi43MjcgMTcuOTUyIDI3Ljc5MzQgMTguNzIzOEMyOC4wODI4IDE4LjQ2OTkgMjguNDU4NiAxOC4zMTI1IDI4Ljg3NSAxOC4zMTI1QzI5Ljc3MzggMTguMzEyNSAzMC41IDE5LjAzODcgMzAuNSAxOS45Mzc1VjI1LjYyNUMzMC41IDI2LjUyMzggMzEuMjI2MiAyNy4yNSAzMi4xMjUgMjcuMjVDMzMuMDIzOCAyNy4yNSAzMy43NSAyNi41MjM4IDMzLjc1IDI1LjYyNVYyNEMzMy43NSAxOC42MTcyIDI5LjM4MjggMTQuMjUgMjQgMTQuMjVaTTI3LjI1IDI0QzI3LjI1IDIzLjEzOCAyNi45MDc2IDIyLjMxMTQgMjYuMjk4MSAyMS43MDE5QzI1LjY4ODYgMjEuMDkyNCAyNC44NjIgMjAuNzUgMjQgMjAuNzVDMjMuMTM4IDIwLjc1IDIyLjMxMTQgMjEuMDkyNCAyMS43MDE5IDIxLjcwMTlDMjEuMDkyNCAyMi4zMTE0IDIwLjc1IDIzLjEzOCAyMC43NSAyNEMyMC43NSAyNC44NjIgMjEuMDkyNCAyNS42ODg2IDIxLjcwMTkgMjYuMjk4MUMyMi4zMTE0IDI2LjkwNzYgMjMuMTM4IDI3LjI1IDI0IDI3LjI1QzI0Ljg2MiAyNy4yNSAyNS42ODg2IDI2LjkwNzYgMjYuMjk4MSAyNi4yOTgxQzI2LjkwNzYgMjUuNjg4NiAyNy4yNSAyNC44NjIgMjcuMjUgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8zNTg5Xzg2NDkiIHgxPSIyNS41IiB5MT0iLTYuMjk1NzJlLTA2IiB4Mj0iMzAuMjAxNiIgeTI9IjQ3LjUzNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjODM1OEJBIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzdCMUNGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMzU4OV84NjQ5IiB4MT0iMjUuNTYyNSIgeTE9Ii0xLjAwMDAxIiB4Mj0iMzAuNDYiIHkyPSI0OC41MTU2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU4QkEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0IxQ0Y3Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMzU4OV84NjQ5Ij4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPGNsaXBQYXRoIGlkPSJjbGlwMV8zNTg5Xzg2NDkiPgo8cmVjdCB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMSAxMSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K";
        }
        case "smart": {
          return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzkxKSIvPgo8cGF0aCBkPSJNMzkuOTk2OSAxOEw0MC4yMzMzIDE4LjAxNTZMNDAuMzUxMyAxOC4wMzMzTDQwLjQ3MzYgMTguMDYyMkw0MC42OTU4IDE4LjEzNzhDNDAuODQ5NCAxOC4yMDA2IDQwLjk5NTQgMTguMjg0MiA0MS4xMzA1IDE4LjM4NjdMNDEuMzM4NyAxOC41Njg5TDQxLjg0OTMgMTkuMDUzM0M0NS44ODkxIDIyLjc3NjggNTAuOTk0NyAyNC43NzYyIDU2LjI0NTggMjQuNjkxMUw1Ni45MzA3IDI0LjY2ODlDNTcuMzc4MyAyNC42NDYyIDU3LjgyIDI0Ljc5MDkgNTguMTg0OSAyNS4wNzk4QzU4LjU0OTggMjUuMzY4NyA1OC44MTY3IDI1Ljc4NSA1OC45NDMxIDI2LjI2MjJDNTkuOTI3MSAyOS45NzY5IDYwLjIyODMgMzMuODczMSA1OS44Mjg3IDM3LjcxOTRDNTkuNDI4OSA0MS41NjU4IDU4LjMzNjcgNDUuMjgzNiA1Ni42MTY1IDQ4LjY1MjNDNTQuODk2NSA1Mi4wMjA3IDUyLjU4MzYgNTQuOTcxNCA0OS44MTU2IDU3LjMyODVDNDcuMDQ3NiA1OS42ODU2IDQzLjg4MDkgNjEuNDAxMiA0MC41MDM2IDYyLjM3MzRDNDAuMTc0IDYyLjQ2ODMgMzkuODI4IDYyLjQ2ODMgMzkuNDk4MiA2Mi4zNzM0QzM2LjEyMDkgNjEuNDAxNCAzMi45NTM4IDU5LjY4NiAzMC4xODU2IDU3LjMyODlDMjcuNDE3NiA1NC45NzE4IDI1LjEwNDUgNTIuMDIxNCAyMy4zODQyIDQ4LjY1MjlDMjEuNjYzOCA0NS4yODQzIDIwLjU3MTMgNDEuNTY2MiAyMC4xNzE1IDM3LjcxOThDMTkuNzcxNyAzMy44NzM0IDIwLjA3MjcgMjkuOTc2OSAyMS4wNTY3IDI2LjI2MjJDMjEuMTgzMSAyNS43ODUgMjEuNDUwMSAyNS4zNjg3IDIxLjgxNSAyNS4wNzk4QzIyLjE3OTkgMjQuNzkwOSAyMi42MjE1IDI0LjY0NjIgMjMuMDY5MyAyNC42Njg5QzI4LjU1MTMgMjQuOTQ3IDMzLjkyOTMgMjIuOTQ0NCAzOC4xNTA3IDE5LjA1MzNMMzguNjc3MyAxOC41NTMzTDM4Ljg2OTYgMTguMzg2N0MzOS4wMDQ3IDE4LjI4NDIgMzkuMTUwNSAxOC4yMDA2IDM5LjMwNCAxOC4xMzc4TDM5LjUyODIgMTguMDYyMkMzOS42MDY5IDE4LjA0MTIgMzkuNjg2NSAxOC4wMjU2IDM5Ljc2NjcgMTguMDE1NkwzOS45OTY5IDE4Wk00MC4wMDA5IDMzLjU1NTZDMzguOTkwNSAzMy41NTUxIDM4LjAxNzMgMzMuOTc4NyAzNy4yNzY1IDM0Ljc0MTFDMzYuNTM1NiAzNS41MDM2IDM2LjA4MTYgMzYuNTQ4NSAzNi4wMDU4IDM3LjY2NjdMMzUuOTk1OCAzOEwzNi4wMDU4IDM4LjMzMzRDMzYuMDU1MSAzOS4wNTQ3IDM2LjI2MjUgMzkuNzUxOCAzNi42MDk4IDQwLjM2NEMzNi45NTY5IDQwLjk3NjIgMzcuNDMzNiA0MS40ODUxIDM3Ljk5ODUgNDEuODQ2N1Y0NS43Nzc4TDM4LjAxMjUgNDYuMDM3OEMzOC4wNzI3IDQ2LjYwMDMgMzguMzI0MiA0Ny4xMTU4IDM4LjcxNTYgNDcuNDc5NEMzOS4xMDcxIDQ3Ljg0MjkgMzkuNjA4NyA0OC4wMjY5IDQwLjExODIgNDcuOTkzOEM0MC42Mjc4IDQ3Ljk2MDUgNDEuMTA2NyA0Ny43MTI3IDQxLjQ1NzEgNDcuMzAwOUM0MS44MDc2IDQ2Ljg4ODkgNDIuMDAyOSA0Ni4zNDQzIDQyLjAwMzYgNDUuNzc3OEw0Mi4wMDU2IDQxLjg0ODlDNDIuNzY5MSA0MS4zNTk2IDQzLjM2NiA0MC42MDQyIDQzLjcwMzQgMzkuNzAwMkM0NC4wNDA3IDM4Ljc5NiA0NC4wOTk2IDM3Ljc5MzggNDMuODcxMSAzNi44NDg3QzQzLjY0MjcgMzUuOTAzNiA0My4xMzk2IDM1LjA2ODUgNDIuNDM5OCAzNC40NzMxQzQxLjc0IDMzLjg3NzYgNDAuODgyNyAzMy41NTUxIDQwLjAwMDkgMzMuNTU1NloiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xXzkxKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzFfOTEiIHgxPSI0MCIgeTE9IjAiIHgyPSI0MCIgeTI9IjgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4MzU2QkQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0MyMEY0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xXzkxIiB4MT0iNDAiIHkxPSIxOCIgeDI9IjQwIiB5Mj0iNjIuNDQ0NSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNFMUQ4RkIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K";
        }
        default: {
          return getWalletInfo(id, true);
        }
      }
    },
    retry: false,
  });
}
