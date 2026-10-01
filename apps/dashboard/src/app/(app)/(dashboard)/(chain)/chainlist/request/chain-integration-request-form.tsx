"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { submitChainIntegrationRequest } from "@/actions/chain-integration-request";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHAIN_STACKS = [
  "Optimism",
  "Arbitrum",
  "Polygon AggLayer",
  "zkSync",
  "Avalanche",
  "Fully custom Bespoke Chain",
] as const;

const text = (max = 300) =>
  z.string().trim().min(1, "Required").max(max, "Too long");
const digits = z
  .string()
  .trim()
  .regex(/^[0-9]{1,20}$/, "Must be a number");

const formSchema = z.object({
  blockExplorerStandard: text(50),
  blockExplorerUrl: text(2000),
  chainId: digits,
  chainName: text(),
  chainShortName: text(50),
  chainStack: z.enum(CHAIN_STACKS).optional(),
  companyName: text(),
  email: z.string().trim().email("Invalid email").max(254),
  explorerIconFormat: text(20),
  explorerIconHeight: digits,
  explorerIconWidth: digits,
  faucetOrBridge: text(2000),
  iconFormat: text(20),
  iconHeight: digits,
  iconUrl: text(2000),
  iconWidth: digits,
  nativeCurrencyDecimals: digits,
  nativeCurrencyName: text(),
  nativeCurrencySymbol: text(20),
  publicRpc: text(2000),
  telegram: text(),
});

type FormValues = z.infer<typeof formSchema>;
type TextFieldName = Exclude<keyof FormValues, "chainStack">;

const SECTIONS: {
  title: string;
  fields: { name: TextFieldName; label: string; placeholder?: string }[];
}[] = [
  {
    fields: [
      { label: "Company name", name: "companyName" },
      { label: "Telegram", name: "telegram" },
      { label: "Email", name: "email" },
    ],
    title: "Contact",
  },
  {
    fields: [
      { label: "Chain Name", name: "chainName" },
      { label: "Chain Short Name", name: "chainShortName", placeholder: "ETH" },
      { label: "Chain Id", name: "chainId", placeholder: "1" },
      { label: "Public RPC", name: "publicRpc" },
      {
        label:
          "Icon URL (must be a publicly accessible/hosted link or IPFS URL)",
        name: "iconUrl",
        placeholder:
          "ipfs://QmbYKZ1MuDa1hzwLGjdCZGapuhV7C9uyRDPJWD994qbocY/generic-icon.png",
      },
      { label: "Icon Width", name: "iconWidth", placeholder: "512" },
      { label: "Icon Height", name: "iconHeight", placeholder: "512" },
      { label: "Icon Format", name: "iconFormat", placeholder: "png" },
    ],
    title: "Mainnet Chain Info",
  },
  {
    fields: [
      {
        label: "Native Currency",
        name: "nativeCurrencyName",
        placeholder: "Ether",
      },
      { label: "Symbol", name: "nativeCurrencySymbol", placeholder: "ETH" },
      { label: "Decimals", name: "nativeCurrencyDecimals", placeholder: "18" },
    ],
    title: "Native Currency",
  },
  {
    fields: [
      {
        label: "Block Explorer",
        name: "blockExplorerUrl",
        placeholder: "https://etherscan.io/",
      },
      {
        label: "Chain Standard",
        name: "blockExplorerStandard",
        placeholder: "EIP3091",
      },
      {
        label: "Explorer Icon Width",
        name: "explorerIconWidth",
        placeholder: "83",
      },
      {
        label: "Explorer Icon Height",
        name: "explorerIconHeight",
        placeholder: "83",
      },
      {
        label: "Explorer Icon Format",
        name: "explorerIconFormat",
        placeholder: "svg",
      },
      { label: "Faucet/Bridge", name: "faucetOrBridge" },
    ],
    title: "Block Explorer",
  },
];

const defaultValues = Object.fromEntries(
  SECTIONS.flatMap((section) => section.fields.map((f) => [f.name, ""])),
) as Omit<FormValues, "chainStack">;

export function ChainIntegrationRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    const res = await submitChainIntegrationRequest(values);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-6">
        <CheckCircle2Icon className="size-5 text-success-text" />
        <p>Thank you for submitting your chain request!</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {SECTIONS.map((section) => (
          <fieldset className="flex flex-col gap-4" key={section.title}>
            <legend className="mb-4 font-semibold text-xl">
              {section.title}
            </legend>
            {section.fields.map((f) => (
              <FormField
                control={form.control}
                key={f.name}
                name={f.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{f.label}</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder={f.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </fieldset>
        ))}

        <FormField
          control={form.control}
          name="chainStack"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chain Stack</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CHAIN_STACKS.map((stack) => (
                    <SelectItem key={stack} value={stack}>
                      {stack}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-fit"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
