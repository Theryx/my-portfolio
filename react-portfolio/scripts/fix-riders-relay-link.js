// Ndouken corrected on 2026-11-13: the riders' app is not what cut the relay-point
// handover from 30 to 10 minutes. Riders do not deliver cards to relay points.
// Unlink the two in the riders' app entry and in the field story.
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();
const ORDER_LIST = 'https://res.cloudinary.com/duzedercz/image/upload/v1789529537/glrqigcg6qhz79dqsqk6.png';

async function patch(id, fn) {
  const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${id}`;
  const md = fn(structuredClone(row.metadata));
  await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log('patched', id);
}

await patch('project:paysika-riders-app', (md) => {
  md.image = ORDER_LIST;
  md.tagline = 'The app our delivery riders used to get new orders and find customers, on cheap phones with weak connections.';
  md.description =
    'I designed the app PaySika delivery riders used to receive new orders, see the customer address and do a QR scan. The address and the scan worked without internet, the screens were readable outdoors in French and English, and riders were trained in a few hours.';
  md.responsibilities = md.responsibilities.filter((r) => !r.includes('30 to 10') && !r.includes('paper handover'));
  md.content_blocks = md.content_blocks
    .map((b) => {
      if (b.type === 'intro' && b.heading === 'Thirty minutes at the relay point') {
        return {
          ...b,
          heading: 'An app for the riders',
          text: 'PaySika delivered cards to customers, and our 15 delivery riders in Douala and Yaounde needed an app to receive new orders, find the customer and do a QR scan. Most of them used cheap smartphones on weak connections.',
        };
      }
      if (b.type === 'stat-cards') {
        return { ...b, cards: b.cards.filter((c) => !c.title.includes('30')) };
      }
      if (b.type === 'photos') {
        return { ...b, items: b.items.filter((i) => i.image === ORDER_LIST) };
      }
      return b;
    });
  md.todo = [
    ...(md.todo ?? []).filter((t) => !t.startsWith('Confirm what the rider saw')),
    'Confirm what the QR scan in the riders\' app was for',
    'Confirm what the relay-point QR photo (pasd7qkl209hrk1gyej3.jpg) shows and which app it belongs to',
  ];
  return md;
});

await patch('project:paysika-field', (md) => {
  md.responsibilities = md.responsibilities.map((r) =>
    r.startsWith('Replaced paper handover at relay points')
      ? 'Replaced the paper handover at relay points with QR-code validation, cutting the wait from about 30 to 10 minutes'
      : r,
  );
  md.content_blocks = md.content_blocks.map((b) =>
    b.heading === 'Thirty minutes at the relay point'
      ? {
          ...b,
          text: 'Customers collected their cards at relay points, where the handover ran on paper forms and manual signatures, and someone in the office typed the status in later. People waited about 30 minutes. We replaced the paperwork with QR-code validation, so the handover was recorded the moment it happened, and the wait dropped to about 10 minutes.',
        }
      : b,
  );
  return md;
});
