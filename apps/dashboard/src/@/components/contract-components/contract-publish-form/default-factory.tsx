import type { Abi } from "abitype";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { UnderlineLink } from "../../ui/UnderlineLink";
import { AbiSelector } from "./abi-selector";
import { NetworksFieldset } from "./networks-fieldset";

interface DefaultFactoryProps {
  abi: Abi;
  client: ThirdwebClient;
}

export function DefaultFactory({ abi, client }: DefaultFactoryProps) {
  const form = useFormContext();

  return (
    <div className="space-y-12">
      {/* Description */}
      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p>
          Default factory lets users deploy your contract to{" "}
          <em className="font-medium">any EVM network</em>.
        </p>
        <p>
          The factory deploys EIP-1167 minimal proxies of your contract. This
          makes it much cheaper to deploy.
        </p>
        <p>
          The factory is{" "}
          <UnderlineLink
            href="https://github.com/thirdweb-dev/contracts/blob/main/contracts/TWStatelessFactory.sol"
            target="_blank"
            rel="noopener noreferrer"
          >
            open-source
          </UnderlineLink>
          , permissionless, and does not alter contract ownership.
        </p>
        <p>
          Your contract needs to be written in the upgradeable/initializable
          pattern. It needs to contain an initializer function.
        </p>
      </div>

      {/* Initializer function */}
      <div>
        <h3 className="text-lg font-semibold mb-1">Initializer function</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Choose the initializer function to invoke on your proxy contracts.
        </p>

        <AbiSelector
          abi={abi}
          defaultValue="initialize"
          onChange={(selectedFn) =>
            form.setValue(
              "factoryDeploymentData.implementationInitializerFunction",
              selectedFn,
            )
          }
          value={form.watch(
            "factoryDeploymentData.implementationInitializerFunction",
          )}
        />
      </div>

      {/* Networks */}
      <NetworksFieldset client={client} />
    </div>
  );
}
