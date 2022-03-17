import { ConsolePage } from "../_app";
import {
  Box,
  Container,
  DarkMode,
  Divider,
  Heading,
  LightMode,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

const TypographyPage: ConsolePage = () => {
  return (
    <Stack>
      <LightMode>
        <Box py={8}>
          <Container maxW="container.page">
            <Stack spacing="72px">
              <Stack>
                <Heading size="display.lg">
                  Display Large/Inter/Extrabold/72px
                </Heading>
                <Heading size="display.md">
                  Display Medium/Inter/Extrabold/64px
                </Heading>
                <Heading size="display.sm">
                  Display Small/Inter/Extrabold/56px
                </Heading>
              </Stack>
              <Divider />
              <Stack>
                <Heading size="title.lg">Title Large/Inter/Bold/32px</Heading>
                <Heading size="title.md">Title Medium/Inter/Bold/24px</Heading>
                <Heading size="title.sm">Title Small/Inter/Bold/20px</Heading>
              </Stack>
              <Divider />
              <Stack>
                <Heading size="subtitle.lg">
                  Subtitle Large/Inter/Bold/24px
                </Heading>
                <Heading size="subtitle.md">
                  Subtitle Medium/Inter/Bold/20px
                </Heading>
                <Heading size="subtitle.sm">
                  Subtitle Small/Inter/Bold/16px
                </Heading>
              </Stack>
              <Divider />
              <Stack>
                <Text size="label.lg">Label Large/Inter/Bold/16px</Text>
                <Text size="label.md">Label Medium/Inter/Bold/14px</Text>
                <Text size="label.sm">Label Small/Inter/Bold/12px</Text>
              </Stack>
              <Divider />
              <Stack>
                <Text size="body.lg">Body Large/Inter/Bold/16px</Text>
                <Text size="body.md">Body Medium/Inter/Bold/14px</Text>
                <Text size="body.sm">Body Small/Inter/Bold/12px</Text>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </LightMode>
      <DarkMode>
        <Box bg="black" py={8}>
          <Container maxW="container.page">
            <Stack spacing="72px">
              <Stack>
                <Heading size="display.lg">
                  Display Large/Inter/Extrabold/72px
                </Heading>
                <Heading size="display.md">
                  Display Medium/Inter/Extrabold/64px
                </Heading>
                <Heading size="display.sm">
                  Display Small/Inter/Extrabold/56px
                </Heading>
              </Stack>
              <Divider />
              <Stack>
                <Heading size="title.lg">Title Large/Inter/Bold/32px</Heading>
                <Heading size="title.md">Title Medium/Inter/Bold/24px</Heading>
                <Heading size="title.sm">Title Small/Inter/Bold/20px</Heading>
              </Stack>
              <Divider />
              <Stack>
                <Heading size="subtitle.lg">
                  Subtitle Large/Inter/Bold/24px
                </Heading>
                <Heading size="subtitle.md">
                  Subtitle Medium/Inter/Bold/20px
                </Heading>
                <Heading size="subtitle.sm">
                  Subtitle Small/Inter/Bold/16px
                </Heading>
              </Stack>
              <Divider />
              <Stack>
                <Text size="label.lg">Label Large/Inter/Bold/16px</Text>
                <Text size="label.md">Label Medium/Inter/Bold/14px</Text>
                <Text size="label.sm">Label Small/Inter/Bold/12px</Text>
              </Stack>
              <Divider />
              <Stack>
                <Text size="body.lg">Body Large/Inter/Bold/16px</Text>
                <Text size="body.md">Body Medium/Inter/Bold/14px</Text>
                <Text size="body.sm">Body Small/Inter/Bold/12px</Text>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </DarkMode>
    </Stack>
  );
};

export default TypographyPage;
