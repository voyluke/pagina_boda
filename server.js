const path = require('path');
const express = require('express');
const crypto = require('crypto'); // built-in Node.js, no install needed

const app = express();
const port = process.env.PORT || 3000;

// ── Contraseña ──────────────────────────────────────────────────
// Para cambiarla, define la variable de entorno SITE_PASSWORD.
// Ejemplo: SITE_PASSWORD=MiContrasena node server.js
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'boda2026';

function tokenFor(pwd) {
  return crypto.createHash('sha256').update('anaMar-Mario-' + pwd).digest('hex');
}
const VALID_TOKEN = tokenFor(SITE_PASSWORD);

// ── Helpers ─────────────────────────────────────────────────────
function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(part => {
    const [k, ...v] = part.trim().split('=');
    out[k.trim()] = decodeURIComponent(v.join('='));
  });
  return out;
}

function isAuthenticated(req) {
  return parseCookies(req.headers.cookie).weddingAccess === VALID_TOKEN;
}

// ── Página de login ─────────────────────────────────────────────
function loginHTML(showError = false) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ana Mar &amp; Mario</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Montserrat', sans-serif;
      background: #5c1040;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1rem;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem 2rem;
      width: min(400px, 92vw);
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    h1 {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(3rem, 10vw, 4.5rem);
      color: #5c1040;
      line-height: 1.1;
      margin-bottom: 0.2rem;
    }
    .sparkle {
      display: block;
      color: rgba(92, 16, 64, 0.25);
      font-size: 1.1rem;
      letter-spacing: 0.5rem;
      margin: 0.4rem 0 1.2rem;
    }
    .sub {
      font-size: 0.8rem;
      color: rgba(42, 26, 40, 0.5);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.8rem;
    }
    label {
      display: block;
      text-align: left;
      font-size: 0.78rem;
      font-weight: 600;
      color: #5c1040;
      margin-bottom: 0.4rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid rgba(92, 16, 64, 0.22);
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      border-color: #e97132;
      box-shadow: 0 0 0 3px rgba(233, 113, 50, 0.15);
    }
    .error {
      margin-top: 0.55rem;
      font-size: 0.83rem;
      color: #b03030;
      text-align: left;
    }
    button {
      margin-top: 1.2rem;
      width: 100%;
      padding: 0.8rem;
      background: #e97132;
      color: #fff;
      border: none;
      border-radius: 999px;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }
    button:hover { opacity: 0.9; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Ana Mar &amp; Mario</h1>
    <span class="sparkle">✦ ✦</span>
    <p class="sub">7 de Noviembre 2026 · Tampico</p>
    <form method="POST" action="/login">
      <label for="pwd">Contraseña de acceso</label>
      <input type="password" id="pwd" name="password" placeholder="••••••••" autofocus required>
      ${showError ? '<p class="error">Contraseña incorrecta, intenta de nuevo.</p>' : ''}
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>`;
}

// ── Rutas de login (públicas) ────────────────────────────────────
app.use(express.urlencoded({ extended: false }));

app.get('/login', (req, res) => {
  if (isAuthenticated(req)) return res.redirect('/');
  res.send(loginHTML());
});

app.post('/login', (req, res) => {
  if (tokenFor(req.body.password) === VALID_TOKEN) {
    const exp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    res.setHeader(
      'Set-Cookie',
      `weddingAccess=${VALID_TOKEN}; Path=/; Expires=${exp}; HttpOnly; SameSite=Strict`
    );
    return res.redirect('/');
  }
  res.status(401).send(loginHTML(true));
});

// ── Guard: todo lo demás requiere autenticación ──────────────────
app.use((req, res, next) => {
  if (isAuthenticated(req)) return next();
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Wedding site running at http://localhost:${port}`);
  if (!process.env.SITE_PASSWORD) {
    console.log(`🔑  Contraseña por defecto: "boda2026" — define SITE_PASSWORD para cambiarla.`);
  }
});
