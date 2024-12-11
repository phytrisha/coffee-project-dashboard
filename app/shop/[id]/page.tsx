'use client'

import { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UpdateCoffeeShop } from "@/components/coffee-shop"

import { ChevronLeft, Pencil, CirclePlus, Pen } from "lucide-react";
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
        
        <Dialog open={editCoffeeShopOpen} onOpenChange={setEditCoffeeShopOpen}>
          <DialogTrigger>
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
              <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
          
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-mono'>{shop.id}</TableCell>
            <TableCell>{shop.name}</TableCell>
            <TableCell>{shop.description}</TableCell>
            <TableCell>{shop.imageUrl}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className='flex flex-row mt-12 mb-4'>
        <h2 className='w-full text-lg font-bold'>Drinks</h2>
        <Button>
          <CirclePlus />Add Drink
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shop.drinks?.map(drink => (
            <TableRow key={drink.id}>
              <TableCell>{drink.name}</TableCell>
              <TableCell>{drink.description}</TableCell>
              <TableCell>${drink.price.toFixed(2)}</TableCell>
              <TableCell>{drink.featured.toString()}</TableCell>
              <TableCell>{drink.imageUrl}</TableCell>
              <TableCell>
                <Button variant="link" >
                  <Pencil />Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}