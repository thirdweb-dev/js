import type { Meta, StoryObj } from "@storybook/nextjs";
import Link from "next/link";
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
import { BadgeContainer } from "../../../stories/utils";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";

const meta = {
  component: Component,
  title: "Shadcn/Table",
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  args: {},
};

function Component() {
  return (
    <div className="container flex max-w-6xl flex-col gap-10 py-10">
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
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
  },
  {
    invoice: "INV002",
    paymentMethod: "PayPal",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
  },
  {
    invoice: "INV003",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
  },
  {
    invoice: "INV004",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
  },
  {
    invoice: "INV005",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
  },
];

function TableDemo(props: { footer?: boolean; linkBox?: boolean }) {
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
              className={cn(
                props.linkBox && "cursor-pointer hover:bg-accent/50",
              )}
              key={invoice.invoice}
              linkBox={props.linkBox}
            >
              <TableCell className="font-medium">
                <Link
                  className={cn(
                    props.linkBox && "before:absolute before:inset-0",
                  )}
                  href={`/invoices/${invoice.invoice}`}
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
