import Link from "next/link";
import type {Metadata} from "next";
import {useTranslate} from "@/i18n/dictionaries";
import {i18n} from "@/config/i18n-config";
import {api, PRODUCT_CATEGORY_GROUP} from "@repo/shared";

export async function generateMetadata(props: {
  params: Promise<{
    lang: string
  }>
}): Promise<Metadata> {
  const {lang} = await props.params;
  const t = await useTranslate(lang);
  return {
    title: t('All Categories AI Tools & Websites'),
    description: t('Find the best AI tools and websites by categories'),
  };
}

export async function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_SKIP_SSG === 'true') {
    return []
  }
  return i18n.locales.map((lang) => {
    return {
      lang: lang
    }
  })
}

export default async function ProductCategoriesPage(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  const t = await useTranslate(lang)
  const tree = await api.productCategories.findTree()
  const categoryCount = tree.reduce((acc, group) => acc + (group?.children?.length || 0), 0)

  return (
    <>
      <div className='flex flex-col w-full justify-center items-center gap-4 text-center pt-24 pb-8 px-4'>
        <h1 className='text-xl md:text-5xl font-bold'>{t("Find Best Products By Categories")}</h1>
        <p>{t("Over {countCategory} categories to find Best websites and tools", {countCategory: categoryCount})}</p>
      </div>
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
            <div key={item.name}>
              <h3
                id={item.name}
                className="text-2xl font-bold mb-4">
                {t(item.text || '')}
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {
                  tree.find((group) => group.name === item.name)?.children &&
                  tree.find((group) => group.name === item.name)?.children?.map((category) => (
                    <Link
                      key={category.text}
                      href={`/${lang}/category/${category.name}`}
                      className='flex flex-row items-start px-4 py-2 border border-gray-300 rounded-lg shadow sm hover:shadow-lg transition-shadow duration-300'>
                      <span className="text-lg">{t(category.text || '')}</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
