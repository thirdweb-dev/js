import { convertFeaturesMapToarray, replaceAddressesInCode } from "./utils";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Code,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { FeatureWithEnabled } from "@thirdweb-dev/sdk/dist/src/constants/contract-features";
import {
  SnippetApiResponse,
  SnippetSchema,
} from "components/contract-tabs/code/types";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useQuery } from "react-query";
import { CodeBlock, Heading, Link, Text } from "tw-components";

interface FeatureDrawerContentProps {
  features: FeatureWithEnabled[];
}

export const FeatureDrawerContent: React.VFC<FeatureDrawerContentProps> = ({
  features,
}) => {
  return (
    <Flex direction="column" gap={8}>
      {features.map((feature) => (
        <FeatureRoot key={feature.name} feature={feature} />
      ))}
    </Flex>
  );
};
function flattenFeatures(features: FeatureWithEnabled[]): FeatureWithEnabled[] {
  const flattenedFeatures: FeatureWithEnabled[] = [];
  features.forEach((feature) => {
    const subFeatures = convertFeaturesMapToarray(feature.features);

    flattenedFeatures.push({
      ...feature,
      features: {} as any,
    });
    if (subFeatures.length) {
      flattenedFeatures.push(...flattenFeatures(subFeatures));
    }
  });

  return flattenedFeatures;
}

interface FeatureDetailsProps {
  feature: FeatureWithEnabled;
}

const FeatureRoot: React.VFC<FeatureDetailsProps> = ({ feature }) => {
  const codeSnippets = useFeatureCodeSnippet();
  const subFeatures = useMemo(() => {
    return flattenFeatures(convertFeaturesMapToarray(feature.features));
  }, [feature]);

  const enabledSubFeatures = subFeatures.filter((f) => f.enabled);
  const disabledSubFeatures = subFeatures.filter((f) => !f.enabled);

  const featureDetails = useMemo(() => {
    return codeSnippets.data ? codeSnippets.data[feature.name] : undefined;
  }, [codeSnippets.data, feature.name]);

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex direction="column" gap={4}>
          <Flex gap={2} align="center">
            <Icon boxSize={6} color="green.500" as={FiCheckCircle} />
            <Heading size="title.md">{feature.name}</Heading>
          </Flex>

          {featureDetails && featureDetails.examples.javascript && (
            <Flex direction="column" gap={2}>
              <Method method={featureDetails} />
            </Flex>
          )}

          {featureDetails &&
            featureDetails?.methods &&
            Object.keys(featureDetails?.methods).length > 0 && (
              <Flex direction="column" gap={4}>
                <Heading size="subtitle.sm">Methods</Heading>
                <Flex direction="column" gap={6}>
                  {featureDetails?.methods?.map((method) => (
                    <Method key={method.name} method={method} />
                  ))}
                </Flex>
              </Flex>
            )}
        </Flex>

        {enabledSubFeatures.length > 0 && (
          <>
            <Heading size="subtitle.lg" mt={8}>
              Detected Features
            </Heading>

            <Accordion allowToggle>
              {subFeatures
                .filter((f) => f.enabled)
                .map((subFeature) => (
                  <FeatureDetails key={subFeature.name} feature={subFeature} />
                ))}
            </Accordion>
          </>
        )}
        {disabledSubFeatures.length > 0 && (
          <>
            <Heading size="subtitle.lg" mt={8}>
              Undetected Features
            </Heading>

            <Accordion allowToggle>
              {disabledSubFeatures.map((subFeature) => (
                <FeatureDetails key={subFeature.name} feature={subFeature} />
              ))}
            </Accordion>
          </>
        )}
      </Flex>
    </>
  );
};

const FeatureDetails: React.VFC<FeatureDetailsProps> = ({ feature }) => {
  const codeSnippets = useFeatureCodeSnippet();

  const featureDetails = useMemo(() => {
    return codeSnippets.data ? codeSnippets.data[feature.name] : undefined;
  }, [codeSnippets.data, feature.name]);

  return (
    <AccordionItem borderColor="borderColor">
      <AccordionButton px={0}>
        <Flex flex={1} gap={2} align="center">
          <Icon
            boxSize={4}
            color={feature.enabled ? "green.500" : "red.500"}
            as={feature.enabled ? FiCheckCircle : FiXCircle}
          />
          <Heading textAlign="left" size="subtitle.sm">
            {feature.name}
          </Heading>
        </Flex>

        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel px={0} py={4}>
        <Flex direction="column" gap={2}>
          {featureDetails && (
            <Flex direction="column" gap={2}>
              <Method method={featureDetails} />
            </Flex>
          )}
          <Heading size="subtitle.sm">Methods</Heading>
          <Flex direction="column" gap={6}>
            {featureDetails?.methods?.map((method) => (
              <Method key={method.name} method={method} />
            ))}
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

function useFeatureCodeSnippet() {
  return useQuery(["feature-snippets"], async () => {
    const res = await fetch(
      `https://raw.githubusercontent.com/thirdweb-dev/typescript-sdk/main/docs/feature_snippets.json`,
    );
    return (await res.json()) as SnippetApiResponse;
  });
}

interface MethodProps {
  method: SnippetSchema;
}

export const Method: React.VFC<MethodProps> = ({ method }) => {
  const router = useRouter();
  const query = router.query.customContract || [];
  const contractAddress = query[0];
  const address = useAddress();
  return (
    <Flex key={method.name} direction="column" gap={1}>
      <Heading size="label.md">
        <Code py={1} px={2} borderRadius="md">
          {method.reference.javascript ? (
            <Link
              isExternal
              href={method?.reference?.javascript || ""}
              color="primary.500"
            >
              {method.name}
            </Link>
          ) : (
            method.name
          )}
        </Code>{" "}
        {method.summary}
      </Heading>
      <Text fontStyle="italic">{method.remarks}</Text>
      {method.examples.javascript && (
        <CodeBlock
          mt={1}
          mb={4}
          language="javascript"
          code={replaceAddressesInCode(
            method.examples.javascript || "",
            contractAddress,
            address,
          )}
        />
      )}
    </Flex>
  );
};
