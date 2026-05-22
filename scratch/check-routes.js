async function run() {
  const urls = [
    'https://react-portfolio-pi-topaz.vercel.app/projects/shomi',
    'https://react-portfolio-pi-topaz.vercel.app/projects/crowdremit',
    'https://react-portfolio-pi-topaz.vercel.app/about',
    'https://react-portfolio-pi-topaz.vercel.app/blog'
  ];

  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        console.log(`Response length: ${text.length}`);
        console.log(`Contains root div: ${text.includes('id="root"')}`);
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
