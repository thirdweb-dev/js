import Image from "next/image";
import {
  getAllWalletsList,
  getWalletInfo,
  type WalletId,
} from "thirdweb/wallets";
import { DocLink, InlineCode } from "../Document";
import { Table, TBody, Td, Th, Tr } from "../Document/Table";

const specialWallets: {
  [key in WalletId]?: boolean;
} = {
  inApp: true,
  smart: true,
};

export async function AllSupportedWallets() {
  const wallets = await getAllWalletsList();

  return (
    <Table>
      <TBody>
        <Tr>
          <Th> Wallet </Th>
          <Th> ID </Th>
        </Tr>

        {wallets
          .filter((w) => !(w.id in specialWallets))
          .map((w) => {
            return (
              <Tr key={w.id}>
                <Td>
                  <DocLink
                    className="flex flex-nowrap items-center gap-4 whitespace-nowrap"
                    href={`/typescript/v5/supported-wallets/${w.id}`}
                  >
                    <WalletImage id={w.id} />
                    {w.name}
                  </DocLink>
                </Td>
                <Td>
                  <InlineCode code={`"${w.id}"`} />
                </Td>
              </Tr>
            );
          })}
      </TBody>
    </Table>
  );
}

async function WalletImage(props: { id: WalletId }) {
  const img = await getWalletInfo(props.id, true);
  return (
    <Image alt="" className="rounded-lg" height={44} src={img} width={44} />
  );
}
