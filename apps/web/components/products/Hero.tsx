import {useTranslate} from "@/i18n/dictionaries";
import SearchBar from "@/components/products/SearchBar";
import {api} from "@repo/shared";

export default async function Hero(props: {
  lang: string;
}) {
  const t = await useTranslate(props.lang);
  const productResponse = await api.products.findAll({
    page: 1,
    pageSize: 12,
  })
  const productCategories = await api.productCategories.findList({
    page: 1,
    pageSize: 12,
  })
  return (
    <>
      <div className='flex flex-col items-center justify-center gap-4 px-4 pt-24 pb-8'>
        <h1 className='text-xl lg:text-5xl font-semibold text-center'>{t("Discover The Best AI Websites & Tools")}</h1>
        <p className='text-center text-sm md:text-md'>
          {t("{{key0}} AIs and {{key1}} categories in the best AI tools directory. AI tools list & GPTs store are updated daily by ChatGPT.", {
            key0: productResponse.meta.total.toString() || '0',
            key1: productCategories.meta.total.toString() || '0',
          })}
        </p>
        <SearchBar
          className='mt-4'
          lang={props.lang}/>
      </div>
    </>
  );
}
