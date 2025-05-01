import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import DataSepedaViewPage from '@/features/data-sepeda/components/data-sepeda-view-page';

export const metadata = {
  title: 'Dashboard: Data Sepeda'
};

type PageProps = { params: Promise<{ nomorSeri: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DataSepedaViewPage nomorSeri={params.nomorSeri} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
