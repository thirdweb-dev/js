import {
  TableContainer as CTableContainer,
  TableContainerProps,
} from "@chakra-ui/react";

export const TableContainer: React.FC<TableContainerProps> = ({ children }) => {
  return (
    <CTableContainer
      p={0}
      overflowX="auto"
      borderRadius="lg"
      borderWidth={1}
      borderColor="borderColor"
    >
      {children}
    </CTableContainer>
  );
};
