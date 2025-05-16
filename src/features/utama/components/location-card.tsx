'use client';

import Link from 'next/link';
import { Clock, MapPin, Calendar, Info, ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LeafletMap } from '@/components/leaflet-map';
import { JumlahSepedaTersedia } from './data-sepeda';
import React, { useEffect, useState } from 'react';

// Function to check if the current time is within operational hours
function isWithinOperationalHours(hours: string): boolean {
  const [start, end] = hours.split(' - ').map((time) => {
    const [hour, minute] = time.split(':').map(Number);
    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0,
      0
    );
    return date.getTime();
  });

  const now = new Date();
  const currentTime = now.getTime();

  return currentTime >= start && currentTime <= end;
}

type OperationalHours = {
  weekdays: string;
  saturday: string;
  sundayHoliday: string;
};

type LocationData = {
  name: string;
  isActive: boolean;
  operationalHours: OperationalHours;
  status: {
    isOpen: boolean;
    availableBikes: number;
  };
};

const operationalHours: OperationalHours = {
  weekdays: '08:00 - 16:00',
  saturday: '08:00 - 12:00',
  sundayHoliday: 'Tutup'
};

const isOpen = (() => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours =
    day === 0 ||
    now.toLocaleDateString('id-ID', { weekday: 'long' }) === 'Libur'
      ? operationalHours.sundayHoliday
      : day === 6
        ? operationalHours.saturday
        : operationalHours.weekdays;

  return hours !== 'Tutup' && isWithinOperationalHours(hours);
})();

export function LocationCard() {
  const [availableBikes, setAvailableBikes] = useState<number>(0);

  useEffect(() => {
    JumlahSepedaTersedia().then(setAvailableBikes);
  }, []);

  const locationData: LocationData = {
    name: 'IPB Bike Shelter',
    isActive: true,
    operationalHours,
    status: {
      isOpen,
      availableBikes
    }
  };

  return (
    <Card className='h-full w-full overflow-hidden'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <MapPin className='text-primary h-5 w-5' />
            <CardTitle>Lokasi {locationData.name}</CardTitle>
          </div>
          <Badge
            variant='outline'
            className={
              locationData.status.isOpen
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-red-100 text-red-800 hover:bg-red-100'
            }
          >
            {locationData.status.isOpen ? 'Buka' : 'Tidak Buka'}
          </Badge>
        </div>
      </CardHeader>

      <div className='relative z-0 h-[300px] w-full'>
        <LeafletMap className='aspect-auto h-full w-full' />
      </div>

      <CardContent className='pt-4'>
        <div className='space-y-4'>
          <div className='flex items-start gap-3'>
            <Clock className='text-muted-foreground mt-0.5 h-5 w-5 shrink-0' />
            <div className='w-full space-y-2'>
              <h3 className='text-sm font-medium'>Waktu Operasional</h3>

              <ul className='space-y-1 text-sm'>
                <li className='flex items-center justify-between'>
                  <span className='text-xs font-medium'>Senin - Jumat</span>
                  <span className='text-muted-foreground text-xs'>
                    {locationData.operationalHours.weekdays}
                  </span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-xs font-medium'>Sabtu</span>
                  <span className='text-muted-foreground text-xs'>
                    {locationData.operationalHours.saturday}
                  </span>
                </li>
                <li className='flex items-center justify-between'>
                  <span className='text-xs font-medium'>Minggu & Hari Libur Nasional</span>
                  <span className='text-muted-foreground text-xs'>
                    {locationData.operationalHours.sundayHoliday}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className='flex items-start gap-3'>
            <Calendar className='text-muted-foreground mt-0.5 h-5 w-5 shrink-0' />
            <div>
              <h3 className='text-sm font-medium'>Status Layanan</h3>
              <div className='mt-1 flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className={
                    locationData.status.isOpen
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                  }
                >
                  {locationData.status.isOpen ? 'Buka' : 'Tutup'}
                </Badge>
                <span className='text-muted-foreground text-xs'>
                  Tersedia {locationData.status.availableBikes} sepeda
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex justify-between pt-2'>
        <Button variant='outline' size='sm' className='gap-1'>
          <Info className='h-4 w-4' />
          <Link href='/dashboard/about'>Detail</Link>
        </Button>
        <Button size='sm' className='gap-1'>
          <Link href='/dashboard/peminjaman'>Ajukan Peminjaman</Link>
          <ArrowRight className='h-4 w-4' />
        </Button>
      </CardFooter>
    </Card>
  );
}
