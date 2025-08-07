'use client';

import { use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function CallbackPage(props: {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    access_token?: string;
    redirect?: string;
  }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const encodedRedirectUrl = searchParams.get('redirect');
    console.log('encodedRedirectUrl', encodedRedirectUrl);

    const redirectUrl = encodedRedirectUrl
      ? decodeURIComponent(encodedRedirectUrl)
      : '/dashboard';

    console.log('redirectUrl', redirectUrl);

    redirect(redirectUrl);
  }, [searchParams, router]);

  return null;
}
