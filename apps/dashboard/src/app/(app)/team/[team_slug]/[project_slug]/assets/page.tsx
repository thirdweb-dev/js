"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  WalletIcon,
  ExternalLinkIcon,
  FileIcon,
  ImageIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";

// Temporary hardcoded chart data
const generateChartData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  let baseValue = 5000;
  return months.map((month) => {
    baseValue = baseValue + Math.floor(Math.random() * 1000);
    return {
      time: new Date(`2023-${months.indexOf(month) + 1}-01`).getTime(),
      volume: baseValue,
    };
  });
};

// Dummy assets data
const assetsData = [
  {
    name: "GM3",
    type: "Token",
    network: "Base",
    contractAddress: "0xtoken-...-gm3",
  },
  {
    name: "GMMM",
    type: "NFT",
    network: "Base",
    contractAddress: "0xnft-gm...-gmmm",
  },
];

export default function AssetsPage() {
  return (
    <div className="flex grow flex-col">
      <div className="border-b py-10">
        <div className="container max-w-7xl">
          <h1 className="font-semibold text-2xl tracking-tight lg:text-3xl">
            Assets
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage tokens and NFTs for your project
          </p>
        </div>
      </div>

      <div className="container max-w-7xl py-8">
        <h2 className="text-xl font-semibold mb-6">Create Asset</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href="./assets/create-token"
            passHref
            className="block h-full transition-all duration-200 hover:opacity-80"
          >
            <Card className="bg-background h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Create Token</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Launch your own ERC-20 token (TokenERC20)
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="./assets/create-nft"
            passHref
            className="block h-full transition-all duration-200 hover:opacity-80"
          >
            <Card className="bg-background h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  Create NFT Collection
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Launch an NFT collection (DropERC721)
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link
            href="./assets/import"
            passHref
            className="block h-full transition-all duration-200 hover:opacity-80"
          >
            <Card className="bg-background h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <FileIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  Import Existing Asset
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Import tokens or NFTs you already own
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="my-12">
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h2 className="text-xl font-semibold">Volume</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    Sales
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Fees
                  </Button>
                  <Button variant="default" size="sm" className="text-sm">
                    Volume
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <ThirdwebAreaChart
                  data={generateChartData()}
                  isPending={false}
                  chartClassName="aspect-[3]"
                  config={{
                    volume: {
                      label: "Volume",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Assets</h2>
          </div>

          {assetsData.length === 0 ? (
            <Card className="bg-background py-16">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No assets found</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first token or NFT collection to get started.
                </p>
                <div className="flex space-x-4">
                  <Link href="./assets/create-token" passHref>
                    <Button variant="default">
                      <PlusIcon className="mr-2 h-4 w-4" /> Create Token
                    </Button>
                  </Link>
                  <Link href="./assets/create-nft" passHref>
                    <Button variant="outline">
                      <PlusIcon className="mr-2 h-4 w-4" /> Create NFT
                      Collection
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-background overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>NETWORK</TableHead>
                    <TableHead>CONTRACT ADDRESS</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.map((asset, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {asset.name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            asset.type === "Token"
                              ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          }`}
                        >
                          {asset.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          {asset.network}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {asset.contractAddress}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href="https://token-marketplace.thirdweb-preview.com/nfts/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Learn More</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="bg-background">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Token Guide</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to create and manage tokens
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">NFT Guide</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to create and manage NFTs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Asset Management</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to manage your digital assets
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
