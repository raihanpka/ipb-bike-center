'use client';

import { useUser } from '@clerk/nextjs';

export function UserGreeting() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <h2 className='text-2xl font-bold tracking-tight'>
        Selamat datang kembali 👋
      </h2>
    );
  }

  return (
    <h2 className='text-2xl font-bold tracking-tight'>
      {user
        ? `Selamat datang kembali, ${user.firstName} 👋`
        : 'Halo, Selamat datang kembali!'}
    </h2>
  );
}
