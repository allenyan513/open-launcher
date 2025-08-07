'use client';
import Link from "next/link";
import {buttonVariants} from "@repo/ui/button";
import {useState} from "react";

export function ProductSubmitSEOPageForm({lang}: { lang: string }) {
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');

  return (
    <form className="flex flex-col gap-4 w-full border p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium mb-1">
          Product Name
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border rounded-md"
          placeholder="e.g., ChatGPT Prompt Generator"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Product URL
        </label>
        <input
          type="url"
          required
          className="w-full px-4 py-2 border rounded-md"
          placeholder="https://example.com"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
        />
      </div>
      <Link
        href={`/${lang}/dashboard/submit?productName=${encodeURIComponent(productName)}&productUrl=${encodeURIComponent(productUrl)}`}
        className={buttonVariants({
          variant: 'default',
          size: 'lg',
          className: 'w-full'
        })}
      >
        Submit
      </Link>
    </form>
  );
}
