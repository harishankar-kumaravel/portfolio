import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

const brands = [
  {
    name: 'Tata BlueScope Steel',
    domain: 'tatabluescopesteel.com',
    linkedin: 'tatabluescopesteel',
  },
  {
    name: 'Aranyakaa Farms',
    domain: 'aranyakaa.com',
    linkedin: 'aranyakaa-farms',
  },
  {
    name: 'Coromandel International',
    domain: 'coromandel.gromor.com',
    linkedin: 'global-business-coromandel-international-limited',
  },
  {
    name: 'G Square',
    domain: 'gsquarehousing.com',
    linkedin: 'gsquarehousing',
  },
  {
    name: 'Mizaj',
    linkedin: 'mizajofficial',
  },
  {
    name: 'Elegance Enterprises',
    linkedin: 'elegance-enterprises1',
  },
  {
    name: 'Namma Markt',
    domain: 'nammamarkt.com',
  },
  {
    name: 'SalesLeadIT',
    domain: 'salesleadit.com',
  },
  {
    name: 'Pondy Thanga Maaligai',
    domain: 'pondythangamaaligai.com',
  },
  {
    name: 'Darzee',
    domain: 'darzeeapp.com',
    linkedin: 'darzee-app',
  },
  {
    name: 'Baddies',
    instagram: 'baddies_style',
  },
  {
    name: 'Dream Alliance',
    domain: 'dreamalliance.in',
  },
  {
    name: 'ID Architects',
    domain: 'idarchitects.co.in',
  },
  {
    name: 'Nichi',
    domain: 'nichi.store',
  },
  {
    name: 'Vlykit Solutions',
    domain: 'vlykitsolutions.com',
  },
  {
    name: 'SPDS',
    instagram: 'spds_india',
  },
  {
    name: 'Kerala Secrets',
    domain: 'keralasecrets.com',
  },
  {
    name: 'Crafts by Elegance',
    domain: 'craftsbyelegance.com',
  },
  {
    name: 'Nasagri',
    domain: 'nasagri.com',
  },
  {
    name: 'Club Aranyakaa',
    domain: 'aranyakaa.com',
  },
  {
    name: 'Elegance Prime Real Estate',
    domain: 'eleganceprimerealestate.ae',
  },
];

async function downloadLogo(brand, filename) {
  const sources = [];

  // 1. Hunter.io Logo API (High quality, no key)
  if (brand.domain) {
    sources.push({
      url: `https://logos.hunter.io/${brand.domain}`,
      name: 'Hunter.io',
    });
  }

  // 2. Unavatar LinkedIn Company Logo
  if (brand.linkedin) {
    sources.push({
      url: `https://unavatar.io/linkedin/company:${brand.linkedin}`,
      name: 'Unavatar LinkedIn',
    });
  }

  // 3. Unavatar Domain Logo
  if (brand.domain) {
    sources.push({
      url: `https://unavatar.io/${brand.domain}?fallback=false`,
      name: 'Unavatar Domain',
    });
  }

  // 4. Google Favicon API (Very reliable fallback for domains)
  if (brand.domain) {
    sources.push({
      url: `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`,
      name: 'Google Favicon',
    });
  }

  // 5. UI Avatars (Beautiful initials fallback, always works)
  sources.push({
    url: `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=128&background=06B6D4&color=fff&format=png&bold=true`,
    name: 'UI Avatars Fallback',
  });

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  };

  for (const source of sources) {
    try {
      const response = await fetch(source.url, { headers });
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Ensure the buffer is not empty or tiny (like a 1x1 tracking pixel)
        if (buffer.length > 100) {
          const dest = path.join(logosDir, filename);
          fs.writeFileSync(dest, buffer);
          console.log(`[SUCCESS] Downloaded ${filename} using ${source.name}`);
          return true;
        }
      }
    } catch (error) {
      // Silently try the next source
    }
  }

  console.error(`[FAILED] Could not download any logo for ${brand.name}`);
  return false;
}

async function run() {
  console.log('Starting logo downloader...');
  for (const brand of brands) {
    const cleanName = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${cleanName}.png`;
    
    await downloadLogo(brand, filename);
    
    // Add a 1-second delay before the next download to prevent rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('Finished logo downloading.');
}

run();
