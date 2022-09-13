import { ContractPayload } from "../interfaces/ContractPayload";
import { ProjectType } from "../types/ProjectType";
import { BrownieBuilder } from "./brownie";
import { FoundryBuilder } from "./foundry";
import { HardhatBuilder } from "./hardhat";
import { SolcBuilder } from "./solc";
import { TruffleBuilder } from "./truffle";

export default async function build(
  path: string,
  projectType: ProjectType,
): Promise<{
  contracts: ContractPayload[];
}> {
  let builder;
  switch (projectType) {
    case "hardhat": {
      builder = new HardhatBuilder();
      break;
    }
    case "foundry": {
      builder = new FoundryBuilder();
      break;
    }
    case "truffle": {
      builder = new TruffleBuilder();
      break;
    }
    case "brownie": {
      builder = new BrownieBuilder();
      break;
    }
    default: {
      builder = new SolcBuilder();
      break;
    }
  }
  return await builder.compile({
    name: "",
    projectPath: path,
  });
}
