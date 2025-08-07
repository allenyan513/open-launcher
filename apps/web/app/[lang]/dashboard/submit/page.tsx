'use client';

import {use} from "react";
import {ProductsPage} from "@/modules/products/products-page";
import {ProductSubmitPage} from "@/modules/products/products-submit-page";

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    productUrl?: string;
    productName?: string;
  }>
}) {
  const {lang} = use(props.params);
  const {productUrl, productName} = use(props.searchParams);
  return <ProductSubmitPage
    lang={lang}
    productUrl={productUrl}
    productName={productName}
  />
}
