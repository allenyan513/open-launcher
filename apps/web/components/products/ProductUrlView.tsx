import Link from "next/link";

interface ProductUrlViewProps {
  productName: string
  urlName: string
  url: string
}

export default async function ProductUrlView(props: ProductUrlViewProps) {
  if (!props.url || props.url.length === 0) {
    return null
  }
  return (
    <div>
      <h2 className='text-[1.5rem] font-bold mb-4'>{props.productName} {props.urlName}</h2>
      <Link
        className='text-blue-500'
        href={props.url}
        target='_blank'>
        {props.url}
      </Link>
    </div>
  )
}
