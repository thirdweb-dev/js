export {
  prepareEvent,
  type EventLog,
  type ContractEvent,
  type ContractEventOptions as ContractEventInput,
} from "./event.js";

export { watchEvents } from "./actions/watch-events.js";
export { getEvents } from "./actions/get-events.js";
