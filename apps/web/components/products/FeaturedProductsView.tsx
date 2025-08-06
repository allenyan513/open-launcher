import {useTranslate} from "@/i18n/dictionaries";
import ProductCompatListView from "@/components/products/ProductCompactListView";
import {api} from "@repo/shared";

export default async function FeaturedProductsView(props: {
  className?: string,
  lang: string,
}) {
  const {lang} = props;
  const t = await useTranslate(lang)
  const featuredProducts = await api.products.findAll({
    page: 1,
    pageSize: 10,
    status: ['approved'],
    orderBy: {
      field: 'featured',
      direction: 'desc'
    }
  })
  //random
  featuredProducts.items.sort(() => Math.random() - 0.5);

  return (
    <div className={props.className}>
      <h2 className={'h2'}>{t('Featured')}</h2>
      <ProductCompatListView
        lang={props.lang}
        data={featuredProducts.items} style={'list'}/>
    </div>
  )
}
