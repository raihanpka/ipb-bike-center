'use client';
import { SignUp } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function SignUpViewPage() {
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = '/admin/utama';
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignUp
      // signInUrl='/auth/sign-in'
      // fallbackRedirectUrl='/dashboard/utama'
      />
    </div>
  );
}
