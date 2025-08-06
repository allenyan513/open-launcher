import Link from "next/link";
import RichText from "@/components/products/RichText";
import BreadCrumb, {BreadCrumbProps} from "@/components/products/BreadCrumb";
import {BsBoxArrowUp} from "react-icons/bs";
import ProductListView from "@/components/products/ProductListView";
import ProductUrlView from "@/components/products/ProductUrlView";
import {Metadata} from "next";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {useTranslate} from "@/i18n/dictionaries";
import {getStrapiMedia, formatMonthlyVisit, getFormatData2} from "@/utils";
import {api} from "@repo/shared";


export async function generateMetadata(props: {
  params: Promise<{
    lang: string
    slug: string
  }>
}): Promise<Metadata | null> {
  const {lang, slug} = await props.params
  const product = await api.products.findOne(slug);
  if (!product) {
    return null
  }
  return {
    title: `${product.name}: ${product.description}`.substring(0, 60),
    description: `${product.name}: ${product.longDescription}.`.substring(0, 160),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/${lang}/products/${slug}`,
    }
  }
}

// export async function generateStaticParams() {
//   return []
// }

export default async function ProductPage(props: {
  params: Promise<{
    lang: string
    slug: string
  }>
}) {
  const {lang, slug} = await props.params
  const t = await useTranslate(lang)
  const product = await api.products.findOne(slug)
  if (!product) {
    return null
  }
  //todo
  const mainProductCategory = product.productCategories ? product.productCategories[0] : null
  const breadCrumbData: BreadCrumbProps = {
    data: [
      {
        name: 'Home',
        url: `/${lang}`
      },
      {
        name: `${mainProductCategory?.name}`,
        url: `/${lang}/category/${mainProductCategory?.slug}`
      },
      {
        name: `${product.name}`,
        url: ``
      }
    ]
  }
  let relativeProducts = null
  if (mainProductCategory) {
    relativeProducts = await api.products.findAll({
      page: 1,
      pageSize: 4,
      productCategoryId: mainProductCategory.id
    })
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <div className='flex flex-col gap-8 pt-24 pb-12 px-4'>
        <BreadCrumb data={breadCrumbData.data}/>
        <div className='flex flex-row gap-2 items-center'>
          {product.icon && (
            <img
              className='w-12 h-12 rounded object-cover aspect-video'
              src={getStrapiMedia(product.icon)}
              alt={product.name}/>
          )}
          <div className='flex flex-col'>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <h2 className='text-gray-500 line-clamp-1'>{product.description}</h2>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/3'>
            <Link
              href={product?.url || ''}
              target='_blank'>
              <img
                className='rounded object-cover aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300'
                src={getStrapiMedia(product.screenshots?.[0] || '')}
                alt={product.name}
              />
            </Link>
          </div>
          <div className='flex-1 flex flex-col gap-3 justify-start items-start'>
            <Link
              className=' inline-flex items-center bg-black text-white px-3 py-2 rounded gap-2 '
              href={product.url || ''}
              target='_blank'>
              <span>{t('Visit')} {product.name}</span>
              <BsBoxArrowUp/>
            </Link>
            <div className='flex flex-row items-center gap-4'>
              <p className='w-36 font-semibold'>{t('AddedOn')}:</p>
              <p className=''>{getFormatData2(product?.createdAt?.toString())}</p>
            </div>

            <div className='flex flex-row items-center gap-4'>
              <p className='w-36 font-semibold'>{t('MonthlyVisitors')}:</p>
              <p className=''>{formatMonthlyVisit(0)}</p>
            </div>

            <p className='w-32 font-semibold'>{t('Categories')}:</p>
            <div className='flex flex-row flex-wrap gap-2'>
              {product.productCategories && product.productCategories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/${lang}/category/${category?.slug}`}
                  className='border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors duration-200'>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col md:grid md:grid-cols-12 gap-8 w-full px-4'>
        <div className='md:col-span-9'>
          {/*Information*/}
          <p className='h2'>{product.name} {t('ProductInformation')}</p>
          <div className='flex flex-col rounded border border-gray-300 px-5 py-4 gap-2 bg-white'>
            <h2 className='h3'>{`What is ${product.name}`}</h2>
            <RichText data={{
              body: product.longDescription || '',
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{`How to use ${product.name}`}</h2>
            <RichText data={{
              body: product.howToUse || '',
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{`Core features of ${product.name}`}</h2>
            <RichText data={{
              body: product.features || '',
            }}/>
            <div className='divider'/>

            {/*Use Cases*/}
            {product.useCase && product.useCase.length > 0 && (
              <>
                <h2 className='h3'>{`Use Cases of ${product.name}`}</h2>
                <RichText data={{
                  body: product.useCase || '',
                }}/>
                <div className='divider'/>
              </>
            )}
            {/*FAQs*/}
            {product.faq && product.faq.length > 0 && (
              <>
                <h2 className='h3'>{`FAQ from ${product.name}`}</h2>
                <RichText data={{
                  body: product.faq || '',
                }}/>
                <div className='divider'/>
              </>
            )}
            {/*<ProductUrlView productName={product.name} urlName={'Pricing'} url={product.pricingUrl}/>*/}
            <ProductUrlView productName={product.name || ''} urlName={'Reddit'} url={product.redditUrl || ''}/>
            {/*<ProductUrlView productName={product.name} urlName={'Discord'} url={product.discordUrl}/>*/}
            <ProductUrlView productName={product.name || ''} urlName={'YouTube'} url={product.youtubeUrl || ''}/>
            <ProductUrlView productName={product.name || ''} urlName={'Twitter'} url={product.twitterUrl || ''}/>
            {/*<ProductUrlView productName={product.name} urlName={'LinkedIn'} url={product.linkedinUrl}/>*/}
          </div>
          {/*Alternatives*/}
          <h2 className='h2 my-8'>{`Alternative Of ${product.name}`}</h2>
          <ProductListView
            lang={lang}
            data={relativeProducts?.items}/>
        </div>
        <FeaturedProductsView
          className='md:col-span-3'
          lang={lang}/>
      </div>
    </>
  );
}
