import { Stack } from 'expo-router';

import { stackScreenOptions } from '../../components/stackOptions';

export default function PricesLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Prices' }} />
    </Stack>
  );
}
