import axios, { isAxiosError } from 'axios';

import type { Location } from '@/types/location';

const LOCATIONS_API_URL = 'https://worker.ajjugiri14.workers.dev/locations';

type ApiLocation = {
  id?: string | number;
  name?: string;
  description?: string;
  address?: string;
  latitude?: string | number;
  longitude?: string | number;
  category?: string;
  imageUrl?: string;
  rating?: string | number;
  city?: string;
};

const toNumber = (value: unknown) => {
  const nextValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

const isValidCoordinate = (latitude: number, longitude: number) =>
  Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;

const normalizeLocation = (location: ApiLocation, index: number): Location | null => {
  const latitude = toNumber(location.latitude);
  const longitude = toNumber(location.longitude);

  if (latitude === null || longitude === null || !isValidCoordinate(latitude, longitude)) {
    return null;
  }

  return {
    id: String(location.id ?? `location-${index}`),
    name: location.name ?? 'Unnamed location',
    description: location.description ?? location.address ?? 'No description available.',
    address: location.address ?? 'Address not available.',
    latitude,
    longitude,
    category: location.category ?? 'Point of Interest',
    imageUrl: location.imageUrl,
    rating: toNumber(location.rating) ?? undefined,
    city: location.city,
  };
};

const normalizeLocationsResponse = (data: unknown): Location[] => {
  const rawLocations = Array.isArray(data) ? data : [];

  return rawLocations
    .map((location, index) => normalizeLocation(location as ApiLocation, index))
    .filter((location): location is Location => location !== null);
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Unable to load locations.';
  }

  return 'Unable to load locations.';
};

export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await axios.get(LOCATIONS_API_URL, {
      headers: {
        Accept: 'application/json',
      },
      timeout: 12000,
    });

    return normalizeLocationsResponse(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLocationById = async (id: string): Promise<Location> => {
  const locations = await getLocations();
  const location = locations.find((nextLocation) => nextLocation.id === id);

  if (!location) {
    throw new Error('Location not found.');
  }

  return location;
};
