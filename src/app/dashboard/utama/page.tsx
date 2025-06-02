import PageContainer from '@/components/layout/page-container';
import type React from 'react';
import { UserGreeting } from '@/features/utama/components/user-greeting';
import { LocationCard } from '@/features/utama/components/location-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
          <div className='col-span-4 md:col-span-4 lg:col-span-4'>
          <div className="grid grid-cols-1 gap-4">
            <div className="mb-2 w-full">
            <Card className="bg-blue-50 text-black shadow-sm">
              <CardContent>
              <CardTitle className="text-lg font-semibold mb-1">
                Selamat datang di Aplikasi IPB Bike Center!
              </CardTitle>
              <p className="text-sm mb-1">
                Pinjam sepeda dengan mudah, cek lokasi sepeda tersedia, dan lakukan peminjaman sepeda secara online.
              </p>
              <ul className="list-disc list-inside text-sm mb-2">
                <li>Lihat ketersediaan sepeda secara real-time.</li>
                <li>Proses peminjaman dan pengembalian sepeda yang cepat dan praktis.</li>
                <li>Riwayat peminjaman dan status akun dapat diakses kapan saja.</li>
                <li>Dukungan layanan bagi civitas untuk pengalaman bersepeda yang nyaman.</li>
              </ul>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-black border-blue-200">
                Solusi transportasi ramah lingkungan di lingkungan kampus IPB
                </Badge>
              </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
        </div>
      </div>
    </PageContainer>
  );
}
