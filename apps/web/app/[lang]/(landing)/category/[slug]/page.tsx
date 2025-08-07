import ProductListView from "@/components/products/ProductListView";
import type {Metadata} from "next";
import BreadCrumb, {BreadCrumbProps} from "@/components/products/BreadCrumb";
import ProductCategoryInformationView from "@/components/products/ProductCategoryInformationView";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {useTranslate} from "@/i18n/dictionaries";
import {api, ProductEntity} from "@repo/shared";
import { notFound } from "next/navigation";


export async function generateMetadata(props: {
  params: Promise<{
    slug: string
    lang: string
  }>
}): Promise<Metadata> {
  const {lang, slug} = await props.params;
  const staticData = await fetchStaticData(lang, slug);
  return {
    title: staticData.title,
    description: staticData.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${lang}/category/${slug}`,
    }
  };
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_SSG === 'true') {
    return []
  }
  const allSlugs = await api.productCategories.findAllSlug();
  const staticLangs = ['en']
  const result =  staticLangs.map((lang) => {
    return allSlugs.map((slug) => ({
      lang: lang,
      slug: slug
    }))
  })
  return result.flat()
}

async function fetchStaticData(lang: string, slug: string) {
  const topProductResponse = await api.products.findAll({
    page: 1,
    pageSize: 64,
    status: ['approved'],
    productCategorySlug: slug,
  })

  const top10ListNames =
    topProductResponse.items.map((item: any) => item.name).slice(0, 10)
      .join(', ')
  const productCategory = await api.productCategories.findOne(slug)
  const latestProducts = await api.products.findAll({
    page: 1,
    pageSize: 3,
    status: ['approved'],
    orderBy: [{
      field: 'createdAt',
      direction: 'desc',
    }],
    productCategorySlug: slug,
  })

  return {
    title: `Best ${topProductResponse.meta.total} ${productCategory.name} AI Tools & Websites in ${new Date().getFullYear()}`,
    description: `Best ${topProductResponse.meta.total} ${productCategory.name} AI Tools & Websites are: ${top10ListNames}.`,
    top10ListNames: top10ListNames,
    products: topProductResponse.items as ProductEntity[],
    productCategory: productCategory,
    latestProducts: latestProducts.items as ProductEntity[],
  }
}


export default async function ProductCategoryListPage(props: {
  params: Promise<{
    lang: string,
    slug: string,
  }>
}) {
  const {lang, slug} = await props.params;
  const t = await useTranslate(lang);
  const staticData = await fetchStaticData(lang, slug);
  const breadCrumbData = [
    {
      name: `${t('Home')}`,
      url: `/${lang}`
    },
    {
      name: `${t('Category')}`,
      url: `/${lang}/category`
    },
    {
      name: `${t(staticData.productCategory.name || '')}`,
      url: `/${lang}/category/${staticData.productCategory.slug}`
    }
  ]

  if(!staticData.products || staticData.products.length === 0) {
    notFound();
  }

  return (
    <>
      <div className='flex flex-col gap-8 pt-24 pb-12 px-4'>
        <BreadCrumb data={breadCrumbData}/>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-xl md:text-5xl font-semibold text-center'>
            {staticData.title}
          </h1>
          <p>{staticData.top10ListNames}</p>
        </div>
      </div>

      <div className='flex flex-col md:grid md:grid-cols-12 gap-8 px-4'>
        <div className='flex flex-col md:col-span-9'>
          <ProductListView
            className={'md:grid-cols-3'}
            lang={lang}
            data={staticData.products}/>
          <ProductCategoryInformationView
            className={'my-8'}
            lang={lang}
            productCategory={staticData.productCategory}
            topProducts={staticData.products}
            latestProducts={staticData.latestProducts}/>
        </div>
        <FeaturedProductsView
          className={'w-full md:col-span-3'}
          lang={lang}/>
      </div>
    </>
  );
}
