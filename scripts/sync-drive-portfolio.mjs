import { writeFile } from 'node:fs/promises';

const driveFolderId = '1QEzJxAd9b2C4aFcHxrP03M42PPDZhPT-';
const driveFolderUrl = `https://drive.google.com/drive/folders/${driveFolderId}?usp=sharing`;
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

function stripExt(filename = '') {
  return filename.replace(/\.[^.]+$/, '');
}

function titleCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
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
    .replace(/\s+[-–—]\s+Google Drive$/i, '')
    .trim();

  return {
    title,
    rows: parseDriveRows(html),
  };
}

async function fetchManifestMetadata(rootRows) {
  const manifestRow = rootRows.find(row => !row.isFolder && row.name === 'manifest.json');
  if (!manifestRow) return new Map();

  try {
    const response = await fetch(`https://drive.google.com/uc?export=download&id=${manifestRow.id}`, {
      headers: { 'User-Agent': userAgent },
      redirect: 'follow',
    });
    if (!response.ok) return new Map();
    const list = await response.json();
    const bySlug = new Map();
    if (Array.isArray(list)) {
      for (const entry of list) {
        if (!entry?.output) continue;
        const filename = entry.output.split('/').pop() || '';
        const slug = stripExt(filename);
        if (slug) {
          bySlug.set(slug, entry);
        }
      }
    }
    return bySlug;
  } catch {
    return new Map();
  }
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

function toMediaItems(rows, { posterBySlug, manifestBySlug, subcategory } = {}) {
  const grouped = new Map();

  for (const row of rows) {
    if (row.isFolder || !isSupportedMedia(row)) continue;
    const type = getType(row.kind, row.name);
    const slug = stripExt(row.name);
    const key = type === 'video' ? `video:${slug}` : `file:${row.id}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        slug,
        type,
        name: row.name,
        mp4: null,
        webm: null,
        other: null,
      });
    }

    const bucket = grouped.get(key);
    const lowerName = row.name.toLowerCase();
    if (lowerName.endsWith('.mp4')) {
      bucket.mp4 = row;
    } else if (lowerName.endsWith('.webm')) {
      bucket.webm = row;
    } else {
      bucket.other = row;
    }
  }

  const items = [];
  for (const entry of grouped.values()) {
    const primary = entry.mp4 || entry.webm || entry.other;
    if (!primary) continue;

    const obfId = obfuscateId(primary.id);
    const posterId = posterBySlug?.get(entry.slug) || '';
    const manifestEntry = manifestBySlug?.get(entry.slug);
    const thumbId = posterId || obfId;

    const item = {
      id: obfId,
      name: primary.name,
      type: entry.type,
      thumbnail: `https://drive.google.com/thumbnail?id=${thumbId}&sz=w1600`,
      href: `https://drive.google.com/file/d/${obfId}/view?usp=sharing`,
    };

    if (posterId) {
      item.posterId = posterId;
    }
    if (entry.webm && entry.webm.id !== primary.id) {
      item.webmId = obfuscateId(entry.webm.id);
    }
    if (subcategory) {
      item.subcategory = subcategory;
    }
    if (manifestEntry?.theme) {
      item.theme = manifestEntry.theme;
    }
    if (typeof manifestEntry?.duration_seconds === 'number') {
      item.duration = Number(manifestEntry.duration_seconds.toFixed(1));
    }
    if (Array.isArray(manifestEntry?.dimensions) && manifestEntry.dimensions.length === 2) {
      item.dimensions = manifestEntry.dimensions;
    }

    items.push(item);
  }

  return items;
}

async function buildCategory(folderRow, context) {
  const folder = await fetchFolder(folderRow.id);
  const items = toMediaItems(folder.rows, context);
  const cleanTitle = titleCase(folder.title || folderRow.name);
  const aspect = getAspect(cleanTitle, items[0]?.type || 'image');

  return {
    title: cleanTitle,
    sourceFolder: folderRow.id,
    aspect,
    count: items.length,
    items,
  };
}

async function collectCategories(folderId, fallbackTitle, context, isRoot = false) {
  const folder = await fetchFolder(folderId);
  const folders = folder.rows.filter(row => row.isFolder);
  const looseItems = toMediaItems(folder.rows, context);
  const categories = [];

  for (const row of folders) {
    const folderKey = row.name.toLowerCase();
    if (folderKey === 'posters') continue;

    const child = await fetchFolder(row.id);
    const childFolders = child.rows.filter(childRow => childRow.isFolder);

    if (folderKey === 'videos' && childFolders.length > 0) {
      // Combine videos/motion-graphics (first) and videos/campaigns into "Video and Animation"
      const sortedVideoFolders = [...childFolders].sort((a, b) => {
        const aScore = a.name.toLowerCase().includes('motion') ? 0 : 1;
        const bScore = b.name.toLowerCase().includes('motion') ? 0 : 1;
        return aScore - bScore;
      });

      const mergedVideos = [];
      for (const vf of sortedVideoFolders) {
        const sub = await fetchFolder(vf.id);
        mergedVideos.push(
          ...toMediaItems(sub.rows, {
            ...context,
            subcategory: titleCase(sub.title || vf.name),
          })
        );
      }

      if (mergedVideos.length > 0) {
        categories.push({
          title: 'Video and Animation',
          sourceFolder: row.id,
          aspect: 'video',
          count: mergedVideos.length,
          items: mergedVideos,
        });
      }
      continue;
    }

    if (childFolders.length > 0) {
      categories.push(...await collectCategories(row.id, row.name, context, false));
    } else {
      categories.push(await buildCategory(row, context));
    }
  }

  if (looseItems.length > 0 && (!isRoot || folders.length === 0)) {
    const cleanTitle = titleCase(folder.title || fallbackTitle || 'Portfolio');
    categories.push({
      title: cleanTitle,
      sourceFolder: folderId,
      aspect: getAspect(cleanTitle, looseItems[0]?.type || 'image'),
      count: looseItems.length,
      items: looseItems,
    });
  }

  return categories;
}

async function run() {
  console.log('Fetching Google Drive portfolio folder...');
  console.log(`Source: ${driveFolderUrl}`);

  const rootFolder = await fetchFolder(driveFolderId);
  const postersFolder = rootFolder.rows.find(row => row.isFolder && row.name.toLowerCase() === 'posters');
  const posterBySlug = new Map();

  if (postersFolder) {
    const posters = await fetchFolder(postersFolder.id);
    for (const row of posters.rows) {
      if (!row.isFolder && isSupportedMedia(row)) {
        posterBySlug.set(stripExt(row.name), obfuscateId(row.id));
      }
    }
  }

  const manifestBySlug = await fetchManifestMetadata(rootFolder.rows);
  const categories = await collectCategories(
    driveFolderId,
    'Portfolio',
    { posterBySlug, manifestBySlug },
    true
  );

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
