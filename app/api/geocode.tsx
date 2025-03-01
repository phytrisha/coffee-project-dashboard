import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type GeocodeResponse = {
  latitude: number;
  longitude: number;
};

type NominatimResult = {
  lat: string;
  lon: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GeocodeResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { address } = req.body;

  try {
    const response = await axios.get<NominatimResult[]>(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );

    const results = response.data;

    if (results && results.length > 0) {
      const { lat, lon } = results[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      res.status(200).json({ latitude, longitude });
    } else {
      res.status(404).json({ error: 'Address not found.' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed.' });
  }
}