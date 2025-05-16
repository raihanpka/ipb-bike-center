import PageContainer from '@/components/layout/page-container';
import type React from 'react';
import { UserGreeting } from '@/features/utama/components/user-greeting';
import { LocationCard } from '@/features/utama/components/location-card';

export default function OverViewLayout() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <UserGreeting />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4 md:col-span-3'>
            <LocationCard />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
