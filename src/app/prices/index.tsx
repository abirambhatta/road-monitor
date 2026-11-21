import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, Group, Row, ui } from '../../components/ui';
import { PRICE_RECORDS } from '../../data/demo';
import { formatDate } from '../../domain/format';
import { color, radius, type } from '../../theme';

const RECORD_FIELDS: [string, string][] = [
  ['Material', 'e.g. cold-mix asphalt, with grade'],
  ['Unit', 'kg, tonne, litre, m³ or bag'],
  ['Unit price', 'Nepalese rupees (NPR)'],
  ['Area', 'District, municipality or market'],
  ['Source', 'District rate schedule, quotation…'],
  ['Effective date', 'When the price applies'],
  ['Tax / transport', 'Included or not'],
  ['Last verified', 'Older prices are flagged as stale'],
];

export default function PricesScreen() {
  return (
    <ScrollView style={ui.screen} contentContainerStyle={ui.content} contentInsetAdjustmentBehavior="automatic">
      {PRICE_RECORDS.length === 0 ? (
        <EmptyState symbol="banknote" title="No verified prices yet">
          <Text style={[ui.body, styles.center]}>
            Cost estimates stay at &quot;Price missing&quot; until a sourced, dated price is added for the area.
            Prices are never guessed.
          </Text>
        </EmptyState>
      ) : (
        <Group title="Price records">
          {PRICE_RECORDS.map((p) => (
            <Row
              key={p.id}
              label={`${p.material} · ${p.grade}`}
              detail={`${p.area} · ${p.source} · verified ${formatDate(p.lastVerified)}`}
              value={`NPR ${p.unitPriceNpr.toLocaleString('en-US')} / ${p.unit}`}
            />
          ))}
        </Group>
      )}

      <Group title="Each price record stores" footer="Planned source types: official district rate schedules, municipal rate documents and dated supplier quotations.">
        {RECORD_FIELDS.map(([label, detail]) => (
          <Row key={label} label={label} value={detail} />
        ))}
      </Group>

      <View style={styles.disabled}>
        <Text style={styles.disabledText}>Add price record</Text>
        <Text style={styles.soon}>Later version</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  disabled: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.line,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 2,
  },
  disabledText: { ...type.headline, color: color.textFaint },
  soon: { ...type.caption, color: color.textFaint },
});
