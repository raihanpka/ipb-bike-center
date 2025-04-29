import { delay } from '@/constants/database-api';
import { RecentSales } from '@/features/utama/components/recent-sales';

export default async function Sales() {
  await delay(3000);
  return <RecentSales />;
}
