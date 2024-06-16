import { beforeAll, describe, expect, test } from "vitest";
import { ANVIL_CHAIN } from "../../../../../test/src/chains.js";
import { renderHook, waitFor } from "../../../../../test/src/react-render.js";
import { TEST_CLIENT } from "../../../../../test/src/test-clients.js";
import {
  TEST_ACCOUNT_A,
  TEST_ACCOUNT_B,
} from "../../../../../test/src/test-wallets.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../../contract/contract.js";
import { mintTo } from "../../../../extensions/erc20/write/mintTo.js";
import { deployERC20Contract } from "../../../../extensions/prebuilts/deploy-erc20.js";
import type { Address } from "../../../../utils/address.js";
import { toWei } from "../../../../utils/units.js";
import { usePrepareTransaction } from "./usePrepareTransaction.js";

describe.runIf(process.env.TW_SECRET_KEY)("usePrepareTransaction", () => {
  let erc20Contract: ThirdwebContract;

  beforeAll(async () => {
    erc20Contract = getContract({
      address: await deployERC20Contract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        params: {
          contractURI: "https://example.com",
          name: "Test",
          symbol: "TST",
        },
        type: "TokenERC20",
      }),
      chain: ANVIL_CHAIN,
      client: TEST_CLIENT,
    });
  }, 60000);

  test("should prepare extension transaction", async () => {
    const { result } = renderHook(() =>
      usePrepareTransaction(mintTo, {
        contract: erc20Contract,
        from: TEST_ACCOUNT_A.address as Address,
        to: TEST_ACCOUNT_B.address as Address,
        amountWei: toWei("1"),
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20000,
    });

    expect(result.current.data).toEqual({
      to: erc20Contract.address,
      chainId: 31337,
      data: "0x449a52f800000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000de0b6b3a7640000",
      gas: 131498n,
      nonce: expect.any(Number),
      accessList: undefined,
      value: undefined,
      maxFeePerGas: expect.any(BigInt),
      maxPriorityFeePerGas: expect.any(BigInt),
      client: expect.any(Object),
      chain: {
        id: 31337,
        name: "Anvil",
        rpc: expect.any(String),
        testnet: true,
        nativeCurrency: { name: "Anvil Ether", symbol: "ETH", decimals: 18 },
      },
      _isSerializableTransaction: true,
    });
  });

  test("should prepare contract call", async () => {
    const { result } = renderHook(() =>
      usePrepareTransaction(
        {
          contract: erc20Contract,
          method: "function mintTo(address to, uint256 amount)",
          params: [TEST_ACCOUNT_B.address as Address, toWei("1")],
        },
        {
          from: TEST_ACCOUNT_A.address as Address,
        },
      ),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20000,
    });

    expect(result.current.data).toEqual({
      to: erc20Contract.address,
      chainId: 31337,
      data: "0x449a52f800000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000de0b6b3a7640000",
      gas: 131498n,
      nonce: expect.any(Number),
      accessList: undefined,
      value: undefined,
      maxFeePerGas: expect.any(BigInt),
      maxPriorityFeePerGas: expect.any(BigInt),
      client: expect.any(Object),
      chain: {
        id: 31337,
        name: "Anvil",
        rpc: expect.any(String),
        testnet: true,
        nativeCurrency: { name: "Anvil Ether", symbol: "ETH", decimals: 18 },
      },
      _isSerializableTransaction: true,
    });
  });

  test("should prepare raw transfer", async () => {
    const { result } = renderHook(() =>
      usePrepareTransaction(
        {
          to: TEST_ACCOUNT_B.address as Address,
          value: toWei("1"),
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
        },
        {
          from: TEST_ACCOUNT_A.address as Address,
        },
      ),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 20000,
    });

    expect(result.current.data).toEqual({
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      chainId: 31337,
      data: "0x",
      gas: 21001n,
      nonce: expect.any(Number),
      accessList: undefined,
      value: 1000000000000000000n,
      maxFeePerGas: expect.any(BigInt),
      maxPriorityFeePerGas: expect.any(BigInt),
      client: expect.any(Object),
      chain: {
        id: 31337,
        name: "Anvil",
        rpc: expect.any(String),
        testnet: true,
        nativeCurrency: { name: "Anvil Ether", symbol: "ETH", decimals: 18 },
      },
      _isSerializableTransaction: true,
    });
  });
});
