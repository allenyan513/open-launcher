import {ProductListItemView} from '@/modules/products/products-launches-item';
import {Button} from '@repo/ui/button';
import {cn} from '@repo/ui/lib/utils';
import {api} from '@repo/shared';
import {useTranslate} from "@/i18n/dictionaries";
import getSession from "@/actions/getSession";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";

export async function ProductLaunchesPage(props: {
  lang: string;
}) {
  const {lang,} = props;
  const t = await useTranslate(lang)
  const todayProducts = await api.products.findLaunches({
    page: 1,
    pageSize: 30,
    launchesType: 'today'
  });
  const weekProducts = await api.products.findLaunches({
    page: 1,
    pageSize: 5,
    launchesType: 'week'
  });
  const monthProducts = await api.products.findLaunches({
    page: 1,
    pageSize: 5,
    launchesType: 'month'
  });
  const session = await getSession()

  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12'>
      <div className="flex flex-col gap-4 md:col-span-8">
        <h2 className="text-xl md:text-3xl font-bold px-4 pb-4">
          {t('Top Products Launching Today')}
        </h2>
        <div className="flex flex-col items-center">
          {todayProducts?.items?.map((product, index) => (
            <ProductListItemView
              key={product.id}
              lang={lang}
              index={index}
              product={product}
              isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
            />
          ))}
          <Button className={cn('max-w-md mt-8')} variant="outline">
            Load More
          </Button>
        </div>
        <h2 className="text-xl md:text-3xl font-bold px-4 pb-4">
          {t('Last Week\'s Top Products')}
        </h2>
        <div className="flex flex-col items-center">
          {weekProducts?.items?.map((product, index) => (
            <ProductListItemView
              key={product.id}
              lang={lang}
              index={index}
              product={product}
              isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
            />
          ))}
          <Button className={cn('max-w-md mt-8')} variant="outline">
            Load More
          </Button>
        </div>
        <h2 className="text-xl md:text-3xl font-bold px-4 pb-4">
          {t('Last Month\'s Top Products')}
        </h2>
        <div className="flex flex-col items-center">
          {monthProducts?.items?.map((product, index) => (
            <ProductListItemView
              key={product.id}
              lang={lang}
              index={index}
              product={product}
              isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
            />
          ))}
          <Button className={cn('max-w-md mt-8')} variant="outline">
            Load More
          </Button>
        </div>
      </div>
      <div className='md:col-span-4 px-4'>
        <FeaturedProductsView lang={lang}/>
      </div>
    </div>

  );
}
