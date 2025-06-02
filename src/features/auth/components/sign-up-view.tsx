'use client';
import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

export function SignUpViewPage() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/admin/utama';
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
       {/* Background for mobile */}
        <div className="absolute inset-0 block lg:hidden z-0">
        <div
          className='absolute inset-0'
          style={{
          backgroundImage: "url('/Rektorat.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          }}
        />
        <div
          className='absolute inset-0'
          style={{
          background: 'rgba(20, 20, 20, 0.7)',
          zIndex: 1,
          }}
        />
      </div>  
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
      <div
        className="absolute inset-0"
        style={{
        backgroundImage: "url('/Rektorat.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
        background: 'rgba(20, 20, 20, 0.7)',
        zIndex: 1,
        }}
      />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <div className="mr-2 h-6 w-6">
        <Image
          src="/Logo.png"
          width="100"
          height="100"
          alt="IPB Bike Logo"
        />
        </div>
        IPB Bike Center
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
        <p className="text-lg">
          IPB Bike Center adalah layanan peminjaman sepeda yang didesain
          khusus untuk memenuhi kebutuhan mobilitas civitas akademika
          IPB University
        </p>
        </blockquote>
        <footer className="mt-4">
        <strong>#MenujuGreenCampus2026</strong>
        </footer>
      </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
        <SignUp />
      </div>
      </div>
    </div>
  );
}
