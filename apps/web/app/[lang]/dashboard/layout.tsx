'use client';
import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@repo/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { use, useState } from 'react';
import { UserProvider } from '@/context/UserProvider';
import ToasterContext from '@/context/ToastContext';
import { SiteHeader } from '@/components/dashboard/site-header';
import {
  IconBrandProducthunt,
  IconCheckbox, IconClipboard,
  IconCode,
  IconDashboard,
  IconForbid2, IconHeart,
  IconHourglassEmpty,
  IconList, IconRocket, IconSettings,
  IconStar, IconTable, IconUser
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export default function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = use(props.params);
  const path = usePathname();
  return (
    <>
      <UserProvider>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 62)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar
            lang={lang}
            title={'FF2050.AI'}
            items={[
              {
                title: 'Submit',
                url: `/${lang}/dashboard/submit`,
                icon: IconRocket,
                active: path.includes('/submit'),
              },
              {
                title: 'Products',
                url: `/${lang}/dashboard/products`,
                icon: IconBrandProducthunt,
                active: path.includes('/products'),
              },
              // {
              //   title: 'Account',
              //   url: `/${lang}/dashboard/account/profile`,
              //   icon: IconUser,
              //   active: path.includes('/account'),
              // },
            ]}
          />
          <SidebarInset>
            <SiteHeader />
            {props.children}
          </SidebarInset>
        </SidebarProvider>
        <ToasterContext />
      </UserProvider>
    </>
  );
}
