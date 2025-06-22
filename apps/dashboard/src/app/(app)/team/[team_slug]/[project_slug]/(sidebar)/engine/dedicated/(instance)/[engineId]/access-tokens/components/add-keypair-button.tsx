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
import { Button } from "chakra/button";
import { FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { CirclePlusIcon } from "lucide-react";
import { useState } from "react";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import { type KeypairAlgorithm, useEngineAddKeypair } from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";

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
  PS256: {
    name: "RSASSA-PSS",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA-PSS -out private.key -pkeyopt rsa_keygen_bits:2048 -pkeyopt rsa_pss_keygen_md:sha256",
    publicKeyInstructions:
      "openssl rsa -pubout -in private.key -out public.key",
  },
  RS256: {
    name: "RSASSA-PKCS1-v1_5",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048",
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
    authToken,
    instanceUrl,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Public key added successfully.",
    "Failed to add public key.",
  );

  const onClick = async () => {
    try {
      await importKeypair({
        algorithm,
        label,
        publicKey,
      });

      onSuccess();

      setPublicKey("");
      onClose();
    } catch (error) {
      onError(error);
      console.error(error);
    }
  };

  return (
    <>
      <Button
        colorScheme="primary"
        leftIcon={<CirclePlusIcon className="size-6" />}
        onClick={onOpen}
        size="sm"
        variant="ghost"
        w="fit-content"
      >
        Add Public Key
      </Button>

      <Modal
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
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
                    color="primary.500"
                    fontFamily="mono"
                    fontSize="small"
                    mt="-1px"
                    onChange={(e) =>
                      setAlgorithm(e.target.value as KeypairAlgorithm)
                    }
                    size="sm"
                    // fontWeight="bold"
                    value={algorithm}
                    variant="unstyled"
                    w="fit-content"
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
                fontSize="small"
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="-----BEGIN PUBLIC KEY-----\n...\n...\n...\n...\n-----END PUBLIC KEY-----"
                rows={6}
                value={publicKey}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a description for this keypair"
                value={label}
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
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              isDisabled={!publicKey}
              onClick={onClick}
              type="submit"
            >
              Add Public Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
