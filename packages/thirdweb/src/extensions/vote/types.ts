// biome-ignore lint/nursery/noEnum: TODO convert this
export enum VoteType {
  against = 0,
  for = 1,
  abstain = 2,
}

// biome-ignore lint/nursery/noEnum: TODO convert this
export enum ProposalState {
  pending = 0,
  active = 1,
  canceled = 2,
  defeated = 3,
  succeeded = 4,
  queued = 5,
  expired = 6,
  executed = 7,
}
