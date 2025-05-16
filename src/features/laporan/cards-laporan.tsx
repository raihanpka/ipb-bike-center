import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle, Users } from 'lucide-react';

interface ReportData {
  StatusPeminjaman?: {
    nama: string;
  };
  userId: string;
}

export function ReportSummaryCards({ data }: { data: ReportData[] }) {
  // Hitung total peminjaman
  const totalPeminjaman = data.length;

  // Hitung peminjaman yang sudah dikembalikan
  const selesaiCount = data.filter(
    (item) =>
      item.StatusPeminjaman?.nama === 'Selesai' ||
      item.StatusPeminjaman?.nama === 'Dikembalikan'
  ).length;

  // Hitung peminjaman yang masih berlangsung
  const berlangsungCount = data.filter(
    (item) =>
      item.StatusPeminjaman?.nama === 'Dipinjam' ||
      item.StatusPeminjaman?.nama === 'Aktif'
  ).length;

  // Hitung jumlah peminjam unik
  const uniqueUsers = new Set(data.map((item) => item.userId)).size;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6'>
          <CardTitle className='text-sm font-medium'>
            Total Peminjaman
          </CardTitle>
          <CalendarClock className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent className='px-4 pb-4 sm:px-6 sm:pb-6'>
          <div className='text-2xl font-bold'>{totalPeminjaman}</div>
          <p className='text-muted-foreground text-xs'>
            Jumlah peminjaman pada periode ini
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6'>
          <CardTitle className='text-sm font-medium'>
            Status Peminjaman
          </CardTitle>
          <CheckCircle className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent className='px-4 pb-4 sm:px-6 sm:pb-6'>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-0'>
            <div className='text-center sm:text-left'>
              <div className='text-2xl font-bold'>{selesaiCount}</div>
              <p className='text-muted-foreground text-xs'>Selesai</p>
            </div>
            <div className='text-center sm:text-left'>
              <div className='text-2xl font-bold'>{berlangsungCount}</div>
              <p className='text-muted-foreground text-xs'>Berlangsung</p>
            </div>
          </div>  
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6'>
          <CardTitle className='text-sm font-medium'>Jumlah Peminjam</CardTitle>
          <Users className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent className='px-4 pb-4 sm:px-6 sm:pb-6'>
          <div className='text-2xl font-bold'>{uniqueUsers}</div>
          <p className='text-muted-foreground text-xs'>
            Jumlah peminjam unik pada periode ini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
