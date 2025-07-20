import { API } from './api';

// 缓存自定义模型配置
let customModelConfigCache = null;
let customModelInfoCache = null;
let customModelVendorInfoCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

/**
 * 获取自定义模型配置
 * @returns {Promise<{enabled: boolean, modelInfo: object, vendorInfo: object}>}
 */
export async function getCustomModelConfig() {
  const now = Date.now();
  
  // 如果缓存有效，直接返回缓存
  if (customModelConfigCache && (now - lastFetchTime) < CACHE_DURATION) {
    return customModelConfigCache;
  }

  try {
    const res = await API.get('/api/option/');
    const { success, data } = res.data;
    
    if (!success) {
      return { enabled: false, modelInfo: {}, vendorInfo: {} };
    }

    let enabled = false;
    let modelInfo = {};
    let vendorInfo = {};

    data.forEach((item) => {
      switch (item.key) {
        case 'CustomModelConfigEnabled':
          enabled = item.value === 'true';
          break;
        case 'CustomModelInfo':
          try {
            modelInfo = item.value ? JSON.parse(item.value) : {};
          } catch (e) {
            console.error('解析自定义模型信息失败:', e);
            modelInfo = {};
          }
          break;
        case 'CustomModelVendorInfo':
          try {
            vendorInfo = item.value ? JSON.parse(item.value) : {};
          } catch (e) {
            console.error('解析自定义厂商信息失败:', e);
            vendorInfo = {};
          }
          break;
      }
    });

    // 更新缓存
    customModelConfigCache = { enabled, modelInfo, vendorInfo };
    customModelInfoCache = modelInfo;
    customModelVendorInfoCache = vendorInfo;
    lastFetchTime = now;

    return customModelConfigCache;
  } catch (error) {
    console.error('获取自定义模型配置失败:', error);
    return { enabled: false, modelInfo: {}, vendorInfo: {} };
  }
}

/**
 * 获取模型的自定义信息
 * @param {string} modelName - 模型名称
 * @returns {Promise<object|null>} 模型的自定义信息，如果没有则返回null
 */
export async function getCustomModelInfo(modelName) {
  const config = await getCustomModelConfig();
  
  if (!config.enabled || !config.modelInfo) {
    return null;
  }

  return config.modelInfo[modelName] || null;
}

/**
 * 获取厂商的自定义信息
 * @param {string} vendorKey - 厂商键名
 * @returns {Promise<object|null>} 厂商的自定义信息，如果没有则返回null
 */
export async function getCustomVendorInfo(vendorKey) {
  const config = await getCustomModelConfig();
  
  if (!config.enabled || !config.vendorInfo) {
    return null;
  }

  return config.vendorInfo[vendorKey] || null;
}

/**
 * 获取模型的自定义标签
 * @param {string} modelName - 模型名称
 * @returns {Promise<string[]>} 标签数组
 */
export async function getCustomModelTags(modelName) {
  const modelInfo = await getCustomModelInfo(modelName);
  
  if (!modelInfo || !modelInfo.tags) {
    return [];
  }

  return modelInfo.tags.split('|').filter(tag => tag.trim());
}

/**
 * 获取模型的自定义图标
 * @param {string} modelName - 模型名称
 * @returns {Promise<string|null>} 图标URL，如果没有则返回null
 */
export async function getCustomModelIcon(modelName) {
  const modelInfo = await getCustomModelInfo(modelName);
  
  if (!modelInfo || !modelInfo.icon) {
    return null;
  }

  return modelInfo.icon;
}

/**
 * 获取厂商的自定义图标
 * @param {string} vendorKey - 厂商键名
 * @returns {Promise<string|null>} 图标URL，如果没有则返回null
 */
export async function getCustomVendorIcon(vendorKey) {
  const vendorInfo = await getCustomVendorInfo(vendorKey);
  
  if (!vendorInfo || !vendorInfo.icon) {
    return null;
  }

  return vendorInfo.icon;
}

/**
 * 清除缓存
 */
export function clearCustomModelConfigCache() {
  customModelConfigCache = null;
  customModelInfoCache = null;
  customModelVendorInfoCache = null;
  lastFetchTime = 0;
}

/**
 * 根据模型名称获取所属的自定义厂商组
 * @param {string} modelName - 模型名称
 * @returns {Promise<string|null>} 厂商组键名，如果没有则返回null
 */
export async function getModelCustomVendorGroup(modelName) {
  const modelInfo = await getCustomModelInfo(modelName);
  
  if (!modelInfo || !modelInfo.group) {
    return null;
  }

  return modelInfo.group;
}

/**
 * 获取所有自定义厂商分组
 * @returns {Promise<object>} 厂商分组对象，键为厂商key，值为厂商信息
 */
export async function getAllCustomVendorGroups() {
  const config = await getCustomModelConfig();
  
  if (!config.enabled || !config.vendorInfo) {
    return {};
  }

  return config.vendorInfo;
}

/**
 * 检查是否启用了自定义模型配置
 * @returns {Promise<boolean>}
 */
export async function isCustomModelConfigEnabled() {
  const config = await getCustomModelConfig();
  return config.enabled;
}
