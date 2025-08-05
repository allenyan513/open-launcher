'use client';
import { buttonVariants } from '@repo/ui/button';
import Link from 'next/link';
import { BsGithub, BsLinkedin, BsTwitterX, BsEnvelope } from 'react-icons/bs';
import { I18nEntries } from '@/components/i18n-entries';
import {Logo} from "@/components/landing/logo";
import * as React from "react";

const sources = [
  {
    title: 'Launches',
    url: '/launches',
  },
  {
    title: 'Products',
    url: '/products',
  },
  {
    title: 'Category',
    url: '/Category',
  },
];

const howTo = [
  {
    title: 'How to turn X (Twitter) posts into reviews',
    url: `/how-to/x-posts`,
  },
];

const compares = [
  {
    title: 'Reviewsup vs. Testimonial.to',
    url: '/compare/reviewsup-vs-testimonial-to',
  },
];

const resources = [
  {
    title: 'Pricing',
    url: '/pricing',
  },
  {
    title: 'About Us',
    url: '/about',
  },
  {
    title: 'Terms of Service',
    url: '/terms-of-service',
  },
  {
    title: 'Privacy Policy',
    url: '/privacy-policy',
  },
];

function FooterLinks(props: {
  title: string;
  links: { title: string; url: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-1 text-[16px]">
      <h2 className="font-semibold">{props.title}</h2>
      {props.links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          className="text-gray-500 hover:text-gray-600"
          target={link.external ? '_blank' : '_self'}
          {...(link.external ? { rel: 'noopener noreferrer' } : {})}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}

export function Footer(props: {
  websiteLogo: string;
  websiteName: string;
  websiteDescription: string;
  builtBy: string;
  builtByLink: string;
  githubLink: string;
  twitterLink: string;
  linkedinLink: string;
  email: string;
}) {
  return (
    <footer className="flex flex-col gap-2 py-8 w-full px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:grid md:md:grid-cols-12 text-sm">
        <div className="flex flex-col gap-2 md:col-span-4">
          <Logo
            websiteLogo={props.websiteLogo}
            websiteName={props.websiteName}
            className=""
            isBeta={false}
          />
          {/*<h3 className="text-lg font-bold sm:inline-block text-red-400">*/}
          {/*  Reviewsup.io*/}
          {/*</h3>*/}
          <h4 className='w-full md:max-w-50'>{props.websiteDescription}</h4>
          <div className="flex items-center">
            {(
              [
                { href: props.twitterLink, icon: <BsTwitterX /> },
                { href: props.linkedinLink, icon: <BsLinkedin /> },
                { href: props.githubLink, icon: <BsGithub /> },
                { href: props.email, icon: <BsEnvelope /> },
              ] as const
            ).map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:col-span-8">
          <div className="flex flex-col gap-4">
            <I18nEntries />
          </div>
          <div className="flex flex-col gap-4">
            <FooterLinks title="Products" links={sources} />
            {/*<FooterLinks title="Compares" links={compares} />*/}
            {/*<FooterLinks title="Blogs" links={howTo} />*/}
          </div>
          <div className="flex flex-col gap-4">
            <FooterLinks title="Resources" links={resources} />
          </div>
        </div>
      </div>
    </footer>
  );
}
