'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col p-8 min-h-screen bg-white items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-green-700 md:text-6xl">
          🎉 Payment Successful!
        </h1>
        <p className="mt-4 text-xl text-gray-700">
          Thank you for your purchase. Your journey begins now!
        </p>
        <p className="mt-2 text-lg text-gray-600">
          You can close this window or return to the{' '}
          <Link href="/apps/web/public" className="text-blue-500 hover:underline">
            reviewsup.io
          </Link>
        </p>
      </div>
    </div>
  );
}
