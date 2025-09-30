import PocketBase from 'pocketbase';

// PocketBase instance
const pb = new PocketBase('https://pocket.xterraengine.com');

// Auto-refresh authentication
pb.autoCancellation(false);

/**
 * Authenticate with PocketBase
 * @returns {Promise<Object>}
 */
export async function authenticatePocketBase() {
  try {
    const authData = await pb.collection('users').authWithPassword(
      'admin@xterraengine.com',
      'admin123'
    );
    console.log('PocketBase authenticated:', authData);
    return authData;
  } catch (error) {
    console.error('PocketBase authentication failed:', error);
    throw error;
  }
}

/**
 * Get all campaigns
 * @returns {Promise<Array>}
 */
export async function getCampaigns() {
  try {
    const records = await pb.collection('campaigns').getFullList({
      sort: '-created',
      expand: 'layouts'
    });
    return records;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

/**
 * Get campaign by ID
 * @param {string} campaignId
 * @returns {Promise<Object>}
 */
export async function getCampaignById(campaignId) {
  try {
    const record = await pb.collection('campaigns').getOne(campaignId, {
      expand: 'layouts'
    });
    return record;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

/**
 * Get all layouts
 * @returns {Promise<Array>}
 */
export async function getLayouts() {
  try {
    const records = await pb.collection('layouts').getFullList({
      sort: '-created'
    });
    return records;
  } catch (error) {
    console.error('Error fetching layouts:', error);
    throw error;
  }
}

/**
 * Get layout by ID
 * @param {string} layoutId
 * @returns {Promise<Object>}
 */
export async function getLayoutById(layoutId) {
  try {
    const record = await pb.collection('layouts').getOne(layoutId);
    return record;
  } catch (error) {
    console.error('Error fetching layout:', error);
    throw error;
  }
}

/**
 * Get multiple layouts by IDs
 * @param {string[]} layoutIds
 * @returns {Promise<Array>}
 */
export async function getLayoutsByIds(layoutIds) {
  try {
    const filter = layoutIds.map(id => `id="${id}"`).join(' || ');
    const records = await pb.collection('layouts').getFullList({
      filter
    });
    return records;
  } catch (error) {
    console.error('Error fetching layouts:', error);
    throw error;
  }
}

/**
 * Get file from files_library by ID
 * @param {string} fileId
 * @returns {Promise<Object>}
 */
export async function getFileById(fileId) {
  try {
    const record = await pb.collection('files_library').getOne(fileId);
    return record;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}

/**
 * Get multiple files by IDs
 * @param {string[]} fileIds
 * @returns {Promise<Array>}
 */
export async function getFilesByIds(fileIds) {
  try {
    if (!fileIds || fileIds.length === 0) return [];
    const filter = fileIds.map(id => `id="${id}"`).join(' || ');
    const records = await pb.collection('files_library').getFullList({
      filter
    });
    return records;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

/**
 * Get file URL from PocketBase
 * @param {Object} record
 * @param {string} filename
 * @returns {string}
 */
export function getFileUrl(record, filename) {
  return pb.files.getUrl(record, filename);
}

/**
 * Get media URL from files_library record
 * @param {Object} fileRecord - Record from files_library collection
 * @returns {string}
 */
export function getMediaUrl(fileRecord) {
  if (!fileRecord || !fileRecord.file) return null;
  return pb.files.getUrl(fileRecord, fileRecord.file);
}

export { pb };