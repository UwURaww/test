import { getFile, putFile, deleteFile } from '../../../lib/github';

function parseCookies(cookie = '') {
  return Object.fromEntries(cookie.split(';').map(s=>s.split('=').map(x=>x && x.trim())).filter(Boolean));
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'no id' });

  if (req.method === 'GET') {
    try {
      const f = await getFile(`scripts/${id}.json`);
      if (!f) return res.status(404).json({ error: 'not found' });
      const obj = JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'));
      if (obj.type === 'protected') {
        return res.json({ id: obj.id, name: obj.name, type: obj.type, createdAt: obj.createdAt, protected: true });
      }
      return res.json({ script: obj });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  const cookies = parseCookies(req.headers.cookie || '');
  if (!cookies.zpm_token) return res.status(401).json({ error: 'not authorized' });

  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const f = await getFile(`scripts/${id}.json`);
      if (!f) return res.status(404).json({ error: 'not found' });
      const old = JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'));
      const updated = { ...old, name: body.name || old.name, content: body.content !== undefined ? body.content : old.content, type: body.type || old.type, updatedAt: new Date().toISOString() };
      await putFile(`scripts/${id}.json`, JSON.stringify(updated, null, 2), `Update script ${updated.name}`, 'main', f.sha);
      const idxF = await getFile('scripts/index.json');
      if (idxF) {
        const idx = JSON.parse(Buffer.from(idxF.content, 'base64').toString('utf8'));
        idx.scripts = idx.scripts.map(s=> s.id===id ? { id, name: updated.name, type: updated.type, createdAt: updated.createdAt } : s);
        await putFile('scripts/index.json', JSON.stringify(idx, null, 2), `Update index for ${updated.name}`, 'main', idxF.sha);
      }
      return res.json({ ok: true, script: updated });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'DELETE') {
    try {
      const f = await getFile(`scripts/${id}.json`);
      if (!f) return res.status(404).json({ error: 'not found' });
      await deleteFile(`scripts/${id}.json`, `Remove script ${id}`, 'main', f.sha);
      const idxF = await getFile('scripts/index.json');
      if (idxF) {
        const idx = JSON.parse(Buffer.from(idxF.content, 'base64').toString('utf8'));
        idx.scripts = idx.scripts.filter(s=>s.id!==id);
        await putFile('scripts/index.json', JSON.stringify(idx, null, 2), `Update index remove ${id}`, 'main', idxF.sha);
      }
      return res.json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
}
