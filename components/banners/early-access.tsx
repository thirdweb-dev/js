import { Center, Link } from "@chakra-ui/layout";
import { Alert, AlertIcon, Stack, Text } from "@chakra-ui/react";
import React from "react";

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
          <Text
            color="purple.900"
            _dark={{ color: "purple.200" }}
            fontSize="body.md"
          >
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
