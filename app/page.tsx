'use client'

import { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { ChevronRight } from "lucide-react";
import { CoffeeTableHeader } from "@/components/coffee-table-header";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image'

interface CoffeeShop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export default function Home() {
  const [data, setData] = useState<CoffeeShop[]>([]);
  const fetchedRef = useRef(false);

  // Move fetchData outside useEffect
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'shops'));
    const items: CoffeeShop[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as CoffeeShop);
    });
    setData(items);
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    
    // Initial fetch
    fetchData();
    fetchedRef.current = true;
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-w-full items-start justify-items-center min-h-screen p-8 pb-4 gap-8 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <CoffeeTableHeader onShopAdded={fetchData}/>
      <div className='w-full'>
        {/* Coffee Shops Overview Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Image
                    src={item.imageUrl}
                    width={100}
                    height={100}
                    alt="Picture of the Drink"
                  />
                </TableCell>
                <TableCell>
                  {item.name}
                </TableCell>
                <TableCell>
                  {item.description}
                </TableCell>
                
                <TableCell className='flex flex-row-reverse'>
                  <Link href={`/shop/${item.id}`}>
                    <Button variant="link">
                      Details <ChevronRight />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
