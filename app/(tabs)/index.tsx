import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { FeatureCard } from '@/components/FeatureCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

const features = [
  {
    icon: 'map-outline' as const,
    title: 'Curated Nearby Pins',
    description: 'Ten hand-picked Paris landmarks appear instantly as a focused OpenStreetMap cluster.',
  },
  {
    icon: 'search-outline' as const,
    title: 'On-Demand Details',
    description: 'Tap a place to enrich the card with fresh Nominatim search data only when needed.',
  },
  {
    icon: 'phone-portrait-outline' as const,
    title: 'Native-Ready Flow',
    description: 'A TypeScript Expo Router app with reusable UI, clean services, and interview-friendly logic.',
  },
];

const stats = [
  { label: 'Static pins', value: '10' },
  { label: 'Map stack', value: 'OSM' },
  { label: 'Details API', value: 'Nominatim' },
];

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.brandMark}>
            <Ionicons name="navigate" size={24} color={colors.surface} />
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Paris demo</Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>OpenStreetMap MVP</Text>
        <Text style={styles.appName}>Map Explorer</Text>
        <Text style={styles.subtitle}>
          Discover a polished cluster of nearby European landmarks, inspect pins smoothly, and fetch live place details only when a location is selected.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/locations')}
          style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
        >
          <Text style={styles.primaryActionText}>Explore Map</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.surface} />
        </Pressable>

        <View style={styles.statGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.routePreview}>
        <View style={styles.routeHeader}>
          <Text style={styles.sectionTitle}>Experience Path</Text>
          <Text style={styles.sectionMeta}>Tap → Focus → Fetch</Text>
        </View>
        <View style={styles.routeMap}>
          <View style={[styles.routePin, styles.routePinStart]}>
            <Ionicons name="location" size={18} color={colors.primary} />
          </View>
          <View style={[styles.routePin, styles.routePinMiddle]}>
            <Ionicons name="business" size={17} color={colors.success} />
          </View>
          <View style={[styles.routePin, styles.routePinEnd]}>
            <Ionicons name="star" size={17} color={colors.warning} />
          </View>
          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />
        </View>
      </View>

      <View style={styles.features}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </View>

      <View style={styles.buildNote}>
        <Ionicons name="layers-outline" size={20} color={colors.primaryDark} />
        <Text style={styles.buildTitle}>
          Built with Expo SDK 54, Expo Router, TypeScript, OpenStreetMap tiles, and Nominatim-powered details.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  liveBadge: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  liveDot: {
    backgroundColor: colors.success,
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  liveText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  appName: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  primaryAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.xl,
  },
  primaryActionText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  pressed: {
    opacity: 0.82,
  },
  statGrid: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingTop: spacing.lg,
  },
  statItem: {
    flex: 1,
    gap: spacing.xs,
  },
  statValue: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  routePreview: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  routeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sectionMeta: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  routeMap: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 126,
    overflow: 'hidden',
  },
  routePin: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    width: 38,
    zIndex: 2,
  },
  routePinStart: {
    left: 28,
    top: 42,
  },
  routePinMiddle: {
    left: '45%',
    top: 24,
  },
  routePinEnd: {
    right: 34,
    top: 62,
  },
  routeLineOne: {
    backgroundColor: colors.primary,
    height: 3,
    left: 58,
    opacity: 0.25,
    position: 'absolute',
    top: 56,
    transform: [{ rotate: '-11deg' }],
    width: 142,
  },
  routeLineTwo: {
    backgroundColor: colors.success,
    height: 3,
    opacity: 0.25,
    position: 'absolute',
    right: 66,
    top: 62,
    transform: [{ rotate: '14deg' }],
    width: 130,
  },
  features: {
    gap: spacing.md,
  },
  buildNote: {
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  buildTitle: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    lineHeight: 20,
  },
});
