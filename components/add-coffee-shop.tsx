import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function AddCoffeeShop(name: string, description: string, imageUrl: string) {
  try {
    const docRef = await addDoc(collection(db, 'shops'), {
      name,
      description,
      imageUrl
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}