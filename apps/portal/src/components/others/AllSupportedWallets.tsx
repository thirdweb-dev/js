import { getAllWalletsList, getWalletInfo, WalletId } from "thirdweb/wallets";
import Image from "next/image";
import { Table, Tr, Td, TBody, Th } from "../Document/Table";
import { DocLink, InlineCode } from "../Document";

const specialWallets: {
	[key in WalletId]?: boolean;
} = {
	smart: true,
	inApp: true,
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
										href={`/typescript/v5/supported-wallets/${w.id}`}
										className="flex flex-nowrap items-center gap-4 whitespace-nowrap"
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
		<Image src={img} width={44} height={44} alt="" className="rounded-lg" />
	);
}
