import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch";

import { AddCoffeeShop } from "./coffee-shop"
import { useState } from 'react';

interface CoffeeTableHeaderProps {
  onShopAdded?: () => void;  // Optional callback for when a shop is added
}

export function CoffeeTableHeader({ onShopAdded }: CoffeeTableHeaderProps) {
  const [nameInputValue, setNameInputValue] = useState('');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');
  const [imageUrlInputValue, setImageUrlInputValue] = useState('');
  const [backgroundImageUrlInputValue, setBackgroundImageUrlInputValue] = useState('');
  const [featuredInputValue, setFeaturedInputValue] = useState(false);



  const [dialogOpen, setDialogOpen] = useState(false);

  const resetForm = () => {
    setNameInputValue('');
    setDescriptionInputValue('');
    setImageUrlInputValue('');
    setBackgroundImageUrlInputValue('');
    setFeaturedInputValue(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AddCoffeeShop(nameInputValue, descriptionInputValue, imageUrlInputValue, backgroundImageUrlInputValue, featuredInputValue);
      
      // Reset form
      resetForm();
      
      // Close dialog
      setDialogOpen(false);
      
      // Notify parent component to refresh data
      if (onShopAdded) {
        onShopAdded();
      }
    } catch (error) {
      console.error('Error adding coffee shop:', error);
    }
  };

  return (
    <div className="w-full flex flex-row items-center">
        <h1 className="w-full text-xl font-bold">
          Coffee Shops
        </h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add Coffee Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Coffee Shop</DialogTitle>
              <DialogDescription>
                Add a new coffee shop.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <div className="grid w-full max-w-sm items-center gap-y-2">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={featuredInputValue}
                  onCheckedChange={(checked: boolean) => setFeaturedInputValue(checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>Add Coffee Shop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
