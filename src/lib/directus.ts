import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN;
const SITE_SLUG = import.meta.env.SITE_SLUG;


export const directus = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

export async function getSiteData() {
  try {
    const response = await directus.request(
      readItems('Sites' as any, {
        filter: { slug: { _eq: SITE_SLUG } },
        limit: 1,
      })
    );
    return response[0] || null;
  } catch (error) {
    console.error("❌ Erreur Directus (getSiteData):", error);
    return null;
  }
}

export async function getProjects(options: any = {}) {
  try {
    return await directus.request(
      readItems('projects', {
        ...options,
        filter: {
          ...options.filter,
          site: { slug: { _eq: SITE_SLUG } }
        },
        fields: options.fields || ['*', 'cover.*']
      })
    );
  } catch (error) {
    console.error("❌ Erreur Directus (getProjects):", error);
    return [];
  }
}

export async function getFromCMS(collection: string, options = {}) {
  try {
    return await directus.request(readItems(collection as any, options));
  } catch (error) {
    console.error(`❌ Erreur Directus (${collection}):`, error);
    return [];
  }
}