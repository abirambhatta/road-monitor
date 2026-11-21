import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ClassBadge, DemoBanner, Group, Row, ui } from '../../components/ui';
import { DEMO_DETECTIONS } from '../../data/demo';
import { formatDate, formatPercent, formatTime, isPothole, SURFACE_LABEL } from '../../domain/format';
import type { Detection } from '../../domain/types';
import { color, radius, space, type } from '../../theme';

type Filter = 'all' | 'potholes' | 'lookalikes';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'potholes', label: 'Potholes' },
  { key: 'lookalikes', label: 'Look-alikes' },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const groups = useMemo(() => {
    const items = DEMO_DETECTIONS.filter((d) =>
      filter === 'all' ? true : filter === 'potholes' ? isPothole(d.cls) : !isPothole(d.cls),
    );
    const byDay = new Map<string, Detection[]>();
    for (const d of items) {
      const day = formatDate(d.detectedAt);
      byDay.set(day, [...(byDay.get(day) ?? []), d]);
    }
    return [...byDay.entries()];
  }, [filter]);

  const potholes = DEMO_DETECTIONS.filter((d) => isPothole(d.cls)).length;

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.summary}>
        <Stat value={String(DEMO_DETECTIONS.length)} label="Detections" />
        <Stat value={String(potholes)} label="Potholes" />
        <Stat value={String(DEMO_DETECTIONS.length - potholes)} label="Look-alikes" />
      </View>

      <View style={styles.segment}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.segmentItem, filter === f.key && styles.segmentActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === f.key }}
          >
            <Text style={[styles.segmentText, filter === f.key && styles.segmentTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <DemoBanner />

      {groups.map(([day, items]) => (
        <Group key={day} title={day}>
          {items.map((d) => (
            <Row
              key={d.id}
              label={d.id}
              detail={`${formatTime(d.detectedAt)} · ${SURFACE_LABEL[d.surface.type]} · ${formatPercent(d.confidence)}`}
              accessory={<ClassBadge cls={d.cls} />}
              onPress={() => router.push(`/history/${d.id}`)}
            />
          ))}
        </Group>
      ))}
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', gap: space.xl, paddingHorizontal: space.xs },
  stat: { gap: 2 },
  statValue: { fontSize: 28, lineHeight: 32, fontWeight: '700', color: color.text, fontVariant: ['tabular-nums'] },
  statLabel: { ...type.label, color: color.textMuted },
  segment: { flexDirection: 'row', backgroundColor: color.surface, borderRadius: radius.md, padding: 3 },
  segmentItem: { flex: 1, paddingVertical: 8, borderRadius: radius.sm + 1, alignItems: 'center' },
  segmentActive: { backgroundColor: color.surfaceRaised },
  segmentText: { ...type.footnote, fontWeight: '600', color: color.textMuted },
  segmentTextActive: { color: color.text },
});
