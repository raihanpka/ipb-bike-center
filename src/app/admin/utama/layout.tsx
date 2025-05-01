import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { Button } from "@/components/ui/button"
import React from 'react';
import Image from 'next/image';
import { UserGreeting } from '@/features/utama/components/user-greeting';
import { JumlahSepedaTersedia, JumlahSepedaDipinjam } from '@/features/utama/components/data-sepeda';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
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
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Turun 20% pada bulan ini
                <IconTrendingDown className="size-4" />
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Total Sepeda Tersedia</CardTitle>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <JumlahSepedaTersedia />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Turun 20% pada bulan ini
                <IconTrendingDown className="size-4" />
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardTitle>Jumlah Peminjaman Aktif</CardTitle>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <JumlahSepedaDipinjam />
              </CardTitle>
              <CardAction></CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Naik 20% pada bulan ini
                <IconTrendingUp className="size-4" />
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4 md:col-span-3'> 
            <Card className="w-full h-full overflow-hidden">
              <CardHeader>
                <CardTitle>Lokasi IPB Bike Shelter</CardTitle>
              </CardHeader>
              <div className="relative w-full h-[200px]">
                <Image
                  src="/BikeShelter.png"
                  alt="maps"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-sm">Waktu Operasional</h3>
                    <p className="text-sm text-muted-foreground">Senin - Jumat, 07:30 - 16:00</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Detail</Button>
                <Button>Ajukan Peminjaman</Button>
              </CardFooter>
            </Card>
          </div>
          <div className='col-span-4'> {bar_stats} </div>
        </div>
      </div>
    </PageContainer>
  );
}
