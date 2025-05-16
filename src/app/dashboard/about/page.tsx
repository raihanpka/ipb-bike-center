import PageContainer from '@/components/layout/page-container';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Bike,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  CheckCircle2,
  Leaf,
  Heart,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tentang IPB Bike Center',
  description:
    'Informasi tentang IPB Bike Center, layanan peminjaman sepeda untuk civitas IPB'
};

export default function AboutPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='container mx-auto max-w-5xl px-4 py-8'>
        {/* Hero Section */}
        <section className='mb-12'>
          <div className='relative mb-6 overflow-hidden rounded-lg'>
            <div className='from-primary/80 to-primary/40 absolute inset-0 z-10 bg-gradient-to-r'></div>
            <Image
              src='/Rektorat.jpeg?height=400&width=1200'
              alt='IPB Bike Center'
              width={1200}
              height={400}
              className='h-[300px] w-full object-cover'
            />
            <div className='absolute inset-0 z-20 flex flex-col justify-center p-8'>
              <h1 className='mb-4 text-4xl font-bold text-white md:text-5xl'>
                IPB Bike Center
              </h1>
              <p className='max-w-2xl text-lg text-white/90 md:text-xl'>
                Solusi mobilitas berkelanjutan untuk civitas akademika IPB
                University
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className='mb-12'>
          <div className='flex flex-col items-center gap-8 md:flex-row'>
            <div className='flex-1'>
              <h2 className='mb-4 text-3xl font-bold tracking-tight'>
                Tentang Kami
              </h2>
              <p className='text-muted-foreground mb-4'>
                IPB Bike Center adalah layanan peminjaman sepeda yang didesain
                khusus untuk memenuhi kebutuhan mobilitas civitas akademika
                Institut Pertanian Bogor. Kami berkomitmen untuk mendukung
                ekosistem kampus hijau (Green Campus) dengan menyediakan
                alternatif transportasi yang ramah lingkungan.
              </p>
              <div className='mt-6 flex flex-wrap gap-3'>
                <Badge
                  variant='outline'
                  className='flex items-center gap-1 px-3 py-1 text-sm'
                >
                  <Leaf className='h-3.5 w-3.5' /> Ramah Lingkungan
                </Badge>
                <Badge
                  variant='outline'
                  className='flex items-center gap-1 px-3 py-1 text-sm'
                >
                  <Heart className='h-3.5 w-3.5' /> Gaya Hidup Sehat
                </Badge>
                <Badge
                  variant='outline'
                  className='flex items-center gap-1 px-3 py-1 text-sm'
                >
                  <Users className='h-3.5 w-3.5' /> Untuk Civitas IPB
                </Badge>
              </div>
            </div>
            <div className='flex-1'>
              <Image
                src='/FasilitasSepeda.jpg?height=300&width=500'
                alt='Bike Center Facility'
                width={500}
                height={300}
                className='rounded-lg shadow-md'
              />
            </div>
          </div>
        </section>

        <Separator className='my-12' />

        {/* Vision & Mission */}
        <section className='mb-12'>
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight'>
            Visi & Misi
          </h2>
          <div className='grid gap-8 md:grid-cols-2'>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-2xl'>Visi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  Menjadi pusat layanan mobilitas berkelanjutan yang mendukung
                  ekosistem kampus hijau (Green Campus) bagi IPB University dan
                  menjadi model percontohan bagi institusi pendidikan lainnya di
                  Indonesia.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-2xl'>Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className='space-y-2'>
                  {[
                    'Menyediakan alternatif transportasi ramah lingkungan',
                    'Mengurangi emisi karbon di lingkungan kampus',
                    'Memfasilitasi mobilitas civitas akademika secara efisien',
                    'Mendorong gaya hidup sehat melalui aktivitas bersepeda'
                  ].map((item, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <CheckCircle2 className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <span className='text-muted-foreground'>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Services */}
        <section className='mb-12'>
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight'>
            Layanan Kami
          </h2>
          <div className='grid gap-6 md:grid-cols-3'>
            <Card className='flex h-full flex-col'>
              <CardHeader className='pb-2'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Bike className='text-primary h-6 w-6' />
                </div>
                <CardTitle>Peminjaman Sepeda</CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-muted-foreground'>
                  Kami menyediakan berbagai jenis sepeda yang dapat dipinjam
                  oleh mahasiswa, dosen, dan staf IPB untuk keperluan mobilitas
                  di dalam kampus.
                </p>
              </CardContent>
            </Card>

            <Card className='flex h-full flex-col'>
              <CardHeader className='pb-2'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Clock className='text-primary h-6 w-6' />
                </div>
                <CardTitle>Perawatan Sepeda</CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-muted-foreground'>
                  Semua sepeda dalam program ini mendapatkan perawatan rutin
                  untuk memastikan keamanan dan kenyamanan pengguna.
                </p>
              </CardContent>
            </Card>

            <Card className='flex h-full flex-col'>
              <CardHeader className='pb-2'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <MapPin className='text-primary h-6 w-6' />
                </div>
                <CardTitle>Titik Pengembalian</CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-muted-foreground'>
                  Kami menyediakan beberapa titik pengembalian sepeda yang
                  tersebar di berbagai lokasi strategis di kampus IPB Dramaga.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className='bg-muted/50 mb-12 rounded-xl p-8'>
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight'>
            Cara Kerja
          </h2>
          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                step: 1,
                title: 'Daftar',
                description:
                  'Daftar menggunakan akun email IPB yang terintegrasi dengan Google lalu lengkapi profil Anda'
              },
              {
                step: 2,
                title: 'Pinjam',
                description: 'Pilih sepeda yang tersedia dan ajukan peminjaman sesuai dengan jangka waktu yang diinginkan'  
              },
              {
                step: 3,
                title: 'Kembalikan',
                description:
                  'Kembalikan sepeda tepat waktu dengan scan QR Code yang diberikan petugas di lokasi pengembalian'
              }
            ].map((item) => (
              <div
                key={item.step}
                className='flex flex-col items-center text-center'
              >
                <div className='bg-background border-border mb-4 flex h-16 w-16 items-center justify-center rounded-full border shadow-sm'>
                  <span className='text-primary text-2xl font-bold'>
                    {item.step}
                  </span>
                </div>
                <h3 className='mb-2 text-xl font-semibold'>{item.title}</h3>
                <p className='text-muted-foreground'>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Contact */}
        <section className='mb-12'>
          <h2 className='mb-8 text-center text-3xl font-bold tracking-tight'>
            Informasi
          </h2>

          <Tabs defaultValue='location' className='w-full'>
            <TabsList className='mb-8 grid w-full grid-cols-2'>
              <TabsTrigger value='location'>Lokasi & Operasional</TabsTrigger>
              <TabsTrigger value='contact'>Kontak & Sosial</TabsTrigger>
            </TabsList>

            <TabsContent value='location'>
              <div className='grid gap-8 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <MapPin className='h-5 w-5' /> Pusat Peminjaman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground mb-4'>
                      Bike & Bus Shelter (Dekat Gedung Asrama Kepemimpinan)
                      <br />
                      Kampus IPB Dramaga
                      <br />
                      Bogor, Jawa Barat 16680
                    </p>

                    <h4 className='mb-2 font-medium'>Jam Operasional</h4>
                    <ul className='text-muted-foreground space-y-1'>
                      <li className='flex justify-between'>
                        <span>Senin - Jumat:</span>
                        <span>08.00 - 16.00 WIB</span>
                      </li>
                      <li className='flex justify-between'>
                        <span>Sabtu:</span>
                        <span>08.00 - 12.00 WIB</span>
                      </li>
                      <li className='flex justify-between'>
                        <span>Minggu & Hari Libur Nasional:</span>
                        <span>Tutup</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Titik Pengembalian</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                      {[
                        'Graha Widya Wisuda',
                        'Gedung Rektorat',
                        'Perpustakaan LSI',
                        'Masjid Al-Hurriyyah',
                        'Fakultas Pertanian',
                        'Fakultas Peternakan',
                        'Fakultas Kehutanan',
                        'Fakultas Kedokteran'
                      ].map((location, index) => (
                        <li key={index} className='flex items-center gap-2'>
                          <div className='bg-primary h-2 w-2 rounded-full'></div>
                          <span className='text-muted-foreground'>
                            {location}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='contact'>
              <div className='grid gap-8 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Kontak</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='text-muted-foreground h-5 w-5' />
                      <span className='text-muted-foreground'>
                        bikecenter@apps.ipb.ac.id
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Phone className='text-muted-foreground h-5 w-5' />
                      <span className='text-muted-foreground'>
                        (0251) 8622-XXX
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-muted-foreground'
                      >
                        <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
                      </svg>
                      <span className='text-muted-foreground'>
                        +62 812-XXXX-XXXX
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Media Sosial</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <Instagram className='text-muted-foreground h-5 w-5' />
                      <span className='text-muted-foreground'>
                        @ipbbikecenter
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Twitter className='text-muted-foreground h-5 w-5' />
                      <span className='text-muted-foreground'>
                        @ipbbikecenter
                      </span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Facebook className='text-muted-foreground h-5 w-5' />
                      <span className='text-muted-foreground'>
                        IPB Bike Center
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA */}
        <section className='mb-8'>
          <Card className='bg-primary text-primary-foreground'>
            <CardHeader>
              <CardTitle className='text-2xl'>
                Mulai Bersepeda Sekarang
              </CardTitle>
              <CardDescription className='text-primary-foreground/80'>
                Bergabunglah dengan komunitas IPB Bike Center dan nikmati
                manfaat bersepeda di kampus
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant='secondary' size='lg'>
                <Link href='/dashboard/peminjaman' className='ml-2'>
                  Mulai Pinjam Sepeda
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </PageContainer>
  );
}
