// src/app/shops/[id]/ShopPage.tsx
'use client'

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import axios, { AxiosError } from 'axios';
import Link from 'next/link'
import { ChevronLeft } from "lucide-react";

import ShopDetails from '@/components/coffee-shop-page/shop-details';
import ShopEditDialog from '@/components/coffee-shop-page/shop-edit-dialog';
import DrinksTable from '@/components/coffee-shop-page/drinks-table';
import AddDrinkDialog from '@/components/coffee-shop-page/add-drink-dialog';
import EditDrinkDialog from '@/components/coffee-shop-page/edit-drink-dialog';
import DeleteDrinkDialog from '@/components/coffee-shop-page/delete-drink-dialog';
import ImageUploadButton from '@/components/coffee-shop-page/image-upload-button';
import { AddDrink, UpdateDrink, DeleteDrink } from "@/components/drinks"
import { UpdateCoffeeShop } from '@/components/coffee-shop';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  featured: boolean;
  drinks?: Drink[];
}

interface GeocodeResponse {
  latitude: number;
  longitude: number;
}

export default function ShopPage({ params }: { params: { id: string } }) {
  const [shop, setShop] = useState<CoffeeShop | null>(null);
  const [nameInputValue, setNameInputValue] = useState(shop?.name || '');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');
  const [imageUrlInputValue, setImageUrlInputValue] = useState('');
  const [featuredInputValue, setFeaturedInputValue] = useState(false);

  const [editCoffeeShopOpen, setEditCoffeeShopOpen] = useState(false);
  const [addDrinkOpen, setAddDrinkOpen] = useState(false);

  const [newDrink, setNewDrink] = useState({
    name: '',
    description: '',
    price: 0,
    featured: false,
    imageUrl: ''
  });

  const [editDrinkOpen, setEditDrinkOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [editingDrink, setEditingDrink] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    featured: false,
    imageUrl: ''
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drinkToDelete, setDrinkToDelete] = useState<Drink | null>(null);

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (shop) {
      setNameInputValue(shop.name);
      setDescriptionInputValue(shop.description);
      setImageUrlInputValue(shop.imageUrl);
      setFeaturedInputValue(shop.featured);
    }
  }, [shop]);

  const fetchShopData = async (shopId: string) => {
    const shopDoc = await getDoc(doc(db, 'shops', shopId));
    const drinksSnapshot = await getDocs(collection(db, 'shops', shopId, 'drinks'));

    const drinks = drinksSnapshot.docs.map(doc => ({
      id: doc.id as string,
      name: doc.data().name as string || '',
      description: doc.data().description as string || '',
      price: doc.data().price as number || 0,
      featured: doc.data().featured as boolean || false,
      imageUrl: doc.data().imageUrl as string || ''
    }));

    const shopData = shopDoc.data();

    setShop({
      id: shopDoc.id,
      name: shopData?.name || '', // Provide default values if needed
      description: shopData?.description || '',
      imageUrl: shopData?.imageUrl || '',
      featured: shopData?.featured || false,
      drinks
    });
  };

  useEffect(() => {
    if (params.id) {
      fetchShopData(params.id);
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop?.id) return;

    try {
      await UpdateCoffeeShop(shop.id, {
        name: nameInputValue,
        description: descriptionInputValue,
        imageUrl: imageUrlInputValue,
        featured: featuredInputValue
      });

      await fetchShopData(shop.id);
      setEditCoffeeShopOpen(false);
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

        await fetchShopData(shop.id);
      } catch (error) {
        console.error('Error updating shop:', error);
      }
    }
  }

  const updateShopLocation = async (address: string, shopId: string | undefined, fetchShopData: (id: string) => Promise<void>) => {
    if (!shopId) return;
  
    try {
      const response = await axios.post<GeocodeResponse>('/api/geocode', { address });
      const { latitude, longitude } = response.data;
  
      await UpdateCoffeeShop(shopId, { lat: latitude, long: longitude });
      await fetchShopData(shopId);
  
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        console.error(axiosError);
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  };

  const handleShopLocationUpdate = async () => {
    await updateShopLocation(address, shop?.id, fetchShopData);
  };

  const handleDrinkImageUpload = async (drink: Drink, newDrinkImageUrl?: string) => {
    if (!shop?.id) return;
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

      setNewDrink({
        name: '',
        description: '',
        price: 0,
        featured: false,
        imageUrl: ''
      });
      setAddDrinkOpen(false);

      await fetchShopData(shop.id);
    } catch (error) {
      console.error('Error adding drink:', error);
    }
  };

  const handleEditClick = (drink: Drink) => {
    setSelectedDrink(drink);
    setEditingDrink({
      id: drink.id,
      name: drink.name,
      description: drink.description,
      price: drink.price,
      featured: drink.featured,
      imageUrl: drink.imageUrl
    });
    setEditDrinkOpen(true);
  };

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

      setSelectedDrink(null);
      setEditDrinkOpen(false);

      await fetchShopData(shop.id);
    } catch (error) {
      console.error('Error updating drink:', error);
    }
  };

  const handleDeleteClick = (drink: Drink) => {
    setDrinkToDelete(drink);
    setDeleteDialogOpen(true);
  };

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
      <Link href="../../" className='text-sm flex flex-row items-center font-medium my-4'><ChevronLeft size={20} />Overview</Link>
      <div className='flex flex-row'>
        <h1 className="w-full text-xl font-bold">{shop.name}</h1>
      </div>

      {/* Shop Information */}
      <div className='flex flex-row mt-8 mb-4'>
        <h2 className='w-full text-lg font-bold'>Shop Information</h2>
        <div className='flex flex-row min-w-80'>
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            className='w-full'
          />
          <Button onClick={handleShopLocationUpdate}>Update</Button>
        </div>
        <ShopEditDialog
          open={editCoffeeShopOpen}
          onOpenChange={setEditCoffeeShopOpen}
          nameInputValue={nameInputValue}
          descriptionInputValue={descriptionInputValue}
          featuredInputValue={featuredInputValue}
          setNameInputValue={setNameInputValue}
          setDescriptionInputValue={setDescriptionInputValue}
          setFeaturedInputValue={setFeaturedInputValue}
          handleSubmit={handleSubmit}
        />
        <ImageUploadButton onImageUpload={handleImageUpload} />
      </div>

      {/* Shop Details */}
      <ShopDetails shop={shop} />

      {/* Drinks */}
      <div className='flex flex-row mt-12 mb-4'>
        <h2 className='w-full text-lg font-bold'>Drinks</h2>
        <AddDrinkDialog open={addDrinkOpen} onOpenChange={setAddDrinkOpen} handleAddDrink={handleAddDrink} />
      </div>

      {/* Drinks Table */}
      <DrinksTable
        drinks={shop.drinks}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleDrinkImageUpload={handleDrinkImageUpload}
      />

      {/* Edit Drink Dialog */}
      <EditDrinkDialog
        open={editDrinkOpen}
        onOpenChange={setEditDrinkOpen}
        editingDrink={editingDrink}
        setEditingDrink={setEditingDrink}
        handleUpdateDrink={handleUpdateDrink}
      />

      {/* Delete Drink Dialog */}
      <DeleteDrinkDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        drinkToDelete={drinkToDelete}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}