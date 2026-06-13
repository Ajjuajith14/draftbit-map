import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function AppButton({ title, onPress, variant = 'primary' }: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, isPrimary ? styles.primaryTitle : styles.secondaryTitle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.borderStrong,
    borderWidth: 1,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  primaryTitle: {
    color: colors.surface,
  },
  secondaryTitle: {
    color: colors.primaryDark,
  },
  pressed: {
    opacity: 0.82,
  },
});
