import { PercentSchema } from "../../../core/schema/shared";
import { BigNumberishSchema, BigNumberSchema } from "../shared/BigNumberSchema";
import { AddressOrEnsSchema } from "../shared/AddressOrEnsSchema";
import {
  CommonContractOutputSchema,
  CommonContractSchema,
  CommonTrustedForwarderSchema,
} from "./common";
import { z } from "zod";

export const VoteSettingsInputSchema = /* @__PURE__ */ (() =>
  z.object({
    voting_delay_in_blocks: z.number().min(0).default(0),
    voting_period_in_blocks: z.number().min(1).default(1),
    voting_token_address: AddressOrEnsSchema,
    voting_quorum_fraction: PercentSchema.default(0),
    proposal_token_threshold: BigNumberishSchema.default(1),
  }))();

export const VoteSettingsOuputSchema = /* @__PURE__ */ (() =>
  VoteSettingsInputSchema.extend({
    proposal_token_threshold: BigNumberSchema,
  }))();

export const VoteContractInput = /* @__PURE__ */ (() =>
  CommonContractSchema.merge(VoteSettingsInputSchema))();

export const VoteContractOutput = /* @__PURE__ */ (() =>
  CommonContractOutputSchema.merge(VoteSettingsOuputSchema))();

export const VoteContractDeploy = /* @__PURE__ */ (() =>
  VoteContractInput.merge(CommonTrustedForwarderSchema))();

export const VoteContractSchema = {
  deploy: VoteContractDeploy,
  output: VoteContractOutput,
  input: VoteContractInput,
};

export const ProposalOutputSchema = /* @__PURE__ */ (() =>
  z.object({
    proposalId: BigNumberSchema,
    proposer: z.string(),
    targets: z.array(z.string()),
    values: z.array(BigNumberSchema),
    signatures: z.array(z.string()),
    calldatas: z.array(z.string()),
    startBlock: BigNumberSchema,
    endBlock: BigNumberSchema,
    description: z.string(),
  }))();
