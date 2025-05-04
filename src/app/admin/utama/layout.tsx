import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';

import { UserGreeting } from '@/features/utama/components/user-greeting';
import { JumlahSepedaTersedia, JumlahSepedaDipinjam } from '@/features/utama/components/data-sepeda';

export default function OverViewLayout({
  bar_stats,
}: {
  bar_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <UserGreeting />
        </div>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Total Pengajuan Peminjaman</CardTitle>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">3</CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Turun 20% pada bulan ini
                <IconTrendingDown className="size-4" />
              </div>
            </CardFooter> */}
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Total Sepeda Tersedia</CardTitle>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <JumlahSepedaTersedia />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Turun 20% pada bulan ini
                <IconTrendingDown className="size-4" />
              </div>
            </CardFooter> */}
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Jumlah Peminjaman Aktif</CardTitle>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <JumlahSepedaDipinjam />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Naik 20% pada bulan ini
                <IconTrendingUp className="size-4" />
              </div>
            </CardFooter> */}
          </Card>
        </div>
        <div className='col-span-4'> {bar_stats} </div>
      </div>
    </PageContainer>
  );
}
