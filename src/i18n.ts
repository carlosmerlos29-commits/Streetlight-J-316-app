import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!['en', 'es'].includes(locale as any)) {
      // Handle invalid locale, maybe redirect or use a default
      // For now, we'll just load English
      locale = 'en';
  }
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});