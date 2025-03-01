
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CirclePlus } from "lucide-react";

interface AddDrinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleAddDrink: (e: React.FormEvent) => Promise<void>;
}

const AddDrinkDialog: React.FC<AddDrinkDialogProps> = ({ open, onOpenChange, handleAddDrink }) => {
    const [newDrink, setNewDrink] = useState({
        name: '',
        description: '',
        price: 0,
        featured: false,
        imageUrl: ''
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <CirclePlus />Add Drink
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Drink</DialogTitle>
                    <DialogDescription>Add a new drink to your menu.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* ... (Input fields) ... */}
                    <div className="grid w-full max-w-sm items-center gap-y-2">
                        <Label htmlFor="drinkName">Name</Label>
                        <Input
                            type="text"
                            id="drinkName"
                            placeholder="Cappuccino"
                            value={newDrink.name}
                            onChange={(e) => setNewDrink(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>
                    <div className="grid w-full gap-y-2">
                        <Label htmlFor="drinkDescription">Description</Label>
                        <Textarea
                            id="drinkDescription"
                            placeholder="Describe your drink..."
                            value={newDrink.description}
                            onChange={(e) => setNewDrink(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-y-2">
                        <Label htmlFor="drinkPrice">Price (€)</Label>
                        <Input
                            type="number"
                            id="drinkPrice"
                            placeholder="3.50"
                            value={newDrink.price}
                            onChange={(e) => setNewDrink(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Switch
                            id="featured"
                            checked={newDrink.featured}
                            onCheckedChange={(checked) => setNewDrink(prev => ({ ...prev, featured: checked }))}
                        />
                        <Label htmlFor="featured">Featured Drink</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddDrink}>Add Drink</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddDrinkDialog;