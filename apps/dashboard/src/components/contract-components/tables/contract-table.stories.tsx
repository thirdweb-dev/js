import type { Meta, StoryObj } from "@storybook/react";
import { ThirdwebProvider } from "thirdweb/react";
import type { ProjectContract } from "../../../app/account/contracts/_components/getProjectContracts";
import {
  BadgeContainer,
  storybookThirdwebClient,
} from "../../../stories/utils";
import { ContractTableUI } from "./contract-table";

const meta = {
  title: "Contracts/ContractTable",
  component: Story,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Story>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

const popularPolygonNFTs: ProjectContract[] = [
  projectContractStub("137", "0x83a5564378839eef0721bc68a0fbeb92e2de73d2"),
  projectContractStub("137", "0x9e8ea82e76262e957d4cc24e04857a34b0d8f062"),
  projectContractStub("137", "0xc93c53de60d1a28df01e41f5bc04619039d2ef4f"),
  projectContractStub("137", "0x4d544035500d7ac1b42329c70eb58e77f8249f0f"),
  projectContractStub("137", "0x77bd275ff2b3dc007475aac9ce7f408f5a800188"),
];

const EthereumPopularNFTs: ProjectContract[] = [
  projectContractStub("1", "0xed5af388653567af2f388e6224dc7c4b3241c544"),
  projectContractStub("1", "0x5af0d9827e0c53e4799bb226655a1de152a425a5"),
  projectContractStub("1", "0xbd3531da5cf5857e7cfaa92426877b022e612cf8"),
  projectContractStub("1", "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"),
  projectContractStub("1", "0x9830b32f7210f0857a859c2a86387e4d1bb760b8"),
];

const basePopularTokens: ProjectContract[] = [
  projectContractStub("8453", "0xC73e76Aa9F14C1837CDB49bd028E8Ff5a0a71dAD"),
  projectContractStub("8453", "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c"),
  projectContractStub("8453", "0x12418783e860997eb99e8aCf682DF952F721cF62"),
  projectContractStub("8453", "0xdca716b7360b76383e8f7b82aefcbe632fc381af"),
  projectContractStub("8453", "0x2C8C89C442436CC6C0a77943E09c8Daf49Da3161"),
];

function Story() {
  const removeContractStub = async (contractId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Removed contract", contractId);
  };

  return (
    <ThirdwebProvider>
      <div className="container flex max-w-6xl flex-col gap-10 py-10">
        <BadgeContainer label="0 Contracts">
          <ContractTableUI
            client={storybookThirdwebClient}
            contracts={[]}
            removeContractFromProject={removeContractStub}
            pageSize={10}
          />
        </BadgeContainer>

        <BadgeContainer label="1 Contract">
          <ContractTableUI
            client={storybookThirdwebClient}
            contracts={[popularPolygonNFTs[0] as ProjectContract]}
            pageSize={10}
            removeContractFromProject={removeContractStub}
          />
        </BadgeContainer>

        <BadgeContainer label="5 Contracts, 1 chain">
          <ContractTableUI
            client={storybookThirdwebClient}
            contracts={popularPolygonNFTs}
            pageSize={10}
            removeContractFromProject={removeContractStub}
          />
        </BadgeContainer>

        <BadgeContainer label="10 Contracts, 2 chains">
          <ContractTableUI
            client={storybookThirdwebClient}
            contracts={[...popularPolygonNFTs, ...EthereumPopularNFTs]}
            pageSize={10}
            removeContractFromProject={removeContractStub}
          />
        </BadgeContainer>

        <BadgeContainer label="15 Contracts, 3 chains">
          <ContractTableUI
            client={storybookThirdwebClient}
            contracts={[
              ...popularPolygonNFTs,
              ...EthereumPopularNFTs,
              ...basePopularTokens,
            ]}
            pageSize={10}
            removeContractFromProject={removeContractStub}
          />
        </BadgeContainer>
      </div>
    </ThirdwebProvider>
  );
}

function projectContractStub(
  chainId: string,
  contractAddress: string,
): ProjectContract {
  return {
    chainId,
    contractAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: `${chainId}-${contractAddress}`,
  };
}
