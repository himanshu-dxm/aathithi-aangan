import { property } from './property';

export interface Rating {
  value: string;
  count: number;
}

const fallback: Rating = { value: property.rating, count: property.reviewsCount };
const listingPath = new URL(property.airbnbUrl).pathname.replace(/\/$/, '');

async function fetchAirbnbRating(): Promise<Rating> {
  try {
    const response = await fetch(property.airbnbUrl, {
      headers: { 'Accept-Language': 'en-GB' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (!new URL(response.url).pathname.startsWith(listingPath)) throw new Error(`redirected to ${response.url}`);

    const html = await response.text();
    for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      const { aggregateRating } = JSON.parse(json);
      const value = Number(aggregateRating?.ratingValue);
      const count = Number(aggregateRating?.ratingCount);
      if (value >= 0 && value <= 5 && Number.isInteger(count) && count > 0) {
        const score = Math.round(value * 100) / 100;
        return { value: Number.isInteger(score) ? score.toFixed(1) : String(score), count };
      }
    }
    throw new Error('no AggregateRating found on listing page');
  } catch (error) {
    const reason = error instanceof Error ? (error.cause instanceof Error ? error.cause.message : error.message) : error;
    console.warn(`[rating] Airbnb fetch failed, using fallback ${fallback.value} (${fallback.count}): ${reason}`);
    return fallback;
  }
}

// Fetched once per build; the site is static, so it refreshes on each deploy.
export const rating = await fetchAirbnbRating();
