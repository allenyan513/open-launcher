'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar(props: {
  lang: string;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(`/${props.lang}/search/${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={props.className}>
      <div className='flex flex-row w-full justify-center'>
        <input
          type="text"
          placeholder="Search for a product..."
          className='border border-gray-300 rounded-l p-2 md:p-4 w-full md:w-[48em]'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className='bg-blue-500 text-white rounded-r p-2 md:p-4'>Search</button>
      </div>
    </div>
  )
}
