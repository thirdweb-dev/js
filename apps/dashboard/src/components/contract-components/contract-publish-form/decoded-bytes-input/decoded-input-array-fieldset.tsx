import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AbiParameter } from "abitype";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DecodedInputSet } from "./decoded-input-set";

interface DecodedInputArrayFieldsetProps {
  param: AbiParameter;
}

export const DecodedInputArrayFieldset: React.FC<
  DecodedInputArrayFieldsetProps
> = ({ param }) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode`,
    control: form.control,
  });

  return (
    <fieldset>
      <div className={cn(fields.length > 0 && "border-border border-b")}>
        {fields.map((item, index) => (
          <Accordion type="single" collapsible className="-mx-1" key={item.id}>
            <AccordionItem value="metadata" className="border-none">
              <AccordionTrigger className="gap-3 border-border border-t px-1">
                <div className="flex grow items-center justify-between gap-4">
                  Parameter set {index + 1}
                  <ToolTipLabel label="Remove parameter set">
                    <Button
                      asChild
                      size="sm"
                      className="!text-destructive-text h-auto w-auto p-2"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(index);
                      }}
                    >
                      <div role="button" tabIndex={0}>
                        <TrashIcon className="size-4" />
                      </div>
                    </Button>
                  </ToolTipLabel>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-6">
                <div className="rounded-lg border border-border px-6 pt-1 pb-6">
                  <DecodedInputSet setIndex={index} param={param} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <div className="mt-6 flex justify-start">
        <Button
          type="button"
          size="sm"
          className="gap-2 bg-background"
          variant="outline"
          disabled={param.type === "bytes" && fields.length >= 1}
          onClick={() =>
            append({
              contractId: "",
              version: "",
              publisherAddress: "",
            })
          }
        >
          <PlusIcon className="size-4" />
          Add parameter set
        </Button>
      </div>
    </fieldset>
  );
};
