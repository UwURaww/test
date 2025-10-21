import { getFile, putFile } from '../../../lib/github';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const idx = await getFile('scripts/index.json');
      if (!idx) return res.json({ scripts: [] });
      const content = Buffer.from(idx.content, 'base64').toString('utf8');
      const j = JSON.parse(content);
      return res.json({ scripts: j.scripts || [] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (req.method === 'POST') {
    const { name, content, type } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name required' });
    const id = nanoid(12);
    const scriptObj = { id, name, type: type || 'protected', content: content || '', createdAt: new Date().toISOString() };
    try {
      await putFile(`scripts/${id}.json`, JSON.stringify(scriptObj, null, 2), `Add script ${name}`);
      const idx = await getFile('scripts/index.json');
      let idxObj = { scripts: [] };
      if (idx) idxObj = JSON.parse(Buffer.from(idx.content, 'base64').toString('utf8'));
      idxObj.scripts = [ { id: scriptObj.id, name: scriptObj.name, type: scriptObj.type, createdAt: scriptObj.createdAt }, ...idxObj.scripts ];
      await putFile('scripts/index.json', JSON.stringify(idxObj, null, 2), `Update index with ${name}`, 'main');
      return res.json({ ok: true, script: scriptObj });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  res.status(405).end();
}
