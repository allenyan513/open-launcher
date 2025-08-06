'use client';

import {LoginForm} from '@/components/login-form';
import {use} from 'react';
import {Logo} from "@/components/landing/logo";

export default function LoginPage(props: {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    redirect?: string;
  }>;
}) {
  const {redirect} = use(props.searchParams);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Logo
          websiteLogo={'/img/favicon.ico'}
          websiteName={'FF2050.AI'}
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirect={redirect}/>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block max-h-screen overflow-y-scroll p-4"></div>
    </div>
  );
}
