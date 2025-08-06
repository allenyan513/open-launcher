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
import {notFound} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@repo/ui/avatar";
import {LinkDoFollow} from "@repo/ui/link-dofollow"
import {websiteConfig} from "@/config/website";


export async function generateMetadata(props: {
  params: Promise<{
    lang: string
    slug: string
  }>
}): Promise<Metadata | null> {
  const {lang, slug} = await props.params
  const product = await api.products.findOne(slug)
  if (!product) {
    return null
  }
  const name = product.name;
  const tagline = product?.productContents?.find((content) => content.language === lang)?.tagline || product.tagline || '';
  const description = product?.productContents?.find((content) => content.language === lang)?.description || product.description || '';

  return {
    title: `${name}: ${tagline} | ${websiteConfig.websiteName}`,
    description: `${description}`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/${lang}/products/${slug}`,
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
    notFound()
  }

  const name = product.name;
  const tagline = product?.productContents?.find((content) => content.language === lang)?.tagline || product.tagline || '';
  const description = product?.productContents?.find((content) => content.language === lang)?.description || product.description || '';
  const longDescription = product?.productContents?.find((content) => content.language === lang)?.longDescription || product.longDescription || '';
  const features = product?.productContents?.find((content) => content.language === lang)?.features || product.features || '';
  const useCase = product?.productContents?.find((content) => content.language === lang)?.useCase || product.useCase || '';
  const howToUse = product?.productContents?.find((content) => content.language === lang)?.howToUse || product.howToUse || '';
  const faq = product?.productContents?.find((content) => content.language === lang)?.faq || product.faq || '';


  const mainProductCategory = product.productCategories ? product.productCategories[0] : null
  const breadCrumbData: BreadCrumbProps = {
    data: [
      {
        name: 'Home',
        url: `/${lang}`
      },
      {
        name: 'Products',
        url: `/${lang}/products`
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
    notFound()
  }
  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12 px-4'>
      <div className='md:col-span-9 flex flex-col gap-4'>
        <BreadCrumb data={breadCrumbData.data}/>
        {/*header*/}
        <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            {product.icon && (
              <img
                className="w-18 h-18 rounded object-cover aspect-video "
                src={getStrapiMedia(product.icon)}
                alt={product.name}
              />
            )}
            {/*Name Tagline Rating*/}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {product.name}
              </h1>
              <h2 className="text-gray-500 line-clamp-1 max-w-lg">
                {tagline}
              </h2>
            </div>
          </div>

          {/*  Actions*/}
          <div className="flex flex-row items-center gap-2 text-sm">
            <LinkDoFollow
              className="rounded-md bg-white text-black px-3 py-2 inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
              href={product.url || '#'}
              isDoFollow={product.status === 'approved'}
              isExternal={true}
              refName={websiteConfig.websiteName}
            >
              <span>Visit Website</span>
            </LinkDoFollow>
          </div>
        </div>
        {/*Tags*/}
        <div className="flex flex-row flex-wrap gap-2">
          {product.productCategories && product.productCategories.length > 0 ? (
            product.productCategories.map((item, index) => (
              <Link
                key={index}
                href={`/category/${item.slug}`}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))
          ) : (
            <span className="text-gray-500">No tags available</span>
          )}
        </div>
        {/*Description*/}
        <p className="text-gray-700 text-md">
          {description || 'No description available for this product.'}
        </p>
        {/*ScreenShots*/}
        {product.screenshots && product.screenshots.length > 0 && (
          <div className="flex flex-row gap-4 overflow-x-auto">
            {product.screenshots.map((screenshot, index) => {
              if (!screenshot) {
                return null;
              }
              return (
                <Link
                  key={index}
                  href={screenshot}
                  target="_blank"
                  className="flex-shrink-0"
                >
                  <img
                    className="rounded w-auto h-48 border object-cover"
                    src={getStrapiMedia(screenshot)}
                    alt={`Screenshot ${index + 1}`}
                  />
                </Link>
              );
            })}
          </div>
        )}

        <div>
          <p className='h2'>{product.name} {t('ProductInformation')}</p>
          <div className='flex flex-col rounded border border-gray-300 px-5 py-4 gap-2 bg-white'>
            <h2 className='h3'>{`What is ${product.name}`}</h2>
            <RichText data={{
              body: longDescription,
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{`How to use ${product.name}`}</h2>
            <RichText data={{
              body: howToUse,
            }}/>
            <div className='divider'/>

            <h2 className='h3'>{`Core features of ${product.name}`}</h2>
            <RichText data={{
              body: features,
            }}/>
            <div className='divider'/>

            {/*Use Cases*/}
            <h2 className='h3'>{`Use Cases of ${product.name}`}</h2>
            <RichText data={{
              body: useCase,
            }}/>
            <div className='divider'/>
            {/*FAQs*/}
            <h2 className='h3'>{`FAQ from ${product.name}`}</h2>
            <RichText data={{
              body: faq,
            }}/>
            <div className='divider'/>
            <ProductUrlView productName={product.name || ''} urlName={'Reddit'} url={product.redditUrl || ''}/>
            <ProductUrlView productName={product.name || ''} urlName={'YouTube'} url={product.youtubeUrl || ''}/>
            <ProductUrlView productName={product.name || ''} urlName={'Twitter'} url={product.twitterUrl || ''}/>
            {/*<ProductUrlView productName={product.name} urlName={'Pricing'} url={product.pricingUrl}/>*/}
            {/*<ProductUrlView productName={product.name} urlName={'Discord'} url={product.discordUrl}/>*/}
            {/*<ProductUrlView productName={product.name} urlName={'LinkedIn'} url={product.linkedinUrl}/>*/}
          </div>
          {/*Alternatives*/}
          <h2 className='h2 my-8'>{`Alternative Of ${product.name}`}</h2>
          <ProductListView
            lang={lang}
            data={relativeProducts?.items}/>
        </div>

      </div>
      <div className='md:col-span-3 flex flex-col gap-12'>
        <div className={'text-sm text-gray-500 gap-4 flex flex-col'}>
          <p>PUBLISHER</p>
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="h-8 w-8 rounded-full grayscale">
              <AvatarImage src={product.user?.avatarUrl} alt={product.user?.name}/>
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <span className="text-gray-900">{product.user?.name}</span>
          </div>
          <div className="flex flex-row gap-2 items-center ">
            <span className="">LAUNCH DATE</span>
            <hr className="border-gray-300 flex-1"/>
            <span className="text-gray-500 uppercase">
            {getFormatData2(product?.createdAt?.toString())}
          </span>
          </div>
        </div>
        <FeaturedProductsView lang={lang}/>
      </div>
    </div>

    // <>
    //   <div className='flex flex-col gap-8 pt-24 pb-12 px-4'>
    //     <BreadCrumb data={breadCrumbData.data}/>
    //     <div className='flex flex-row gap-2 items-center'>
    //       {product.icon && (
    //         <img
    //           className='w-12 h-12 rounded object-cover aspect-video'
    //           src={getStrapiMedia(product.icon)}
    //           alt={product.name}/>
    //       )}
    //       <div className='flex flex-col'>
    //         <h1 className="text-2xl font-semibold">{product.name}</h1>
    //         <h2 className='text-gray-500 line-clamp-1'>{product.tagline}</h2>
    //       </div>
    //     </div>
    //     <div className='flex flex-col lg:flex-row gap-8'>
    //       <div className='w-full lg:w-1/3'>
    //         <Link
    //           href={product?.url || ''}
    //           target='_blank'>
    //           <img
    //             className='rounded object-cover aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300'
    //             src={getStrapiMedia(product.screenshots?.[0] || '')}
    //             alt={product.name}
    //           />
    //         </Link>
    //       </div>
    //       <div className='flex-1 flex flex-col gap-3 justify-start items-start'>
    //         <Link
    //           className=' inline-flex items-center bg-black text-white px-3 py-2 rounded gap-2 '
    //           href={product.url || ''}
    //           target='_blank'>
    //           <span>{t('Visit')} {product.name}</span>
    //           <BsBoxArrowUp/>
    //         </Link>
    //         <div className='flex flex-row items-center gap-4'>
    //           <p className='w-36 font-semibold'>{t('AddedOn')}:</p>
    //           <p className=''>{getFormatData2(product?.createdAt?.toString())}</p>
    //         </div>
    //
    //         <div className='flex flex-row items-center gap-4'>
    //           <p className='w-36 font-semibold'>{t('MonthlyVisitors')}:</p>
    //           <p className=''>{formatMonthlyVisit(0)}</p>
    //         </div>
    //
    //         <p className='w-32 font-semibold'>{t('Categories')}:</p>
    //         <div className='flex flex-row flex-wrap gap-2'>
    //           {product.productCategories && product.productCategories.map((category: any) => (
    //             <Link
    //               key={category.id}
    //               href={`/${lang}/category/${category?.slug}`}
    //               className='border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors duration-200'>
    //               {category.name}
    //             </Link>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
}
