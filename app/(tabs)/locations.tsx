import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppHeader } from '@/components/AppHeader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { LocationCard } from '@/components/LocationCard';
import { OpenStreetMapView, type OpenStreetMapViewHandle } from '@/components/OpenStreetMapView';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { locationCardLayout } from '@/constants/map';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useLocations } from '@/hooks/useLocations';
import { getLocationById } from '@/services/locationsApi';
import type { Location } from '@/types/location';

const isValidCoordinate = (location: Location) =>
  Number.isFinite(location.latitude) &&
  Number.isFinite(location.longitude) &&
  Math.abs(location.latitude) <= 90 &&
  Math.abs(location.longitude) <= 180;

export default function LocationsScreen() {
  const { height } = useWindowDimensions();
  const mapRef = useRef<OpenStreetMapViewHandle | null>(null);
  const listRef = useRef<FlatList<Location> | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<Location | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const { locations, loading, error, refetch } = useLocations();

  const validLocations = useMemo(() => locations.filter(isValidCoordinate), [locations]);
  const selectedLocation = validLocations.find((location) => location.id === selectedLocationId);
  const mapHeight = Math.max(360, Math.floor(height * 0.56));

  const fitAllMarkers = useCallback(() => {
    if (validLocations.length === 0) {
      return;
    }

    mapRef.current?.fitAll();
  }, [validLocations]);

  const fetchLocationDetails = async (location: Location) => {
    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const nextLocationDetails = await getLocationById(location.id);
      setSelectedLocationDetails(nextLocationDetails);
    } catch (caughtError) {
      setSelectedLocationDetails(location);
      setDetailsError(
        caughtError instanceof Error ? caughtError.message : 'Unable to load location details.',
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const focusLocation = (location: Location, index: number) => {
    setSelectedLocationId(location.id);
    setSelectedLocationDetails(location);
    mapRef.current?.selectLocation(location.id);
    listRef.current?.scrollToIndex({
      animated: true,
      index,
      viewOffset: spacing.lg,
      viewPosition: 0.08,
    });
  };

  const handleMarkerPress = (location: Location, index: number) => {
    focusLocation(location, index);
    void fetchLocationDetails(location);
  };

  const handleCardPress = (location: Location, index: number) => {
    focusLocation(location, index);
    void fetchLocationDetails(location);
  };

  useEffect(() => {
    if (validLocations.length === 0) {
      return;
    }

    setSelectedLocationId((currentId) => currentId ?? validLocations[0].id);
    fitAllMarkers();
  }, [fitAllMarkers, validLocations]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.container}>
        <AppHeader title="Locations" subtitle="Explore places loaded from OpenStreetMap." />

        {loading ? <LoadingState message="Loading locations..." /> : null}

        {!loading && error ? <ErrorState message={error} onRetry={refetch} /> : null}

        {!loading && !error && locations.length > 0 && validLocations.length === 0 ? (
          <EmptyState
            title="No mappable locations"
            message="The API returned locations, but none included valid coordinates."
          />
        ) : null}

        {!loading && !error && locations.length === 0 ? (
          <EmptyState title="No locations yet" message="The API returned an empty location list." />
        ) : null}

        {!loading && !error && validLocations.length > 0 ? (
          <>
            <View style={[styles.mapWrap, { height: mapHeight }]}>
              <OpenStreetMapView
                ref={mapRef}
                locations={validLocations}
                selectedLocationId={selectedLocationId}
                onMarkerPress={handleMarkerPress}
              />

              <Pressable accessibilityRole="button" onPress={fitAllMarkers} style={styles.recenterButton}>
                <Ionicons name="locate-outline" size={22} color={colors.primary} />
              </Pressable>

              <View style={styles.zoomControls}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => mapRef.current?.zoomIn()}
                  style={styles.zoomButton}
                >
                  <Ionicons name="add" size={22} color={colors.primary} />
                </Pressable>
                <View style={styles.zoomDivider} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => mapRef.current?.zoomOut()}
                  style={styles.zoomButton}
                >
                  <Ionicons name="remove" size={22} color={colors.primary} />
                </Pressable>
              </View>

              {selectedLocationDetails ? (
                <View style={styles.mapDetails}>
                  <View style={styles.mapDetailsHeader}>
                    <Text numberOfLines={1} style={styles.mapDetailsTitle}>
                      {selectedLocationDetails.name}
                    </Text>
                    {detailsLoading ? <Text style={styles.mapDetailsLoading}>Loading</Text> : null}
                  </View>
                  <Text numberOfLines={1} style={styles.mapDetailsCategory}>
                    {selectedLocationDetails.category}
                  </Text>
                  <Text numberOfLines={2} style={styles.mapDetailsAddress}>
                    {selectedLocationDetails.address}
                  </Text>
                  {detailsError ? (
                    <Text numberOfLines={1} style={styles.mapDetailsError}>
                      Showing saved details
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            <View style={styles.cardsSection}>
              <View style={styles.cardsHeader}>
                <Text style={styles.cardsTitle}>Nearby highlights</Text>
                <Text style={styles.cardsCount}>{validLocations.length} places</Text>
              </View>
              <FlatList
                ref={listRef}
                data={validLocations}
                getItemLayout={(_, index) => ({
                  length: locationCardLayout.width + locationCardLayout.gap,
                  offset: (locationCardLayout.width + locationCardLayout.gap) * index,
                  index,
                })}
                horizontal
                keyExtractor={(item) => item.id}
                onScrollToIndexFailed={({ index }) => {
                  setTimeout(() => {
                    listRef.current?.scrollToIndex({ animated: true, index });
                  }, 250);
                }}
                renderItem={({ item, index }) => (
                  <LocationCard
                    location={item}
                    onPress={() => handleCardPress(item, index)}
                    selected={item.id === selectedLocation?.id}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                style={styles.cardsList}
              />
            </View>
          </>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  mapWrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  recenterButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    bottom: spacing.md,
    height: 46,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    width: 46,
    elevation: 4,
  },
  zoomControls: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    left: spacing.md,
    overflow: 'hidden',
    position: 'absolute',
    top: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  zoomButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  zoomDivider: {
    backgroundColor: colors.border,
    height: 1,
    width: '100%',
  },
  mapDetails: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    bottom: spacing.md,
    left: spacing.md,
    maxWidth: 310,
    padding: spacing.md,
    position: 'absolute',
    right: spacing.xxxl + spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  mapDetailsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  mapDetailsTitle: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  mapDetailsLoading: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  mapDetailsCategory: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  mapDetailsAddress: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  mapDetailsError: {
    color: colors.warning,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xs,
  },
  cardsSection: {
    gap: spacing.md,
  },
  cardsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardsTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  cardsCount: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  cardsList: {
    flexGrow: 0,
  },
});
