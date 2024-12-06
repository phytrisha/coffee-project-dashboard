'use client'

import { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CoffeeTableHeader } from "@/components/coffee-table-header";
import { db } from '@/lib/firebase';
// Example usage in a component
import { collection, getDocs } from 'firebase/firestore';

interface CoffeeShop {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function Home() {
  const [data, setData] = useState<CoffeeShop[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    
    async function fetchData() {
      console.log("Initial Data Fetch");
      const querySnapshot = await getDocs(collection(db, 'shops'));
      const items: CoffeeShop[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CoffeeShop);
      });
      setData(items);
      
      fetchedRef.current = true;
    }
    
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-w-full items-start justify-items-center min-h-screen p-8 pb-4 gap-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <CoffeeTableHeader />
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.image}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
