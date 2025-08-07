export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh', 'ja', 'ko', 'pt', 'es', 'de', 'fr', 'vi'],
} as const;

export const i18nMetadata = i18n.locales.map((lang) => {
  return {
    lang: lang,
  };
});

export const i18nLanguages = [
  {
    name: 'English',
    url: '/',
    code: 'en',
  },
  {
    name: 'Español',
    url: '/es',
    code: 'es',
  },
  {
    name: 'Français',
    url: '/fr',
    code: 'fr',
  },
  {
    name: 'Português',
    url: '/pt',
    code: 'pt',
  },
  {
    name: 'Deutsch',
    url: '/de',
    code: 'de',
  },
  {
    name: '日本語',
    url: '/ja',
    code: 'ja',
  },
  {
    name: '简体中文',
    url: '/zh',
    code: 'zh',
  },
  {
    name: '한국어',
    url: '/ko',
    code: 'ko',
  },
  {
    name: 'Tiếng Việt',
    url: '/vi',
    code: 'vi',
  },
];

export type Locale = (typeof i18n)['locales'][number];
