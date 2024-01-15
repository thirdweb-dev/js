import type { MethodType } from "../abi/resolveAbiFunction.js";
import type { GetMethodInputs, ParseMethod } from "../abi/types.js";
import type { ThirdwebClient } from "../client/client.js";
import type {
  GetContractOptions,
  ThirdwebContract,
} from "../contract/index.js";

type BaseTransactionOptions<method extends MethodType> = {
  method: method;
  params: GetMethodInputs<method> | (() => Promise<GetMethodInputs<method>>);
};

export type TransactionOptions<
  client extends ThirdwebClient,
  method extends MethodType,
> = client extends ThirdwebContract
  ? BaseTransactionOptions<method>
  : GetContractOptions & BaseTransactionOptions<method>;

export type Transaction<
  contract extends ThirdwebContract = ThirdwebContract,
  method extends MethodType = MethodType,
> = {
  contract: contract;
  options: BaseTransactionOptions<method>;
  _abiFn: null | Promise<ParseMethod<method>>;
  _encoded: null | Promise<string>;
};
