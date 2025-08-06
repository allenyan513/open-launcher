import {Metadata} from "next";
import {i18n} from "@/config/i18n-config";
import ProductListView from "@/components/products/ProductListView";
import ProductCompatListView from "@/components/products/ProductCompactListView";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import Hero from "@/components/products/Hero";
import ProductTagsView from "@/components/products/ProductTagsView";
import ProductGroupsView from "@/components/products/ProductGroupsView";
import {getLetterFromDate} from "@repo/shared/utils";
import {api} from "@repo/shared";
import {useTranslate} from "@/i18n/dictionaries";

// export const revalidate = 86400;

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
  const productCategories = await api.productCategories.findAll({
    page: 1,
    pageSize: 12,
  })
  return {
    title: t("Discover The Best AI Websites & Tools"),
    description: t("{{key0}} AIs and {{key1}} categories in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.", {
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
  const staticData = await fetchStaticData(lang)
  return (
    <>
      <Hero lang={lang}/>
      <div className='flex flex-col lg:flex-row gap-8 py-8 px-4 '>
        <div className='flex-1 flex flex-col gap-8'>
          <ProductTagsView
            activeTag={"Today"}
            lang={lang}
          />
          <div className='flex flex-col gap-4'>
            <ProductListView
              data={staticData.todayProducts.slice(0, 8)}
              lang={lang}/>
            <ProductCompatListView
              data={staticData.todayProducts.slice(8)}
              lang={lang}
            />
          </div>
          <ProductGroupsView lang={lang}/>
        </div>
        <FeaturedProductsView
          className={'w-full lg:w-1/5'}
          lang={lang}/>
      </div>
    </>
  );
}
