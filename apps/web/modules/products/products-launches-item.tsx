import Link from 'next/link';
import {ProductEntity} from '@repo/shared/types';
import {BsCaretUp, BsCaretUpFill, BsTag} from 'react-icons/bs';
import {getStrapiMedia} from "@/utils";
import {ProductVoteButton} from "@/modules/products/products-launches-item-vote-button";

export function ProductListItemView(props: {
  lang: string
  index: number;
  product: ProductEntity;
  isVoted: boolean;
}) {
  const {lang,index, product , isVoted} = props;
  return (
    <Link
      href={`/${lang}/products/${product.slug}`}
      className="w-full flex flex-row flex-grow gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    >
      {product.icon ? (
        <img
          className="w-12 h-12 rounded"
          src={getStrapiMedia(product.icon)}
          alt={product.name}
        />
      ) : (
        <div className="w-12 h-12 bg-black text-white rounded flex items-center justify-center">
          {product?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-row flex-1 justify-between items-center w-full">
        <div className="flex flex-col items-start gap-1">
          <p className="line-clamp-1 text-lg font-semibold text-black">
            {index + 1}. {product.name ? product.name : 'YOUR PRODUCT NAME'}
          </p>
          <p className="text-md text-gray-500 line-clamp-2 whitespace-break-spaces overflow-x-hidden">
            {product.tagline ? product.tagline : 'YOUR PRODUCT DESCRIPTION'}
          </p>
          <div className="flex flex-row flex-wrap gap-2 items-center text-gray-500 text-sm">
            <BsTag/>
            {product.productCategories && product.productCategories.length > 0 ? (
              product.productCategories
                .slice(0, 3)
                .map((item, index) => (
                <span key={index}>
                  {item.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No tags available</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm">
        </div>
      </div>
      <div>
        <ProductVoteButton
          productId={product.id || ''}
          voteCount={product.voteCount || 0}
          isVoted={isVoted}
        />
      </div>
    </Link>
  );
}
