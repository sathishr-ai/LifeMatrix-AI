// Transparent synchronization client for Web & Mobile
// Intercepts localStorage operations to automatically synchronize data with the backend sync server

export const getApiUrl = (path: string) => {
  if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api${path}`;
  let host = window.location.hostname || '127.0.0.1';
  if (host === 'localhost') {
    host = '127.0.0.1';
  }
  return `http://${host}:5175/api${path}`;
};

const getCurrentUserEmail = (): string | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.email?.toLowerCase() || null;
    }
  } catch (e) {}
  return null;
};

const originalSetItem = window.localStorage.setItem;
const originalRemoveItem = window.localStorage.removeItem;

let isSyncingFromServer = false;

// 1. Core Sync Function to load all user-scoped data from the server
async function syncUserFromServer(email: string) {
  try {
    isSyncingFromServer = true;
    const res = await fetch(getApiUrl(`/userdata?email=${encodeURIComponent(email)}`));
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string') {
            originalSetItem.call(window.localStorage, key, value);
            // Instantly broadcast key updates to React UI widgets
            if (key === 'user_profile_pic') {
              window.dispatchEvent(new CustomEvent('profile-pic-changed', { detail: value }));
            }
          }
        });
      }
    }
  } catch (err) {
    console.warn('[SYNC CLIENT] Failed to fetch user data from server:', err);
  } finally {
    isSyncingFromServer = false;
  }
}

// 2. Override setItem to transparently sync modifications to backend
window.localStorage.setItem = function (key: string, value: string) {
  originalSetItem.apply(this, arguments as any);

  if (isSyncingFromServer) return;

  // Sync registered users list to backend when updated locally
  if (key === 'registeredUsers') {
    try {
      const users = JSON.parse(value);
      fetch(getApiUrl('/users'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users }),
      }).catch(err => console.warn('[SYNC CLIENT] Failed to sync users list to server:', err));
    } catch (e) {}
  }

  // If currentUser is being updated, trigger a sync to load their data
  if (key === 'currentUser') {
    try {
      const user = JSON.parse(value);
      if (user && user.email) {
        syncUserFromServer(user.email.toLowerCase());
      }
    } catch (e) {}
  }

  // Sync general user-scoped or clinical data to the backend under the active user session
  const email = getCurrentUserEmail();
  if (email && key !== 'registeredUsers' && key !== 'currentUser' && key !== 'theme') {
    fetch(getApiUrl('/userdata'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, key, value }),
    }).catch(err => console.warn(`[SYNC CLIENT] Failed to sync key ${key} to server:`, err));
  }
};

// 3. Override removeItem to transparently sync deletions to backend
window.localStorage.removeItem = function (key: string) {
  // 🛡️ CRITICAL SESSION ISOLATION ARMOR:
  // If the user is logging out (wiping 'currentUser'), immediately purge ALL user-scoped local keys
  // (profile picture, symptoms, logs) to prevent any cross-contamination with the next logged-in user!
  if (key === 'currentUser') {
    try {
      Object.keys(window.localStorage).forEach(k => {
        if (k !== 'registeredUsers' && k !== 'theme' && k !== 'currentUser') {
          originalRemoveItem.call(window.localStorage, k);
        }
      });
      // Reset all active global reactive UI state
      window.dispatchEvent(new CustomEvent('profile-pic-changed', { detail: null }));
    } catch (err) {}
  }

  originalRemoveItem.apply(this, arguments as any);

  if (isSyncingFromServer) return;

  const email = getCurrentUserEmail();
  if (email && key !== 'registeredUsers' && key !== 'currentUser') {
    fetch(getApiUrl('/userdata/remove'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, key }),
    }).catch(err => console.warn(`[SYNC CLIENT] Failed to delete key ${key} from server:`, err));
  }
};

// 4. Initialization on application mount
async function initSync() {
  console.log('[SYNC CLIENT] Initializing synchronization client...');

  // Pull registered users list from backend to merge local database
  try {
    const res = await fetch(getApiUrl('/users'));
    if (res.ok) {
      const { users } = await res.json();
      if (users && Array.isArray(users)) {
        isSyncingFromServer = true;
        
        // Overwrite local users cache with server's source of truth to reflect deletions and changes
        originalSetItem.call(window.localStorage, 'registeredUsers', JSON.stringify(users));
        isSyncingFromServer = false;
      }
    }
  } catch (err) {
    console.warn('[SYNC CLIENT] Sync server offline, running in standalone mode.', err);
  }

  // If currentUser is already logged in, sync their latest logs from backend on start
  const email = getCurrentUserEmail();
  if (email) {
    console.log(`[SYNC CLIENT] Active user session detected for ${email}, pulling latest clinical data...`);
    await syncUserFromServer(email);
  }
}

// Run initialization
initSync();
