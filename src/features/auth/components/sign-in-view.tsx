'use client';
import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function SignInViewPage() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/admin/utama';
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn
      // fallbackRedirectUrl='/dashboard/utama'
      // signUpFallbackRedirectUrl='/dashboard/utama'
      />
    </div>
  );
}
