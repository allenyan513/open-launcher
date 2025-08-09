import {Button} from "@repo/ui/button";
import toast from "react-hot-toast";
import React from "react";
import {BsCopy} from "react-icons/bs";

const badgeEmbedCodeHTML = `
<a href="{{endpointUrl}}/products/{{productSlug}}" target="_blank">
<img src="{{endpointUrl}}/api/products/{{productSlug}}/badge.svg?theme={{theme}}&text={{text}}"
  style="width: 180px; height: 54px;"
  width="180"
  height="54" />
</a>
`;
const badgeEmbedCodeReact = `
<a href="{{endpointUrl}}/products/{{productSlug}}" target="_blank">
<img src="{{endpointUrl}}/api/products/{{productSlug}}/badge.svg?theme={{theme}}&text={{text}}"
  style={{ width: '180px', height: '54px' }}/>
</a>
`;

function getBadgeEmbedCode(
  productSlug: string,
  language: 'html' | 'react' = 'html',
  text: 'FEATURED ON' | 'LAUNCHED ON' = 'FEATURED ON',
  theme: 'light' | 'dark' = 'light',
): string {
  return (language === 'react' ? badgeEmbedCodeReact : badgeEmbedCodeHTML)
    .replace(/{{productSlug}}/g, productSlug)
    .replace(/{{endpointUrl}}/g, process.env.NEXT_PUBLIC_ENDPOINT_URL as string)
    .replace(/{{theme}}/g, theme)
    .replace(/{{text}}/g, text)
    .trim();
}

function BadgeItem(props: {
  productSlug: string;
  text: 'FEATURED ON' | 'LAUNCHED ON';
  theme: 'light' | 'dark';
}) {
  const {productSlug, text, theme} = props;
  return (
    <div className="flex flex-col items-center gap-2 border border-gray-300 p-2 rounded-md">
      <div dangerouslySetInnerHTML={{__html: getBadgeEmbedCode(productSlug, 'html', text, theme)}}/>
      <Button
        variant="outline"
        className='w-full'
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(getBadgeEmbedCode(productSlug, 'html', text, theme));
          toast.success('Code copied to clipboard!');
        }}
      >
        <BsCopy/> HTML code
      </Button>
      <Button
        variant="outline"
        className='w-full'
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(getBadgeEmbedCode(productSlug, 'react', text, theme));
          toast.success('Code copied to clipboard!');
        }}
      >
        <BsCopy/> React code
      </Button>
    </div>
  )
}

export function ProductsSubmitLaunchBadge(props: {
  productSlug: string;
}) {
  const {productSlug} = props;

  return (
    <div
      className="flex flex-col gap-1 text-start my-4 w-full border border-gray-300 p-4 rounded-md">
      <p className='text-2xl font-semibold'>Badges</p>
      <p className="text-sm text-gray-500 mb-4">
        Embed these badges on your website to verify your product.
      </p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <BadgeItem
          productSlug={productSlug}
          text='FEATURED ON'
          theme='light'
          />
        <BadgeItem
          productSlug={productSlug}
          text='FEATURED ON'
          theme='dark'
        />
        <BadgeItem
          productSlug={productSlug}
          text='LAUNCHED ON'
          theme='light'
        />
        <BadgeItem
          productSlug={productSlug}
          text='LAUNCHED ON'
          theme='dark'
        />
      </div>
      <div className="flex flex-col gap-1 text-start mb-4">
        <p>Rules:</p>
        <ul className="text-start list-disc pl-4 text-sm text-gray-500">
          <li>Make sure your website's Domain Rating (DR) is greater than 0</li>
          <li>Embed the badge on your website to verify your product</li>
          <li>Maintain the badge and ensure it is visible, we will check it periodically</li>
        </ul>
      </div>
    </div>
  )
}
