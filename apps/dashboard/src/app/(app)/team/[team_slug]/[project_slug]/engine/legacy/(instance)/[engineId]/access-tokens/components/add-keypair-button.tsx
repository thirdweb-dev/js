import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import {
  type KeypairAlgorithm,
  useEngineAddKeypair,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Alert,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { Button, FormLabel, Text } from "tw-components";

const KEYPAIR_ALGORITHM_DETAILS: Record<
  KeypairAlgorithm,
  {
    name: string;
    privateKeyInstructions: string;
    publicKeyInstructions: string;
  }
> = {
  ES256: {
    name: "ECDSA",
    privateKeyInstructions:
      "openssl ecparam -name prime256v1 -genkey -noout -out private.key",
    publicKeyInstructions: "openssl ec -in private.key -pubout -out public.key",
  },
  RS256: {
    name: "RSASSA-PKCS1-v1_5",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048",
    publicKeyInstructions:
      "openssl rsa -pubout -in private.key -out public.key",
  },
  PS256: {
    name: "RSASSA-PSS",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA-PSS -out private.key -pkeyopt rsa_keygen_bits:2048 -pkeyopt rsa_pss_keygen_md:sha256",
    publicKeyInstructions:
      "openssl rsa -pubout -in private.key -out public.key",
  },
};

interface AddKeypairButtonProps {
  instanceUrl: string;
  authToken: string;
}

export const AddKeypairButton: React.FC<AddKeypairButtonProps> = ({
  instanceUrl,
  authToken,
}) => {
  const [publicKey, setPublicKey] = useState<string>("");
  const [algorithm, setAlgorithm] = useState<KeypairAlgorithm>("ES256");
  const [label, setLabel] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync: importKeypair } = useEngineAddKeypair({
    instanceUrl,
    authToken,
  });
  const trackEvent = useTrack();

  const { onSuccess, onError } = useTxNotifications(
    "Public key added successfully.",
    "Failed to add public key.",
  );

  const onClick = async () => {
    try {
      await importKeypair({
        publicKey,
        algorithm,
        label,
      });

      onSuccess();
      trackEvent({
        category: "engine",
        action: "add-keypair",
        label: "success",
        instance: instanceUrl,
      });
      setPublicKey("");
      onClose();
    } catch (error) {
      onError(error);
      trackEvent({
        category: "engine",
        action: "add-keypair",
        label: "error",
        instance: instanceUrl,
        error,
      });
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant="ghost"
        size="sm"
        leftIcon={<CirclePlusIcon className="size-6" />}
        colorScheme="primary"
        w="fit-content"
      >
        Add Public Key
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent className="!bg-background rounded-lg border border-border">
          <ModalHeader>Add Public Key</ModalHeader>
          <ModalBody as={Flex} flexDir="column" gap={8}>
            <FormControl>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <Text>Create a private key using:</Text>
                  <Select
                    w="fit-content"
                    value={algorithm}
                    onChange={(e) =>
                      setAlgorithm(e.target.value as KeypairAlgorithm)
                    }
                    fontSize="small"
                    size="sm"
                    variant="unstyled"
                    // fontWeight="bold"
                    fontFamily="mono"
                    color="primary.500"
                    mt="-1px"
                  >
                    {(
                      Object.keys(
                        KEYPAIR_ALGORITHM_DETAILS,
                      ) as KeypairAlgorithm[]
                    ).map((key) => (
                      <option key={key} value={key}>
                        {key} ({KEYPAIR_ALGORITHM_DETAILS[key].name})
                      </option>
                    ))}
                  </Select>
                </div>

                <PlainTextCodeBlock
                  code={
                    KEYPAIR_ALGORITHM_DETAILS[algorithm].privateKeyInstructions
                  }
                />
                <Text>Extract the public key.</Text>
                <PlainTextCodeBlock
                  code={
                    KEYPAIR_ALGORITHM_DETAILS[algorithm].publicKeyInstructions
                  }
                />
                <Text>Print the public key.</Text>
                <PlainTextCodeBlock code="cat public.key" />
              </div>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                Public Key ({KEYPAIR_ALGORITHM_DETAILS[algorithm].name})
              </FormLabel>
              <Textarea
                fontFamily="mono"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="-----BEGIN PUBLIC KEY-----\n...\n...\n...\n...\n-----END PUBLIC KEY-----"
                rows={6}
                fontSize="small"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this keypair"
              />
            </FormControl>

            <Alert variant="left-accent">
              <div className="flex flex-col gap-2">
                <Text>
                  <strong>Keep your private key secure!</strong>
                  <br />
                  Your backend will sign access tokens with this private key
                  which Engine verifies with this public key.
                </Text>
              </div>
            </Alert>
          </ModalBody>

          <ModalFooter as={Flex} gap={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="primary"
              onClick={onClick}
              isDisabled={!publicKey}
            >
              Add Public Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
