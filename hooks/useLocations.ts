import { useCallback, useEffect, useState } from 'react';

import { getLocations } from '@/services/locationsApi';
import type { Location } from '@/types/location';

type UseLocationsResult = {
  locations: Location[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// This hook owns loading, error, and refetch state so map screens can stay easy to scan.
export const useLocations = (): UseLocationsResult => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextLocations = await getLocations();
      setLocations(nextLocations);
    } catch (caughtError) {
      setLocations([]);
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load locations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { locations, loading, error, refetch };
};
