import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';

interface ReportData {
  id: string;
  Users?: { nama: string };
  DataSepeda?: { merk: string; jenis: string; nomorSeri: string };
  tanggalPeminjaman: string;
  tanggalPengembalian: string;
  StatusPeminjaman?: { nama: string };
  jangkaPeminjaman: string;
}

export function ReportTable({ data }: { data: ReportData[] }) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Menunggu Persetujuan':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aktif':
        return 'bg-green-100 text-green-800';
      case 'Ditolak':
        return 'bg-red-100 text-red-800';
      case 'Selesai':
        return 'bg-blue-100 text-blue-800';
      case 'Dibatalkan':
        return 'bg-gray-100 text-gray-800';
      case 'Terlambat':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='mb-6 rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Peminjam</TableHead>
            <TableHead className='hidden sm:table-cell'>Sepeda</TableHead>
            <TableHead className='hidden md:table-cell'>
              Tanggal Pinjam
            </TableHead>
            <TableHead className='hidden md:table-cell'>
              Tanggal Kembali
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='hidden sm:table-cell'>Durasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='py-4 text-center'>
                Tidak ada data peminjaman pada periode ini
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>
                  {item.Users?.nama || 'N/A'}
                  <div className='text-muted-foreground mt-1 text-xs sm:hidden'>
                    {item.DataSepeda?.merk || 'N/A'} -{' '}
                    {formatDate(item.tanggalPeminjaman)}
                  </div>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <div className='max-w-[150px] truncate md:max-w-none'>
                    {item.DataSepeda?.merk || 'N/A'} (
                    {item.DataSepeda?.jenis || 'N/A'})
                    <div className='text-muted-foreground text-xs'>
                      {item.DataSepeda?.nomorSeri || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {formatDate(item.tanggalPeminjaman)}
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {formatDate(item.tanggalPengembalian)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(item.StatusPeminjaman?.nama)}
                  >
                    {item.StatusPeminjaman?.nama || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  {item.jangkaPeminjaman}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
