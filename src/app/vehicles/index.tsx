import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Group, Row, ui } from '../../components/ui';
import { ACTIVE_VEHICLE_ID, DEMO_VEHICLES } from '../../data/demo';
import type { VehicleProfile } from '../../domain/types';
import { color, radius, space, type } from '../../theme';

const VEHICLE_SYMBOL: Record<VehicleProfile['vehicle'], SFSymbol> = {
  car: 'car.side',
  motorbike: 'motorcycle',
  bus: 'bus',
  truck: 'truck.box',
};

const MOUNT_LABEL: Record<VehicleProfile['mount'], string> = {
  dashboard: 'Dashboard',
  windscreen: 'Windscreen',
  roof: 'Roof',
  handlebar: 'Handlebar',
  bumper: 'Bumper',
};

const notSet = (v: number | null, unit: string) => (v == null ? 'Not set' : `${v} ${unit}`);

export default function VehiclesScreen() {
  const [activeId, setActiveId] = useState(ACTIVE_VEHICLE_ID);
  const active = DEMO_VEHICLES.find((v) => v.id === activeId) ?? DEMO_VEHICLES[0];

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} contentInsetAdjustmentBehavior="automatic">
      <Text style={ui.body}>
        Every vehicle mounts the camera differently. Measurements in centimetres need each setup to be calibrated
        first.
      </Text>

      <View style={styles.cards}>
        {DEMO_VEHICLES.map((v) => {
          const selected = v.id === activeId;
          return (
            <Pressable
              key={v.id}
              onPress={() => setActiveId(v.id)}
              style={[styles.card, selected && styles.cardSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <SymbolView name={VEHICLE_SYMBOL[v.vehicle]} size={26} tintColor={selected ? color.accent : color.textMuted} />
              <Text style={styles.cardTitle} numberOfLines={1}>
                {v.name}
              </Text>
              <Text style={styles.cardSub}>{MOUNT_LABEL[v.mount]} mount</Text>
            </Pressable>
          );
        })}
      </View>

      <Group title={`${active.name} · camera setup`} footer="Camera height, angle and field of view are entered when the camera is installed on the vehicle.">
        <Row label="Mount position" value={MOUNT_LABEL[active.mount]} />
        <Row label="Camera height" value={notSet(active.cameraHeightM, 'm')} />
        <Row label="Camera angle" value={notSet(active.cameraPitchDeg, '°')} />
        <Row label="Field of view" value={notSet(active.horizontalFovDeg, '°')} />
        <Row
          label="Calibration"
          accessory={
            <View style={[styles.status, active.calibrated ? styles.statusOk : styles.statusTodo]}>
              <Text style={[styles.statusText, { color: active.calibrated ? color.ok : color.accent }]}>
                {active.calibrated ? 'Calibrated' : 'Not calibrated'}
              </Text>
            </View>
          }
        />
      </Group>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cards: { flexDirection: 'row', gap: space.sm },
  card: {
    flex: 1,
    backgroundColor: color.surface,
    borderRadius: radius.lg,
    padding: space.md,
    gap: space.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardSelected: { borderColor: color.accent },
  cardTitle: { ...type.footnote, fontWeight: '600', color: color.text, marginTop: space.xs },
  cardSub: { ...type.caption, color: color.textFaint },
  status: { borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  statusOk: { backgroundColor: 'rgba(98,184,130,0.15)' },
  statusTodo: { backgroundColor: 'rgba(242,182,50,0.14)' },
  statusText: { ...type.label, fontSize: 10 },
});
