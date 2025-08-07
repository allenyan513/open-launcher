import {Button} from '@repo/ui/button';
import React, {useState} from 'react';
import {Input} from "@repo/ui/input";

const supportedSites = {
  reddit: 'reddit.com',
  twitter: 'twitter.com',
  x: 'x.com',
  facebook: 'facebook.com',
  instagram: 'instagram.com',
  youtube: 'youtube.com',
  tiktok: 'tiktok.com',
  github: 'github.com',
  linkedin: 'linkedin.com',
};

type SocialLinks = string[]

export function SocialLinkInput(props: {
  value: SocialLinks;
  onChange: (links: SocialLinks) => void;
}) {
  const {value, onChange} = props;
  const [urlInput, setUrlInput] = useState('');

  const handleUrlSubmit = (e: any) => {
    try {
      e.preventDefault();
      const parsedUrl = new URL(urlInput);
      const hostname = parsedUrl.hostname.replace('www.', '');
      const matchedSite = Object.entries(supportedSites).find(([key, domain]) =>
        hostname.includes(domain)
      );
      if (matchedSite) {
        setUrlInput('');
        const newLinks = [...value, urlInput];
        onChange(newLinks);
      } else {
        alert('Unsupported URL. Please enter a social media URL.');
      }
    } catch (err) {
      alert('Invalid URL format.');
    }
  };

  return (
    <div className="">
      <div className="flex flex-row items-center gap-2">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter a social media link..."
        />
        <Button
          type='button'
          onClick={handleUrlSubmit}
          variant="default">
          +
        </Button>
      </div>

      <div className="mt-2">
        {value.map((item, index) => (
          <div key={item} className="flex items-center gap-1">
            <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {item}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
