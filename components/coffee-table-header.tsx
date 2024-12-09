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
import { AddCoffeeShop } from "./add-coffee-shop"
import { useState } from 'react';


export function CoffeeTableHeader() {
  const [nameInputValue, setNameInputValue] = useState('');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');
  const [imageUrlInputValue, setImageUrlInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(nameInputValue)
    e.preventDefault();
    await AddCoffeeShop(nameInputValue, descriptionInputValue, imageUrlInputValue);
    // Refresh data after adding
  };

  return (
    <div className="w-full flex flex-row items-center">
        <h1 className="w-full text-xl font-bold">
          Coffee Shops
        </h1>
        
        <Dialog>
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
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  type="imageUrl"
                  id="imageUrl"
                  placeholder="image.png"
                  value={imageUrlInputValue}
                  onChange={(e) => setImageUrlInputValue(e.target.value)}
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
