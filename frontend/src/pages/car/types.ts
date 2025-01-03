export interface CarImage {
  image_url: string;
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: string;
  color: string;
  description: string;
  mileage: number;
  price: string;
  zipcode: string;
  images: CarImage[];
}
