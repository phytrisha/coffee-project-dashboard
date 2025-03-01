import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import React from 'react';

interface Drink {
    id: string;
    name: string;
    description: string;
    price: number;
    featured: boolean;
    imageUrl: string;
}

interface EditDrinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingDrink: Drink;
    setEditingDrink: (drink: Drink) => void;
    handleUpdateDrink: (e: React.FormEvent) => Promise<void>;
}

const EditDrinkDialog: React.FC<EditDrinkDialogProps> = ({
    open, onOpenChange, editingDrink, setEditingDrink, handleUpdateDrink
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Drink</DialogTitle>
                    <DialogDescription>Update the details of your drink.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* ... (Input fields) ... */}
                    <div className="grid w-full max-w-sm items-center gap-y-2">
                        <Label htmlFor="editDrinkName">Name</Label>
                        <Input
                            type="text"
                            id="editDrinkName"
                            value={editingDrink.name}
                            onChange={(e) => setEditingDrink({ ...editingDrink, name: e.target.value })}
                        />
                    </div>
                    <div className="grid w-full gap-y-2">
                        <Label htmlFor="editDrinkDescription">Description</Label>
                        <Textarea
                            id="editDrinkDescription"
                            value={editingDrink.description}
                            onChange={(e) => setEditingDrink({ ...editingDrink, description: e.target.value })}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-y-2">
                        <Label htmlFor="editDrinkPrice">Price (€)</Label>
                        <Input
                            type="number"
                            id="editDrinkPrice"
                            value={editingDrink.price}
                            onChange={(e) => setEditingDrink({ ...editingDrink, price: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Switch
                            id="editFeatured"
                            checked={editingDrink.featured}
                            onCheckedChange={(checked) => setEditingDrink({ ...editingDrink, featured: checked })}
                        />
                        <Label htmlFor="editFeatured">Featured Drink</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdateDrink}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditDrinkDialog;