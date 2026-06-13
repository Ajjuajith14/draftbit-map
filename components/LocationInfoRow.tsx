import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type LocationInfoRowProps = {
  label: string;
  value: string;
};

export function LocationInfoRow({ label, value }: LocationInfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
});
