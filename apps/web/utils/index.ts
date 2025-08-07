import {cookies} from "next/headers";
import {AuthFetchOptions} from "@repo/shared/api-client";

export function getStrapiMedia(url: string | null | undefined): string {
  if (url == null) {
    return '';
  }
  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    if (url.startsWith('https://patient-feast-bceee20761.media.strapiapp.com')) {
      return url.replace('https://patient-feast-bceee20761.media.strapiapp.com', 'https://s3.us-east-2.amazonaws.com/strapi.ff2050.com');
    }
    return url;
  }
  return '';
}

export function formatMonthlyVisit(visit: number) {
  if (!visit) {
    return 'Unknown'
  }
  if (visit > 1000000) {
    return `${(visit / 1000000).toFixed(1)}M`
  } else if (visit > 1000) {
    return `${(visit / 1000).toFixed(1)}K`
  } else {
    return visit.toString()
  }
}

export function getFormatData2(dateTime: string | undefined) {
  if (!dateTime) {
    return '';
  }
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(dateTime).toLocaleDateString('en-US', options);
}


export function getLetterFromDate(date = new Date()) {
  const day = date.getDate(); // 获取当前日
  const offset = (day - 1) % 25; // 从0开始的偏移，确保在0到24之间循环
  return String.fromCharCode(97 + offset); // 97 是 'a' 的 ASCII 码
}

export async function generateAuthFetchOptions(): Promise<AuthFetchOptions> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;
  return {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  } as AuthFetchOptions;
}

