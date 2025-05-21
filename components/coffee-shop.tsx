import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

export async function AddCoffeeShop(name: string, description: string, imageUrl: string, backgroundImageUrl: string, featured: boolean) {
  try {
    const docRef = await addDoc(collection(db, 'shops'), {
      name,
      description,
      imageUrl,
      backgroundImageUrl,
      featured
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Add new update function
export async function UpdateCoffeeShop(
  shopId: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    backgroundImageUrl?: string;
    featured?: boolean;
    lat?: number;
    long?: number;
  }
) {
  try {
    const shopRef = doc(db, 'shops', shopId);
    await updateDoc(shopRef, data);
    console.log("Document successfully updated");
    return true;
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
}