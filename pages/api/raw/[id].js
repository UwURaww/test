import { getFile } from '../../../lib/github';
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const f = await getFile(`scripts/${id}.json`);
    if (!f) return res.status(404).send('Not found');
    const obj = JSON.parse(Buffer.from(f.content, 'base64').toString('utf8'));
    res.setHeader('Content-Type', 'text/plain');
    return res.send(obj.content || '');
  } catch (e) { return res.status(500).send('Server error'); }
}
