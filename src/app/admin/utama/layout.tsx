import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconCalendar, IconBike, IconUsers } from '@tabler/icons-react';
import React from 'react';
import { UserGreeting } from '@/features/utama/components/user-greeting';
import {
  JumlahSepedaTersedia,
  JumlahSepedaDipinjam,
  JumlahMenungguPersetujuan
} from '@/features/utama/components/data-sepeda';

function getCurrentMonthYearID() {
  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  const now = new Date();
  const namaBulan = bulan[now.getMonth()];
  const tahun = now.getFullYear();
  return `${namaBulan} ${tahun}`;
}

export default function OverViewLayout({}: {}) {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <UserGreeting />
        </div>
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardTitle>Total Sepeda Tersedia</CardTitle>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                <JumlahSepedaTersedia />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='font-muted-foreground line-clamp-1 flex gap-2'>
                <IconBike className='size-5' />
                Kondisi sepeda yang layak pakai dan tidak sedang dipinjam
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardTitle>Jumlah Menunggu Persetujuan</CardTitle>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                <JumlahMenungguPersetujuan />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='font-muted-foreground line-clamp-1 flex gap-2'>
                <IconUsers className='size-5' />
                Total jumlah pengajuan peminjaman yang menunggu persetujuan
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardTitle>Jumlah Peminjaman Aktif</CardTitle>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                <JumlahSepedaDipinjam />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='font-muted-foreground line-clamp-1 flex gap-2'>
                <IconUsers className='size-5' />
                Total pengguna yang sedang meminjam sepeda
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='col-span-4'></div>
      </div>
    </PageContainer>
  );
}
