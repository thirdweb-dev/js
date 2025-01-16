import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Meta, StoryObj } from "@storybook/react";
import Link from "next/link";
import { BadgeContainer, mobileViewport } from "../../../stories/utils";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

const meta = {
  title: "Shadcn/Table",
  component: Component,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Component() {
  return (
    <div className="flex min-w-0 flex-col gap-6 px-4 py-6 lg:mx-auto lg:max-w-[1000px]">
      <BadgeContainer label="Normal">
        <TableDemo />
      </BadgeContainer>

      <BadgeContainer label="Clickable Row">
        <TableDemo linkBox />
      </BadgeContainer>

      <BadgeContainer label="With Footer">
        <TableDemo footer />
      </BadgeContainer>
    </div>
  );
}

type Invoice = {
  invoice: string;
  paymentStatus: string;
  totalAmount: string;
  paymentMethod: string;
};

const invoices: Invoice[] = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
];

function TableDemo(props: {
  footer?: boolean;
  linkBox?: boolean;
}) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow
              key={invoice.invoice}
              linkBox={props.linkBox}
              className={cn(
                props.linkBox && "cursor-pointer hover:bg-accent/50",
              )}
            >
              <TableCell className="font-medium">
                <Link
                  href={`/invoices/${invoice.invoice}`}
                  className={cn(
                    props.linkBox && "before:absolute before:inset-0",
                  )}
                >
                  {invoice.invoice}
                </Link>
              </TableCell>
              <TableCell>
                <Badge>{invoice.paymentStatus}</Badge>
              </TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {props.footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
}
