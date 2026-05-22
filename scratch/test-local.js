import fetch from 'node-fetch'; // wait, node-fetch might not be installed, but global fetch is available in modern Node!
// Modern Node (v18+) has global fetch!

async function run() {
  try {
    console.log('Fetching /api/profiles...');
    const res = await fetch('http://localhost:3000/api/profiles');
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Body:', body);
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}

run();
