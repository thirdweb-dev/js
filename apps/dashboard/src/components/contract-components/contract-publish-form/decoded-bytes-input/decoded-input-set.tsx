import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import type { AbiParameter } from "abitype";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DecodedInput } from "./decoded-input";

interface DecodedInputSetProps {
  param: AbiParameter;
  setIndex: number;
}

export const DecodedInputSet: React.FC<DecodedInputSetProps> = ({
  param,
  setIndex,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}`,
    control: form.control,
  });

  return (
    <fieldset>
      {fields.map((item, index) => (
        <Accordion type="single" collapsible className="-mx-1" key={item.id}>
          <AccordionItem value="metadata" className="border-border border-b">
            <AccordionTrigger className="gap-3 border-0 px-1 ">
              <div className="flex grow items-center justify-between gap-4">
                <span className="font-medium text-sm">
                  Parameter {index + 1}
                </span>
                <ToolTipLabel label="Remove Parameter">
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
              <DecodedInput
                key={item.id}
                paramIndex={index}
                setIndex={setIndex}
                param={param}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      <div className="mt-6 flex justify-start">
        <Button
          type="button"
          size="sm"
          className="gap-2"
          variant="outline"
          disabled={param.type === "bytes" && fields.length >= 1}
          onClick={() =>
            append({
              type: "",
              defaultValue: "",
            })
          }
        >
          <PlusIcon className="size-4" />
          Add Parameter
        </Button>
      </div>
    </fieldset>
  );
};
