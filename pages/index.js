import { useEffect, useState } from 'react';

function ScriptItem({s, onCopy, onEdit, onDelete}) {
  return (<div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
    <div style={{flex:1}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{fontWeight:700}}>{s.name}</div><div className="small">{s.type}</div></div></div>
    <div style={{display:'flex', gap:8}}>
      <button className="btn" onClick={()=>onCopy(s.id)}>Copy link</button>
      <button className="btn" onClick={()=>onEdit(s)}>Edit</button>
      <button className="btn" onClick={()=>onDelete(s.id)}>Delete</button>
    </div>
  </div>)
}

export default function Dashboard(){
  const [scripts,setScripts]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [form,setForm]=useState({name:'',content:'',type:'protected',id:null});
  useEffect(()=>{ fetch('/api/scripts').then(r=>r.json()).then(j=>setScripts(j.scripts||[])).catch(()=>{}); },[]);

  function openAdd(){ setForm({name:'',content:'',type:'protected',id:null}); setShowModal(true); }
  async function save(){
    const payload = { name: form.name, content: form.content, type: form.type };
    const r = await fetch('/api/scripts', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload) });
    const j = await r.json();
    if (r.ok) { setScripts(prev=>[j.script,...prev]); setShowModal(false); }
    else alert(j.error||'Error');
  }
  function edit(s){ setForm(s); setShowModal(true); }
  async function del(id){ if(!confirm('Delete?')) return; const r = await fetch('/api/scripts/'+id, { method:'DELETE' }); if (r.ok) setScripts(prev=>prev.filter(x=>x.id!==id)); else alert('Error'); }
  function copyLink(id){ const url = location.origin + '/s/' + id; navigator.clipboard.writeText(url); alert('Link copied'); }

  return (<div className="container"><header className="header"><h1>ZumProtect — Safe Script Manager</h1><div><button className="btn" onClick={openAdd}>Upload Script</button></div></header><main style={{marginTop:16}}>{scripts.length===0 ? <div className="card">No scripts yet.</div> : scripts.map(s=> <ScriptItem key={s.id} s={s} onCopy={copyLink} onEdit={edit} onDelete={del} />)}</main>{showModal && (<div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)'}}><div className="card" style={{width:760}}><h3>{form.id ? 'Edit Script' : 'Upload Script'}</h3><input className="w-full p-2 mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><select className="w-48 p-2 mb-2" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="protected">Protected</option><option value="open">Open Source</option></select><textarea className="w-full code-box" rows={10} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} /><div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:8}}><button className="btn" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn" onClick={save}>Add script</button></div></div></div>)}</div>)
