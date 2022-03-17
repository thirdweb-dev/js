import { ConsolePage } from "../_app";
import { Center, Flex } from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { TWForm, TWInput } from "components/form";
import { Card } from "components/layout/Card";
import React from "react";
import { useQuery } from "react-query";
import { z } from "zod";

const TestSchema = z.object({
  price: z.string(),
});

const FormTestPage: ConsolePage = () => {
  const query = useQuery<z.input<typeof TestSchema>>(
    ["test"],
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            price: "123",
          });
        }, 1000);
      });
    },
    { cacheTime: 0, staleTime: 0 },
  );

  return (
    <Center m={8}>
      <Card>
        <TWForm
          initialValueQuery={query}
          schema={TestSchema}
          onSubmit={(d) => console.log("*** onSubmit", d)}
        >
          <Flex direction="column" gap={4}>
            <TWInput step="0.01" name="price" type="number" />
            <Button type="submit">Submit</Button>
          </Flex>
        </TWForm>
      </Card>
    </Center>
  );
};

export default FormTestPage;
