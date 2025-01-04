import type { AbiParameter, AbiParameterToPrimitiveType } from "abitype";
import type * as ox__Hex from "ox/Hex";
import type { Log as ox__Log } from "ox/Log";
import type { Filter, MaybeRequired, Prettify } from "../utils/type-utils.js";

//////////////////////////////////////////////////////////////////////
// ABI event types

type EventParameterOptions = {
  EnableUnion?: boolean;
  IndexedOnly?: boolean;
  Required?: boolean;
};
type DefaultEventParameterOptions = {
  EnableUnion: true;
  IndexedOnly: true;
  Required: false;
};

export type AbiEventParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
  Options extends EventParameterOptions = DefaultEventParameterOptions,
  // Remove non-indexed parameters based on `Options['IndexedOnly']`
> = TAbiParameters extends readonly []
  ? readonly []
  : Filter<
        TAbiParameters,
        Options["IndexedOnly"] extends true ? { indexed: true } : object
      > extends infer Filtered extends readonly AbiParameter[]
    ? _HasUnnamedAbiParameter<Filtered> extends true
      ? // Has unnamed tuple parameters so return as array
          | readonly [
              ...{
                [K in keyof Filtered]: AbiEventParameterToPrimitiveType<
                  Filtered[K],
                  Options
                >;
              },
            ]
          // Distribute over tuple to represent optional parameters
          | (Options["Required"] extends true
              ? never
              : // Distribute over tuple to represent optional parameters
                Filtered extends readonly [
                    ...infer Head extends readonly AbiParameter[],
                    infer _,
                  ]
                ? AbiEventParametersToPrimitiveTypes<
                    readonly [...{ [K in keyof Head]: Omit<Head[K], "name"> }],
                    Options
                  >
                : never)
      : // All tuple parameters are named so return as object
        {
            [Parameter in Filtered[number] as Parameter extends {
              name: infer Name extends string;
            }
              ? Name
              : never]?: AbiEventParameterToPrimitiveType<Parameter, Options>;
          } extends infer Mapped
        ? Prettify<
            MaybeRequired<
              Mapped,
              Options["Required"] extends boolean ? Options["Required"] : false
            >
          >
        : never
    : never;

// TODO: Speed up by returning immediately as soon as named parameter is found.
type _HasUnnamedAbiParameter<TAbiParameters extends readonly AbiParameter[]> =
  TAbiParameters extends readonly [
    infer Head extends AbiParameter,
    ...infer Tail extends readonly AbiParameter[],
  ]
    ? Head extends { name: string }
      ? Head["name"] extends ""
        ? true
        : _HasUnnamedAbiParameter<Tail>
      : true
    : false;

/**
 * @internal
 */
type LogTopicType<
  TPrimitiveType = ox__Hex.Hex,
  TTopic extends ox__Log["topics"][0] = ox__Log["topics"][0],
> = TTopic extends ox__Hex.Hex
  ? TPrimitiveType
  : TTopic extends ox__Hex.Hex[]
    ? TPrimitiveType[]
    : TTopic extends null
      ? null
      : never;

/**
 * @internal
 */
type AbiEventParameterToPrimitiveType<
  TAbiParameter extends AbiParameter,
  Options extends EventParameterOptions = DefaultEventParameterOptions,
  _Type = AbiParameterToPrimitiveType<TAbiParameter>,
> = Options["EnableUnion"] extends true ? LogTopicType<_Type> : _Type;
