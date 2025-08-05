'use client';

import React, {use} from 'react';
import {ProductsSubmitPlan} from "@/modules/products/products-submit-plan";

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const {lang, productId} = use(props.params);
  return (
    <ProductsSubmitPlan lang={lang} productId={productId}/>
  );
}
