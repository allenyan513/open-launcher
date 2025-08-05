'use client';

import {use} from "react";
import {ProductsPage} from "@/modules/products/products-page";

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const {lang} = use(props.params);
  return <ProductsPage lang={lang}/>
}
