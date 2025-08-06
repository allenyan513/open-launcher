import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default async function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <>
      <Header
        lang={lang}
        websiteLogo={'/img/favicon.ico'}
        websiteName={'FF2050.AI'}
        githubLink="https://github.com/allenyan513/open-launcher"
        appLink={`${process.env.NEXT_PUBLIC_ENDPOINT_URL}/dashboard`}
        items={[
          { title: 'Launches', href: '/launches' },
          { title: 'Products', href: '/products' },
          { title: 'Category', href: '/category' },
        ]}
      />
      <main className="flex flex-col items-center justify-between w-full max-w-7xl mx-auto">{props.children}</main>
      <Footer
        websiteLogo={'/img/favicon.ico'}
        websiteName={'FF2050.AI'}
        websiteDescription={'Find your next AI tool and website.'}
        builtBy="FF2050.AI"
        builtByLink={process.env.NEXT_PUBLIC_ENDPOINT_URL as string}
        githubLink="https://github.com/allenyan513/open-launcher"
        twitterLink="https://x.com/alinlinlink"
        linkedinLink="https://www.linkedin.com/in/ligangyan/"
        email={'mailto:wsyanligang@gmail.com'}
      />
    </>
  );
}
