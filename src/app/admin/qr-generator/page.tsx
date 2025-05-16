'use client';

import PageContainer from '@/components/layout/page-container';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { QRCodeGenerator } from '@/components/qr-code-generator';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function QRGeneratorPage() {
  const { user, isLoaded } = useUser();
  const [searchNomorSeri, setSearchNomorSeri] = useState('');
  const [selectedNomorSeri, setSelectedNomorSeri] = useState('');
  const [sepedaList, setSepedaList] = useState<
    { nomorSeri: string; merk: string; jenis: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && isLoaded) {
      setIsAdmin(user.publicMetadata?.role === 'admin');
      setLoading(false);
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    const fetchSepeda = async () => {
      if (!isAdmin) return;

      try {
        const { data, error } = await supabase
          .from('DataSepeda')
          .select('nomorSeri, merk, jenis')
          .order('nomorSeri');
        if (error) throw error;
        setSepedaList(data || []);
      } catch (error) {
        console.error('Error fetching sepeda:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin && !loading) {
      fetchSepeda();
    }
  }, [isAdmin, loading]);

  // Filter sepedaList berdasarkan searchNomorSeri
  const filteredSepeda = searchNomorSeri
    ? sepedaList.filter((s) =>
        s.nomorSeri.toLowerCase().includes(searchNomorSeri.toLowerCase())
      )
    : [];

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

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <h1 className='mb-6 text-3xl font-bold'>Generator QR Code Sepeda</h1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Cari Nomor Seri Sepeda</CardTitle>
              <CardDescription>
                Ketik nomor seri sepeda untuk membuat QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder='Cari nomor seri sepeda'
                value={searchNomorSeri}
                onChange={(e) => {
                  setSearchNomorSeri(e.target.value);
                  setSelectedNomorSeri(''); // reset pilihan jika search berubah
                }}
                className='mb-2'
              />
              {searchNomorSeri && (
                <div className='max-h-40 overflow-auto rounded border bg-white shadow'>
                  {filteredSepeda.length === 0 ? (
                    <div className='p-2 text-sm text-gray-500'>
                      Tidak ditemukan
                    </div>
                  ) : (
                    filteredSepeda.map((sepeda) => (
                      <div
                        key={sepeda.nomorSeri}
                        className={`cursor-pointer p-2 hover:bg-gray-100 ${selectedNomorSeri === sepeda.nomorSeri ? 'bg-gray-200' : ''}`}
                        onClick={() => setSelectedNomorSeri(sepeda.nomorSeri)}
                      >
                        {sepeda.nomorSeri} - {sepeda.merk} {sepeda.jenis}
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedNomorSeri && (
                <div className='mt-2 text-sm text-green-600'>
                  Nomor Seri terpilih:{' '}
                  <span className='font-bold'>{selectedNomorSeri}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <QRCodeGenerator nomorSeri={selectedNomorSeri} />
        </div>
      </div>
    </PageContainer>
  );
}
