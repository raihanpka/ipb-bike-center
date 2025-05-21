'use client';

import PageContainer from '@/components/layout/page-container';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CardRiwayat } from '@/features/peminjaman/components/card-riwayat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { SistemNotifikasiKeterlambatan } from '@/components/sistem-notifikasi-keterlambatan';

type Peminjaman = {
  id: string;
  nomorSeriSepeda: string;
  tanggalPeminjaman: string;
  jangkaPeminjaman: string;
  tanggalPengembalian: string;
  statusId: number;
  statusNama: string;
  jenisSepeda: string;
  merkSepeda: string;
};

export default function RiwayatPeminjamanPage() {
  const { user, isLoaded } = useUser();
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeminjaman = async () => {
    if (!user) return;

    try {
      // Ambil data utama peminjaman
      const { data, error } = await supabase
        .from('Peminjaman')
        .select(
          `
          id,
          nomorSeriSepeda,
          tanggalPeminjaman,
          jangkaPeminjaman,
          tanggalPengembalian,
          statusId
        `
        )
        .eq('userId', user.id)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setPeminjaman([]);
        return;
      }

      // Ambil data tambahan untuk setiap peminjaman
      const enhancedData = await Promise.all(
        data.map(async (item) => {
          let statusNama = 'Tidak diketahui';
          let jenisSepeda = 'Tidak diketahui';
          let merkSepeda = 'Tidak diketahui';

          // Ambil nama status
          try {
            const { data: statusData } = await supabase
              .from('StatusPeminjaman')
              .select('nama')
              .eq('id', item.statusId)
              .single();
            if (statusData) {
              statusNama = statusData.nama;
            }
          } catch (error) {
            toast.error(`${error}`, { richColors: true });
          }

          // Ambil data sepeda
          try {
            const { data: sepedaData } = await supabase
              .from('DataSepeda')
              .select('jenis, merk')
              .eq('nomorSeri', item.nomorSeriSepeda)
              .single();
            if (sepedaData) {
              jenisSepeda = sepedaData.jenis;
              merkSepeda = sepedaData.merk;
            }
          } catch (error) {
            toast.error(`${error}`, { richColors: true });
          }

          return {
            ...item,
            statusNama,
            jenisSepeda,
            merkSepeda
          };
        })
      );

      setPeminjaman(enhancedData);
    } catch (error) {
      toast.error(`Gagal memuat data peminjaman: ${error}`, { richColors: true });
      setPeminjaman([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPeminjaman();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='mr-2 h-6 w-6 animate-spin' />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='container mx-auto py-10 text-center'>
        <h1 className='text-2xl font-bold'>
          Silakan login untuk melihat riwayat peminjaman
        </h1>
      </div>
    );
  }

  const peminjamanAktif = peminjaman.filter(
    (item) => item.statusId === 1 || item.statusId === 2 || item.statusId === 6
  );
  const peminjamanSelesai = peminjaman.filter(
    (item) => item.statusId === 3 || item.statusId === 4
  );

  return (
    <>
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4 px-2 sm:px-4'>
        <h1 className='mb-4 text-center text-2xl font-bold sm:mb-6 sm:text-left sm:text-3xl'>
          Riwayat Peminjaman
        </h1>

        <Tabs
          defaultValue='aktif'
          className='mb-4 justify-center sm:mb-6 sm:justify-center'
        >
          <div className='flex justify-center sm:justify-start'>
            <TabsList className='mb-8 flex flex-wrap justify-center gap-2 sm:flex-wrap sm:justify-center'>
              <TabsTrigger value='aktif'>
                Peminjaman Aktif ({peminjamanAktif.length})
              </TabsTrigger>
              <TabsTrigger value='selesai'>
                Peminjaman Selesai ({peminjamanSelesai.length})
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='aktif'>
            {peminjamanAktif.length === 0 ? (
              <div className='py-10 text-center'>
                <p className='text-muted-foreground'>
                  Belum ada peminjaman aktif
                </p>
              </div>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {peminjamanAktif.map((item) => (
                  <CardRiwayat
                    key={item.id}
                    id={item.id}
                    nomorSeriSepeda={item.nomorSeriSepeda}
                    tanggalPeminjaman={item.tanggalPeminjaman}
                    jangkaPeminjaman={item.jangkaPeminjaman}
                    tanggalPengembalian={item.tanggalPengembalian}
                    statusId={item.statusId}
                    statusNama={item.statusNama}
                    jenisSepeda={item.jenisSepeda}
                    merkSepeda={item.merkSepeda}
                    onStatusUpdate={fetchPeminjaman}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value='selesai'>
            {peminjamanSelesai.length === 0 ? (
              <div className='py-10 text-center'>
                <p className='text-muted-foreground'>
                  Belum ada riwayat peminjaman selesai
                </p>
              </div>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {peminjamanSelesai.map((item) => (
                  <CardRiwayat
                    key={item.id}
                    id={item.id}
                    nomorSeriSepeda={item.nomorSeriSepeda}
                    tanggalPeminjaman={item.tanggalPeminjaman}
                    jangkaPeminjaman={item.jangkaPeminjaman}
                    tanggalPengembalian={item.tanggalPengembalian}
                    statusId={item.statusId}
                    statusNama={item.statusNama}
                    jenisSepeda={item.jenisSepeda}
                    merkSepeda={item.merkSepeda}
                    onStatusUpdate={fetchPeminjaman}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
    <SistemNotifikasiKeterlambatan />
    </>
  );
}
