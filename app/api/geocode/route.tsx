// app/api/geocode/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );

    const results = response.data;

    if (results && results.length > 0) {
      const { lat, lon } = results[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      return NextResponse.json({ latitude, longitude });
    } else {
      return NextResponse.json({ error: 'Address not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json({ error: 'Geocoding failed.' }, { status: 500 });
  }
}