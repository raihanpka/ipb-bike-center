'use client';
import { useRouter } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function SignInViewPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Force full page reload to ensure proper auth state
      window.location.href = '/dashboard/overview';
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn
        fallbackRedirectUrl='/dashboard/overview'
        signUpFallbackRedirectUrl='/dashboard/overview'
      />
    </div>
  );
}
