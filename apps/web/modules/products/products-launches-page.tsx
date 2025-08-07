import {ProductListItemView} from '@/modules/products/products-launches-item';
import {Button} from '@repo/ui/button';
import {cn} from '@repo/ui/lib/utils';
import {api} from '@repo/shared';
import {useTranslate} from "@/i18n/dictionaries";
import {notFound} from "next/navigation";
import getSession from "@/actions/getSession";

export async function ProductLaunchesPage(props: {
  lang: string;
}) {
  const {lang,} = props;
  const t = await useTranslate(lang)
  const products = await api.products.findToday({
    page: 1,
    pageSize: 20,
  });
  const session = await getSession()
  console.log('products', products);
  if (!products || !products.items || products.items.length === 0) {
    notFound()
  }

  return (
    <>
      <h2 className="text-xl md:text-3xl font-bold px-4 pb-4">
        {t('Top Products Launching Today')}
      </h2>
      <div className="flex flex-col items-center">
        {products && products.items.map((product, index) => (
          <ProductListItemView
            key={product.id}
            index={index}
            product={product}
            isVoted={session?.productVotes?.some(vote => vote.productId === product.id) || false}
          />
        ))}

        <Button
          className={cn('max-w-md mt-8')}
          variant="outline"
        >
          Load More
        </Button>
      </div>
    </>
  );
}
