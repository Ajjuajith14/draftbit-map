import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CategoryBadge } from '@/components/CategoryBadge';
import { colors } from '@/constants/colors';
import { locationCardLayout } from '@/constants/map';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { Location } from '@/types/location';

type LocationCardProps = {
  location: Location;
  onPress: () => void;
  selected?: boolean;
};

export function LocationCard({ location, onPress, selected = false }: LocationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selectedCard, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.name}>
          {location.name}
        </Text>
        {typeof location.rating === 'number' ? (
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{location.rating.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
      <CategoryBadge category={location.category} />
      <Text numberOfLines={2} style={styles.address}>
        {location.city ? `${location.city} - ${location.address}` : location.address}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 2,
    gap: spacing.md,
    marginRight: locationCardLayout.gap,
    minHeight: 148,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    width: locationCardLayout.width,
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    shadowOpacity: 0.12,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  rating: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  ratingText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  address: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.84,
  },
});
