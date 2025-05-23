'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Maintenance() {
  const router = useRouter();

  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <h1 className='text-primary-700 text-3xl font-bold'>IPB Bike Center</h1>
      <h2 className='font-heading text-foreground-800 my-2 text-xl font-semibold'>
        Sedang Dalam Pemeliharaan
      </h2>
      <p className='text-foreground-600'>
        Kami sedang melakukan perawatan sistem untuk meningkatkan kualitas
        layanan. Silakan kembali lagi nanti atau coba muat ulang halaman ini.
      </p>
      <div className='mt-6 flex justify-center gap-2'>
        <Button onClick={() => router.push('/')} variant='default' size='lg'>
          Muat Ulang
        </Button>
      </div>
      <p className='text-muted-foreground mt-4 text-sm'>
        Terima kasih atas kesabaran Anda
      </p>
    </div>
  );
}
