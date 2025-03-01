// src/components/coffee-shop-page/ShopEditDialog.tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";

interface ShopEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nameInputValue: string;
    descriptionInputValue: string;
    featuredInputValue: boolean;
    setNameInputValue: (value: string) => void;
    setDescriptionInputValue: (value: string) => void;
    setFeaturedInputValue: (value: boolean) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ShopEditDialog: React.FC<ShopEditDialogProps> = ({
    open, onOpenChange, nameInputValue, descriptionInputValue, featuredInputValue, setNameInputValue, setDescriptionInputValue, setFeaturedInputValue, handleSubmit
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link">
                    <Pencil />Edit Shop Information
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit</DialogTitle>
                    <DialogDescription>Edit the details of your coffeeshop.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* ... (Input fields) ... */}
                    <div className="grid w-full max-w-sm items-center gap-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="name"
                            id="name"
                            placeholder="My Coffee Shop"
                            value={nameInputValue}
                            onChange={(e) => setNameInputValue(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Type your message here."
                            value={descriptionInputValue}
                            onChange={(e) => setDescriptionInputValue(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-y-2">
                        <Label htmlFor="featured">Featured</Label>
                        <Switch
                            id="featured"
                            checked={featuredInputValue}
                            onCheckedChange={(checked: boolean) => setFeaturedInputValue(checked)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ShopEditDialog;