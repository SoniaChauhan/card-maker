'use client';
import App from '@/App';

/**
 * Shared client component for SEO route pages.
 * Renders the full app with a specific card type pre-selected,
 * so each route keeps its clean URL while rendering actual content.
 *
 * @param {{ cardType: string }} props
 */
export default function CardPage({ cardType }) {
  return <App initialCard={cardType} />;
}
