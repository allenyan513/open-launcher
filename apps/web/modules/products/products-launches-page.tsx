import {ProductListItemView} from '@/modules/products/products-launches-item';
import {Button} from '@repo/ui/button';
import {api, ProductLaunchesType} from '@repo/shared';
import {useTranslate} from "@/i18n/dictionaries";
import getSession from "@/actions/getSession";
import FeaturedProductsView from "@/components/products/FeaturedProductsView";

const config = [
  {
    name: ProductLaunchesType.today,
    pageSize: 30,
    title: 'Top Products Launching Today',
  },
  {
    name: ProductLaunchesType.yesterday,
    pageSize: 20,
    title: 'Yesterday\'s Top Products',
  },
  {
    name: ProductLaunchesType.thedaybeforeyesterday,
    pageSize: 10,
    title: 'The Day Before Yesterday\'s Top Products',
  },
  {
    name: ProductLaunchesType.last7days,
    pageSize: 5,
    title: 'Last Week\'s Top Products',
  },
  {
    name: ProductLaunchesType.last30days,
    pageSize: 5,
    title: 'Last Month\'s Top Products',
  },
];

export async function ProductLaunchesPage(props: {
  lang: string;
}) {
  const {lang,} = props;
  const t = await useTranslate(lang)
  const results = await Promise.all(
    config.map(async (item) => {
      return await api.products.findLaunches({
        page: 1,
        pageSize: item.pageSize,
        launchesType: item.name
      });
    })
  );
  const session = await getSession()
  return (
    <div className='flex flex-col md:grid md:grid-cols-12 gap-8 pt-24 pb-12'>
      <div className="flex flex-col gap-4 md:col-span-8">
        {results.map((result, index) => (
          <div key={index}>
            <h2 className="text-xl md:text-3xl font-bold px-4 pb-4">
              {config?.[index]?.title}
            </h2>
            <div className="flex flex-col items-center">
              {result?.items?.map((product, index) => (
                <ProductListItemView
                  key={product.id}
                  lang={lang}
                  index={index}
                  product={product}
                  isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
                />
              ))}
              <Button className={'w-full mt-4 mb-8'} variant="outline">
                View all
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className='md:col-span-4 px-4'>
        <FeaturedProductsView lang={lang}/>
      </div>
    </div>

  );
}
