import Link from "next/link";
import {ProductEntity} from "@repo/shared";
import clsx from "clsx";
import {getStrapiMedia} from "@/utils";


export default function ProductCompatListView(props: {
  lang: string
  data: ProductEntity[]
  style?: 'grid' | 'list'
}) {
  if (!props || !props.data || props.data.length === 0) {
    return null
  }

  function cn(arg0: string): string | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={
      props.style === 'list' ? `flex flex-col gap-4 ` : `grid grid-cols-2 md:grid-cols-4 gap-4`}>
      {props.data.map((item: ProductEntity, index: number) => (
        <Link
          key={index}
          target={item.featured ? '_blank' : '_self'}
          href={`/${props.lang}/products/${item.slug}`}
          className={clsx('flex flex-col border border-gray-300 rounded px-4 py-3 gap-2 justify-start items-start shadow-sm hover:shadow-lg transition-shadow duration-300',
            item.featured ? 'border-amber-400' : '',
          )}>
          <div className='flex flex-row gap-2 items-center'>
            {item.icon ? (
              <img
                className='w-5 h-5 rounded-full object-cover'
                src={getStrapiMedia(item.icon)}
                alt={item.name}/>
            ) : (
              <div>
                <p
                  className='w-6 h-6 rounded-full bg-black text-white text-center'>{item?.name?.charAt(0).toUpperCase()}</p>
              </div>
            )}
            <p className="text-lg font-semibold line-clamp-1">{item.name}</p>
          </div>
          <p className='text-gray-400 text-sm line-clamp-2 whitespace-break-spaces'>{item.tagline}</p>
        </Link>
      ))}
    </div>
  );
}
