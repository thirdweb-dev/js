// Import the base contracts'
import baseContracts from "../../constants/base-contracts";

export function hasBaseContract(name: string): boolean {
  return baseContracts[name as keyof typeof baseContracts] !== undefined;
}

export function readBaseContract(name: string): string {
  return baseContracts[name as keyof typeof baseContracts];
}
