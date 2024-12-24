import { useState, useCallback } from 'react';

const useCityByZipcode = () => {
  const [location, setLocation] = useState<string>('');

  const getCityByZipcode = useCallback(async (zipcode: string) => {
    try {
      const response = await fetch(`http://api.zippopotam.us/us/${zipcode}`);
      const data = await response.json();
      setLocation(`${data.places[0]['place name']}, ${data.places[0]['state']}` || '');
    } catch (error) {
      console.error('Error fetching city:', error);
      setLocation('Error fetching location');
    }
  }, []);

  return { location, getCityByZipcode };
};

export default useCityByZipcode;