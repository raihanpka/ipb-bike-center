'use client';

import { useEffect } from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { id as LocaleId } from 'date-fns/locale';
import {
  Bike,
  Calendar,
  Clock,
  User,
  Check,
  X,
  Loader2,
  Phone,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

type PeminjamanAdminCardProps = {
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
  onStatusUpdate: () => void;
};

export function CardPeminjamanAdmin({
  id,
  userId,
  nomorSeriSepeda,
  tanggalPeminjaman,
  jangkaPeminjaman,
  tanggalPengembalian,
  statusId,
  statusNama,
  jenisSepeda,
  merkSepeda,
  namaUser,
  emailUser,
  nomorTeleponAktif,
  fotoPeminjam,
  fotoKTM,
  suratPeminjaman,
  onStatusUpdate
}: PeminjamanAdminCardProps) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

    // Cek keterlambatan pengembalian
    const isTerlambat = async () => {
      if (!tanggalPengembalian) return false;
      try {
        // Konversi tanggalPengembalian ke Date (anggap sudah dalam format ISO)
        const pengembalianDate = parseISO(tanggalPengembalian);
  
        // Waktu sekarang dalam WIB (UTC+7)
        const now = new Date();
        const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  
        // Hari dalam minggu (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
        const dayOfWeek = nowWIB.getUTCDay();
        const hour = nowWIB.getUTCHours();
  
        // Cek apakah sudah lewat jam batas
        let batasJam = null;
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          // Senin-Jumat
          batasJam = 16;
        } else if (dayOfWeek === 6) {
          // Sabtu
          batasJam = 12;
        } else {
          // Minggu tidak dihitung keterlambatan
          return false;
        }
  
        // Jika sudah lewat jam batas dan tanggalPengembalian < sekarang WIB
        if (hour >= batasJam && pengembalianDate < nowWIB) {
          // Jika status masih 2 (aktif), update ke 6 (terlambat)
          if (statusId === 2) {
            await supabase.from('Peminjaman').update({ statusId: 6 }).eq('id', id);
            onStatusUpdate();
          }
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };
  
    // Jalankan cek keterlambatan saat komponen mount atau statusId berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (statusId === 2) {
        isTerlambat();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusId]);

  const handleApprove = async () => {
    setIsSubmitting(true);

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from('Peminjaman')
        .update({ statusId: 2 }) // 2 = Aktif
        .eq('id', id);

      if (peminjamanError) throw peminjamanError;

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from('DataSepeda')
        .update({ status: 'Dipinjam' })
        .eq('nomorSeri', nomorSeriSepeda);

      if (sepedaError) throw sepedaError;

      toast.success('Peminjaman berhasil disetujui');
      onStatusUpdate();
    } catch (error: any) {
      toast.error(
        error.message || 'Terjadi kesalahan saat menyetujui peminjaman',
        { richColors: true }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from('Peminjaman')
        .update({ statusId: 3 }) // 3 = Ditolak
        .eq('id', id);

      if (peminjamanError) throw peminjamanError;

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from('DataSepeda')
        .update({ status: 'Tersedia' })
        .eq('nomorSeri', nomorSeriSepeda);

      if (sepedaError) throw sepedaError;

      toast.success('Peminjaman berhasil ditolak');
      onStatusUpdate();
    } catch (error: any) {
      toast.error(
        error.message || 'Terjadi kesalahan saat menolak peminjaman',
        { richColors: true }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      // Update status peminjaman
      const { error: peminjamanError } = await supabase
        .from('Peminjaman')
        .update({ statusId: 4 }) // 4 = Selesai
        .eq('id', id);

      if (peminjamanError) throw peminjamanError;

      // Update status sepeda
      const { error: sepedaError } = await supabase
        .from('DataSepeda')
        .update({ status: 'Tersedia' })
        .eq('nomorSeri', nomorSeriSepeda);

      if (sepedaError) throw sepedaError;

      toast.success('Peminjaman berhasil diselesaikan');
      onStatusUpdate();
    } catch (error: any) {
      toast.error(
        error.message || 'Terjadi kesalahan saat menyelesaikan peminjaman',
        { richColors: true }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // Menunggu Persetujuan
        return 'bg-yellow-100 text-yellow-800';
      case 2: // Aktif
        return 'bg-green-100 text-green-800';
      case 3: // Ditolak
        return 'bg-red-100 text-red-800';
      case 4: // Selesai
        return 'bg-blue-100 text-blue-800';
      case 5: // Dibatalkan
        return 'bg-gray-100 text-gray-800';
      case 6: // Terlambat
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleReject}
        loading={isLoading}
      />
      <Card className='overflow-hidden'>
        <CardHeader className='pb-2'>
          <div className='flex items-start justify-between'>
            <CardTitle className='text-lg'>
              {merkSepeda} {jenisSepeda}
            </CardTitle>
            <Badge className={getStatusColor(statusId)}>{statusNama}</Badge>
          </div>
          <CardDescription>ID: {id.slice(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex items-center'>
            <User className='text-muted-foreground mr-2 h-4 w-4' />
            <span className='text-sm'>{namaUser}</span>
          </div>
          <div className='flex items-center'>
            <Phone className='text-muted-foreground mr-2 h-4 w-4' />
            <span className='text-sm'>{nomorTeleponAktif}</span>
          </div>
          <div className='flex items-center'>
            <Calendar className='text-muted-foreground mr-2 h-4 w-4' />
            <span className='text-sm'>
              Tanggal:{' '}
              {format(new Date(tanggalPeminjaman), 'dd MMMM yyyy', {
                locale: LocaleId
              })}
            </span>
          </div>
          <div className='flex items-center'>
            <Clock className='text-muted-foreground mr-2 h-4 w-4' />
            <span className='text-sm'>
              Jangka Waktu:{' '}
              {jangkaPeminjaman === 'Harian' ? '1 Hari' : '2 Bulan'}
            </span>
          </div>
          <div className='flex items-center'>
            <Bike className='text-muted-foreground mr-2 h-4 w-4' />
            <span className='text-sm'>No. Seri: {nomorSeriSepeda}</span>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2'>
          {statusId !== 4 && statusId !== 5 && (
            <Button
              size='sm'
              variant='outline'
              className='flex items-center gap-1'
              onClick={() => setIsDetailDialogOpen(true)}
            >
              <Eye className='h-4 w-4' /> Detail
            </Button>
          )}
          {statusId === 1 && ( // Menunggu Persetujuan
            <>
              <Button
                size='sm'
                variant='outline'
                className='flex items-center gap-1'
                onClick={() => setOpen(true)}
                disabled={isSubmitting}
              >
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <>
                  <X className='h-4 w-4' /> Tolak
                </>
              )}
              </Button>
              <Button
                size='sm'
                className='flex items-center gap-1'
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                <Check className='h-4 w-4' /> Setujui
              </Button>
            </>
          )}
          {statusId === 2 && ( // Aktif
            <Button
              size='sm'
              variant='outline'
              className='flex items-center gap-1'
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              <Check className='h-4 w-4' /> Selesai
            </Button>
          )}
          {statusId === 6 && ( // Terlambat
            <Button
              size='sm'
              variant='outline'
              className='flex items-center gap-1'
              onClick={handleComplete}
              disabled={isSubmitting}
            >
              <Check className='h-4 w-4' /> Selesai
            </Button>
          )}
        </CardFooter>
      </Card>

      {statusId !== 4 && statusId !== 5 && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Detail Peminjaman</DialogTitle>
              <DialogDescription>
                Detail lengkap peminjaman sepeda
              </DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 font-medium'>Informasi Peminjam</h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Nama:</span> {namaUser}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Email:</span> {emailUser}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>No. Telepon:</span>{' '}
                      {nomorTeleponAktif}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 font-medium'>Informasi Sepeda</h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Merk:</span> {merkSepeda}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Jenis:</span> {jenisSepeda}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>No. Seri:</span>{' '}
                      {nomorSeriSepeda}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className='mb-2 font-medium'>Informasi Peminjaman</h3>
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Tanggal Peminjaman:</span>{' '}
                      {format(new Date(tanggalPeminjaman), 'dd MMMM yyyy', {
                        locale: LocaleId
                      })}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Jangka Waktu:</span>{' '}
                      {jangkaPeminjaman === 'Harian' ? '1 Hari' : '2 Bulan'}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Tanggal Pengembalian:</span>{' '}
                      {format(new Date(tanggalPengembalian), 'dd MMMM yyyy', {
                        locale: LocaleId
                      })}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Status:</span>{' '}
                      <Badge className={getStatusColor(statusId)}>
                        {statusNama}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div>
                  <h3 className='mb-2 font-medium'>Foto Peminjam</h3>
                  {fotoPeminjam ? (
                    <div className='overflow-hidden rounded-md border'>
                      <Image
                        src={fotoPeminjam || '/placeholder.svg'}
                        alt='Foto Peminjam'
                        width={300}
                        height={300}
                        className='justify-center object-cover'
                      />
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-sm'>
                      Tidak ada foto peminjam
                    </p>
                  )}
                </div>
                <div>
                  <h3 className='mb-2 font-medium'>Foto KTM</h3>
                  {fotoKTM ? (
                    <div className='overflow-hidden rounded-md border'>
                      <Image
                        src={fotoKTM || '/placeholder.svg'}
                        alt='Foto KTM'
                        width={300}
                        height={300}
                        className='object-cover'
                      />
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-sm'>
                      Tidak ada foto KTM
                    </p>
                  )}
                </div>
                {suratPeminjaman && (
                  <div>
                    <h3 className='mb-2 font-medium'>Surat Peminjaman</h3>
                    <Button
                      asChild
                      className='w-full'
                      variant='outline'
                      size='sm'
                    >
                      <a
                        href={suratPeminjaman}
                        target='_blank'
                        rel='noopener noreferrer'
                        download
                      >
                        Unduh Surat Peminjaman
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsDetailDialogOpen(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
