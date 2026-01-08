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
import { DecodedInput } from "./decoded-input";

interface DecodedInputSetProps {
  param: AbiParameter;
  setIndex: number;
  client: ThirdwebClient;
}

export const DecodedInputSet: React.FC<DecodedInputSetProps> = ({
  param,
  setIndex,
  client,
}) => {
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `constructorParams.${param.name ? param.name : "*"}.dynamicValue.paramsToEncode.${setIndex}`,
  });

  return (
    <fieldset>
      {fields.map((item, index) => (
        <Accordion className="-mx-1" collapsible key={item.id} type="single">
          <AccordionItem className="border-border border-b" value="metadata">
            <AccordionTrigger className="gap-3 border-0 px-1 ">
              <div className="flex grow items-center justify-between gap-4">
                <span className="font-medium text-sm">
                  Parameter {index + 1}
                </span>
                <ToolTipLabel label="Remove Parameter">
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
              <DecodedInput
                client={client}
                key={item.id}
                param={param}
                paramIndex={index}
                setIndex={setIndex}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      <div className="mt-6 flex justify-start">
        <Button
          className="gap-2"
          onClick={() =>
            append({
              defaultValue: "",
              type: "",
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          Add Parameter
        </Button>
      </div>
    </fieldset>
  );
};
