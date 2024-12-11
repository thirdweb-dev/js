import { Img } from "@/components/blocks/Img";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceDeployerAddress } from "lib/publisher-utils";
import { replaceIpfsUrl } from "lib/sdk";
import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { type Column, type Row, useTable } from "react-table";
import type { PublishedContractDetails } from "../../../../../components/contract-components/hooks";

interface PublishedContractTableProps {
  contractDetails: ContractDataInput[];
  footer?: React.ReactNode;
  publisherEnsName: string | undefined;
}

type ContractDataInput = PublishedContractDetails;
type ContractDataRow = ContractDataInput["metadata"] & {
  id: string;
};

function convertContractDataToRowData(
  input: ContractDataInput,
): ContractDataRow {
  return {
    id: input.contractId,
    ...input.metadata,
  };
}

export function PublishedContractTable(props: PublishedContractTableProps) {
  const { contractDetails, footer, publisherEnsName } = props;
  const trackEvent = useTrack();
  const rows = useMemo(
    () => contractDetails.map(convertContractDataToRowData),
    [contractDetails],
  );

  const tableColumns: Column<ContractDataRow>[] = useMemo(() => {
    const cols: Column<ContractDataRow>[] = [
      {
        Header: "Logo",
        accessor: (row) => row.logo,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        Cell: (cell: any) => (
          <Img
            alt=""
            src={cell.value ? replaceIpfsUrl(cell.value) : ""}
            fallback={
              <div className="size-8 rounded-full border border-border bg-muted" />
            }
            className="size-8"
          />
        ),
      },
      {
        Header: "Name",
        accessor: (row) => row.name,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => {
          return (
            <Link
              href={replaceDeployerAddress(
                `/${publisherEnsName || cell.row.original.publisher}/${cell.row.original.id}`,
              )}
              className="whitespace-nowrap text-foreground before:absolute before:inset-0"
            >
              {cell.value}
            </Link>
          );
        },
      },
      {
        Header: "Description",
        accessor: (row) => row.description,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => (
          <span className="line-clamp-2 max-w-[350px] whitespace-normal text-muted-foreground">
            {cell.value}
          </span>
        ),
      },
      {
        Header: "Version",
        accessor: (row) => row.version,
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => (
          <span className="text-muted-foreground">{cell.value}</span>
        ),
      },
      {
        id: "audit-badge",
        accessor: (row) => ({ audit: row.audit }),
        // biome-ignore lint/suspicious/noExplicitAny: FIXME
        Cell: (cell: any) => (
          <span className="flex items-center gap-2">
            {cell.value.audit ? (
              <ToolTipLabel label="View Contract Audit">
                <Button
                  asChild
                  variant="ghost"
                  className="relative z-10 h-auto w-auto p-2"
                >
                  <TrackedLinkTW
                    href={replaceIpfsUrl(cell.value.audit)}
                    category="deploy"
                    label="audited"
                    aria-label="View Contract Audit"
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent({
                        category: "visit-audit",
                        action: "click",
                        label: cell.value.audit,
                      });
                    }}
                  >
                    <ShieldCheckIcon className="size-5 text-success-text" />
                  </TrackedLinkTW>
                </Button>
              </ToolTipLabel>
            ) : null}
          </span>
        ),
      },
    ];

    return cols;
  }, [trackEvent, publisherEnsName]);

  const tableInstance = useTable({
    columns: tableColumns,
    data: rows,
  });

  return (
    <TableContainer>
      <Table {...tableInstance.getTableProps()}>
        <TableHeader>
          {tableInstance.headerGroups.map((headerGroup) => {
            const { key, ...rowProps } = headerGroup.getHeaderGroupProps();
            return (
              <TableRow {...rowProps} key={key}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <TableHead
                    {...column.getHeaderProps()}
                    // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                    key={columnIndex}
                  >
                    <span className="text-muted-foreground">
                      {column.render("Header")}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            );
          })}
        </TableHeader>

        <TableBody {...tableInstance.getTableBodyProps()} className="relative">
          {tableInstance.rows.map((row) => {
            tableInstance.prepareRow(row);
            return <ContractTableRow row={row} key={row.getRowProps().key} />;
          })}
        </TableBody>
      </Table>
      {footer}
    </TableContainer>
  );
}

function ContractTableRow(props: {
  row: Row<ContractDataRow>;
}) {
  const { row } = props;
  const { key, ...rowProps } = row.getRowProps();
  return (
    <>
      <TableRow
        linkBox
        className="cursor-pointer hover:bg-muted/50"
        {...rowProps}
        key={key}
      >
        {row.cells.map((cell) => (
          <TableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render("Cell")}
          </TableCell>
        ))}
      </TableRow>
    </>
  );
}
