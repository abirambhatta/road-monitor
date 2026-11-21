import { Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ClassBadge, DemoBanner, EmptyState, Group, ProvenanceTag, Row, ui } from '../../components/ui';
import { findDetection, findVehicle } from '../../data/demo';
import {
  formatCoord,
  formatDate,
  formatPercent,
  formatQuantity,
  formatTime,
  googleMapsUrl,
  isPothole,
  SURFACE_LABEL,
} from '../../domain/format';
import type { Quantity } from '../../domain/types';
import { color, radius, space, type } from '../../theme';

export default function DetectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = id ? findDetection(id) : undefined;

  if (!d) {
    return (
      <View style={ui.screen}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <EmptyState symbol="questionmark.circle" title="This detection doesn't exist" />
      </View>
    );
  }

  const vehicle = findVehicle(d.vehicleProfileId);
  const pothole = isPothole(d.cls);

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} contentInsetAdjustmentBehavior="automatic">
      <Stack.Screen options={{ title: d.id }} />

      <View style={styles.hero}>
        <ClassBadge cls={d.cls} size="lg" />
        <Text style={ui.footnote}>
          {formatDate(d.detectedAt)} at {formatTime(d.detectedAt)} · detector confidence {formatPercent(d.confidence)}
        </Text>
      </View>

      <DemoBanner />

      {/* Frame placeholder */}
      <View style={styles.frame}>
        <SymbolView name="photo" size={26} tintColor={color.textFaint} weight="light" />
        <Text style={ui.footnote}>No camera frame stored for demo records</Text>
      </View>

      <Group title="Overview">
        <Row label="Class" value={pothole ? 'Pothole' : 'Look-alike (not a pothole)'} />
        <Row label="Detector confidence" value={formatPercent(d.confidence)} accessory={<ProvenanceTag provenance="estimate" />} />
        <Row
          label="Road surface"
          value={`${SURFACE_LABEL[d.surface.type]}${d.surface.confidence != null ? ` · ${formatPercent(d.surface.confidence)}` : ''}`}
          accessory={<ProvenanceTag provenance={d.surface.type === 'unknown' ? 'unavailable' : 'estimate'} />}
        />
        <Row label="Vehicle" value={vehicle ? `${vehicle.name} · ${vehicle.calibrated ? 'calibrated' : 'not calibrated'}` : '—'} />
      </Group>

      <Group title="Location">
        <Row label="Coordinates" value={formatCoord(d.location)} mono />
        <Row label="GPS accuracy" value={d.location.accuracyM != null ? `±${d.location.accuracyM} m` : '—'} />
        <Row label="Open in Google Maps" onPress={() => Linking.openURL(googleMapsUrl(d.location))} />
      </Group>

      {pothole ? (
        <>
          <Group title="Size and depth" footer="Values appear only after the measurement method is validated against hand-measured potholes.">
            <QuantityRow label="Length" q={d.measurements.length} />
            <QuantityRow label="Width" q={d.measurements.width} />
            <QuantityRow label="Surface area" q={d.measurements.area} />
            <QuantityRow label="Depth" q={d.measurements.depth} />
            <QuantityRow label="Volume" q={d.measurements.volume} />
          </Group>

          <Group title="Repair estimate">
            <Row label="Repair method" value={d.repair.method ?? 'Not selected'} detail={d.repair.note} />
            <Row label="Material" value={d.repair.material ?? '—'} />
            <QuantityRow label="Quantity" q={d.repair.quantity} />
          </Group>

          <Group title="Cost" footer="Material cost only. Labour, transport and equipment aren't included.">
            <QuantityRow label="Material cost" q={d.cost.materialCostNpr} warn={d.cost.priceRecordId == null} />
            <Row label="Price source" value={d.cost.priceRecordId ?? 'None'} />
          </Group>
        </>
      ) : (
        <Group title="Repair estimate" footer="Look-alikes are recorded so they can be reviewed, but they're never measured or costed as potholes.">
          <Row label="Status" value="Not a pothole: no estimate" />
        </Group>
      )}

      <Text style={[ui.footnote, styles.disclaimer]}>
        Decision-support prototype. Estimates don&apos;t replace a professional road survey.
      </Text>
    </ScrollView>
  );
}

function QuantityRow({ label, q, warn }: { label: string; q: Quantity; warn?: boolean }) {
  return (
    <Row
      label={label}
      detail={q.note}
      value={formatQuantity(q)}
      accessory={
        warn ? (
          <View style={styles.warn}>
            <Text style={styles.warnText}>Price missing</Text>
          </View>
        ) : (
          <ProvenanceTag provenance={q.provenance} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  hero: { gap: space.xs, paddingHorizontal: space.xs },
  frame: {
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  warn: { borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(229,101,75,0.16)' },
  warnText: { ...type.label, fontSize: 10, color: color.danger },
  disclaimer: { textAlign: 'center', color: color.textFaint },
});
