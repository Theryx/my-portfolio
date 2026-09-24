import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lovingTechBlocks } from './lovingtech-blocks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const m = env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!m) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const sql = neon(m[1]);

const clean = (s) => (s == null ? s : String(s).replace(/[\u2013\u2014]/g, '-'));
const cleanDeep = (v) =>
  typeof v === 'string' ? clean(v)
    : Array.isArray(v) ? v.map(cleanDeep)
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, cleanDeep(x)]))
    : v;

const now = new Date().toISOString();

const entry = {
  id: 'project:lovingtech-cx',
  type: 'project',
  title: 'Loving Tech',
  tags: ['E-commerce · Customer success'],
  is_hidden: false,
  sort_order: 0,
  content: '',
  metadata: {
    tag: 'E-commerce · Customer success',
    role: 'Customer Success Consultant',
    period: 'January to April 2026',
    location: 'Douala, Cameroon',
    site: 'https://lovingtech.shop/',
    image: 'lovingtech-storefront.png',
    tagline: 'An internal support system and an order journey that run on WhatsApp.',
    description:
      'For four months I worked as a customer success consultant at Loving Tech, an online tech shop in Cameroon. I designed a WhatsApp support system, with a bot and a bank of prepared answers that escalates to the right team, and the order journey from product discovery and cart to payment on delivery and order tracking.',
    responsibilities: [
      'Designed a WhatsApp support system where a bot answers common questions from a bank of prepared answers and escalates the rest to the right team',
      'Designed the delivery follow-up, where the customer confirms receipt and sends a photo as proof',
      'Designed the order journey: product discovery, cart, checkout, and the choice between paying online and paying on delivery',
      'Designed order tracking where the customer enters an order code on the website to see the status, with an email and a button at each state change',
    ],
    content_blocks: lovingTechBlocks,
    source_project_id: 'lovingtech-cx',
  },
};

await sql`
  INSERT INTO warehouse_entries (id, type, title, content, metadata, tags, is_hidden, sort_order, created_at, updated_at)
  VALUES (
    ${entry.id}, ${entry.type}, ${entry.title}, ${entry.content},
    ${JSON.stringify(cleanDeep(entry.metadata))}::jsonb, ${entry.tags}, ${entry.is_hidden}, ${entry.sort_order}, ${now}, ${now}
  )
  ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type, title = EXCLUDED.title, content = EXCLUDED.content,
    metadata = EXCLUDED.metadata, tags = EXCLUDED.tags,
    is_hidden = EXCLUDED.is_hidden, sort_order = EXCLUDED.sort_order, updated_at = ${now}`;

const assets = [
  { id: 'asset:lovingtech-storefront', filename: 'lovingtech-storefront.png', mime: 'image/png', description: 'The Loving Tech storefront.', tags: ['lovingtech', 'ecommerce', 'storefront'] },
  { id: 'asset:lovingtech-whatsapp-bot', filename: 'lovingtech-whatsapp-bot.jpg', mime: 'image/jpeg', description: 'The WhatsApp support bot and its message templates.', tags: ['lovingtech', 'whatsapp', 'support', 'bot'] },
  { id: 'asset:lovingtech-cart', filename: 'lovingtech-cart.png', mime: 'image/png', description: 'The cart drawer with payment on delivery.', tags: ['lovingtech', 'cart', 'checkout'] },
  { id: 'asset:lovingtech-checkout', filename: 'lovingtech-checkout.png', mime: 'image/png', description: 'The checkout page with contact details and delivery choice.', tags: ['lovingtech', 'checkout', 'order'] },
  { id: 'asset:lovingtech-order-confirmation', filename: 'lovingtech-order-confirmation.png', mime: 'image/png', description: 'The order confirmation screen.', tags: ['lovingtech', 'order', 'confirmation'] },
  { id: 'asset:lovingtech-order-tracking', filename: 'lovingtech-order-tracking.png', mime: 'image/png', description: 'The order tracking states.', tags: ['lovingtech', 'order', 'tracking'] },
  { id: 'asset:lovingtech-track-lookup', filename: 'lovingtech-track-lookup.png', mime: 'image/png', description: 'The order reference lookup screen.', tags: ['lovingtech', 'order', 'tracking'] },
  { id: 'asset:lovingtech-gozem', filename: 'lovingtech-gozem.jpg', mime: 'image/jpeg', description: 'A Gozem delivery rider, the delivery partner for Loving Tech.', tags: ['lovingtech', 'delivery', 'gozem'] },
];

for (const a of assets) {
  await sql`
    INSERT INTO assets (id, filename, url, mime_type, description, tags, created_at)
    VALUES (${a.id}, ${a.filename}, ${a.filename}, ${a.mime}, ${a.description}, ${a.tags}, ${now})
    ON CONFLICT (id) DO UPDATE SET
      filename = EXCLUDED.filename, url = EXCLUDED.url, mime_type = EXCLUDED.mime_type,
      description = EXCLUDED.description, tags = EXCLUDED.tags`;
}

// Drop the earlier mislabelled asset id, if present.
await sql`DELETE FROM assets WHERE id = 'asset:lovingtech-whatsapp-api'`;

const check = await sql`SELECT id, title, jsonb_array_length(metadata->'content_blocks') AS blocks FROM warehouse_entries WHERE id = ${entry.id}`;
console.log('Entry:', check[0]);
console.log(`Upserted ${assets.length} assets.`);
