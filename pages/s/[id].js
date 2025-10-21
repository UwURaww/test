import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Viewer() {
  const router = useRouter();
  const { id } = router.query;
  const [script, setScript] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(()=>{
    if (!id) return;
    fetch('/api/scripts/' + id).then(r=>r.json()).then(j=>{
      if (j.error) { setMeta({ error: j.error }); return; }
      if (j.script) setScript(j.script);
      else setMeta({ protected: j.protected, name: j.name, type: j.type });
    }).catch(e=>setMeta({ error: e.message }));
  }, [id]);

  if (meta && meta.error) return (<div className="container center-screen"><div className="card">{meta.error}</div></div>);
  if (meta && meta.protected) {
    return (<div className="container center-screen"><div className="card shield-wrap"> 
      <div style={{width:160, height:160, borderRadius:9999, background:'linear-gradient(180deg, rgba(124,58,237,0.18), rgba(124,58,237,0.05))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 30px rgba(124,58,237,0.12)'}}>
        <div style={{width:90, height:90, borderRadius:9999, background:'#0b1020', display:'flex', alignItems:'center', justifyContent:'center', border:'3px solid rgba(124,58,237,0.6)'}}>
          <div style={{fontSize:48, color:'#eecbf7'}}>✖</div>
        </div>
      </div>
      <div style={{textAlign:'center'}}>
        <h2 style={{fontSize:20, marginBottom:6}}>This script is protected by ZumProtect</h2>
        <div className="small">Unauthorized access is restricted. Executors may load the protected script via this link programmatically.</div>
      </div>
    </div></div>);
  }

  if (!script) return (<div className="container center-screen"><div className="card">Loading…</div></div>);

  return (<div className="container"><div className="card"><h2>{script.name}</h2><pre className="code-box">{script.content}</pre><div style={{marginTop:12}}><a className="btn" href={'/api/raw/'+script.id}>Download</a></div></div></div>)
}
