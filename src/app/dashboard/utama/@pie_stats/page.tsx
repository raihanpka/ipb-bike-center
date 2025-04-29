import { delay } from '@/constants/database-api';
import { PieGraph } from '@/features/utama/components/pie-graph';

export default async function Stats() {
  await delay(1000);
  return <PieGraph />;
}
