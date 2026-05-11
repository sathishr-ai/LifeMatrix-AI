export function getScopedKey(baseKey: string): string {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return baseKey;
  try {
    const user = JSON.parse(userStr);
    return user?.email ? `${user.email}_${baseKey}` : baseKey;
  } catch (e) {
    return baseKey;
  }
}

export function getStorageItem(key: string, defaultValue: string = ''): string {
  const scopedKey = getScopedKey(key);
  return localStorage.getItem(scopedKey) || defaultValue;
}

export function setStorageItem(key: string, value: string): void {
  const scopedKey = getScopedKey(key);
  localStorage.setItem(scopedKey, value);
}

export function removeStorageItem(key: string): void {
  const scopedKey = getScopedKey(key);
  localStorage.removeItem(scopedKey);
}
