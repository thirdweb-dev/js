import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOnrampCountrySupport } from "../../../../utils";
import type { OnrampProvider } from "../client/provider";

export async function CountriesTable(props: { provider: OnrampProvider }) {
  const data = await getOnrampCountrySupport(props.provider);
  const countries = data.supportedCountries;

  return (
    <TableContainer className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm transition-all">
      <Table>
        <TableHeader className="z-0">
          <TableRow className="border-border/50 border-b bg-muted/50">
            <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
              Country
            </TableHead>
            <TableHead className="py-4 font-medium text-muted-foreground/80 text-xs uppercase tracking-wider">
              Currencies
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.map((country) => (
            <TableRow key={country.code} className="hover:bg-accent/50">
              <TableCell className="font-medium">{country.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {country.currencies.join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
