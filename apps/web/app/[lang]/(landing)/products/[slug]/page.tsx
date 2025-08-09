import Link from "next/link";
import BreadCrumb, {BreadCrumbProps} from "@/components/products/BreadCrumb";
import ProductListView from "@/components/products/ProductListView";
import {Metadata} from "next";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {useTranslate} from "@/i18n/dictionaries";
import {getStrapiMedia, getFormatData2,} from "@/utils";
import {api} from "@repo/shared";
import {notFound} from "next/navigation";
import {Avatar, AvatarFallback, AvatarImage} from "@repo/ui/avatar";
import {LinkDoFollow} from "@repo/ui/link-dofollow"
import {websiteConfig} from "@repo/shared";
import {ProductVoteButtonV2} from "@/modules/products/products-launches-item-vote-button-v2";
import getSession from "@/actions/getSession";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from 'rehype-sanitize';


function ProductInformationItem(props: { title: string, content: string }) {
  const {title, content} = props
  if (!content) {
    return null
  }
  return (
    <>
      <h2 className='font-semibold'>{title}</h2>
      <div className='rich-text'>
        <Markdown
          children={content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
        />
      </div>
      <div className='border-t border-gray-300 my-2'></div>
    </>
  )
}

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
  const session = await getSession()
  if (!product) {
    notFound()
  }
  if (product.status !== 'approved') {
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

  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12 px-4'>
      <div className='md:col-span-9 flex flex-col gap-4'>
        <BreadCrumb data={breadCrumbData.data}/>
        {/*header*/}
        <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            {product.icon ? (
              <img
                className="w-12 h-12 rounded"
                src={getStrapiMedia(product.icon)}
                alt={product.name}
              />
            ) : (
              <div className="w-12 h-12 bg-black text-white rounded flex items-center justify-center">
                {product?.name?.charAt(0).toUpperCase()}
              </div>
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
          <LinkDoFollow
            className="h-12 rounded-md text-center bg-white text-black px-4 py-2 inline-flex items-center  justify-center gap-2 border hover:bg-gray-100 transition-colors duration-300"
            href={product.url || '#'}
            isDoFollow={product.status === 'approved'}
            isExternal={true}
            refName={websiteConfig.websiteName}
          >
            Visit Website
          </LinkDoFollow>
        </div>
        {/*Tags*/}
        <div className="flex flex-row flex-wrap gap-2">
          {product.productCategories && product.productCategories.length > 0 ? (
            product.productCategories.map((item, index) => (
              <Link
                key={index}
                href={`/${lang}/category/${item.slug}`}
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

        {/*Information*/}
        <div className='flex flex-col gap-2'>
          {!longDescription && !howToUse && !features && !useCase && !faq ? (
              <p className='text-gray-500'>No additional information available for this product.</p>
            ) :
            <p className='text-xl font-semibold mb-2'>{product.name} Product Information</p>
          }
          <ProductInformationItem
            title={`What is ${product.name} `}
            content={longDescription}
          />
          <ProductInformationItem
            title={`How to use ${product.name}`}
            content={howToUse}
          />
          <ProductInformationItem
            title={`Core features of ${product.name}`}
            content={features}
          />
          <ProductInformationItem
            title={`Use Cases of ${product.name}`}
            content={useCase}
          />
          <ProductInformationItem
            title={`FAQ from ${product.name}`}
            content={faq}
          />
        </div>

        {/*Alternatives*/}
        <div>
          <h2 className='text-xl font-semibold mb-4'>{`Alternative Of ${product.name}`}</h2>
          <ProductListView
            lang={lang}
            data={relativeProducts?.items}/>
        </div>

      </div>
      <div className='md:col-span-3 flex flex-col gap-8'>
        <div className="md:static fixed bottom-0 left-0 w-full z-50 bg-white p-2 md:p-0 md:w-auto">
          <ProductVoteButtonV2
            productId={product.id || ''}
            voteCount={product.voteCount || 0}
            isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
            className="w-full p-2 "
          />
        </div>
        <div className='text-sm text-gray-500 gap-4 flex flex-col'>
          <div className="flex flex-row gap-2 items-center ">
            <p>PUBLISHER</p>
            <hr className="border-gray-300 flex-1"/>
            <div className="flex flex-row gap-2 items-center">
              <Avatar className="h-6 w-6 rounded-full grayscale">
                <AvatarImage src={product.user?.avatarUrl} alt={product.user?.name}/>
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <span className="text-gray-900">{product.user?.name}</span>
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center ">
            <p className="">LAUNCH DATE</p>
            <hr className="border-gray-300 flex-1"/>
            <span className="text-gray-500 uppercase">{getFormatData2(product?.launchDate?.toString())} </span>
          </div>
          <div className="flex flex-col gap-4">
            <p className="uppercase">Social Links</p>
            <div className='flex flex-row gap-2'>
              {product.socialLinks && product.socialLinks.length > 0 && (
                product.socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-5 h-5 rounded-full border border-gray-300"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${link}`}
                      alt={`${link}`}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
        <FeaturedProductsView lang={lang}/>
      </div>
    </div>
  );
}
