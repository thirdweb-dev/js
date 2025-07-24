import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { NFTInput } from "thirdweb/utils";
import { FilePreview } from "@/components/blocks/file-preview";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { CodeClient } from "@/components/ui/code/code.client";
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

type BatchTableProps = {
  data: NFTInput[];
  nextTokenIdToMint?: bigint;
  client: ThirdwebClient;
};

export function BatchTable({
  data,
  nextTokenIdToMint,
  client,
}: BatchTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showTokenId = nextTokenIdToMint !== undefined;
  const showExternalUrl = data.some((row) => row.external_url);
  const showBackgroundColor = data.some((row) => row.background_color);
  const showAnimationUrl = data.some((row) => row.animation_url);
  const showDescription = data.some((row) => row.description);
  const showAttributes = data.some((row) => row.attributes || row.properties);

  const showPagination = totalPages > 1;

  // Render the UI for your table
  return (
    <div className="rounded-lg border bg-card">
      <TableContainer className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              {showTokenId && <TableHead>Token ID</TableHead>}
              <TableHead>Image</TableHead>
              {showAnimationUrl && <TableHead>Animation Url</TableHead>}
              <TableHead>Name</TableHead>
              {showDescription && (
                <TableHead className="min-w-[300px]">Description</TableHead>
              )}
              {showAttributes && <TableHead>Attributes</TableHead>}
              {showExternalUrl && <TableHead>External URL</TableHead>}
              {showBackgroundColor && <TableHead>Background Color</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, rowIndex) => {
              const actualIndex = startIndex + rowIndex;
              return (
                <TableRow
                  className="border-b last:border-b-0"
                  key={actualIndex}
                >
                  {/* Token ID */}
                  {showTokenId && (
                    <TableCell>
                      {String(nextTokenIdToMint + BigInt(actualIndex))}
                    </TableCell>
                  )}

                  {/* Image */}
                  <TableCell className="min-w-36">
                    <FilePreview
                      className="size-36 shrink-0 rounded-lg object-contain"
                      client={client}
                      srcOrFile={
                        typeof row.image === "string" ||
                        row.image instanceof File
                          ? row.image
                          : undefined
                      }
                    />
                  </TableCell>

                  {/* Animation Url */}
                  {showAnimationUrl && (
                    <TableCell className="min-w-36">
                      <FilePreview
                        className="size-36 shrink-0 rounded-lg"
                        client={client}
                        srcOrFile={
                          typeof row.animation_url === "string" ||
                          row.animation_url instanceof File
                            ? row.animation_url
                            : undefined
                        }
                      />
                    </TableCell>
                  )}

                  {/* Name */}
                  <TableCell>{row.name}</TableCell>

                  {/* Description */}
                  {showDescription && (
                    <TableCell className="max-w-xs">
                      <p className="whitespace-pre-wrap">{row.description}</p>
                    </TableCell>
                  )}

                  {/* Attributes */}
                  {showAttributes && (
                    <TableCell>
                      {row.attributes || row.properties ? (
                        <CodeClient
                          code={JSON.stringify(
                            row.attributes || row.properties || {},
                            null,
                            2,
                          )}
                          lang="json"
                          scrollableClassName="max-w-[300px] max-h-[400px]"
                          className="bg-background [&>*]:text-xs"
                        />
                      ) : null}
                    </TableCell>
                  )}

                  {/* External URL */}
                  {showExternalUrl && (
                    <TableCell>
                      {typeof row.external_url === "string" ? (
                        <ToolTipLabel label={row.external_url}>
                          <span>
                            {row.external_url.slice(0, 20) +
                              (row.external_url.length > 20 ? "..." : "")}
                          </span>
                        </ToolTipLabel>
                      ) : row.external_url instanceof File ? (
                        <FilePreview
                          client={client}
                          srcOrFile={row.external_url}
                        />
                      ) : null}
                    </TableCell>
                  )}

                  {/* Background Color */}
                  {showBackgroundColor && (
                    <TableCell>{row.background_color}</TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <div className="border-t py-5">
          <PaginationButtons
            activePage={currentPage}
            totalPages={totalPages}
            onPageClick={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
