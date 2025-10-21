export default function handler(req, res) {
  res.setHeader('Set-Cookie', `zpm_token=deleted; HttpOnly; Path=/; Max-Age=0`);
  return res.json({ ok: true });
}
