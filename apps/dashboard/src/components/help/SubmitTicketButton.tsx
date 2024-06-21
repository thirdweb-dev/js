import type { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import { useWatch } from "react-hook-form";
import { Button } from "tw-components";

export const SubmitTicketButton = () => {
  const markdown = useWatch<CreateTicketInput>({
    name: "markdown",
  });
  const productLabel = useWatch<CreateTicketInput>({
    name: "product",
  });
  return (
    <Button
      type="submit"
      colorScheme="primary"
      isDisabled={!productLabel || !markdown || !markdown.length}
    >
      Submit
    </Button>
  );
};
