export const GENERATED_ABI = {} as const;
export type ContractAddress = keyof typeof GENERATED_ABI;
export type ContractAbi = (typeof GENERATED_ABI)[ContractAddress];
