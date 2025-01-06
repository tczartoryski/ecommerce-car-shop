import * as React from 'react';

const useCityByZipcode = () => {
  const [location, setLocation] = React.useState<string>('');
  const cache = React.useRef<{ [key: string]: string }>({});

  const getCityByZipcode = React.useCallback(async (zipcode: string) => {
    if (cache.current[zipcode]) {
      setLocation(cache.current[zipcode]);
      return;
    }

    try {
      const response = await fetch(`http://api.zippopotam.us/us/${zipcode}`);
      const data = await response.json();
      const cityState = `${data.places[0]['place name']}, ${data.places[0]['state']}`;
      cache.current[zipcode] = cityState;
      setLocation(cityState);
    } catch (error) {
      console.error('Error fetching city:', error);
      setLocation('Error fetching location');
    }
  }, []);

  return { location, getCityByZipcode };
};

export default useCityByZipcode;
