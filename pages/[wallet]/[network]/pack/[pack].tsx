import { AppLayout } from "components/app-layouts/app";
import { ConsolePage } from "pages/_app";
import React from "react";

// const PackPage: ConsolePage = () => {
//   const packAddress = useSingleQueryParam("pack");
//   const data = usePackList(packAddress);
//   const contract = usePackContract(packAddress);
//   const metadata = usePackContractMetadata(packAddress);
//   const isAdmin = useIsAdmin(contract);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [activeTab, setActiveTab] = useState<number | undefined>();
//   const { data: balance, isLoading } = usePackLink(packAddress);

//   const { Track } = useTrack({
//     page: "pack",
//     pack: packAddress,
//   });

//   const noLink = useMemo(() => {
//     return BigNumber.from(balance?.value || 0).isZero();
//   }, [balance]);

//   return (
//     <Track>
//       <MintDrawer
//         isOpen={isOpen}
//         onClose={onClose}
//         contract={contract as EitherBaseContractType}
//       />
//       <ContractLayout
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         contract={contract}
//         metadata={metadata}
//         data={data}
//         primaryAction={MintButton}
//         emptyState={{
//           title:
//             "You have not created any packs yet, let's create one to get started!",
//           action: {
//             icon: FiPlus,
//             onClick: onOpen,
//             label: "Create first pack",
//             requiredRole: "minter",
//           },
//         }}
//       >
//         <Stack spacing={5}>
//           {noLink && !isLoading && isAdmin && (
//             <ContractPageNotice
//               color="orange"
//               onClick={() => setActiveTab(3)}
//               action="Deposit LINK"
//               message={`
//                 You need to deposit LINK to enable pack opening. LINK is used to
//                 ensure that pack opens are genuinely random.
//               `}
//             />
//           )}
//           {data.data && <ContractItemsTable contract={contract} items={data.data} />}
//         </Stack>
//       </ContractLayout>
//     </Track>
//   );
// };

const PackPage: ConsolePage = () => {
  return <div>Pack page</div>;
};

PackPage.Layout = AppLayout;

export default PackPage;
