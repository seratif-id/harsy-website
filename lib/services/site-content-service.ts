import { readData } from './db';

export async function getSiteContent() {
  const data = await readData();
  return data.siteContent || {};
}
