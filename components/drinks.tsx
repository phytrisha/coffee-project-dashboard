// components/drink.ts
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface DrinkData {
  name: string;
  description: string;
  price: number;
  featured: boolean;
  imageUrl: string;
}

export async function AddDrink(shopId: string, drinkData: DrinkData) {
  try {
    const docRef = await addDoc(collection(db, 'shops', shopId, 'drinks'), {
      name: drinkData.name,
      description: drinkData.description,
      price: drinkData.price,
      featured: drinkData.featured,
      imageUrl: drinkData.imageUrl
    });
    console.log("Drink added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding drink: ", e);
    throw e;
  }
}

export async function UpdateDrink(
  shopId: string,
  drinkId: string,
  data: Partial<DrinkData>
) {
  try {
    const drinkRef = doc(db, 'shops', shopId, 'drinks', drinkId);
    await updateDoc(drinkRef, data);
    console.log("Drink successfully updated");
    return true;
  } catch (e) {
    console.error("Error updating drink: ", e);
    throw e;
  }
}

export async function DeleteDrink(shopId: string, drinkId: string) {
  try {
    const drinkRef = doc(db, 'shops', shopId, 'drinks', drinkId);
    await deleteDoc(drinkRef);
    console.log("Drink successfully deleted");
    return true;
  } catch (e) {
    console.error("Error deleting drink: ", e);
    throw e;
  }
}