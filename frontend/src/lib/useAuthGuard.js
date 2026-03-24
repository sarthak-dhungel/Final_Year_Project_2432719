'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Protects a page — redirects to /signin if the user is not logged in.
 * Returns { session, status } so the page can use session data.
 *
 * Usage:
 *   const { session, status } = useAuthGuard();
 *   if (status === 'loading') return <LoadingSpinner />;
 */
export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  return { session, status };
}