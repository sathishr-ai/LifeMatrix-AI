import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// ==========================================================
// 🌟 PASTE YOUR SUPABASE CREDENTIALS HERE:
// ==========================================================
const SUPABASE_URL = "https://gyjnnwnnfdaxapsucoaw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5am5ud25uZmRheGFwc3Vjb2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzMxMDgsImV4cCI6MjA5MzcwOTEwOH0.ZLVcNYBfoVaiW1jPR327N9YOlvwdJa01sAO-akx6ziY";
// ==========================================================

// Check if Supabase keys are configured
const isSupabaseConfigured = true;

if (isSupabaseConfigured) {
  console.log('[BACKEND] ☁️ Supabase Cloud database connection detected! Active in cloud mode.');
} else {
  console.log('[BACKEND] 💾 Supabase keys not set. Running in local offline mode (db.json).');
}

// Ensure db.json exists with default pre-registered user as fallback
if (!fs.existsSync(DB_PATH)) {
  const initialDb = {
    users: [
      {
        name: 'Alex Johnson',
        email: 'test@example.com',
        password: 'password123'
      }
    ],
    userdata: {}
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading db.json, returning empty structure:', e);
    return { users: [], userdata: {} };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write to db.json:', e);
  }
}

const PORT = 5175;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/users') {
    if (req.method === 'GET') {
      if (isSupabaseConfigured) {
        try {
          const supRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
          if (supRes.ok) {
            const users = await supRes.json();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ users }));
            return;
          } else {
            console.warn('[SUPABASE] Failed to fetch users, response code:', supRes.status);
          }
        } catch (err) {
          console.error('[SUPABASE] Failed to connect, falling back to db.json:', err);
        }
      }

      // Fallback local DB mode
      const db = readDb();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ users: db.users || [] }));

    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          if (payload && Array.isArray(payload.users)) {
            if (isSupabaseConfigured) {
              try {
                // PostgREST upsert (Prefer: resolution=merge-duplicates)
                const supRes = await fetch(`${SUPABASE_URL}/rest/v1/users?on_conflict=email`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                  },
                  body: JSON.stringify(payload.users.map(u => ({
                    name: u.name,
                    email: u.email.toLowerCase(),
                    password: u.password
                  })))
                });
                if (supRes.ok) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                } else {
                  console.warn('[SUPABASE] Failed to upsert users, status:', supRes.status);
                }
              } catch (err) {
                console.error('[SUPABASE] Failed to sync users to Supabase, falling back:', err);
              }
            }

            // Fallback local DB mode
            const db = readDb();
            db.users = payload.users;
            writeDb(db);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Invalid payload. Expected { users: [] }');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    }

  } else if (url.pathname === '/api/userdata') {
    if (req.method === 'GET') {
      const email = url.searchParams.get('email');
      if (email) {
        if (isSupabaseConfigured) {
          try {
            const supRes = await fetch(`${SUPABASE_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email.toLowerCase())}`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
              }
            });
            if (supRes.ok) {
              const rows = await supRes.json();
              const mappedData = {};
              rows.forEach(row => { mappedData[row.key] = row.value; });
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mappedData));
              return;
            } else {
              console.warn('[SUPABASE] Failed to fetch userdata, status:', supRes.status);
            }
          } catch (err) {
            console.error('[SUPABASE] Failed to connect, falling back to db.json:', err);
          }
        }

        // Fallback local DB mode
        const db = readDb();
        const userdata = db.userdata || {};
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(userdata[email.toLowerCase()] || {}));
      } else {
        res.statusCode = 400;
        res.end('Email parameter is required');
      }

    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const { email, key, value } = payload;
          if (email && key) {
            if (isSupabaseConfigured) {
              try {
                // PostgREST upsert (Prefer: resolution=merge-duplicates)
                const supRes = await fetch(`${SUPABASE_URL}/rest/v1/userdata?on_conflict=email,key`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                  },
                  body: JSON.stringify({
                    email: email.toLowerCase(),
                    key,
                    value
                  })
                });
                if (supRes.ok) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                } else {
                  console.warn('[SUPABASE] Failed to upsert userdata, status:', supRes.status);
                }
              } catch (err) {
                console.error('[SUPABASE] Failed to sync userdata to Supabase, falling back:', err);
              }
            }

            // Fallback local DB mode
            const db = readDb();
            if (!db.userdata) db.userdata = {};
            const userEmail = email.toLowerCase();
            if (!db.userdata[userEmail]) db.userdata[userEmail] = {};

            db.userdata[userEmail][key] = value;
            writeDb(db);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Missing required fields email or key');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    }

  } else if (url.pathname === '/api/userdata/remove') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const { email, key } = payload;
          if (email && key) {
            if (isSupabaseConfigured) {
              try {
                const supRes = await fetch(`${SUPABASE_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email.toLowerCase())}&key=eq.${encodeURIComponent(key)}`, {
                  method: 'DELETE',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                  }
                });
                if (supRes.ok) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                } else {
                  console.warn('[SUPABASE] Failed to delete userdata row, status:', supRes.status);
                }
              } catch (err) {
                console.error('[SUPABASE] Failed to delete userdata row on Supabase, falling back:', err);
              }
            }

            // Fallback local DB mode
            const db = readDb();
            if (db.userdata && db.userdata[email.toLowerCase()]) {
              delete db.userdata[email.toLowerCase()][key];
              writeDb(db);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Missing required fields email or key');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    }

  } else if (url.pathname === '/api/users/delete') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const { email } = payload;
          if (email) {
            if (isSupabaseConfigured) {
              try {
                // PostgREST DELETE on users. Since cascade delete is set on userdata, this wipes everything!
                const supRes = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email.toLowerCase())}`, {
                  method: 'DELETE',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                  }
                });
                if (supRes.ok) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                } else {
                  console.warn('[SUPABASE] Failed to delete user, status:', supRes.status);
                }
              } catch (err) {
                console.error('[SUPABASE] Failed to delete user from Supabase, falling back:', err);
              }
            }

            // Fallback local DB mode
            const db = readDb();
            const userEmail = email.toLowerCase();
            db.users = (db.users || []).filter(u => u.email.toLowerCase() !== userEmail);
            if (db.userdata && db.userdata[userEmail]) {
              delete db.userdata[userEmail];
            }
            writeDb(db);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Missing email');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    }
  } else {
    res.statusCode = 404;
    res.end('Endpoint Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[BACKEND SYNC] Server running on http://0.0.0.0:${PORT}`);
});
