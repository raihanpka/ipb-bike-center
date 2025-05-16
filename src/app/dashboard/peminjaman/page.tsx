'use client';

import { useUser } from '@clerk/nextjs';
import { FormPeminjaman } from '@/features/peminjaman/components/form-peminjaman';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';

export default function PeminjamanPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='mr-2 h-6 w-6 animate-spin' />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <PageContainer scrollable={true}>
      <div className='container mx-auto overflow-y-auto px-4 py-10'>
        <div className='max-h-[calc(100vh-200px)] overflow-y-auto pb-6'>
          <FormPeminjaman />
        </div>
      </div>
    </PageContainer>
  );
}
