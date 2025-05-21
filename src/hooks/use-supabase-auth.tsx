'use client';

import { useUser } from '@clerk/nextjs';
import type { UserResource } from '@clerk/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseAuth() {
  const { user, isLoaded } = useUser() as {
    user: UserResource | null;
    isLoaded: boolean;
  };
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // cek admin
  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      setLoading(true);
      try {
        if (!user) {
          setIsAdmin(false);
          return;
        }
        if (user.publicMetadata?.role === 'admin') {
          setIsAdmin(true);
          return;
        }
        const { data, error } = await supabase
          .from('Users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, user]);

  return { supabase, user, isAdmin, loading };
}
