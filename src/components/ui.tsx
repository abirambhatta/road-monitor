import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { CLASS_LABEL, PROVENANCE_LABEL } from '../domain/format';
import type { DetectionClass, Provenance } from '../domain/types';
import { classColor, color, font, provenanceColor, radius, space, type } from '../theme';

/** iOS inset-grouped section: optional header, rows separated by hairlines. */
export function Group({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <View style={styles.group}>
      {title ? <Text style={styles.groupTitle}>{title}</Text> : null}
      <View style={styles.groupBody}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 ? <View style={styles.separator} /> : null}
            {row}
          </Fragment>
        ))}
      </View>
      {footer ? <Text style={styles.groupFooter}>{footer}</Text> : null}
    </View>
  );
}

export function Row({
  label,
  value,
  detail,
  mono,
  accessory,
  onPress,
}: {
  label: string;
  value?: string;
  detail?: string;
  mono?: boolean;
  accessory?: ReactNode;
  onPress?: () => void;
}) {
  const body = (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.rowLabel}>{label}</Text>
        {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, mono && styles.mono]} numberOfLines={2}>
            {value}
          </Text>
        ) : null}
        {accessory}
        {onPress ? <SymbolView name="chevron.right" size={13} tintColor={color.textFaint} weight="semibold" /> : null}
      </View>
    </View>
  );
  return onPress ? (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {body}
    </Pressable>
  ) : (
    body
  );
}

export function ProvenanceTag({ provenance }: { provenance: Provenance }) {
  const c = provenanceColor[provenance];
  return (
    <View style={[styles.tag, { borderColor: c }]}>
      <Text style={[styles.tagText, { color: c }]}>{PROVENANCE_LABEL[provenance]}</Text>
    </View>
  );
}

export function ClassBadge({ cls, size = 'md' }: { cls: DetectionClass; size?: 'md' | 'lg' }) {
  return (
    <View style={styles.classBadge}>
      <View style={[styles.swatch, size === 'lg' && styles.swatchLg, { backgroundColor: classColor[cls] }]} />
      <Text style={[styles.classText, size === 'lg' && type.title]}>{CLASS_LABEL[cls]}</Text>
    </View>
  );
}

export function DemoBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.banner, style]}>
      <Text style={styles.bannerLabel}>Demo data</Text>
      <Text style={styles.bannerText}>No detection model yet. These records are examples for testing the layout.</Text>
    </View>
  );
}

export function EmptyState({ symbol, title, children }: { symbol: SFSymbol; title: string; children?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <SymbolView name={symbol} size={34} tintColor={color.textFaint} weight="light" />
      <Text style={styles.emptyTitle}>{title}</Text>
      {children}
    </View>
  );
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl * 2, gap: space.xl },
  body: { ...type.body, color: color.textMuted },
  footnote: { ...type.footnote, color: color.textMuted },
  mono: { fontFamily: font.mono, fontVariant: ['tabular-nums'] },
});

const styles = StyleSheet.create({
  group: { gap: space.sm },
  groupTitle: { ...type.label, color: color.textMuted, paddingHorizontal: space.lg },
  groupBody: { backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden' },
  groupFooter: { ...type.footnote, color: color.textFaint, paddingHorizontal: space.lg },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: color.line, marginLeft: space.lg },
  row: {
    minHeight: 48,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  rowMain: { flex: 1, gap: 2 },
  rowLabel: { ...type.body, color: color.text },
  rowDetail: { ...type.footnote, color: color.textFaint },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1, maxWidth: '62%' },
  rowValue: { ...type.body, color: color.textMuted, textAlign: 'right', flexShrink: 1 },
  mono: { fontFamily: font.mono, fontSize: 14, fontVariant: ['tabular-nums'] },
  pressed: { backgroundColor: color.surfaceRaised },
  tag: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { ...type.label, fontSize: 10, letterSpacing: 0.6 },
  classBadge: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  swatchLg: { width: 14, height: 14, borderRadius: 3 },
  classText: { ...type.headline, color: color.text },
  banner: {
    borderWidth: 1,
    borderColor: color.line,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: space.md,
    gap: 2,
  },
  bannerLabel: { ...type.label, color: color.accent },
  bannerText: { ...type.footnote, color: color.textMuted },
  empty: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.xl },
  emptyTitle: { ...type.headline, color: color.text, textAlign: 'center' },
});
