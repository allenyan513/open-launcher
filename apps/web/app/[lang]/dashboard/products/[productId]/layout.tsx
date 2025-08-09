'use client';
import React, {use} from "react";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import {DashboardRoot} from "@/components/dashboard/dashboard-root";
import {DashboardContent} from "@/components/dashboard/dashboard-content";
import {BsHeart, BsStar,BsInfoCircle,BsPatchExclamation} from "react-icons/bs";
import Link from "next/link";
import {cn} from "@repo/ui/lib/utils";
import {usePathname} from "next/navigation";

const pageItems = [
  {
    title: 'Main info',
    url: 'info',
    icon: BsInfoCircle,
  },
  {
    title: 'Extra info',
    url: 'extra',
    icon: BsPatchExclamation,
  },
  {
    title: 'Launch',
    url: 'plan',
    icon: BsHeart,
  },
]

export default function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string; productId: string }>;
}) {
  const {lang, productId} = use(props.params);
  const path = usePathname();
  return (
    <DashboardRoot>
      <DashboardHeader
        title={'Submit Product'}
        subtitle={'Have you created an exciting product? Submit it and share it with others.'}
      />
      <DashboardContent>
        <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
          <div className="flex flex-col  md:col-span-2 gap-2">
            {pageItems.map((item) => (
              <Link
                key={item.title}
                href={`/dashboard/products/${productId}/${item.url}`}
                className={cn(
                  'cursor-pointer flex flex-row gap-2 items-center justify-start h-12 rounded px-4 font-semibold border',
                  path.includes(item.url)
                    ? 'bg-red-100 text-red-400  border-red-300'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground border-gray-300',
                )}
              >
                {item.icon && <item.icon/>}
                <span className={'text-[14px]'}>{item.title}</span>
              </Link>
            ))}
          </div>
          <div className="md:col-span-8">{props.children}</div>
        </div>
      </DashboardContent>
    </DashboardRoot>
  );
}
