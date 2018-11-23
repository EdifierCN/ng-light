import { StorageService, StorageConfig } from '@shared/modules/store';
import { LANG_KEY } from '@shared/modules/setting';

const config = new StorageConfig();
const storage = new StorageService(config);

export const LOCALE_LANGUAGE = storage.get(LANG_KEY) || 'zh-CN';
