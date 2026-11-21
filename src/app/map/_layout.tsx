import { Stack } from 'expo-router';

import { stackScreenOptions } from '../../components/stackOptions';

export default function MapLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Map', headerLargeTitle: false }} />
    </Stack>
  );
}
