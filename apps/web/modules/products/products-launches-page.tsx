'use client';
import React, {use, useEffect, useState} from 'react';
import {ProductCategoryEntity, ProductEntity, ProductCategoryGroup} from '@repo/shared/types';
import {ProductListItemView} from '@/modules/products/products-launches-item';
import {Button} from '@repo/ui/button';
import {cn} from '@repo/ui/lib/utils';
import {api} from '@repo/shared';

export function ProductLaunchesPage(props: {
  lang: string;
  title?: string;
  defaultTags?: string[];
}) {
  const {lang, defaultTags = [], title} = props;
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadProducts = async (pageToLoad: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await api.products.findAll({
        page: pageToLoad,
        pageSize: pageSize,
        orderBy: {
          field: 'createdAt',
          direction: 'desc',
        },
        status: ['approved'],
      });
      setProducts((prev) => [...prev, ...response.items]);
      if (response.items.length < pageSize) {
        setHasMore(false); // 没有更多了
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // 初次加载
    loadProducts(1);
  }, [status, pageSize, JSON.stringify(tags)]); // JSON.stringify(tags) 防止 array 依赖不触发

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(nextPage);
  };

  return (
    <>
      <h2 className="text-xl md:text-3xl font-bold px-4">
        {title ? title : 'Top Products'}
      </h2>
      <div className="flex flex-col items-center">
        {products &&
          products.map((product, index) => (
            <ProductListItemView
              key={product.id}
              index={index}
              product={product}
            />
          ))}

        {hasMore && (
          <Button
            className={cn('max-w-md mt-8')}
            variant="outline"
            onClick={handleLoadMore}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
    </>
  );
}
