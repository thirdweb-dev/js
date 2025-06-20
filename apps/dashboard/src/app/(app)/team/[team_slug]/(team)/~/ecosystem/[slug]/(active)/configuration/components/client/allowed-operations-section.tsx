"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
import { type Control, useFieldArray } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { PartnerFormValues } from "./partner-form.client";

type AllowedOperationsSectionProps = {
  control: Control<PartnerFormValues>;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  client: ThirdwebClient;
};

export function AllowedOperationsSection({
  control,
  enabled,
  onToggle,
  client,
}: AllowedOperationsSectionProps) {
  // Setup field array for allowed operations
  const allowedOperationsFields = useFieldArray({
    control,
    name: "accessControl.allowedOperations",
  });

  const allowedOperationsId = useId();
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-4 flex items-center justify-between gap-6 ">
        <div>
          <Label className="text-base" htmlFor={allowedOperationsId}>
            Allowed Operations
          </Label>
          <p className="mt-0.5 text-muted-foreground text-xs">
            Configure which signing operations are allowed for this partner
          </p>
        </div>
        <Switch
          checked={enabled}
          id={allowedOperationsId}
          onCheckedChange={onToggle}
        />
      </div>

      {enabled && (
        <div className="rounded-lg">
          <div className="flex flex-col gap-6">
            {allowedOperationsFields.fields.map((field, index) => (
              <div
                className="rounded-md border border-border p-4"
                key={field.id}
              >
                <div className="mb-4 flex items-center justify-between">
                  <FormField
                    control={control}
                    name={`accessControl.allowedOperations.${index}.signMethod`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Allowed Signature Method</FormLabel>
                        <FormDescription className="text-xs">
                          Select the types of signatures that are allowed for
                          this partner
                        </FormDescription>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => {
                            // Update the signature method
                            field.onChange(value);

                            // Reset the operation data based on the selected method
                            if (value === "eth_signTransaction") {
                              // Remove any existing fields for other methods
                              allowedOperationsFields.update(index, {
                                allowedTransactions: [],
                                signMethod: value,
                              });
                            } else if (value === "eth_signTypedData_v4") {
                              allowedOperationsFields.update(index, {
                                allowedTypedData: [],
                                signMethod: value,
                              });
                            } else if (value === "personal_sign") {
                              allowedOperationsFields.update(index, {
                                allowedPersonalSigns: [],
                                signMethod: value,
                              });
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a signature method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="eth_signTransaction">
                              eth_signTransaction
                            </SelectItem>
                            <SelectItem value="eth_signTypedData_v4">
                              eth_signTypedData_v4
                            </SelectItem>
                            <SelectItem value="personal_sign">
                              personal_sign
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    aria-label="Remove operation"
                    className="!w-auto ml-4 h-10 px-3"
                    onClick={() => {
                      allowedOperationsFields.remove(index);
                    }}
                    type="button"
                    variant="outline"
                  >
                    <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
                  </Button>
                </div>

                {/* Render different fields based on the signature method */}
                {allowedOperationsFields.fields[index]?.signMethod ===
                  "eth_signTransaction" && (
                  <TransactionRestrictions
                    client={client}
                    control={control}
                    index={index}
                  />
                )}

                {allowedOperationsFields.fields[index]?.signMethod ===
                  "eth_signTypedData_v4" && (
                  <TypedDataRestrictions
                    client={client}
                    control={control}
                    index={index}
                  />
                )}

                {allowedOperationsFields.fields[index]?.signMethod ===
                  "personal_sign" && (
                  <PersonalSignRestrictions
                    client={client}
                    control={control}
                    index={index}
                  />
                )}
              </div>
            ))}

            <Button
              className="w-full gap-2 bg-background"
              onClick={() => {
                allowedOperationsFields.append({
                  allowedTransactions: [],
                  signMethod: "eth_signTransaction",
                });
              }}
              type="button"
              variant="outline"
            >
              <PlusIcon className="size-4" />
              Add operation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for eth_signTransaction restrictions
function TransactionRestrictions({
  control,
  index,
  client,
}: {
  control: Control<PartnerFormValues>;
  index: number;
  client: ThirdwebClient;
}) {
  const transactionsArray = useFieldArray({
    control,
    name: `accessControl.allowedOperations.${index}.allowedTransactions`,
  });

  return (
    <div className="mt-4">
      <Label className="mb-3 inline-block">Allowed Transactions</Label>
      <FormDescription className="mb-4 text-xs">
        Specify the specific transactions patterns that are allowed for this
        partner. Optional, default is all transactions.
      </FormDescription>
      <FormDescription className="mb-4 text-warning-text text-xs">
        Attention - 'eth_signTransaction' signatures are only for EOA
        transactions. To specify allowed Smart Account transactions, you need to
        select the 'eth_personalSign' signature method, with type 'userOp' (user
        operations).
      </FormDescription>
      <div className="flex flex-col gap-4">
        {transactionsArray.fields.map((field, txIndex) => (
          <div
            className="flex flex-row gap-4 rounded-md border border-border p-4"
            key={field.id}
          >
            <div className="flex flex-1 flex-col gap-2">
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTransactions.${txIndex}.chainId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        client={client}
                        onChange={(chainId) => field.onChange(chainId)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTransactions.${txIndex}.contractAddress`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Address (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTransactions.${txIndex}.selector`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Selector (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <FormField
                  control={control}
                  name={`accessControl.allowedOperations.${index}.allowedTransactions.${txIndex}.maxValue`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Value in Wei (optional)</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input placeholder="0" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              aria-label="Remove transaction"
              className="!w-auto ml-2 px-3"
              onClick={() => {
                transactionsArray.remove(txIndex);
              }}
              type="button"
              variant="outline"
            >
              <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
            </Button>
          </div>
        ))}

        <Button
          className="w-full gap-2 bg-background"
          onClick={() => {
            transactionsArray.append({
              chainId: 1,
              contractAddress: "",
              maxValue: "",
              selector: "",
            });
          }}
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add transaction
        </Button>
      </div>
    </div>
  );
}

// Component for eth_signTypedData_v4 restrictions
function TypedDataRestrictions({
  control,
  index,
  client,
}: {
  control: Control<PartnerFormValues>;
  index: number;
  client: ThirdwebClient;
}) {
  const typedDataArray = useFieldArray({
    control,
    name: `accessControl.allowedOperations.${index}.allowedTypedData`,
  });

  return (
    <div className="mt-4">
      <Label className="mb-3 inline-block">Allowed Typed Data</Label>
      <FormDescription className="mb-4 text-xs">
        Specify the specific typed data patterns that are allowed for this
        partner. Optional, default is any typed data.
      </FormDescription>
      <div className="flex flex-col gap-4">
        {typedDataArray.fields.map((field, dataIndex) => (
          <div
            className="flex flex-row gap-4 rounded-md border border-border p-4"
            key={field.id}
          >
            <div className="flex flex-1 flex-col gap-2">
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTypedData.${dataIndex}.domain`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="Domain name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTypedData.${dataIndex}.verifyingContract`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verifying Contract (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedTypedData.${dataIndex}.chainId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain (optional)</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        client={client}
                        onChange={(chainId) => field.onChange(chainId)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <FormField
                  control={control}
                  name={`accessControl.allowedOperations.${index}.allowedTypedData.${dataIndex}.primaryType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Type (optional)</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input placeholder="Type" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              aria-label="Remove typed data"
              className="!w-auto ml-2 px-3"
              onClick={() => {
                typedDataArray.remove(dataIndex);
              }}
              type="button"
              variant="outline"
            >
              <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
            </Button>
          </div>
        ))}

        <Button
          className="w-full gap-2 bg-background"
          onClick={() => {
            typedDataArray.append({
              chainId: undefined,
              domain: "",
              primaryType: undefined,
              verifyingContract: undefined,
            });
          }}
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add typed data
        </Button>
      </div>
    </div>
  );
}

// Component for personal_sign restrictions
function PersonalSignRestrictions({
  control,
  index,
  client,
}: {
  control: Control<PartnerFormValues>;
  index: number;
  client: ThirdwebClient;
}) {
  const personalSignArray = useFieldArray({
    control,
    name: `accessControl.allowedOperations.${index}.allowedPersonalSigns`,
  });

  return (
    <div className="mt-4">
      <Label className="mb-3 inline-block">Allowed Personal Sign Data</Label>
      <FormDescription className="mb-4 text-xs">
        Specify the types of personal signatures that are allowed for this
        partner. Optional, default is all personal signatures.
      </FormDescription>
      <div className="flex flex-col gap-4">
        {personalSignArray.fields.map((field, signIndex) => (
          <div className="rounded-md border border-border p-3" key={field.id}>
            <div className="mb-4 flex items-center justify-between">
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedPersonalSigns.${signIndex}.messageType`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Message Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        // Update the message type
                        field.onChange(value);

                        // Reset the message data based on the selected type
                        if (value === "userOp") {
                          personalSignArray.update(signIndex, {
                            allowedTransactions: [],
                            messageType: value,
                          });
                        } else if (value === "other") {
                          personalSignArray.update(signIndex, {
                            message: "",
                            messageType: value,
                          });
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select message type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="userOp">userOp</SelectItem>
                        <SelectItem value="other">other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                aria-label="Remove personal sign"
                className="!w-auto ml-4 h-10 px-3"
                onClick={() => {
                  personalSignArray.remove(signIndex);
                }}
                type="button"
                variant="outline"
              >
                <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
              </Button>
            </div>

            {personalSignArray.fields[signIndex]?.messageType === "userOp" ? (
              <UserOpTransactions
                client={client}
                control={control}
                opIndex={index}
                signIndex={signIndex}
              />
            ) : (
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${index}.allowedPersonalSigns.${signIndex}.message`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Message pattern" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Specify a message pattern that is allowed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}

        <Button
          className="w-full gap-2 bg-background"
          onClick={() => {
            personalSignArray.append({
              message: "",
              messageType: "other",
            });
          }}
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add personal sign
        </Button>
      </div>
    </div>
  );
}

// Component for userOp transactions within personal_sign
function UserOpTransactions({
  control,
  opIndex,
  signIndex,
  client,
}: {
  control: Control<PartnerFormValues>;
  opIndex: number;
  signIndex: number;
  client: ThirdwebClient;
}) {
  const userOpTransactionsArray = useFieldArray({
    control,
    name: `accessControl.allowedOperations.${opIndex}.allowedPersonalSigns.${signIndex}.allowedTransactions`,
  });

  return (
    <div className="mt-4">
      <Label className="mb-3 inline-block">
        Allowed User Operations (smart account transactions)
      </Label>
      <FormDescription className="mb-4 text-xs">
        Specify the specific User Operations that are allowed for this partner.
        Optional, default is all User Operations.
      </FormDescription>
      <div className="flex flex-col gap-4">
        {userOpTransactionsArray.fields.map((field, txIndex) => (
          <div
            className="flex flex-row gap-4 rounded-md border border-border p-4"
            key={field.id}
          >
            <div className="flex flex-1 flex-col gap-2">
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${opIndex}.allowedPersonalSigns.${signIndex}.allowedTransactions.${txIndex}.chainId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        client={client}
                        onChange={(chainId) => field.onChange(chainId)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${opIndex}.allowedPersonalSigns.${signIndex}.allowedTransactions.${txIndex}.contractAddress`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Address (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`accessControl.allowedOperations.${opIndex}.allowedPersonalSigns.${signIndex}.allowedTransactions.${txIndex}.selector`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Selector (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <FormField
                  control={control}
                  name={`accessControl.allowedOperations.${opIndex}.allowedPersonalSigns.${signIndex}.allowedTransactions.${txIndex}.maxValue`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Value in Wei (optional)</FormLabel>
                      <div className="flex">
                        <FormControl>
                          <Input placeholder="0" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button
              aria-label="Remove transaction"
              className="!w-auto ml-2 px-3"
              onClick={() => {
                userOpTransactionsArray.remove(txIndex);
              }}
              type="button"
              variant="outline"
            >
              <Trash2Icon className="size-4 shrink-0 text-destructive-text" />
            </Button>
          </div>
        ))}

        <Button
          className="w-full gap-2 bg-background"
          onClick={() => {
            userOpTransactionsArray.append({
              chainId: 1,
              contractAddress: "",
              maxValue: "",
              selector: "",
            });
          }}
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add transaction
        </Button>
      </div>
    </div>
  );
}
