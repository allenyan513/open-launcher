import {Metadata} from "next";
import Hero from "@/components/products/Hero";
import {api, PRODUCT_CATEGORY_GROUP} from "@repo/shared";
import {useTranslate} from "@/i18n/dictionaries";
import {i18n} from "@/config/i18n-config";
import Link from "next/link";
import {notFound} from "next/navigation";

async function fetchStaticData(lang: string) {
  const t = await useTranslate(lang);
  // 从最新里取12个产品
  const latestProducts = await api.products.findAll({
    page: 1,
    pageSize: 24,
    status: ['approved'],
  })
  const todayProducts = [
    ...latestProducts.items,
  ]
  //random
  todayProducts.sort(() => Math.random() - 0.5);
  const productCategories = await api.productCategories.findList({
    page: 1,
    pageSize: 12,
  })
  return {
    title: t("Discover The Best AI Websites & Tools"),
    description: t("{key0} AIs and {key1} categories in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.", {
      key0: latestProducts.meta.total.toString() || '0',
      key1: productCategories.meta.total.toString() || '0',
    }),
    todayProducts: todayProducts,
  }
}

export async function generateMetadata(props: {
  params: Promise<{
    lang: string
  }>
}): Promise<Metadata> {
  const {lang} = await props.params;
  const staticData = await fetchStaticData(lang);
  return {
    title: staticData.title,
    description: staticData.description,
  }
}

export async function generateStaticParams(props: any) {
  if (process.env.NEXT_PUBLIC_SKIP_SSG === 'true') {
    return []
  }
  return i18n.locales.map((lang) => {
    return {
      lang: lang
    }
  })
}


export default async function ProductsPage(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  const t = await useTranslate(lang);
  const data = await api.products.findProducts()
  if (!data) {
    notFound()
  }
  return (
    <>
      <Hero lang={lang}/>
      <div className='grid grid-cols-12 w-full px-4'>
        <div className='col-span-3 sticky top-24 h-[calc(100vh-6rem)] w-64 overflow-y-auto'>
          {PRODUCT_CATEGORY_GROUP.map((group) => (
            <ul key={group.name} className='flex flex-col gap-2'>
              <li className='mb-4'>
                <Link
                  href={`#${group.name}`}>
                  {t(group.text || '')}
                </Link>
              </li>
            </ul>
          ))}
        </div>
        <div className="col-span-9 flex flex-col gap-8">
          {PRODUCT_CATEGORY_GROUP.map((item) => (
            <div key={item.name} className='flex flex-col gap-4'>
              <h2
                id={item.name}
                className='text-3xl font-semibold flex flex-row gap-2 items-center'>
                {t(item.text)}
              </h2>
              {data?.[item.name]?.map((product) => (
                <div
                  className='flex flex-row items-start gap-1'
                  key={product.id}>
                  <Link
                    href={`/${lang}/products/${product.slug}`}
                    className={'text-blue-500 line-clamp-1'}
                  >
                    {/* max 40 chars*/}
                    {product.name && product.name.length > 40 ? product.name.slice(0, 40) + '...' : product.name}
                  </Link>
                  <p>-</p>
                  <p className='flex-1 text-gray-500 line-clamp-1 overflow-x-hidden'>{product.tagline}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
