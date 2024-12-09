'use client'

import { useState, useEffect } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Pencil, CirclePlus } from "lucide-react";


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

  useEffect(() => {
    async function fetchShopData() {
      const shopDoc = await getDoc(doc(db, 'shops', params.id));
      const drinksSnapshot = await getDocs(collection(db, 'shops', params.id, 'drinks'));
      
      const drinks = drinksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setShop({
        id: shopDoc.id,
        ...shopDoc.data(),
        drinks
      } as CoffeeShop);
    }

    fetchShopData();
  }, [params.id]);

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <a href="../../">
        <Button variant="ghost">
          <ChevronLeft />Overview
        </Button>
      </a>
      <div className='flex flex-row'>
        <h1 className="w-full text-xl font-bold">
          {shop.name}
        </h1>
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
                  Edit<Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}