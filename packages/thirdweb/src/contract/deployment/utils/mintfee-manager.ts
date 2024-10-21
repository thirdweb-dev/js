import type { ClientAndChain } from "../../../utils/types.js";
import { TW_SIGNER_1, TW_SIGNER_2, TW_SIGNER_3, MULTISIG_REQUIRED_APPROVALS } from "./bootstrap.js";
import { getDeployedInfraContract, getPredictedInfraContractAddress } from "./infra.js";

/**
 * @internal
 */
export async function getDeployedMintFeeManagerContract(args: ClientAndChain) {
  // check if Multisig is deployed
  const multisig = await getDeployedInfraContract({
    ...args,
    contractId: "MultiSig",
    constructorParams: { _signers: [TW_SIGNER_1, TW_SIGNER_2, TW_SIGNER_3], _requiredApprovals: MULTISIG_REQUIRED_APPROVALS },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });
  if (!multisig) {
    return null;
  }

  // check if MintFeeManager is deployed
  const mintfeeManager = await getDeployedInfraContract({
    ...args,
    contractId: "MintFeeManagerCore",
    constructorParams: { _owner: multisig, _modules: [], _moduleInstallData: [] },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });
  if (!mintfeeManager) {
    return null;
  }
  return mintfeeManager;
}

/**
 * @internal
 */
export async function getDeployedMultisigContract(args: ClientAndChain) {
  const multisig = await getDeployedInfraContract({
    ...args,
    contractId: "MultiSig",
    constructorParams: { _signers: [TW_SIGNER_1, TW_SIGNER_2, TW_SIGNER_3], _requiredApprovals: MULTISIG_REQUIRED_APPROVALS },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });
  if (!multisig) {
    return null;
  }

  return multisig;
}

/**
 * @internal
 */
export async function getPredictedMintFeeManagerAddress(args: ClientAndChain) {
  // compute multisig address
  const multisig = await getPredictedInfraContractAddress({
    ...args,
    contractId: "MultiSig",
    constructorParams: { _signers: [TW_SIGNER_1, TW_SIGNER_2, TW_SIGNER_3], _requiredApprovals: MULTISIG_REQUIRED_APPROVALS },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });

  // compute mintfee manager address
  const mintfeeManager = await getPredictedInfraContractAddress({
    ...args,
    contractId: "MintFeeManagerCore",
    constructorParams: { _owner: multisig, _modules: [], _moduleInstallData: [] },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });
  
  return mintfeeManager;
}

/**
 * @internal
 */
export async function getPredictedMultisigAddress(args: ClientAndChain) {
  // compute multisig address
  const multisig = await getPredictedInfraContractAddress({
    ...args,
    contractId: "MultiSig",
    constructorParams: { _signers: [TW_SIGNER_1, TW_SIGNER_2, TW_SIGNER_3], _requiredApprovals: MULTISIG_REQUIRED_APPROVALS },
    publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936", // TODO: remove before merging
  });

  return multisig;
}
