import Link from "next/link";
import clsx from "clsx";
import {ProductEntity} from "@repo/shared";
import {getStrapiMedia} from "@/utils";


export default function ProductListView(props: {
  className?: string,
  lang: string,
  data: any
}) {
  if (!props.data || props.data.length === 0) {
    return null
  }
  return (
    <>
      <div className={clsx(props.className, 'grid grid-cols-1 md:grid-cols-4 gap-4')}>
        {props.data.map((item: ProductEntity, index: number) => (
          <Link
            key={index}
            target={item.featured ? '_blank' : '_self'}
            href={`/${props.lang}/products/${item.slug}`}
            className={clsx('flex flex-col gap-1 border border-gray-300 rounded shadow-sm hover:shadow-lg transition-shadow duration-300',
              item.featured ? 'border-amber-400' : '',
            )}>
            <div className='relative'>
              {item.screenshots && item.screenshots.length > 0 && (
                <img
                  className='w-full rounded-t object-cover aspect-video'
                  src={getStrapiMedia(item.screenshots[0])}
                  alt={item.name}/>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className='px-4 pt-2 pb-3 flex flex-col gap-1'>
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
              <p className='line-clamp-2 text-gray-400 text-sm'>{item.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
