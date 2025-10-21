import fetch from 'isomorphic-unfetch';

const GITHUB_API = 'https://api.github.com';

function getRepoParts() {
  const repo = process.env.GITHUB_REPO;
  if (!repo) throw new Error('GITHUB_REPO not set');
  const [owner, repoName] = repo.split('/');
  return { owner, repoName };
}

async function getFile(path) {
  const { owner, repoName } = getRepoParts();
  const url = `${GITHUB_API}/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('GitHub getFile failed: ' + res.status);
  return await res.json();
}

async function putFile(path, contentString, message, branch='main', sha=null) {
  const { owner, repoName } = getRepoParts();
  const url = `${GITHUB_API}/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`;
  const body = { message, content: Buffer.from(contentString, 'utf8').toString('base64'), branch };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const j = await res.json();
  if (!res.ok) throw new Error('GitHub putFile failed: ' + JSON.stringify(j));
  return j;
}

async function deleteFile(path, message, branch='main', sha) {
  const { owner, repoName } = getRepoParts();
  const url = `${GITHUB_API}/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`;
  const body = { message, branch, sha };
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
  const j = await res.json();
  if (!res.ok) throw new Error('GitHub deleteFile failed: ' + JSON.stringify(j));
  return j;
}

export { getFile, putFile, deleteFile };
