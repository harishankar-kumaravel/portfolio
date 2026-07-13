import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup file paths
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../firebase-service-account.json');
const INPUT_DATA_PATH = path.join(__dirname, '../src/data/drivePortfolio.js');
const OUTPUT_DATA_PATH = path.join(__dirname, '../src/data/firebasePortfolio.js');

async function main() {
  console.log('====================================================');
  console.log('   GOOGLE DRIVE TO FIREBASE STORAGE TRANSFER UTILITY');
  console.log('====================================================');

  // 1. Verify drivePortfolio.js has been generated
  if (!existsSync(INPUT_DATA_PATH)) {
    console.error(`\n❌ ERROR: ${INPUT_DATA_PATH} not found!`);
    console.log('Please run "npm run sync:drive" first to pull items from Google Drive.');
    process.exit(1);
  }

  // 2. Verify Service Account File exists
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('\n❌ ERROR: firebase-service-account.json not found!');
    console.log('\nTo run this script, you must obtain a Firebase service account private key:');
    console.log('1. Go to the Firebase Console: https://console.firebase.google.com/');
    console.log('2. Select your project -> Click the gear icon (Project Settings) -> Service Accounts.');
    console.log('3. Click "Generate New Private Key" and download the JSON file.');
    console.log('4. Rename it to "firebase-service-account.json" and place it in the root of this repository.');
    console.log('5. Re-run this script.\n');
    process.exit(1);
  }

  // 3. Load input drive portfolio categories
  const driveDataModule = await import(new URL('../src/data/drivePortfolio.js', import.meta.url).href);
  const categories = driveDataModule.drivePortfolioCategories;

  if (!categories || categories.length === 0) {
    console.error('\n❌ ERROR: No categories found in drivePortfolio.js.');
    process.exit(1);
  }

  // 4. Load service account and initialize firebase-admin
  let admin;
  try {
    admin = (await import('firebase-admin')).default;
  } catch (err) {
    console.error('\n❌ ERROR: "firebase-admin" is not installed.');
    console.log('Please install it by running: npm install firebase-admin');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(await readFile(SERVICE_ACCOUNT_PATH, 'utf-8'));
  const projectId = serviceAccount.project_id;
  const storageBucket = `${projectId}.appspot.com`; // Default Firebase Storage bucket

  console.log(`\nInitializing Firebase Admin SDK...`);
  console.log(`- Project ID: ${projectId}`);
  console.log(`- Storage Bucket: ${storageBucket}`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket,
  });

  const bucket = admin.storage().bucket();

  // Test bucket connection
  try {
    console.log('Verifying connection to storage bucket...');
    await bucket.exists();
    console.log('Connection successful!');
  } catch (err) {
    console.error('\n❌ ERROR: Could not connect to the Firebase Storage bucket.');
    console.error('Verify that Firebase Storage is enabled in your Firebase console and service account permissions are active.');
    console.error('Detail:', err.message);
    process.exit(1);
  }

  // 5. Process categories and upload files
  const updatedCategories = [];
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const category of categories) {
    console.log(`\n----------------------------------------------------`);
    console.log(`Category: ${category.title} (${category.items.length} items)`);
    console.log(`----------------------------------------------------`);
    
    const updatedItems = [];

    for (let i = 0; i < category.items.length; i++) {
      const item = category.items[i];
      const prefix = `[${i + 1}/${category.items.length}]`;
      
      console.log(`${prefix} Transferring: ${item.name}`);
      console.log(`  - Drive ID: ${item.id}`);

      try {
        // Resolve direct download link
        // Images can be fetched directly at high-res from lh3 thumbnail generator
        // Videos must use the standard export/download endpoint
        const downloadUrl = item.type === 'image' || item.type === 'animation'
          ? `https://lh3.googleusercontent.com/d/${item.id}=s0` // s0 means original size
          : `https://drive.google.com/uc?export=download&id=${item.id}`;

        const res = await fetch(downloadUrl);
        if (!res.ok) {
          throw new Error(`Google Drive returned status: ${res.status} ${res.statusText}`);
        }

        const buffer = Buffer.from(await res.arrayBuffer());

        // Determine content type
        const contentType = res.headers.get('content-type') || getContentType(item.name, item.type);
        const fileExt = getExtension(item.name) || getExtFromMime(contentType);
        const fileName = `${item.id}${fileExt}`;
        const destinationPath = `portfolio/${category.sourceFolder}/${fileName}`;

        console.log(`  - Uploading to Firebase Storage as "${destinationPath}" (${contentType})...`);

        const file = bucket.file(destinationPath);
        await file.save(buffer, {
          metadata: {
            contentType: contentType,
            cacheControl: 'public, max-age=31536000',
          },
        });

        // Make the file publicly accessible
        await file.makePublic();

        const firebaseStorageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        console.log(`  - Success! Public URL: ${firebaseStorageUrl}`);

        updatedItems.push({
          ...item,
          thumbnail: firebaseStorageUrl,
          src: firebaseStorageUrl,
          driveHref: item.href, // Preserve original drive page link
        });
        totalUploaded++;

      } catch (error) {
        console.error(`  - ❌ Failed:`, error.message);
        // Fallback to original drive details if upload fails
        updatedItems.push(item);
        totalFailed++;
      }
    }

    updatedCategories.push({
      ...category,
      items: updatedItems,
    });
  }

  // 6. Write to output file
  const generatedAt = new Date().toISOString();
  const fileContents = `// Generated by scripts/transfer-drive-to-firebase.mjs
// Run "node scripts/transfer-drive-to-firebase.mjs" to re-transfer.
// File generated at: ${generatedAt}

export const firebasePortfolioSyncedAt = ${JSON.stringify(generatedAt)};

export const firebasePortfolioCategories = ${JSON.stringify(updatedCategories, null, 2)};
`;

  await writeFile(OUTPUT_DATA_PATH, fileContents);

  console.log('\n====================================================');
  console.log('🎉 TRANSFER PROCESS COMPLETED!');
  console.log(`- Uploaded successfully: ${totalUploaded}`);
  console.log(`- Failed: ${totalFailed}`);
  console.log(`- Updated data file written to: ${OUTPUT_DATA_PATH}`);
  console.log('\nNext Steps:');
  console.log('To activate Firebase Storage URLs on your portfolio website:');
  console.log('1. Open src/data/portfolio.js');
  console.log('2. Change the import line at the top to import from "./firebasePortfolio" instead of "./drivePortfolio".');
  console.log('====================================================');
}

function getContentType(name, type) {
  const ext = getExtension(name);
  if (type === 'video') return 'video/mp4';
  if (type === 'animation') return 'image/gif';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/jpeg';
}

function getExtension(name) {
  const match = name.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? '';
}

function getExtFromMime(mime) {
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  if (mime === 'image/svg+xml') return '.svg';
  if (mime === 'video/mp4') return '.mp4';
  return '.jpg';
}

main().catch(console.error);
