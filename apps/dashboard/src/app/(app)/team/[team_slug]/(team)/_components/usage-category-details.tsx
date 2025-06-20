import type { UsageCategory } from "@/api/usage/billing-preview";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsageCategoryDetailsProps {
  category: UsageCategory;
}

export function UsageCategoryDetails({ category }: UsageCategoryDetailsProps) {
  const categoryTotalCents = category.lineItems.reduce(
    (sum, item) => sum + item.amountUsdCents,
    0,
  );

  // filter out any lines with 0 quantity
  const filteredLineItems = category.lineItems.filter(
    (item) => item.quantity > 0,
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">{category.category}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow>
              <TableHead className="w-[45%] pl-6">Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="pr-6 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLineItems.length > 0 ? (
              filteredLineItems.map((item, index) => (
                <TableRow
                  className="hover:bg-accent"
                  key={`${item.description}_${index}`}
                >
                  <TableCell className="py-3 pl-6 font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {item.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {formatPrice(item.unitAmountUsdCents, {
                      inCents: true,
                      isUnitPrice: true,
                    })}
                  </TableCell>
                  <TableCell className="py-3 pr-6 text-right">
                    {formatPrice(
                      item.quantity *
                        Number.parseFloat(item.unitAmountUsdCents),
                      { inCents: true },
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 pl-6 text-center text-muted-foreground"
                  colSpan={4}
                >
                  No usage during this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {categoryTotalCents > 0 && (
        <CardFooter className="flex justify-end p-4 pr-6 ">
          <div className="font-semibold text-md">
            Subtotal: {formatPrice(categoryTotalCents, { inCents: true })}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Currency Formatting Helper
export function formatPrice(
  value: number | string,
  options?: { isUnitPrice?: boolean; inCents?: boolean },
) {
  const { isUnitPrice = false, inCents = true } = options || {};
  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : value;

  if (Number.isNaN(numericValue)) {
    return "N/A";
  }

  const amountInDollars = inCents ? numericValue / 100 : numericValue;

  return amountInDollars.toLocaleString("en-US", {
    currency: "USD",
    maximumFractionDigits: isUnitPrice ? 10 : 2,
    minimumFractionDigits: 2,
    style: "currency", // Allow more precision for unit prices
  });
}
