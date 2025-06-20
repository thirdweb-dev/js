import type { AbiParameter } from "abitype";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DecodedInputSet } from "./decoded-input-set";

interface DecodedInputArrayFieldsetProps {
  param: AbiParameter;
  client: ThirdwebClient;
}

export const DecodedInputArrayFieldset: React.FC<
  DecodedInputArrayFieldsetProps
> = ({ param, client }) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode`,
  });

  return (
    <fieldset>
      <div className={cn(fields.length > 0 && "border-border border-b")}>
        {fields.map((item, index) => (
          <Accordion className="-mx-1" collapsible key={item.id} type="single">
            <AccordionItem className="border-none" value="metadata">
              <AccordionTrigger className="gap-3 border-border border-t px-1">
                <div className="flex grow items-center justify-between gap-4">
                  Parameter set {index + 1}
                  <ToolTipLabel label="Remove parameter set">
                    <Button
                      className="!text-destructive-text"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(index);
                      }}
                      size="icon"
                      variant="ghost"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </ToolTipLabel>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-6">
                <div className="rounded-lg border border-border px-6 pt-1 pb-6">
                  <DecodedInputSet
                    client={client}
                    param={param}
                    setIndex={index}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="mt-6 flex justify-start">
        <Button
          className="gap-2 bg-background"
          disabled={param.type === "bytes" && fields.length >= 1}
          onClick={() =>
            append({
              contractId: "",
              publisherAddress: "",
              version: "",
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add parameter set
        </Button>
      </div>
    </fieldset>
  );
};
