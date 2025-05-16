'use client';

import type React from 'react';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format, addDays, addMonths } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileUploader } from '@/components/file-uploader';
import { uploadFileToStorage } from '@/lib/upload-utils';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';

type JenisSepeda = string;

export function FormPeminjaman() {
  const router = useRouter();
  const { user } = useUser();
  const { supabase, loading: authLoading } = useSupabaseAuth();

  const [tanggalPeminjaman, setTanggalPeminjaman] = useState<Date | undefined>(
    undefined
  );
  const [jangkaPeminjaman, setJangkaPeminjaman] = useState<string>('Harian');
  const [jenisSepeda, setJenisSepeda] = useState<string>('');
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [nomorTelepon, setNomorTelepon] = useState<string>('');
  const [fotoPeminjam, setFotoPeminjam] = useState<File[]>([]);
  const [fotoKTM, setFotoKTM] = useState<File[]>([]);
  const [suratPeminjaman, setSuratPeminjaman] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jenisSepedaOptions, setJenisSepedaOptions] = useState<JenisSepeda[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jenis sepeda saat komponen dimount
  useEffect(() => {
    const fetchJenisSepeda = async () => {
      try {
        // Versi yang disederhanakan - ambil semua sepeda dengan filter status "Tersedia"
        const { data } = await supabase
          .from('DataSepeda')
          .select('jenis')
          .eq('status', 'Tersedia')
          .order('jenis');

        if (!data || data.length === 0) {
          // Jika tidak ada data, gunakan data dummy untuk testing
          setJenisSepedaOptions(['Gunung', 'Keranjang', 'Lipat', 'Listrik']);
          toast.warning('Menggunakan data sepeda default', {
            richColors: true
          });
          return;
        }

        // Ambil jenis sepeda unik
        const uniqueJenis = Array.from(new Set(data.map((item) => item.jenis)));
        setJenisSepedaOptions(uniqueJenis);
      } catch {
        // Gunakan data dummy jika terjadi error
        setJenisSepedaOptions(['Gunung', 'Keranjang', 'Lipat', 'Listrik']);
        toast.warning('Menggunakan data sepeda default', { richColors: true });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchJenisSepeda();
    }
  }, [supabase, authLoading]);

  // Hitung tanggal pengembalian berdasarkan jangka waktu
  const hitungTanggalPengembalian = useCallback(
    (tanggal: Date, jangka: string) => {
      if (jangka === 'Harian') {
        return addDays(tanggal, 0);
      } else {
        return addMonths(tanggal, 2);
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !tanggalPeminjaman ||
      !jangkaPeminjaman ||
      !jenisSepeda ||
      !nomorTelepon
    ) {
      toast.error('Mohon lengkapi semua field', { richColors: true });
      return;
    }

    if (fotoPeminjam.length === 0) {
      toast.error('Mohon upload foto diri Anda', { richColors: true });
      return;
    }

    if (fotoKTM.length === 0) {
      toast.error('Mohon upload foto KTM Anda', { richColors: true });
      return;
    }

    if (!user?.id) {
      toast.error('Sesi pengguna tidak valid, silakan login ulang', {
        richColors: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Hitung tanggal pengembalian
      const tanggalPengembalian = hitungTanggalPengembalian(
        tanggalPeminjaman,
        jangkaPeminjaman
      );

      // Upload foto peminjam
      const fotoPeminjamUrl = await uploadFileToStorage(
        supabase,
        fotoPeminjam[0],
        'peminjaman',
        `peminjam/${user.id}`
      );

      // Upload foto KTM
      const fotoKTMUrl = await uploadFileToStorage(
        supabase,
        fotoKTM[0],
        'peminjaman',
        `ktm/${user.id}`
      );

      // Upload surat peminjaman hanya jika jangkaPeminjaman adalah "2 Bulan"
      let suratPeminjamanUrl = null;
      if (jangkaPeminjaman === '2 Bulan') {
        if (suratPeminjaman.length === 0) {
          toast.error('Mohon upload surat peminjaman untuk jangka 2 Bulan', {
            richColors: true
          });
          setIsSubmitting(false);
          return;
        }
        suratPeminjamanUrl = await uploadFileToStorage(
          supabase,
          suratPeminjaman[0],
          'peminjaman',
          `surat/${user.id}`
        );
      }

      if (!fotoPeminjamUrl || !fotoKTMUrl) {
        toast.error('Gagal mengupload file, silakan coba lagi', {
          richColors: true
        });
      }

      // Cari sepeda yang tersedia dengan jenis yang dipilih
      const { data: availableBikes, error: bikesError } = await supabase
        .from('DataSepeda')
        .select('nomorSeri')
        .eq('jenis', jenisSepeda)
        .eq('status', 'Tersedia')
        .limit(1);

      if (bikesError || !availableBikes || availableBikes.length === 0) {
        throw new Error('Tidak ada sepeda tersedia untuk jenis yang dipilih');
      }

      // Ambil nomor seri sepeda yang pertama
      const nomorSeriSepeda = availableBikes[0].nomorSeri;

      // Cek apakah peminjam sudah terdaftar di database
      const { data: existingUser } = await supabase
        .from('Users')
        .select('id')
        .eq('id', user.id)
        .single();

      // Jika user tidak ada, insert user baru
      if (!existingUser) {
        const { error: insertError } = await supabase.from('Users').insert({
          id: user.id,
          email: user.emailAddresses?.[0]?.emailAddress ?? '',
          nomorTelepon: nomorTelepon,
          nama: user.fullName || user.username || '',
          role: user.publicMetadata?.role || 'user'
        });
        if (insertError) {
          throw insertError;
        }
      }


      // Simpan data peminjaman
      const { error } = await supabase.from('Peminjaman').insert({
        userId: user.id, // Use Clerk ID directly
        nomorSeriSepeda,
        tanggalPeminjaman: format(tanggalPeminjaman, 'yyyy-MM-dd'),
        jangkaPeminjaman,
        tanggalPengembalian: format(tanggalPengembalian, 'yyyy-MM-dd'),
        statusId: 1, // 1 = Menunggu Persetujuan
        nomorTeleponAktif: nomorTelepon,
        fotoPeminjam: fotoPeminjamUrl,
        fotoKTM: fotoKTMUrl,
        suratPeminjaman: suratPeminjamanUrl
      });

      // Simpan nama user berdasarkan nama lengkap di form
      await supabase
        .from('Users')
        .update({ nama: namaLengkap })
        .eq('id', user.id);

      if (error) throw error;

      // Update status sepeda menjadi 'Dipinjam'
      const { error: updateError } = await supabase
        .from('DataSepeda')
        .update({ status: 'Dipinjam' })
        .eq('nomorSeri', nomorSeriSepeda);

      if (updateError) throw updateError;

      toast.success('Pengajuan peminjaman sepeda berhasil diajukan', {
        richColors: true
      });

      // Reset form
      setNamaLengkap('');
      setTanggalPeminjaman(undefined);
      setJangkaPeminjaman('Harian');
      setJenisSepeda('');
      setNomorTelepon('');
      setFotoPeminjam([]);
      setFotoKTM([]);
      setSuratPeminjaman([]);

      // Redirect ke halaman riwayat peminjaman
      router.push('/dashboard/peminjaman/riwayat');
    } catch (error: any) {
      toast.error(
        error.message || 'Terjadi kesalahan saat mengajukan peminjaman',
        { richColors: true }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    return Promise.resolve();
  };

  if (authLoading || isLoading) {
    return (
      <div className='flex items-center justify-center p-6'>
        <Loader2 className='mr-2 h-6 w-6 animate-spin' />
        <span>Memuat data...</span>
      </div>
    );
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-2xl'>Pengajuan Peminjaman Sepeda</CardTitle>
        <CardDescription>
          Silakan isi form berikut untuk mengajukan peminjaman sepeda
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='namaLengkap'>Nama Lengkap</Label>
            <Input
              id='namaLengkap'
              type='text'
              value={namaLengkap}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
                  setNamaLengkap(value);
                } else {
                  toast.error('Isi dengan nama lengkap yang sesuai', {
                    richColors: true
                  });
                }
              }}
              placeholder='Masukkan nomor lengkap yang sesuai dengan nama pada KTM'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tanggal'>Tanggal Peminjaman</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !tanggalPeminjaman && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {tanggalPeminjaman
                    ? format(tanggalPeminjaman, 'PPP')
                    : 'Pilih tanggal'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={tanggalPeminjaman}
                  onSelect={setTanggalPeminjaman}
                  initialFocus
                  disabled={(date) => {
                    const now = new Date();
                    const isSameDay =
                      date.toDateString() === now.toDateString();
                    const isBefore4PM = now.getHours() < 16;
                    return (
                      date.getTime() < now.setHours(0, 0, 0, 0) ||
                      (isSameDay && !isBefore4PM)
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-2'>
            <Label>Jangka Waktu Peminjaman</Label>
            <RadioGroup
              value={jangkaPeminjaman}
              onValueChange={setJangkaPeminjaman}
              className='flex flex-col space-y-1'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='Harian' id='Harian' />
                <Label htmlFor='Harian'>Harian</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='2 Bulan' id='2 Bulan' />
                <Label htmlFor='2 Bulan'>2 Bulan</Label>
              </div>
            </RadioGroup>
            <p className='text-muted-foreground mt-1 text-sm'>
              {jangkaPeminjaman === 'Harian'
                ? 'Sepeda harus dikembalikan pada hari yang sama'
                : 'Sepeda harus dikembalikan dalam 2 bulan'}
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='jenisSepeda'>Jenis Sepeda</Label>
            <Select value={jenisSepeda} onValueChange={setJenisSepeda}>
              <SelectTrigger>
                <SelectValue placeholder='Pilih jenis sepeda' />
              </SelectTrigger>
              <SelectContent>
                {jenisSepedaOptions.map((jenis) => (
                  <SelectItem key={jenis} value={jenis}>
                    Sepeda {jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='nomorTelepon'>Nomor Telepon Aktif</Label>
            <Input
              id='nomorTelepon'
              type='tel'
              value={nomorTelepon}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^[0-9]+$/.test(value)) {
                  setNomorTelepon(value);
                } else {
                  toast.error('Nomor telepon hanya boleh berisi angka', {
                    richColors: true
                  });
                }
              }}
              placeholder='Masukkan nomor telepon aktif'
            />
          </div>

          <div className='space-y-2'>
            <Label>Foto Diri</Label>
            <FileUploader
              value={fotoPeminjam}
              onValueChange={setFotoPeminjam}
              onUpload={handleUpload}
              accept={{ 'image/*': [] }}
              maxSize={1024 * 1024 * 2} // 2MB
              maxFiles={1}
            />
            <p className='text-muted-foreground text-xs'>
              Upload foto diri Anda dalam kondisi terbaru dengan wajah terlihat
              jelas
            </p>
          </div>

          <div className='space-y-2'>
            <Label>Foto KTM</Label>
            <FileUploader
              value={fotoKTM}
              onValueChange={setFotoKTM}
              onUpload={handleUpload}
              accept={{ 'image/*': [] }}
              maxSize={1024 * 1024 * 2} // 2MB
              maxFiles={1}
            />
            <p className='text-muted-foreground mb-4 text-xs'>
              Upload foto KTM Anda dengan informasi terlihat jelas
            </p>
          </div>

          {jangkaPeminjaman === '2 Bulan' && (
            <div className='space-y-2'>
              <Label>Surat Peminjaman</Label>
              <FileUploader
                value={suratPeminjaman}
                onValueChange={setSuratPeminjaman}
                onUpload={handleUpload}
                accept={{
                  'application/pdf': [],
                  'application/msword': [],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    []
                }}
                maxSize={1024 * 1024 * 2} // 2MB
                maxFiles={1}
              />
              <p className='text-muted-foreground mb-2 text-xs'>
                Upload surat peminjaman Anda yang sudah diberi materai
              </p>
              <p className='text-muted-foreground mb-2 text-xs'>
                Jika belum punya template nya, download{' '}
                <a
                  href='https://kbyohjsdzfncnqnnzzwe.supabase.co/storage/v1/object/public/peminjaman/Template_Surat_Peminjaman_2025.docx'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 underline'
                  download
                >
                  di sini
                </a>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Memproses...
              </>
            ) : (
              'Ajukan Peminjaman'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
