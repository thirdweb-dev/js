import type { BiconomyOptions } from "./providers/biconomy.js";
import type { EngineOptions } from "./providers/engine.js";
import type { OpenZeppelinOptions } from "./providers/openzeppelin.js";

export type GaslessOptions =
  | EngineOptions
  | OpenZeppelinOptions
  | BiconomyOptions;
