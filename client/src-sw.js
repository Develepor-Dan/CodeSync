import { warmStrategyCache } from 'workbox-recipes';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';

// Precache and route all assets defined in the workbox manifest
precacheAndRoute(self.__WB_MANIFEST);

// Setup page cache
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

// Warm the page cache for specific URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Route for navigation requests using the page cache strategy
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      return await pageCache.handle({ event });
    } catch (error) {
      // Handle errors gracefully, e.g., fallback to network or show a custom offline page
      console.error('Error handling navigation request:', error);
      return caches.match('/offline.html');
    }
  }
);

// Set up asset cache
registerRoute(
  ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
