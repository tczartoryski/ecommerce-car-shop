import * as React from 'react';
import { request } from '../authentication/authUtils';
import { Car } from '../../pages/car/types';

const useFetchCars = (url: string) => {
  const [cars, setCars] = React.useState<Car[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCars = React.useCallback(async () => {
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

  React.useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return { cars, loading, error, refetch: fetchCars };
};

export default useFetchCars;