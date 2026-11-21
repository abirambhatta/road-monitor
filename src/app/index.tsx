import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ACTIVE_VEHICLE_ID, findVehicle } from '../data/demo';
import { distanceM, formatCoord, formatDuration } from '../domain/format';
import type { GeoPoint } from '../domain/types';
import { color, font, radius, space, type } from '../theme';

type GpsState =
  | { kind: 'off' }
  | { kind: 'denied' }
  | { kind: 'searching' }
  | { kind: 'fix'; point: GeoPoint; speedKmh: number | null };

export default function InspectScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [focused, setFocused] = useState(true);
  const [inspecting, setInspecting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gps, setGps] = useState<GpsState>({ kind: 'off' });
  const lastPoint = useRef<GeoPoint | null>(null);
  const watcher = useRef<Location.LocationSubscription | null>(null);

  const vehicle = findVehicle(ACTIVE_VEHICLE_ID);

  // Only one camera preview may be active; unmount it when the tab loses focus.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  useEffect(() => {
    if (!inspecting) return;
    const started = Date.now();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, [inspecting]);

  useEffect(() => () => watcher.current?.remove(), []);

  const start = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setElapsed(0);
    setDistance(0);
    lastPoint.current = null;
    setInspecting(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setGps({ kind: 'denied' });
      return;
    }
    setGps({ kind: 'searching' });
    watcher.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
      (loc) => {
        const point: GeoPoint = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracyM: loc.coords.accuracy ?? undefined,
        };
        const speed = loc.coords.speed;
        setGps({ kind: 'fix', point, speedKmh: speed != null && speed >= 0 ? speed * 3.6 : null });
        // Only count distance from reasonably accurate fixes.
        if (lastPoint.current && (point.accuracyM ?? 99) <= 25) {
          setDistance((d) => d + distanceM(lastPoint.current as GeoPoint, point));
        }
        lastPoint.current = point;
      },
    );
  };

  const stop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    watcher.current?.remove();
    watcher.current = null;
    setInspecting(false);
    setGps({ kind: 'off' });
  };

  if (!permission) return <View style={styles.fill} />;

  if (!permission.granted) {
    return (
      <View style={[styles.fill, styles.gate, { paddingTop: insets.top + space.xxl }]}>
        <SymbolView name="camera.viewfinder" size={44} tintColor={color.accent} weight="light" />
        <Text style={styles.gateTitle}>Camera access</Text>
        <Text style={styles.gateText}>
          Road Monitor looks at the road through the camera to find potholes. Video stays on this phone.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
          onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
        >
          <Text style={styles.primaryText}>{permission.canAskAgain ? 'Allow camera' : 'Open Settings'}</Text>
        </Pressable>
      </View>
    );
  }

  const panelBottom = Math.max(insets.bottom, 96) + space.sm;

  return (
    <View style={styles.fill}>
      {focused ? <CameraView style={StyleSheet.absoluteFill} facing="back" /> : null}

      {/* Road region guide: where the detector will look */}
      <View pointerEvents="none" style={styles.roi}>
        <Text style={styles.roiLabel}>Road region</Text>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <View style={styles.lane}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.laneDash} />
          ))}
        </View>
      </View>

      {/* Status strip */}
      <View style={[styles.status, { top: insets.top + space.sm }]}>
        <GpsPill gps={gps} />
        <Pill dot={color.textFaint} text="Model not loaded" />
        <Pill text="Surface —" />
        <Pill text={`${vehicle?.name ?? 'No vehicle'}${vehicle && !vehicle.calibrated ? ' · not calibrated' : ''}`} />
      </View>

      {/* Session panel */}
      <View style={[styles.panel, { bottom: panelBottom }]}>
        <View style={styles.readouts}>
          <Readout label="Time" value={formatDuration(elapsed)} live={inspecting} />
          <Readout label="Distance" value={`${(distance / 1000).toFixed(2)} km`} />
          <Readout
            label="Speed"
            value={gps.kind === 'fix' && gps.speedKmh != null ? `${Math.round(gps.speedKmh)} km/h` : '— km/h'}
          />
          <Readout label="Found" value="0" />
        </View>

        <Text style={styles.coords} numberOfLines={1}>
          {gps.kind === 'fix'
            ? `${formatCoord(gps.point)}${gps.point.accuracyM != null ? `  ±${Math.round(gps.point.accuracyM)} m` : ''}`
            : gps.kind === 'searching'
              ? 'Waiting for GPS fix…'
              : gps.kind === 'denied'
                ? 'Location permission denied: detections will have no coordinates'
                : 'GPS starts with the inspection'}
        </Text>

        {inspecting ? (
          <Pressable style={({ pressed }) => [styles.stop, pressed && styles.primaryPressed]} onPress={stop}>
            <View style={styles.stopSquare} />
            <Text style={styles.stopText}>Stop inspection</Text>
          </Pressable>
        ) : (
          <Pressable style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]} onPress={start}>
            <Text style={styles.primaryText}>Start inspection</Text>
          </Pressable>
        )}
        <Text style={styles.note}>Preview only. The pothole detection model isn&apos;t loaded yet.</Text>
      </View>
    </View>
  );
}

function Pill({ text, dot }: { text: string; dot?: string }) {
  return (
    <View style={styles.pill}>
      {dot ? <View style={[styles.pillDot, { backgroundColor: dot }]} /> : null}
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function GpsPill({ gps }: { gps: GpsState }) {
  switch (gps.kind) {
    case 'fix':
      return (
        <Pill
          dot={(gps.point.accuracyM ?? 99) <= 10 ? color.ok : color.accent}
          text={`GPS ±${Math.round(gps.point.accuracyM ?? 0)} m`}
        />
      );
    case 'searching':
      return <Pill dot={color.accent} text="GPS searching" />;
    case 'denied':
      return <Pill dot={color.danger} text="No location access" />;
    default:
      return <Pill dot={color.textFaint} text="GPS off" />;
  }
}

function Readout({ label, value, live }: { label: string; value: string; live?: boolean }) {
  return (
    <View style={styles.readout}>
      <View style={styles.readoutHead}>
        {live ? <View style={styles.liveDot} /> : null}
        <Text style={styles.readoutLabel}>{label}</Text>
      </View>
      <Text style={styles.readoutValue}>{value}</Text>
    </View>
  );
}

const CORNER = 18;

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000' },
  gate: { backgroundColor: color.bg, alignItems: 'flex-start', paddingHorizontal: space.xl, gap: space.lg },
  gateTitle: { ...type.title, fontSize: 28, lineHeight: 34, color: color.text },
  gateText: { ...type.body, color: color.textMuted, maxWidth: 340 },

  roi: { position: 'absolute', left: '7%', right: '7%', top: '44%', height: '30%' },
  roiLabel: { ...type.label, fontSize: 10, color: 'rgba(236,233,226,0.7)', position: 'absolute', top: -18, left: 0 },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: color.accent },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  lane: { position: 'absolute', top: 10, bottom: 10, left: '50%', marginLeft: -1.5, justifyContent: 'space-between' },
  laneDash: { width: 3, height: 14, borderRadius: 1, backgroundColor: 'rgba(242,182,50,0.45)' },

  status: { position: 'absolute', left: space.md, right: space.md, flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15,17,19,0.78)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { ...type.footnote, color: color.text },

  panel: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    backgroundColor: 'rgba(15,17,19,0.9)',
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.md,
  },
  readouts: { flexDirection: 'row', justifyContent: 'space-between' },
  readout: { gap: 2 },
  readoutHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  readoutLabel: { ...type.label, fontSize: 10, color: color.textMuted },
  readoutValue: { fontFamily: font.mono, fontSize: 17, color: color.text, fontVariant: ['tabular-nums'] },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.danger },
  coords: { fontFamily: font.mono, fontSize: 12, color: color.textMuted },

  primary: {
    alignSelf: 'stretch',
    backgroundColor: color.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryPressed: { opacity: 0.8 },
  primaryText: { ...type.headline, color: color.accentInk },
  stop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radius.md,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: color.danger,
  },
  stopSquare: { width: 12, height: 12, borderRadius: 2, backgroundColor: color.danger },
  stopText: { ...type.headline, color: color.danger },
  note: { ...type.caption, color: color.textFaint, textAlign: 'center' },
});
