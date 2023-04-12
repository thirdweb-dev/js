import { EventType } from "../../constants";
import { ContractEvent, EventQueryOptions } from "../../types";
import { ContractWrapper } from "./contract-wrapper";
import type { BaseContract, Event, providers } from "ethers";
import type { EventFragment } from "ethers/lib/utils.js";
import type { EventEmitter } from "eventemitter3";

/**
 * Listen to Contract events in real time
 * @public
 */
export class ContractEvents<TContract extends BaseContract> {
  protected contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * Subscribe to transactions in this contract.
   * @remarks Will emit an "event" object containing the transaction status ('submitted' and 'completed') and hash
   * @example
   * ```javascript
   * contract.events.addTransactionListener((event) => {
   *   console.log(event);
   * }
   * ```
   * @param listener - the callback function that will be called on every transaction
   * @public
   */
  public addTransactionListener(listener: EventEmitter.ListenerFn) {
    this.contractWrapper.addListener(EventType.Transaction, listener);
  }

  /**
   * Remove a transaction listener
   * @remarks Remove a listener that was added with addTransactionListener
   * @example
   * ```javascript
   * contract.events.removeTransactionListener((event) => {
   *  console.log(event);
   * }
   * ```
   * @param listener - the callback function to remove
   * @public
   */
  public removeTransactionListener(listener: EventEmitter.ListenerFn) {
    this.contractWrapper.off(EventType.Transaction, listener);
  }

  /**
   * Subscribe to contract events
   * @remarks You can add a listener for any contract event to run a function when
   * the event is emitted. For example, if you wanted to listen for a "TokensMinted" event,
   * you could do the following:
   * @example
   * ```javascript
   * contract.events.addEventListener("TokensMinted", (event) => {
   *   console.log(event);
   * });
   * ```
   * @public
   * @param eventName - the event name as defined in the contract
   * @param listener - the callback function that will be called on every new event
   * @returns a function to un-subscribe from the event
   */
  public addEventListener<TEvent extends Record<string, any>>(
    eventName: keyof TContract["filters"] | (string & {}),
    listener: (event: ContractEvent<TEvent>) => void,
  ) {
    // validates event, throws error if not found
    const event = this.contractWrapper.readContract.interface.getEvent(
      eventName as string,
    );

    const address = this.contractWrapper.readContract.address;
    const filter = {
      address,
      topics: [
        this.contractWrapper.readContract.interface.getEventTopic(event),
      ],
    };

    const wrappedListener = (log: providers.Log) => {
      const parsedLog =
        this.contractWrapper.readContract.interface.parseLog(log);
      listener(
        this.toContractEvent<TEvent>(
          parsedLog.eventFragment,
          parsedLog.args,
          log,
        ),
      );
    };

    this.contractWrapper.getProvider().on(filter, wrappedListener);
    return () => {
      this.contractWrapper.getProvider().off(filter, wrappedListener);
    };
  }

  /**
   * Listen to all events emitted from this contract
   *
   * @example
   * ```javascript
   * contract.events.listenToAllEvents((event) => {
   *   console.log(event.eventName) // the name of the emitted event
   *   console.log(event.data) // event payload
   * }
   * ```
   * @public
   * @param listener - the callback function that will be called on every new event
   * @returns A function that can be called to stop listening to events
   */
  public listenToAllEvents<TEvent extends Record<string, any>>(
    listener: (event: ContractEvent<TEvent>) => void,
  ) {
    const address = this.contractWrapper.readContract.address;
    const filter = { address };

    const wrappedListener = (log: providers.Log) => {
      try {
        const parsedLog =
          this.contractWrapper.readContract.interface.parseLog(log);

        listener(
          this.toContractEvent<TEvent>(
            parsedLog.eventFragment,
            parsedLog.args,
            log,
          ),
        );
      } catch (e) {
        console.error("Could not parse event:", log, e);
      }
    };

    this.contractWrapper.getProvider().on(filter, wrappedListener);

    return () => {
      this.contractWrapper.getProvider().off(filter, wrappedListener);
    };
  }

  /**
   * Remove an event listener from this contract
   * @remarks Remove a listener that was added with addEventListener
   * @example
   * ```javascript
   * contract.events.removeEventListener("TokensMinted", (event) => {
   *   console.log(event);
   * });
   * ```
   * @public
   * @param eventName - the event name as defined in the contract
   * @param listener - the listener to unregister
   */
  public removeEventListener(
    eventName: keyof TContract["filters"] | (string & {}),
    listener: providers.Listener,
  ) {
    // validates event, throws error if not found
    const event = this.contractWrapper.readContract.interface.getEvent(
      eventName as string,
    );
    this.contractWrapper.readContract.off(event.name as string, listener);
  }

  /**
   * Remove all listeners on this contract
   * @remarks Remove all listeners from a contract
   * @example
   * ```javascript
   * contract.events.removeAllListeners();
   * ```
   * @public
   */
  public removeAllListeners() {
    this.contractWrapper.readContract.removeAllListeners();
    const address = this.contractWrapper.readContract.address;
    const filter = { address };
    this.contractWrapper.getProvider().removeAllListeners(filter);
  }

  /**
   * Get All Events
   * @remarks Get a list of all the events emitted from this contract during the specified time period
   * @example
   * ```javascript
   * // Optionally pass in filters to limit the blocks from which events are retrieved
   * const filters = {
   *   fromBlock: 0,
   *   toBlock: 1000000,
   * }
   * const events = await contract.events.getAllEvents(filters);
   * console.log(events[0].eventName);
   * console.log(events[0].data);
   * ```
   *
   * @param filters - Specify the from and to block numbers to get events for, defaults to all blocks
   * @returns The event objects of the events emitted with event names and data for each event
   */
  public async getAllEvents<TEvent extends Record<string, any>>(
    filters: Omit<EventQueryOptions, "filters"> = {
      fromBlock: 0,
      toBlock: "latest",
      order: "desc",
    },
  ): Promise<ContractEvent<TEvent>[]> {
    const fromBlock = filters.fromBlock as number;
    const toBlock =
      filters.toBlock === "latest"
        ? await this.contractWrapper.getProvider().getBlockNumber()
        : (filters.toBlock as number);

    let events: Event[] = [];
    try {
      // First we try to get the entire block range like before
      events = await this.queryChunk(fromBlock, toBlock);
    } catch {
      // Otherwise, we need to do chunking with retries
      const totalBlocks = fromBlock - toBlock + 1;

      // First try to figure out what chunk size we should use by finding max chunk size
      // That doesn't throw an error (or just go down to minimum size)
      let chunkSize = 10000;
      const minimumChunkSize = 1250;
      while (chunkSize > minimumChunkSize) {
        try {
          await this.queryChunk(fromBlock, fromBlock + chunkSize);
          break;
        } catch {
          chunkSize /= 2;
        }
      }

      // Start getting events in chunks
      const chunks = [];
      for (let i = 0; i < Math.ceil(totalBlocks / chunkSize); i++) {
        const chunkStart = fromBlock + i * chunkSize;
        const chunkEnd = Math.min(chunkStart + chunkSize - 1, toBlock);
        const maxRetries = 3;

        chunks.push(
          // For each chunk, try to query the chunk with exponential backoff
          new Promise<{ start: number; end: number; chunk: Event[] }>(
            async (resolve, reject) => {
              let backoffTime = 2000;

              // If fetching chunk initially fails, try to query with exponential backoff
              for (let j = 0; j < maxRetries; j++) {
                try {
                  const chunk = await this.queryChunk(chunkStart, chunkEnd);
                  return resolve({
                    start: chunkStart,
                    end: chunkEnd,
                    chunk,
                  });
                } catch (err) {
                  await new Promise((res) => setTimeout(res, backoffTime));
                  backoffTime *= 2;
                }
              }

              reject(
                `Failed to fetch events from block ${chunkStart} to block ${chunkEnd}`,
              );
            },
          ),
        );
      }

      // Wait for all chunks to be resolved
      const results = await Promise.allSettled(chunks);

      // Populate all succesfully fetched chunks, and log any errors
      for (const result of results) {
        if (result.status === "fulfilled") {
          events.push(...result.value.chunk);
        } else {
          console.warn(result.reason);
        }
      }
    }

    // Sort events in specified order
    const orderedEvents = events.sort((a, b) => {
      return filters.order === "desc"
        ? b.blockNumber - a.blockNumber
        : a.blockNumber - b.blockNumber;
    });

    return this.parseEvents(orderedEvents);
  }

  /**
   * Get Events
   * @remarks Get a list of the events of a specific type emitted from this contract during the specified time period
   * @example
   * ```javascript
   * // The name of the event to get logs for
   * const eventName = "Transfer";
   *
   * // Optionally pass in options to limit the blocks from which events are retrieved
   * const options = {
   *   fromBlock: 0,
   *   toBlock: 1000000, // can also pass "latest"
   *   order: "desc",
   *   // Configure event filters (filter on indexed event parameters)
   *   filters: {
   *     from: "0x...",
   *     to: "0x..."
   *   }
   * };
   *
   * const events = await contract.events.getEvents(eventName, options);
   * console.log(events[0].eventName);
   * console.log(events[0].data);
   * ```
   *
   * @param eventName - The name of the event to get logs for
   * @param options - Specify the from and to block numbers to get events for, defaults to all blocks. @see EventQueryOptions
   * @returns The requested event objects with event data
   */
  public async getEvents<
    TEvent extends Record<string, any> = Record<string, any>,
    TFilter extends Record<string, any> = Record<string, any>,
  >(
    eventName: string,
    options: EventQueryOptions<TFilter> = {
      fromBlock: 0,
      toBlock: "latest",
      order: "desc",
    },
  ): Promise<ContractEvent<TEvent>[]> {
    const event = this.contractWrapper.readContract.interface.getEvent(
      eventName as string,
    );

    const eventInterface =
      this.contractWrapper.readContract.interface.getEvent(eventName);
    const args = options.filters
      ? eventInterface.inputs.map((e) => (options.filters as TFilter)[e.name])
      : [];
    const filter = this.contractWrapper.readContract.filters[event.name](
      ...args,
    );

    const events = await this.contractWrapper.readContract.queryFilter(
      filter,
      options.fromBlock,
      options.toBlock,
    );

    const orderedEvents = events.sort((a, b) => {
      return options.order === "desc"
        ? b.blockNumber - a.blockNumber
        : a.blockNumber - b.blockNumber;
    });

    return this.parseEvents<TEvent>(orderedEvents);
  }

  private parseEvents<TEvent = Record<string, any>>(
    events: Event[],
  ): ContractEvent<TEvent>[] {
    return events.map((e) => {
      const transaction = Object.fromEntries(
        Object.entries(e).filter(
          (a) => typeof a[1] !== "function" && a[0] !== "args",
        ),
      ) as providers.Log;
      if (e.args) {
        const entries = Object.entries(e.args);
        const args = entries.slice(entries.length / 2, entries.length);

        const data: Record<string, unknown> = {};
        for (const [key, value] of args) {
          data[key] = value;
        }

        return {
          eventName: e.event || "",
          data: data as TEvent,
          transaction,
        };
      }

      return {
        eventName: e.event || "",
        data: {} as TEvent,
        transaction,
      };
    });
  }

  private toContractEvent<TEvent extends Record<string, any>>(
    event: EventFragment,
    args: ReadonlyArray<any>,
    rawLog: providers.Log,
  ): ContractEvent<TEvent> {
    const transaction = Object.fromEntries(
      Object.entries(rawLog).filter(
        (a) => typeof a[1] !== "function" && a[0] !== "args",
      ),
    ) as providers.Log;
    const results: Record<string, any> = {};
    event.inputs.forEach((param, index) => {
      if (Array.isArray(args[index])) {
        const components = param.components;
        if (components) {
          const arr = args[index];
          if (param.type === "tuple[]") {
            // tuple[]
            const objArray: Record<string, unknown>[] = [];
            for (let i = 0; i < arr.length; i++) {
              const tuple = arr[i];
              const obj: Record<string, unknown> = {};
              for (let j = 0; j < components.length; j++) {
                const name = components[j].name;
                obj[name] = tuple[j];
              }
              objArray.push(obj);
            }
            results[param.name] = objArray;
          } else {
            // simple tuple
            const obj: Record<string, unknown> = {};
            for (let i = 0; i < components.length; i++) {
              const name = components[i].name;
              obj[name] = arr[i];
            }
            results[param.name] = obj;
          }
        }
      } else {
        results[param.name] = args[index];
      }
    });
    return {
      eventName: event.name,
      data: results as TEvent,
      transaction,
    };
  }

  private async queryChunk(from: number, to: number) {
    try {
      const events = await this.contractWrapper.readContract.queryFilter(
        {},
        from,
        to,
      );
      return events;
    } catch (err: any) {
      throw new Error(
        `Error querying chunk from block ${from} to block ${to}: ${err.message}`,
      );
    }
  }
}
