async function run() {
  try {
    console.log('Fetching production /api/profiles...');
    const res = await fetch('https://react-portfolio-pi-topaz.vercel.app/api/profiles');
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Body:', body);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

run();
