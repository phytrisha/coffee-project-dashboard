'use client'

import { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import Image from 'next/image'


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateCoffeeShop } from "@/components/coffee-shop";
import { Switch } from "@/components/ui/switch";
import { AddDrink, UpdateDrink, DeleteDrink } from "@/components/drinks"

import { ChevronLeft, Pencil, CirclePlus, Pen, Trash2, Upload } from "lucide-react";
import Link from 'next/link'

interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
  imageUrl: string;
}

interface CoffeeShop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  drinks?: Drink[];
}

export default function ShopPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<CoffeeShop | null>(null);
  const [nameInputValue, setNameInputValue] = useState(shop?.name || '');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');
  const [imageUrlInputValue, setImageUrlInputValue] = useState('');
  const [editCoffeeShopOpen, setEditCoffeeShopOpen] = useState(false);

  const [addDrinkOpen, setAddDrinkOpen] = useState(false);
  const [newDrink, setNewDrink] = useState({
    name: '',
    description: '',
    price: 0,
    featured: false,
    imageUrl: ''
  });

  // New state for editing drinks
  const [editDrinkOpen, setEditDrinkOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [editingDrink, setEditingDrink] = useState({
    name: '',
    description: '',
    price: 0,
    featured: false,
    imageUrl: ''
  });

  // New state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drinkToDelete, setDrinkToDelete] = useState<Drink | null>(null);

  // Add this new useEffect to update input values when shop data loads
  useEffect(() => {
    if (shop) {
      setNameInputValue(shop.name);
      setDescriptionInputValue(shop.description);
      setImageUrlInputValue(shop.imageUrl);
    }
  }, [shop]);

  const fetchShopData = async (shopId: string) => {
    const shopDoc = await getDoc(doc(db, 'shops', shopId));
    const drinksSnapshot = await getDocs(collection(db, 'shops', shopId, 'drinks'));
    
    const drinks = drinksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    setShop({
      id: shopDoc.id,
      ...shopDoc.data(),
      drinks
    } as CoffeeShop);
  };
  
  // Use it in useEffect
  useEffect(() => {
    if (params.id) {
      fetchShopData(params.id);
    }
  }, [params.id]);
  
  // And in handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;
  
    try {
      await UpdateCoffeeShop(shop.id, {
        name: nameInputValue,
        description: descriptionInputValue,
        imageUrl: imageUrlInputValue
      });
  
      // Refetch data
      await fetchShopData(shop.id);
      setEditCoffeeShopOpen(false);  // Close the dialog
      
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };

  const handleImageUpload = async (newImageUrl?: string) => {
    if (!shop?.id) return;
    if (newImageUrl) {
      try {
        await UpdateCoffeeShop(shop.id, {
          imageUrl: newImageUrl
        });
    
        // Refetch data
        await fetchShopData(shop.id);
        // setEditCoffeeShopOpen(false);  // Close the dialog
        
      } catch (error) {
        console.error('Error updating shop:', error);
      }  
    }
  }

  const handleDrinkImageUpload = async (drink: Drink, newDrinkImageUrl?: string) => {
    if (!shop?.id) return;
    console.log("Drink ID: " + drink.id)
    console.log("Shop ID: " + shop.id)
    console.log("Image URL: " + newDrinkImageUrl)
    if (newDrinkImageUrl) {
      try {
        await UpdateDrink(shop.id, drink.id, {
          imageUrl: newDrinkImageUrl
        });

        await fetchShopData(shop.id);
      } catch (error) {
        console.error('Error updating shop:', error);
      }
    }
  }

  const handleAddDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;

    try {
      await AddDrink(shop.id, {
        name: newDrink.name,
        description: newDrink.description,
        price: parseFloat(newDrink.price.toString()),
        featured: newDrink.featured,
        imageUrl: newDrink.imageUrl
      });

      // Reset form and close dialog
      setNewDrink({
        name: '',
        description: '',
        price: 0,
        featured: false,
        imageUrl: ''
      });
      setAddDrinkOpen(false);

      // Refresh the data
      await fetchShopData(shop.id);
    } catch (error) {
      console.error('Error adding drink:', error);
    }
  };

  // Function to open edit dialog with drink data
  const handleEditClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setEditingDrink({
      name: drink.name,
      description: drink.description,
      price: drink.price,
      featured: drink.featured,
      imageUrl: drink.imageUrl
    });
    setEditDrinkOpen(true);
  };

  // Function to handle drink updates
  const handleUpdateDrink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id || !selectedDrink?.id) return;

    try {
      await UpdateDrink(shop.id, selectedDrink.id, {
        name: editingDrink.name,
        description: editingDrink.description,
        price: parseFloat(editingDrink.price.toString()),
        featured: editingDrink.featured,
        imageUrl: editingDrink.imageUrl
      });

      // Reset form and close dialog
      setSelectedDrink(null);
      setEditDrinkOpen(false);

      // Refresh the data
      await fetchShopData(shop.id);
    } catch (error) {
      console.error('Error updating drink:', error);
    }
  };

  // Function to handle delete confirmation
  const handleDeleteClick = (drink: Drink) => {
    setDrinkToDelete(drink);
    setDeleteDialogOpen(true);
  };

  // Function to handle actual deletion
  const handleDeleteConfirm = async () => {
    if (!shop?.id || !drinkToDelete?.id) return;

    try {
      await DeleteDrink(shop.id, drinkToDelete.id);
      setDeleteDialogOpen(false);
      setDrinkToDelete(null);
      await fetchShopData(shop.id);
    } catch (error) {
      console.error('Error deleting drink:', error);
    }
  };

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <Link href="../../" className='text-sm flex flex-row items-center font-medium my-4'><ChevronLeft size={20}/>Overview</Link>
      <div className='flex flex-row'>
        <h1 className="w-full text-xl font-bold">
          {shop.name}
        </h1>
      </div>

      <div className='flex flex-row mt-8 mb-4'>
        <h2 className='w-full text-lg font-bold'>Shop Information</h2>

        <CldUploadWidget
          options={{ sources: ['local', 'url', 'unsplash'] }}
          uploadPreset="coffee-shop-image"
          onSuccess={(result) => {
            // console.log(result)
            if (result && result.info) {
                const imageUrl = (result.info as CloudinaryUploadWidgetInfo).secure_url;
                handleImageUpload(imageUrl);
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
        
        <Dialog open={editCoffeeShopOpen} onOpenChange={setEditCoffeeShopOpen}>
          <DialogTrigger asChild>
            <Button variant="link">
              <Pen />Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Edit the details of your coffeeshop.
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
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
          
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
            <Image
              src={shop.imageUrl}
              width={100}
              height={100}
              alt="Picture of the Coffee Shop"
            />
            </TableCell>
            <TableCell className='font-mono'>{shop.id}</TableCell>
            <TableCell>{shop.name}</TableCell>
            <TableCell>{shop.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className='flex flex-row mt-12 mb-4'>
        <h2 className='w-full text-lg font-bold'>Drinks</h2>
        <Dialog open={addDrinkOpen} onOpenChange={setAddDrinkOpen}>
          <DialogTrigger asChild>
            <Button>
              <CirclePlus />Add Drink
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Drink</DialogTitle>
              <DialogDescription>
                Add a new drink to your menu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
      </div>
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
          {shop.drinks?.map(drink => (
            <TableRow key={drink.id}>
              <TableCell>
                <Image
                  src={drink.imageUrl}
                  width={100}
                  height={100}
                  alt="Picture of the Drink"
                />
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
                    // console.log(result)
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

      <Dialog open={editDrinkOpen} onOpenChange={setEditDrinkOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Drink</DialogTitle>
            <DialogDescription>
              Update the details of your drink.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-y-2">
              <Label htmlFor="editDrinkName">Name</Label>
              <Input
                type="text"
                id="editDrinkName"
                value={editingDrink.name}
                onChange={(e) => setEditingDrink(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid w-full gap-y-2">
              <Label htmlFor="editDrinkDescription">Description</Label>
              <Textarea
                id="editDrinkDescription"
                value={editingDrink.description}
                onChange={(e) => setEditingDrink(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-y-2">
              <Label htmlFor="editDrinkPrice">Price (€)</Label>
              <Input
                type="number"
                id="editDrinkPrice"
                value={editingDrink.price}
                onChange={(e) => setEditingDrink(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <Switch
                id="editFeatured"
                checked={editingDrink.featured}
                onCheckedChange={(checked) => setEditingDrink(prev => ({ ...prev, featured: checked }))}
              />
              <Label htmlFor="editFeatured">Featured Drink</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateDrink}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-semibold">{drinkToDelete?.name}</span>{' '}
              from the menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}