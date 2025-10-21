export default function handler(req, res) {
  const { ADMIN_PASSWORD } = process.env;
  if (!ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not set' });
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    const token = Math.random().toString(36).slice(2);
    res.setHeader('Set-Cookie', `zpm_token=${token}; HttpOnly; Path=/; Max-Age=86400`);
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'invalid' });
}
