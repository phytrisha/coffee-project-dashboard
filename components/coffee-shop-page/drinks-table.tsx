// src/components/coffee-shop-page/DrinksTable.tsx
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Upload } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

interface Drink {
    id: string;
    name: string;
    description: string;
    price: number;
    featured: boolean;
    imageUrl: string;
}

interface DrinksTableProps {
    drinks?: Drink[];
    handleEditClick: (drink: Drink) => void;
    handleDeleteClick: (drink: Drink) => void;
    handleDrinkImageUpload: (drink: Drink, newDrinkImageUrl?: string) => Promise<void>;
}

const DrinksTable: React.FC<DrinksTableProps> = ({ drinks, handleEditClick, handleDeleteClick, handleDrinkImageUpload }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {drinks?.map(drink => (
                    <TableRow key={drink.id}>
                        {/* ... (Table cells) ... */}
                        <TableCell>
                            <Image src={drink.imageUrl} width={100} height={100} alt="Picture of the Drink" />
                        </TableCell>
                        <TableCell>{drink.name}</TableCell>
                        <TableCell>{drink.description}</TableCell>
                        <TableCell>{drink.price.toFixed(2)}€</TableCell>
                        <TableCell>{drink.featured.toString()}</TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-2">
                                <CldUploadWidget
                                    options={{ sources: ['local', 'url', 'unsplash'] }}
                                    uploadPreset="coffee-shop-image"
                                    onSuccess={(result) => {
                                        if (result && result.info) {
                                            const imageUrl = (result.info as CloudinaryUploadWidgetInfo).secure_url;
                                            handleDrinkImageUpload(drink, imageUrl);
                                        }
                                    }}
                                    onQueuesEnd={(result, { widget }) => {
                                        widget.close();
                                    }}
                                >
                                    {({ open }) => {
                                        function handleOnClick() {
                                            open();
                                        }
                                        return (
                                            <Button variant="link" onClick={handleOnClick}>
                                            <Upload />Upload an Image
                                        </Button>
                                    );
                                }}
                            </CldUploadWidget>
                            <Button variant="link" onClick={() => handleEditClick(drink)}>
                                <Pencil className="h-4 w-4 mr-1" />Edit
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => handleDeleteClick(drink)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />Delete
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
};

export default DrinksTable;