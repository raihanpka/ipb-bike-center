import ReportDashboard from '@/features/laporan/dashboard-laporan';
import PageContainer from '@/components/layout/page-container';

export default async function ReportPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-2'>
        <h1 className='mb-6 text-3xl font-bold'>Laporan Peminjaman Sepeda</h1>
        <ReportDashboard />
      </div>
    </PageContainer>
  );
}
