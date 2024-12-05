import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CoffeeTableHeader } from "@/components/coffee-table-header";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-w-full items-start justify-items-center min-h-screen p-8 pb-4 gap-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <CoffeeTableHeader />
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Holanka</TableCell>
            <TableCell>Easygoing, eclectic coffee house.</TableCell>
            <TableCell>holanka.png</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Monmouth Coffee</TableCell>
            <TableCell>Fair-trade coffee & gourmet treats.</TableCell>
            <TableCell>monmouth.png</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Drury 188-189</TableCell>
            <TableCell>Funky hangout for craft coffee</TableCell>
            <TableCell>drury.png</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
