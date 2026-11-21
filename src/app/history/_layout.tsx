import { Stack } from 'expo-router';

import { stackScreenOptions } from '../../components/stackOptions';

export default function HistoryLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'History' }} />
      <Stack.Screen name="[id]" options={{ headerLargeTitle: false, headerBackTitle: 'History' }} />
    </Stack>
  );
}
