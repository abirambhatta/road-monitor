import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { ClassBadge, DemoBanner, EmptyState, Group, Row, ui } from '../../components/ui';
import { DEMO_DETECTIONS } from '../../data/demo';
import { CLASS_LABEL, formatCoord, googleMapsUrl } from '../../domain/format';
import { classColor, color, space } from '../../theme';

const googleMapsEnabled = Boolean(Constants.expoConfig?.extra?.googleMapsEnabled);

// Fit the demo points.
const lats = DEMO_DETECTIONS.map((d) => d.location.latitude);
const lons = DEMO_DETECTIONS.map((d) => d.location.longitude);
const initialRegion = {
  latitude: (Math.min(...lats) + Math.max(...lats)) / 2,
  longitude: (Math.min(...lons) + Math.max(...lons)) / 2,
  latitudeDelta: (Math.max(...lats) - Math.min(...lats)) * 1.8 + 0.004,
  longitudeDelta: (Math.max(...lons) - Math.min(...lons)) * 1.8 + 0.004,
};

export default function MapScreen() {
  if (googleMapsEnabled) {
    return (
      <View style={ui.screen}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
          userInterfaceStyle="dark"
        >
          {DEMO_DETECTIONS.map((d) => (
            <Marker
              key={d.id}
              coordinate={d.location}
              pinColor={classColor[d.cls]}
              title={`${CLASS_LABEL[d.cls]} · ${d.id}`}
              description="Tap for details"
              onCalloutPress={() => router.push(`/history/${d.id}`)}
            />
          ))}
        </MapView>
        <DemoBanner style={styles.floatingBanner} />
      </View>
    );
  }

  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} contentInsetAdjustmentBehavior="automatic">
      <EmptyState symbol="map" title="Google Maps isn't set up in this build">
        <Text style={[ui.body, styles.center]}>
          The map needs a Google Maps API key, added to the build as a GitHub secret. Until then, each location
          opens in the Google Maps app.
        </Text>
      </EmptyState>
      <DemoBanner />
      <Group title="Detections" footer="Tap a row to open the location in Google Maps.">
        {DEMO_DETECTIONS.map((d) => (
          <Row
            key={d.id}
            label={d.id}
            detail={formatCoord(d.location)}
            accessory={<ClassBadge cls={d.cls} />}
            onPress={() => Linking.openURL(googleMapsUrl(d.location))}
          />
        ))}
      </Group>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  floatingBanner: {
    position: 'absolute',
    top: space.md,
    left: space.lg,
    right: space.lg,
    backgroundColor: 'rgba(15,17,19,0.88)',
    borderColor: color.line,
  },
});
