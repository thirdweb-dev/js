import { Alert, AlertIcon, Center, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { Text } from "tw-components";

export const EarlyAccessBanner: React.FC = () => {
  return (
    <Alert colorScheme="purple" status="info" flexShrink={0} py={2}>
      <Center w="100%">
        <Stack direction="row" spacing={4} align="center">
          <AlertIcon
            boxSize={4}
            color="purple.900"
            _dark={{ color: "purple.200" }}
          />
          <Text color="purple.900" _dark={{ color: "purple.200" }}>
            <strong>Early access.</strong> Please report any issues and bugs in
            our{" "}
            <Link
              fontWeight="bold"
              color="inherit"
              href="https://discord.gg/thirdweb"
              isExternal
            >
              Discord
            </Link>
            .
          </Text>
        </Stack>
      </Center>
    </Alert>
  );
};
