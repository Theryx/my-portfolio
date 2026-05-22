async function run() {
  const urls = [
    'https://react-portfolio-pi-topaz.vercel.app/api/profiles',
    'https://react-portfolio-pi-topaz.vercel.app/api/projects?profile_id=default',
    'https://react-portfolio-pi-topaz.vercel.app/api/blog?profile_id=default'
  ];

  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      if (res.status === 200) {
        const body = await res.json();
        console.log(`Response length: ${Array.isArray(body) ? body.length : typeof body}`);
        console.log(`Data keys/ids:`, Array.isArray(body) ? body.map(x => x.id || x.title) : Object.keys(body));
      } else {
        const text = await res.text();
        console.log(`Error Response:`, text.substring(0, 200));
      }
    } catch (e) {
      console.error(`Failed to fetch ${url}:`, e);
    }
    console.log('---');
  }
}

run();
