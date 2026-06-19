import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, '../public/logos');

if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Local copy of brands to avoid import issues
const brands = [
  {
    name: 'Tata BlueScope Steel',
    logoUrl: 'https://media.licdn.com/dms/image/v2/D4D0BAQEVzvCoqTcHgw/company-logo_200_200/B4DZvaqiQPIAAM-/0/1768900142613/tatasteelcolors_logo?e=1778716800&v=beta&t=9p9Qg6cyqo-OHD3EDnh4a7u2XK6go1Mgi1jyoS810n0',
  },
  {
    name: 'Aranyakaa Farms',
    logoUrl: 'https://logo.clearbit.com/aranyakaa.com',
  },
  {
    name: 'Coromandel International',
    logoUrl: 'https://logo.clearbit.com/coromandel.biz',
  },
  {
    name: 'G Square',
    logoUrl: 'https://logo.clearbit.com/gsquarehousing.com',
  },
  {
    name: 'Mizaj',
    logoUrl: 'https://unavatar.io/linkedin/company/mizajofficial',
  },
  {
    name: 'Elegance Enterprises',
    logoUrl: 'https://unavatar.io/linkedin/company/elegance-enterprises1',
  },
  {
    name: 'Namma Markt',
    logoUrl: 'https://logo.clearbit.com/nammamarkt.com',
  },
  {
    name: 'SalesLeadIT',
    logoUrl: 'https://logo.clearbit.com/salesleadit.com',
  },
  {
    name: 'Pondy Thanga Maaligai',
    logoUrl: 'https://logo.clearbit.com/pondythangamaaligai.com',
  },
  {
    name: 'Darzee',
    logoUrl: 'https://logo.clearbit.com/darzeeapp.com',
  },
  {
    name: 'Baddies',
    logoUrl: 'https://unavatar.io/instagram/baddies_style',
  },
  {
    name: 'Dream Alliance',
    logoUrl: 'https://logo.clearbit.com/dreamalliance.in',
  },
  {
    name: 'ID Architects',
    logoUrl: 'https://logo.clearbit.com/idarchitects.co.in',
  },
  {
    name: 'Nichi',
    logoUrl: 'https://logo.clearbit.com/nichi.store',
  },
  {
    name: 'Vlykit Solutions',
    logoUrl: 'https://logo.clearbit.com/vlykit.com',
  },
  {
    name: 'SPDS',
    logoUrl: 'https://unavatar.io/instagram/spds_india',
  },
  {
    name: 'Kerala Secrets',
    logoUrl: 'https://logo.clearbit.com/keralasecrets.com',
  },
  {
    name: 'Crafts by Elegance',
    logoUrl: 'https://logo.clearbit.com/craftsbyelegance.com',
  },
  {
    name: 'Nasagri',
    logoUrl: 'https://logo.clearbit.com/nasagri.com',
  },
  {
    name: 'Club Aranyakaa',
    logoUrl: 'https://logo.clearbit.com/aranyakaa.com',
  },
  {
    name: 'Elegance Prime Real Estate',
    logoUrl: 'https://logo.clearbit.com/eleganceprimerealestate.ae',
  },
];

async function downloadImage(url, filename) {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch (${response.status} ${response.statusText})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dest = path.join(logosDir, filename);
    fs.writeFileSync(dest, buffer);
    console.log(`[SUCCESS] Downloaded ${filename}`);
    return true;
  } catch (error) {
    console.error(`[FAILED] ${filename} from ${url}:`, error.message);
    return false;
  }
}

async function run() {
  console.log('Starting logo downloader...');
  for (const brand of brands) {
    if (brand.logoUrl) {
      const ext = brand.logoUrl.includes('.svg') ? 'svg' : 'png';
      const cleanName = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${cleanName}.${ext}`;
      await downloadImage(brand.logoUrl, filename);
    }
  }
  console.log('Finished logo downloading.');
}

run();
