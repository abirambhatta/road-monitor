import { Stack } from 'expo-router';

import { stackScreenOptions } from '../../components/stackOptions';

export default function VehiclesLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Vehicles' }} />
    </Stack>
  );
}
