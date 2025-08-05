'use client'
import {api} from "@repo/shared";
import {redirect} from "next/navigation";
import {use, useEffect} from "react";


export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const {lang, productId} = use(props.params);
  useEffect(() => {
    api.products.findOne(productId).then((product) => {
      if (!product) {
        return redirect(`/dashboard/products`);
      } else {
        return redirect(`/dashboard/products/${productId}/info`);
      }
    });
  }, [productId]);
  return null;
}
