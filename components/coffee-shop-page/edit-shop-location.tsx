// components/edit-shop-location.tsx
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EditShopLocationProps {
  onLocationUpdate: (latitude: number, longitude: number) => void;
  initialAddress?: string; // Optional initial address
}

const EditShopLocation: React.FC<EditShopLocationProps> = ({
  onLocationUpdate,
  initialAddress = '',
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeocode = async () => {
    setLoading(true);
    setError(null); // Reset error on new attempt
    try {
      const response = await axios.post('/api/geocode', { address });
      const { latitude, longitude } = response.data;
      onLocationUpdate(latitude, longitude);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ error: string }>;
        setError(axiosError.response?.data?.error || 'Geocoding failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='flex'>
      <Input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className='min-w-80'
      />
      <Button onClick={handleGeocode} disabled={loading} variant="link">
        {loading ? 'Geocoding...' : 'Update'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EditShopLocation;