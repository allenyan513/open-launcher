import FeaturedProductsView from "@/components/products/FeaturedProductsView";
import {ProductLaunchesPage} from "@/modules/products/products-launches-page";

export default async function Page(props: {
  params: Promise<{
    lang: string
  }>
}) {
  const {lang} = await props.params;
  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12'>
      <div className='flex flex-col md:col-span-8'>
        <ProductLaunchesPage
          lang={lang}
          title={'Top Products Launching Today'}
        />
      </div>
      <FeaturedProductsView
        className={'md:col-span-4'}
        lang={lang}/>
    </div>
  );
}
