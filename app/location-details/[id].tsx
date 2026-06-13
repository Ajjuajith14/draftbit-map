import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CategoryBadge } from '@/components/CategoryBadge';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { LocationInfoRow } from '@/components/LocationInfoRow';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { getLocationById } from '@/services/locationsApi';
import type { Location } from '@/types/location';

export default function LocationDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const locationId = Array.isArray(id) ? id[0] : id;

    if (!locationId) {
      setError('Invalid location id.');
      setLoading(false);
      return;
    }

    const loadLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextLocation = await getLocationById(locationId);
        setLocation(nextLocation);
      } catch (caughtError) {
        setLocation(null);
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load location.');
      } finally {
        setLoading(false);
      }
    };

    void loadLocation();
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState message="Loading location details..." />
      </ScreenContainer>
    );
  }

  if (error || !location) {
    return (
      <ScreenContainer>
        <ErrorState message={error ?? 'Location not found.'} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {location.imageUrl ? (
        <Image source={{ uri: location.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.placeholderGlow} />
          <Ionicons name="location-outline" size={42} color={colors.primary} />
        </View>
      )}

      <View style={styles.titleBlock}>
        <CategoryBadge category={location.category} />
        <Text style={styles.title}>{location.name}</Text>
        {typeof location.rating === 'number' ? (
          <View style={styles.rating}>
            <Ionicons name="star" size={18} color={colors.warning} />
            <Text style={styles.ratingText}>{location.rating.toFixed(1)} rating</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <LocationInfoRow label="Address" value={location.address} />
        {location.city ? <LocationInfoRow label="City" value={location.city} /> : null}
        <LocationInfoRow label="Description" value={location.description} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Coordinates</Text>
        <LocationInfoRow label="Latitude" value={location.latitude.toFixed(6)} />
        <LocationInfoRow label="Longitude" value={location.longitude.toFixed(6)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Location Metadata</Text>
        <LocationInfoRow label="Location ID" value={location.id} />
        <LocationInfoRow label="Category" value={location.category} />
        <LocationInfoRow
          label="Image"
          value={location.imageUrl ? 'Provided by API' : 'Placeholder shown'}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    height: 220,
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 220,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderGlow: {
    backgroundColor: colors.primarySoft,
    borderRadius: 120,
    height: 180,
    opacity: 0.9,
    position: 'absolute',
    right: -42,
    top: -36,
    width: 180,
  },
  titleBlock: {
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  rating: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
});
