import { useState, useEffect, useCallback } from 'react';
import { Car } from '../../pages/dashboard/components/car/MyCars';
import { request } from '../authentication/authentication';

const useFetchCars = (url: string) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request(url, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data: Car[] = await response.json();
      setCars(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, refetch: fetchCars };
};

export default useFetchCars;