import { writeFile } from 'node:fs/promises';

const driveFolderId = '1iYBoCITW1co3IX_A7kwyiz_xm-t7w6Lo';
const driveFolderUrl = `https://drive.google.com/drive/folders/${driveFolderId}?usp=sharing`;
const youtubePlaylistUrl = 'https://www.youtube.com/playlist?list=PLmwoqRo1iFaGdgv7C9ICliv8oW6XTVSkQ';
const folderMimeType = 'application/vnd.google-apps.folder';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function titleCase(value) {
  return value
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bAnd\b/g, 'and');
}

function getAspect(name, type) {
  const n = name.toLowerCase();
  if (type === 'video' || type === 'animation') return 'video';
  if (n.includes('banner') || n.includes('poster') || n.includes('hoarding') || n.includes('16x') || n.includes('60x')) return 'landscape';
  if (n.includes('brochure') || n.includes('pamphlet') || n.includes('pamplet')) return 'portrait';
  if (n.includes('social') || n.includes('post')) return 'square';
  return 'landscape';
}

function getType(kind, name) {
  const n = name.toLowerCase();
  if (kind.toLowerCase() === 'video' || /\.(mp4|mov|m4v|webm|avi|mkv)$/i.test(name)) return 'video';
  if (n.endsWith('.gif') || n.includes('animation')) return 'animation';
  return 'image';
}

function isVideoAndAnimationCategory(title) {
  return title.toLowerCase().replace(/&/g, 'and').includes('video and animation');
}

function parseDriveRows(html) {
  return [...html.matchAll(/<tr data-selectable data-id="([^"]+)"[\s\S]*?<\/tr>/g)]
    .map(match => {
      const row = match[0];
      const text = [...row.matchAll(/>([^<>]{2,180})</g)]
        .map(textMatch => decodeHtml(textMatch[1]).trim())
        .filter(Boolean);

      const kind = text[0] || '';
      const isFolder = row.includes('Shared folder') || row.includes('Folder');
      const name = isFolder ? (text[0] || 'Untitled') : (text[1] || text[0] || 'Untitled');

      return {
        id: match[1],
        name,
        kind,
        isFolder,
      };
    });
}

async function fetchFolder(folderId) {
  const response = await fetch(`https://drive.google.com/drive/folders/${folderId}?usp=sharing`, {
    headers: { 'User-Agent': userAgent },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Drive folder ${folderId}: HTTP ${response.status}`);
  }

  const html = await response.text();
  const title = decodeHtml(html.match(/<title>(.*?)<\/title>/)?.[1] || 'Portfolio')
    .replace(/\s+–\s+Google Drive$/, '')
    .trim();

  return {
    title,
    rows: parseDriveRows(html),
  };
}

function obfuscateId(id) {
  if (!id) return '';
  const base64 = Buffer.from(id).toString('base64');
  return base64.split('').reverse().join('');
}

function isSupportedMedia(row) {
  if (row.isFolder) return false;
  const name = (row.name || '').toLowerCase();
  const kind = (row.kind || '').toLowerCase();
  return (
    ['image', 'video'].includes(kind) ||
    /\.(jpg|jpeg|png|webp|svg|gif|mp4|mov|m4v|webm|avi|mkv)$/i.test(name)
  );
}

function toPortfolioItem(row) {
  const type = getType(row.kind, row.name);
  const obfId = obfuscateId(row.id);

  return {
    id: obfId,
    name: row.name,
    type,
    thumbnail: `https://drive.google.com/thumbnail?id=${obfId}&sz=w1600`,
    href: `https://drive.google.com/file/d/${obfId}/view?usp=sharing`,
  };
}

function parsePlaylistItems(html) {
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
  if (!match) {
    throw new Error('Could not find ytInitialData in YouTube page HTML');
  }

  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;

  if (!contents || !Array.isArray(contents)) {
    throw new Error('Could not parse playlist video list structure from YouTube JSON');
  }

  const items = [];
  const seen = new Set();

  for (const item of contents) {
    const vm = item.lockupViewModel;
    if (!vm) continue;

    const watchEndpoint = vm.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint;
    const videoId = watchEndpoint?.videoId;
    if (!videoId || seen.has(videoId)) continue;

    const title = vm.metadata?.lockupMetadataViewModel?.title?.content || 'Untitled';
    const thumbnails = vm.contentImage?.thumbnailViewModel?.image?.sources || [];
    const thumbnail = thumbnails[thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    seen.add(videoId);
    items.push({
      id: videoId,
      name: title,
      type: title.toLowerCase().includes('animation') || title.toLowerCase().includes('logo') ? 'animation' : 'video',
      thumbnail,
      href: `https://www.youtube.com/watch?v=${videoId}`,
    });
  }

  return items;
}

async function buildYoutubeVideoCategory() {
  const response = await fetch(youtubePlaylistUrl, {
    headers: { 'User-Agent': userAgent },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube playlist: HTTP ${response.status}`);
  }

  const items = parsePlaylistItems(await response.text());

  return {
    title: 'Video and Animation',
    sourceFolder: youtubePlaylistUrl,
    aspect: 'video',
    count: items.length,
    items,
  };
}

async function buildCategory(folderRow) {
  const folder = await fetchFolder(folderRow.id);
  const items = folder.rows
    .filter(row => !row.isFolder && isSupportedMedia(row))
    .map(toPortfolioItem);

  const aspect = getAspect(folder.title || folderRow.name, items[0]?.type || 'image');

  return {
    title: titleCase(folder.title || folderRow.name),
    sourceFolder: folderRow.id,
    aspect,
    count: items.length,
    items,
  };
}

async function collectCategories(folderId, fallbackTitle, isRoot = false) {
  const folder = await fetchFolder(folderId);
  const folders = folder.rows.filter(row => row.isFolder);
  const looseItems = folder.rows.filter(row => !row.isFolder && isSupportedMedia(row)).map(toPortfolioItem);
  const categories = [];

  for (const row of folders) {
    // Include all folders, including Video and Animation, directly from Google Drive

    const child = await fetchFolder(row.id);
    const childFolders = child.rows.filter(childRow => childRow.isFolder);

    if (childFolders.length > 0) {
      categories.push(...await collectCategories(row.id, row.name));
    } else {
      categories.push(await buildCategory(row));
    }
  }

  if (looseItems.length > 0 && (!isRoot || folders.length === 0)) {
    categories.push({
      title: titleCase(folder.title || fallbackTitle || 'Portfolio'),
      sourceFolder: folderId,
      aspect: getAspect(folder.title || fallbackTitle || 'Portfolio', looseItems[0]?.type || 'image'),
      count: looseItems.length,
      items: looseItems,
    });
  }

  return categories;
}

async function run() {
  console.log('Fetching Google Drive portfolio folder...');
  console.log(`Source: ${driveFolderUrl}`);

  const categories = await collectCategories(driveFolderId, 'Portfolio', true);
  // No longer fetching from YouTube. Everything is fetched directly from Google Drive.

  const filteredCategories = categories
    .filter(category => category.items.length > 0 && category.title.toLowerCase() !== 'portfolio')
    .sort((a, b) => b.items.length - a.items.length);
  const generatedAt = new Date().toISOString();
  const contents = `// Generated by scripts/sync-drive-portfolio.mjs from Google Drive folder
// Source: ${driveFolderUrl}
// Run "npm run sync:drive" after changing the Google Drive folder.

export const drivePortfolioSyncedAt = ${JSON.stringify(generatedAt)}

export const drivePortfolioCategories = ${JSON.stringify(filteredCategories, null, 2)}
`;

  await writeFile(new URL('../src/data/drivePortfolio.js', import.meta.url), contents);

  console.log(`Synced ${filteredCategories.reduce((total, category) => total + category.count, 0)} portfolio items.`);
  for (const category of filteredCategories) {
    console.log(`- ${category.title}: ${category.count}`);
  }
}

run().catch(error => {
  console.error('Sync failed:', error);
  process.exit(1);
});
