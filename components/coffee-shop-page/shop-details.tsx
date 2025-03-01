// src/components/coffee-shop-page/ShopDetails.tsx
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CoffeeShop {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    featured: boolean;
}

interface ShopDetailsProps {
    shop: CoffeeShop;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({ shop }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Featured</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Image src={shop.imageUrl} width={100} height={100} alt="Picture of the Coffee Shop" />
                    </TableCell>
                    <TableCell className='font-mono'>{shop.id}</TableCell>
                    <TableCell>{shop.name}</TableCell>
                    <TableCell>{shop.description}</TableCell>
                    <TableCell>{shop.featured.toString()}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default ShopDetails;