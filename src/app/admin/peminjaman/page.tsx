'use client';

import PageContainer from '@/components/layout/page-container';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CardPeminjamanAdmin } from '@/features/peminjaman/components/card-peminjaman-admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Peminjaman = {
  id: string;
  userId: string;
  nomorSeriSepeda: string;
  tanggalPeminjaman: string;
  jangkaPeminjaman: string;
  tanggalPengembalian: string;
  statusId: number;
  statusNama: string;
  jenisSepeda: string;
  merkSepeda: string;
  namaUser: string;
  emailUser: string;
  nomorTeleponAktif: string;
  fotoPeminjam: string | null;
  fotoKTM: string | null;
  suratPeminjaman: string | null;
  notifikasiTerkirim?: boolean;
};

export default function KelolaPeminjamanPage() {
  const { user, isLoaded } = useUser();
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);
  const [filteredPeminjaman, setFilteredPeminjaman] = useState<Peminjaman[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Cek apakah user adalah admin
  useEffect(() => {
    if (user && isLoaded) {
      // Cek dari metadata Clerk
      setIsAdmin(user.publicMetadata?.role === 'admin');
      setLoading(false);
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const fetchPeminjaman = async () => {
    if (!isAdmin) return;

    try {
      // Versi yang disederhanakan - hanya ambil data yang penting
      const { data, error } = await supabase
        .from('Peminjaman')
        .select(
          `
          id,
          userId,
          nomorSeriSepeda,
          tanggalPeminjaman,
          jangkaPeminjaman,
          tanggalPengembalian,
          statusId,
          nomorTeleponAktif,
          fotoPeminjam,
          fotoKTM,
          suratPeminjaman
        `
        )
        .order('createdAt', { ascending: false });

      if (error) throw error;

      // Jika tidak ada data, tampilkan pesan
      if (!data || data.length === 0) {
        setPeminjaman([]);
        setFilteredPeminjaman([]);
        return;
      }

      // Ambil data tambahan yang diperlukan
      const enhancedData = await Promise.all(
        data.map(async (item) => {
          // Default values jika gagal mengambil data tambahan
          let statusNama = 'Tidak diketahui';
          let jenisSepeda = 'Tidak diketahui';
          let merkSepeda = 'Tidak diketahui';
          let namaUser = 'Tidak diketahui';
          let emailUser = 'Tidak diketahui';

          // Coba ambil status peminjaman
          try {
            const { data: statusData } = await supabase
              .from('StatusPeminjaman')
              .select('nama')
              .eq('id', item.statusId)
              .single();

            if (statusData) {
              statusNama = statusData.nama;
            }
          } catch (e) {
            toast.error(`${e}`, { richColors: true });
          }

          // Coba ambil data sepeda
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

          // Coba ambil data user
          try {
            const { data: userData } = await supabase
              .from('Users')
              .select('nama, email')
              .eq('id', item.userId)
              .single();

            if (userData) {
              namaUser = userData.nama;
              emailUser = userData.email;
            }
          } catch (error) {
            toast.error(`${error}`, { richColors: true });
          }

          return {
            ...item,
            statusNama,
            jenisSepeda,
            merkSepeda,
            namaUser,
            emailUser
          };
        })
      );

      setPeminjaman(enhancedData);
      setFilteredPeminjaman(enhancedData);
    } catch (error) {
      toast.error(`${error}`, { richColors: true });
      setPeminjaman([]);
      setFilteredPeminjaman([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !loading) {
      fetchPeminjaman();
    }
  }, [isAdmin, loading]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPeminjaman(peminjaman);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = peminjaman.filter(
        (item) =>
          item.namaUser.toLowerCase().includes(query) ||
          item.nomorSeriSepeda.toLowerCase().includes(query) ||
          item.merkSepeda.toLowerCase().includes(query) ||
          item.jenisSepeda.toLowerCase().includes(query) ||
          item.nomorTeleponAktif.includes(query)
      );
      setFilteredPeminjaman(filtered);
    }
  }, [searchQuery, peminjaman]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='mr-2 h-6 w-6 animate-spin' />
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='container mx-auto py-10 text-center'>
        <h1 className='text-2xl font-bold'>
          Anda tidak memiliki akses ke halaman ini
        </h1>
      </div>
    );
  }

  const peminjamanMenunggu = filteredPeminjaman.filter(
    (item) => item.statusId === 1
  );
  const peminjamanAktif = filteredPeminjaman.filter(
    (item) => item.statusId === 2 || item.statusId === 6
  );
  const peminjamanSelesai = filteredPeminjaman.filter(
    (item) => item.statusId === 3 || item.statusId === 4
  );

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <h1 className='mb-4 text-center text-2xl font-bold sm:mb-6 sm:text-left sm:text-3xl'>
          Kelola Peminjaman Sepeda
        </h1>
        <div className='relative mb-4 sm:mb-6'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input
            type='search'
            placeholder='Cari berdasarkan nama, nomor seri, merk, jenis, atau nomor telepon...'
            className='py-2 pl-8 text-sm'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue='menunggu' className='mb-4 sm:mb-6'>
          <TabsList className='mb-8 flex flex-wrap justify-center gap-2 sm:flex-row sm:justify-start'>
            <TabsTrigger value='menunggu'>
              Menunggu Persetujuan ({peminjamanMenunggu.length})
            </TabsTrigger>
            <TabsTrigger value='aktif'>
              Peminjaman Aktif ({peminjamanAktif.length})
            </TabsTrigger>
            <TabsTrigger value='selesai'>
              Peminjaman Selesai ({peminjamanSelesai.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value='menunggu'>
            {peminjamanMenunggu.length === 0 ? (
              <div className='py-10 text-center'>
                <p className='text-muted-foreground'>
                  Tidak ada peminjaman yang menunggu persetujuan
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {peminjamanMenunggu.map((item) => (
                  <CardPeminjamanAdmin
                    key={item.id}
                    {...item}
                    onStatusUpdate={fetchPeminjaman}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value='aktif'>
            {peminjamanAktif.length === 0 ? (
              <div className='py-10 text-center'>
                <p className='text-muted-foreground'>
                  Tidak ada peminjaman aktif
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {peminjamanAktif.map((item) => (
                  <CardPeminjamanAdmin
                    key={item.id}
                    {...item}
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
                  Tidak ada peminjaman selesai
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {peminjamanSelesai.map((item) => (
                  <CardPeminjamanAdmin
                    key={item.id}
                    {...item}
                    onStatusUpdate={fetchPeminjaman}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
