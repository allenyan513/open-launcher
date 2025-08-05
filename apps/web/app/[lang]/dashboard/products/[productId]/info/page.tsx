'use client';

import {use} from "react";
import {ProductsSubmitInfo} from "@/modules/products/products-submit-info";

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const {lang, productId} = use(props.params);
  return <ProductsSubmitInfo lang={lang} productId={productId}/>
}
