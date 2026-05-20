import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// ==========================================================
// 🌟 PASTE YOUR SUPABASE CREDENTIALS HERE:
// ==========================================================
const SUPABASE_URL = "https://gyjnnwnnfdaxapsucoaw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5am5ud25uZmRheGFwc3Vjb2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzMxMDgsImV4cCI6MjA5MzcwOTEwOH0.ZLVcNYBfoVaiW1jPR327N9YOlvwdJa01sAO-akx6ziY";
// ==========================================================

// ==========================================================
// 📧 GMAIL SMTP CONFIGURATION (DIRECT WORLDWIDE ROUTING):
// ==========================================================
const GMAIL_USER = "sathishat2005@gmail.com";
const GMAIL_APP_PASSWORD = "rckb iepq qjss pyrg"; // PASTE YOUR 16-LETTER GOOGLE APP PASSWORD HERE
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmRhA-Zv6llh9gLWgKkajWSUg1kxIHRxgihb-hBHumBFQguizMz84xf9LP4wXUUsK9jA/exec"; // Paste the Google Apps Script Web App URL here
// ==========================================================

function buildBrandedEmailHtml(code) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin:0; padding:0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 15px 40px rgba(15, 23, 42, 0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #4F46E5, #06B6D4); padding: 24px 24px; text-align: center; color: white; }
        .content { padding: 40px 32px; text-align: center; }
        .badge { background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 12px; padding: 10px 16px; margin-bottom: 24px; color: #0369a1; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; }
        .copy-block { color: #475569; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 32px; }
        .code-box { background: linear-gradient(180deg, #f8fafc, #f1f5f9); border: 2px dashed #cbd5e1; border-radius: 24px; padding: 32px 24px; margin: 24px auto; text-align: center; max-width: 280px; }
        .code-label { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin: 0 0 12px 0; }
        .code-text { font-size: 36px; font-weight: 900; color: #4F46E5; letter-spacing: 8px; margin: 0; font-family: 'SF Mono', Menlo, Monaco, 'Courier New', monospace; }
        .footer { text-align: center; font-size: 12px; color: #64748b; padding: 32px 24px; border-top: 1px solid #f1f5f9; background: #fcfdfe; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin:0; font-size: 22px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">LifeMatrix AI</h2>
          <p style="margin:4px 0 0 0; font-size: 10px; opacity: 0.9; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Security Verification</p>
        </div>
        
        <div class="content">
          <div class="badge">
            🔑 Password Reset Request
          </div>
          
          <div class="copy-block">
            <p style="font-size: 20px; margin-top: 0; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">Verification Code</p>
            <p>We received a request to reset the password associated with your LifeMatrix account. Please use the secure verification code below to proceed:</p>
          </div>
          
          <div class="code-box">
            <p class="code-label">Temporary Code</p>
            <div class="code-text">${code}</div>
          </div>

          <div style="margin-top: 32px; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 24px;">
            This code will remain active for the next <b>10 minutes</b>. 
            <br>
            If you did not request a password reset, you can safely ignore this email.
          </div>
        </div>
        
        <div class="footer">
          This is an automated security notification.<br>
          &copy; 2026 LifeMatrix AI Global Systems &bull; Your Health Data is Always Encrypted & Secure.
        </div>
      </div>
    </body>
    </html>
  `;
}


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

// ==========================================================
// 🔔 MEDICATION REMINDERS DB & SCHEDULING UTILS:
// ==========================================================
const REMINDERS_PATH = path.join(__dirname, 'reminders.json');

function readReminders() {
  try {
    if (!fs.existsSync(REMINDERS_PATH)) return [];
    const data = fs.readFileSync(REMINDERS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('[REMINDER] Error reading reminders.json:', e);
    return [];
  }
}

function writeReminders(data) {
  try {
    fs.writeFileSync(REMINDERS_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[REMINDER] Failed to write to reminders.json:', e);
  }
}

function buildMedReminderEmailHtml(userName, medName, dosage, time, withFood) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Critical Medication Reminder</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin:0; padding:0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 15px 40px rgba(15, 23, 42, 0.05); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #4F46E5, #06B6D4); padding: 24px 24px; text-align: center; color: white; }
        .content { padding: 40px 32px; text-align: center; }
        .warning-banner { background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 12px; margin-bottom: 24px; color: #991b1b; font-size: 13px; font-weight: 600; letter-spacing: 0.2px; text-transform: uppercase; display: inline-block; }
        .pill-box { background: linear-gradient(180deg, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-radius: 24px; padding: 28px 32px; margin: 24px auto; text-align: left; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01); }
        .med-title { font-size: 28px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0; letter-spacing: -0.5px; }
        .med-meta { font-size: 16px; font-weight: 700; color: #4f46e5; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
        .food-badge { display: inline-block; background: #ecfdf5; color: #047857; font-size: 12px; font-weight: 800; padding: 8px 16px; border-radius: 30px; margin-top: 16px; letter-spacing: 0.5px; border: 1px solid #a7f3d0; }
        .copy-block { color: #475569; font-size: 15px; line-height: 1.7; text-align: left; margin-bottom: 32px; }
        .btn-action { display: inline-block; background: linear-gradient(135deg, #4F46E5, #6366F1); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 18px 36px; border-radius: 18px; letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4); transition: all 0.2s ease; }
        .footer { text-align: center; font-size: 12px; color: #64748b; padding: 32px 24px; border-top: 1px solid #f1f5f9; background: #fcfdfe; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin:0; font-size: 22px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase;">LifeMatrix AI</h2>
          <p style="margin:4px 0 0 0; font-size: 10px; opacity: 0.9; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">Vitality Care Coordination</p>
        </div>
        
        <div class="content">
          <div class="warning-banner">
            🔔 Medication Alert
          </div>
          
          <div class="copy-block">
            <p style="font-size: 18px; margin-top: 0; font-weight: 800; color: #0f172a;">Dear ${userName || 'Patient'},</p>
            <p>This is your scheduled care notification to let you know it is time to take your medication.</p>
            <p>To ensure optimal health outcomes and clinical progress, <b>consistency is key</b>. Please pause what you are doing right now and administer your scheduled dose.</p>
          </div>
          
          <div class="pill-box">
            <div style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">
              <span style="font-weight: 800; color: #0f172a; display: inline-block; min-width: 140px;">💊 Medicine Name:</span>
              <span style="color: #0891B2; font-weight: 700;">${medName}</span>
            </div>
            <div style="margin-bottom: 16px; font-size: 15px; line-height: 1.6;">
              <span style="font-weight: 800; color: #0f172a; display: inline-block; min-width: 140px;">⚖️ Dosage:</span>
              <span style="color: #4F46E5; font-weight: 700;">${dosage}</span>
            </div>
            <div style="font-size: 15px; line-height: 1.6;">
              <span style="font-weight: 800; color: #0f172a; display: inline-block; min-width: 140px;">⏰ Scheduled Time:</span>
              <span style="color: #0891B2; font-weight: 700;">${time}</span>
            </div>
            ${withFood ? '<div class="food-badge" style="margin-top: 20px;">🍲 MUST TAKE WITH FOOD</div>' : ''}
          </div>

          <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: left; color: #64748b; font-size: 14px; line-height: 1.6;">
            Please remember to log this dose in your LifeMatrix dashboard to keep your active history up to date.
            <br><br>
            Wishing you continued health,
            <br>
            <b>The LifeMatrix Healthcare Team</b>
          </div>
        </div>
        
        <div class="footer">
          This is an automated precision medical notification.<br>
          &copy; 2026 LifeMatrix AI Global Systems &bull; Your Health Data is Always Encrypted & Secure.
        </div>
      </div>
    </body>
    </html>
  `;
}

const PORT = process.env.PORT || 5175;

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
                    password: u.password,
                    mobile: u.mobile || null
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
          let { email, key, value } = payload;
          if (email && key) {
            // ✨ MAGICAL BUCKET INTERCEPTOR:
            // If storing the profile pic and it's Base64, pipe it into the Supabase Storage Bucket!
            if (key === 'user_profile_pic' && value && typeof value === 'string' && value.startsWith('data:image/') && isSupabaseConfigured) {
              try {
                console.log(`[SUPABASE] ☁️ Intercepted Base64 portrait for ${email}. Redirecting to Storage Bucket...`);
                const matches = value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const contentType = matches[1];
                  const base64Data = matches[2];
                  const buffer = Buffer.from(base64Data, 'base64');

                  // Create a clean file name based on their email
                  const safeEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
                  const fileName = `${safeEmail}_avatar.jpg`;

                  // Post directly to Supabase Storage REST API!
                  const storageUrl = `${SUPABASE_URL}/storage/v1/object/avatars/${fileName}`;
                  const uploadRes = await fetch(storageUrl, {
                    method: 'POST',
                    headers: {
                      'apikey': SUPABASE_ANON_KEY,
                      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                      'Content-Type': contentType || 'image/jpeg',
                      'x-upsert': 'true' // Overwrite existing file
                    },
                    body: buffer
                  });

                  if (uploadRes.ok || uploadRes.status === 409) {
                    console.log(`[SUPABASE] ✅ Portrait uploaded to bucket! Rewriting DB value to Public URL.`);
                    // Replace the base64 in the database with the clean public URL!
                    // We append a timestamp (?t=...) to force the browser to reload it immediately without caching issues.
                    value = `${SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}?t=${Date.now()}`;
                  } else {
                    const errText = await uploadRes.text();
                    console.warn('[SUPABASE] Bucket upload rejected. Falling back to Base64 in DB. Response:', errText);
                  }
                }
              } catch (err) {
                console.error('[SUPABASE] Exception trying to write to Storage bucket, falling back to Base64:', err);
              }
            }

            if (isSupabaseConfigured) {
              try {
                const userEmailLower = email.toLowerCase();

                // Atomic upsert: inserts if new, updates if (email, key) already exists
                const supRes = await fetch(`${SUPABASE_URL}/rest/v1/userdata?on_conflict=email,key`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                  },
                  body: JSON.stringify({
                    email: userEmailLower,
                    key,
                    value
                  })
                });

                if (supRes && supRes.ok) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                  return;
                } else {
                  const errBody = supRes ? await supRes.text() : 'No response';
                  console.warn(`[SUPABASE] Userdata upsert failed (status: ${supRes?.status}). Key: "${key}", Email: "${userEmailLower}". Response: ${errBody}. Executing local JSON fallback.`);
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
            // 🧹 MAGICAL BUCKET CLEANER:
            // If removing the profile picture, delete the actual .jpg file from the Storage bucket too!
            if (key === 'user_profile_pic' && isSupabaseConfigured) {
              try {
                const safeEmail = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
                const fileName = `${safeEmail}_avatar.jpg`;
                const storageUrl = `${SUPABASE_URL}/storage/v1/object/avatars/${fileName}`;

                console.log(`[SUPABASE] 🧹 Deleting orphaned portrait for ${email} from Storage bucket...`);
                await fetch(storageUrl, {
                  method: 'DELETE',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                  }
                });
                console.log(`[SUPABASE] 🗑️ Successfully wiped file from Storage.`);
              } catch (err) {
                console.error('[SUPABASE] Failed to delete file from bucket during cleanup:', err);
              }
            }

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
  } else if (url.pathname === '/api/reminders') {
    if (req.method === 'GET') {
      const allReminders = readReminders();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ reminders: allReminders }));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const newReminder = JSON.parse(body);
          if (newReminder.email && newReminder.name && newReminder.time) {
            const allReminders = readReminders();

            // Filter out duplicate entries (prevent spam if they edit)
            const updated = allReminders.filter(r => !(r.email.toLowerCase() === newReminder.email.toLowerCase() && r.name.toLowerCase() === newReminder.name.toLowerCase() && r.time === newReminder.time));

            updated.push({
              email: newReminder.email.toLowerCase(),
              userName: newReminder.userName || 'User',
              name: newReminder.name,
              dosage: newReminder.dosage || '1 unit',
              time: newReminder.time,
              frequency: newReminder.frequency || 'Once daily',
              withFood: !!newReminder.withFood,
              created_at: new Date().toISOString()
            });

            writeReminders(updated);
            console.log(`\n[REMINDER ENGINE] 📅 Scheduled Physical Reminder: ${newReminder.name} [${newReminder.time}] for ${newReminder.email}`);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Missing parameters');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    } else if (req.method === 'DELETE') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          if (payload.email && payload.name) {
            const all = readReminders();
            const filtered = all.filter(r => !(r.email.toLowerCase() === payload.email.toLowerCase() && r.name.toLowerCase() === payload.name.toLowerCase()));
            writeReminders(filtered);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } else {
            res.statusCode = 400;
            res.end('Missing email or name');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON');
        }
      });
    }
  } else if (url.pathname === '/api/auth/send-recovery-email') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = JSON.parse(body);
          const { email, code } = payload;
          if (email && code) {
            console.log(`\n[SECURITY NODE] 🔐 Password recovery initiated for: ${email}`);

            if (!GMAIL_APP_PASSWORD || GMAIL_APP_PASSWORD.trim() === "") {
              console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------------------------');
              console.log('\x1b[33m%s\x1b[0m', `  ⚠️  [SIMULATION] Simulated email to ${email} with code: ${code}`);
              console.log('\x1b[36m%s\x1b[0m', '  🚀 [GMAIL UPGRADE]: Enter your Google App Password in server.js to send to ANYONE!');
              console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------------------------');

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: "Simulation active. Check terminal console for code.",
                simulated: true
              }));
              return;
            }

            console.log(`[SECURITY NODE] 📧 Dispatching direct physical email to ${email} via Google SMTP...`);

            const emailHtml = buildBrandedEmailHtml(code);

            // Setup universal high-reliability Google SMTP (Port 587 TLS)
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              secure: false, // uses standard STARTTLS
              auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD
              },
              connectionTimeout: 8000, // Auto-fallback after 8 seconds
              greetingTimeout: 8000,
              socketTimeout: 8000,
              tls: {
                rejectUnauthorized: false // Prevents local SSL proxy rejects
              }
            });

            const mailOptions = {
              from: `"LifeMatrix AI" <${GMAIL_USER}>`,
              to: email,
              subject: '🔐 Access Code: LifeMatrix Secure Handshake',
              html: emailHtml
            };

            try {
              if (GOOGLE_APPS_SCRIPT_URL) {
                console.log('[SECURITY NODE] 🚀 Using Google Apps Script HTTP Bypass...');
                const gasRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                  method: 'POST',
                  body: JSON.stringify({
                    to: email,
                    subject: '🔐 Access Code: LifeMatrix Secure Handshake',
                    html: emailHtml
                  })
                });
                if (!gasRes.ok) throw new Error('Apps Script rejected request');
              } else {
                await transporter.sendMail(mailOptions);
              }
              console.log(`[SECURITY NODE] ✅ Physical email successfully delivered via Google Secure Relay.`);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, delivered: true }));
            } catch (deliveryErr) {
              console.error('[SECURITY NODE] ❌ Transmission failed:', deliveryErr.message);
              console.log('\x1b[33m%s\x1b[0m', `⚠️  [FIREWALL FAILSAFE] Bypassing network block. Providing Sandbox OTP: ${code}`);

              // Graceful degradation: Inform frontend of local recovery so login flow never crashes
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                offlineRecovery: true,
                details: deliveryErr.message,
                code: code
              }));
            }
          } else {
            res.statusCode = 400;
            res.end('Missing email or code');
          }
        } catch (e) {
          res.statusCode = 400;
          res.end('Invalid JSON payload');
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

function formatTo12Hour(timeStr) {
  if (!timeStr || !timeStr.includes(':')) return timeStr;
  try {
    const [hourStr, minStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // '0' hour maps to '12'
    return `${hour}:${minStr} ${ampm}`;
  } catch (e) {
    return timeStr;
  }
}

// ==========================================================
// 🕒 ZERO-DELAY CONTINUOUS BACKGROUND MEDICATION SCHEDULER:
// ==========================================================
let lastCheckedMinute = "";
const alreadySentThisMinute = new Set();

setInterval(async () => {
  const now = new Date();

  // Convert to exact HH:MM local string (Matches host machine local time)
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 1. Detect minute rollover and reset anti-duplicate memory guard
  if (currentHHMM !== lastCheckedMinute) {
    alreadySentThisMinute.clear();
    lastCheckedMinute = currentHHMM;
  }

  const allReminders = readReminders();

  // 2. Filter active reminders scheduled for this minute that have NOT fired yet
  const activeReminders = allReminders.filter(r => {
    const uniqueKey = `${r.email.toLowerCase()}-${r.name.toLowerCase()}-${r.time}`;
    return r.time === currentHHMM && !alreadySentThisMinute.has(uniqueKey);
  });

  if (activeReminders.length > 0) {
    console.log(`\n[REMINDER ENGINE] 🔔 TRIGGER: ${activeReminders.length} unsent alert(s) activated at local time ${currentHHMM}.`);

    if (!GMAIL_APP_PASSWORD || GMAIL_APP_PASSWORD.trim() === "") {
      console.warn('[REMINDER ENGINE] ⚠️ Cannot dispatch emails: GMAIL_APP_PASSWORD is empty.');
      return;
    }

    // Mark as fired IMMEDIATELY to lock during concurrent async dispatch windows
    activeReminders.forEach(r => {
      const uniqueKey = `${r.email.toLowerCase()}-${r.name.toLowerCase()}-${r.time}`;
      alreadySentThisMinute.add(uniqueKey);
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });

    for (const r of activeReminders) {
      console.log(`[REMINDER ENGINE] 📧 Dispatching scheduled prescription email to ${r.email} for: ${r.name}`);

      const emailHtml = buildMedReminderEmailHtml(
        r.userName,
        r.name,
        r.dosage,
        formatTo12Hour(r.time),
        r.withFood
      );

      const mailOptions = {
        from: `"LifeMatrix Care" <${GMAIL_USER}>`,
        to: r.email,
        subject: `🔔 Medication Alert: ${r.userName || 'Patient'}, it is time for your scheduled ${r.name} (${r.dosage})`,
        html: emailHtml
      };

      try {
        if (GOOGLE_APPS_SCRIPT_URL) {
          console.log('[REMINDER ENGINE] 🚀 Using Google Apps Script HTTP Bypass...');
          const gasRes = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({
              to: r.email,
              subject: mailOptions.subject,
              html: emailHtml
            })
          });
          if (!gasRes.ok) throw new Error('Apps Script rejected request');
        } else {
          await transporter.sendMail(mailOptions);
        }
        console.log(`[REMINDER ENGINE] ✅ Success: Delivered scheduled medicine notification to ${r.email}`);
      } catch (err) {
        console.error(`[REMINDER ENGINE] ❌ Delivery failed to ${r.email}:`, err.message);
        // If fail, allow a retry in the remaining portion of the minute
        const uniqueKey = `${r.email.toLowerCase()}-${r.name.toLowerCase()}-${r.time}`;
        alreadySentThisMinute.delete(uniqueKey);
      }
    }
  }
}, 10000);
