import { NativeTabs } from 'expo-router/native-tabs';
import { StatusBar } from 'expo-status-bar';

import { color } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <NativeTabs tintColor={color.accent} minimizeBehavior="never">
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Icon sf={{ default: 'camera.viewfinder', selected: 'camera.viewfinder' }} />
          <NativeTabs.Trigger.Label>Inspect</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="map">
          <NativeTabs.Trigger.Icon sf={{ default: 'map', selected: 'map.fill' }} />
          <NativeTabs.Trigger.Label>Map</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="history">
          <NativeTabs.Trigger.Icon sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }} />
          <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="prices">
          <NativeTabs.Trigger.Icon sf={{ default: 'banknote', selected: 'banknote.fill' }} />
          <NativeTabs.Trigger.Label>Prices</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="vehicles">
          <NativeTabs.Trigger.Icon sf={{ default: 'car', selected: 'car.fill' }} />
          <NativeTabs.Trigger.Label>Vehicles</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
