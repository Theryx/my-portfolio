// Ndouken confirmed on 2026-11-13:
// - The QR scan in the riders' app confirmed a delivery at the customer's door.
// - The relay-point QR photo (pasd7qkl209hrk1gyej3.jpg) is the PaySika customer app: customers
//   scanned the stand's QR code with the app, which showed their pickup code and user info,
//   to prove they had ordered the card.
//   It is not part of the agents' app, so it moves out of "The app our agents used".
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const sql = neon(env.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/)[1]);
const now = new Date().toISOString();
const PICKUP = 'https://res.cloudinary.com/duzedercz/image/upload/v1789531743/pasd7qkl209hrk1gyej3.jpg';
const PICKUP_CAPTION = 'A relay-point stand. Customers scanned the QR code here with the PaySika app, which brought up their pickup code and details to show they had ordered the card.';

async function patch(id, fn) {
  const [row] = await sql`SELECT metadata FROM warehouse_entries WHERE id = ${id}`;
  const md = fn(structuredClone(row.metadata));
  await sql`UPDATE warehouse_entries SET metadata = ${JSON.stringify(md)}::jsonb, updated_at = ${now} WHERE id = ${id}`;
  console.log('patched', id);
}

// Move the pickup-code photo out of the agents' app block, into its own block.
const movePickup = (md) => {
  const blocks = [];
  for (const b of md.content_blocks ?? []) {
    if (b.type === 'photos' && b.heading === 'The app our agents used' && b.items.some((i) => i.image === PICKUP)) {
      blocks.push({ ...b, items: b.items.filter((i) => i.image !== PICKUP) });
      blocks.push({ type: 'photos', heading: 'The pickup code', items: [{ image: PICKUP, caption: PICKUP_CAPTION }] });
    } else if (b.heading === 'The pickup code') {
      blocks.push({ ...b, items: b.items.map((i) => (i.image === PICKUP ? { ...i, caption: PICKUP_CAPTION } : i)) });
    } else {
      blocks.push(b);
    }
  }
  md.content_blocks = blocks;
  return md;
};
for (const id of ['project:paysika_fintech', 'project:paysika_default', 'project:paysika-field']) await patch(id, movePickup);

await patch('project:paysika-riders-app', (md) => {
  md.description = md.description.replace('and do a QR scan', 'and confirm each delivery with a QR scan at the customer\'s door');
  md.responsibilities = md.responsibilities.map((r) =>
    r.startsWith('Kept the customer address and the QR scan working offline')
      ? 'Kept the customer address and the QR scan that confirmed delivery at the customer\'s door working offline; receiving new orders needed a connection'
      : r,
  );
  md.content_blocks = md.content_blocks.map((b) => {
    if (b.type === 'intro' && b.heading === 'An app for the riders') {
      return { ...b, text: b.text.replace('find the customer and do a QR scan', 'find the customer and confirm the delivery with a QR scan at the door') };
    }
    if (b.type === 'steps') {
      return {
        ...b,
        items: b.items.map((i) =>
          i.title === 'Works without internet where it counts'
            ? { ...i, text: 'The customer address and the QR scan that confirmed the delivery worked offline. Receiving new orders needed a connection, because new orders come from the server.' }
            : i,
        ),
      };
    }
    return b;
  });
  md.todo = (md.todo ?? []).filter((t) => !t.startsWith('Confirm what the QR scan') && !t.startsWith('Confirm what the relay-point QR photo'));
  return md;
});
