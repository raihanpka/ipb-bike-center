import { delay } from '@/constants/database-api';
import { BarGraph } from '@/features/utama/components/bar-graph';

export default async function BarStats() {
  await await delay(1000);

  return <BarGraph />;
}
