import * as crypto from 'crypto';

export function filterUrl(url: string, limit = 254) {
  if (url.length > limit) {
    return '';
  }
  return url;
}

export function completeUrl(url: string, path: string) {
  if (path.startsWith('http')) {
    return path;
  }
  if (url.endsWith('/')) {
    return url + path;
  } else {
    return url + '/' + path;
  }
}

export function formatArrayStringToMarkdown(arr: string[]) {
  if (!arr || arr.length === 0) {
    return '';
  }
  return arr.map((feature) => `- ${feature}`).join('\n');
}

export function formatNameDescriptionArrayToMarkdown(
  array: { name: string; description: string }[],
) {
  if (!array || array.length === 0) {
    return '';
  }
  return array
    .map((item) => `- **${item.name}**: ${item.description}`)
    .join('\n');
}
export function hash(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function generateIdToken(): string {
  return crypto.randomBytes(16).toString('hex');
}


export function getLetterFromDate(date = new Date()) {
  const day = date.getDate(); // 获取当前日
  const offset = (day - 1) % 25; // 从0开始的偏移，确保在0到24之间循环
  return String.fromCharCode(97 + offset); // 97 是 'a' 的 ASCII 码
}


export function getFormatH1Date(date: Date) {
  const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
  return date.toLocaleDateString('en-US', options);
}

export function getFormatData2(dateTime: string) {
  const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(dateTime).toLocaleDateString('en-US', options);
}
