import { ContractPayload } from "../interfaces/ContractPayload";
import { ProjectType } from "../types/ProjectType";
import { BrownieBuilder } from "./brownie";
import { FoundryBuilder } from "./foundry";
import { HardhatBuilder } from "./hardhat";
import { SolcBuilder } from "./solc";
import { TruffleBuilder } from "./truffle";
import { ZKHardhatBuilder } from "./zkHardhat";

export default async function build(
  path: string,
  projectType: ProjectType,
  options: any,
): Promise<{
  contracts: ContractPayload[];
}> {
  let builder;
  switch (projectType) {
    case "hardhat": {
      builder = new HardhatBuilder();
      break;
    }
    case "zk-hardhat": {
      builder = new ZKHardhatBuilder();
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
    clean: options.clean,
    zksync: options.zksync,
  });
}
