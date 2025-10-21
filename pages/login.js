import { useState } from 'react';
import Router from 'next/router';
export default function Login(){ 
  const [password,setPassword]=useState(''); const [err,setErr]=useState('');
  async function submit(e){ e.preventDefault(); const r = await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password})}); if (r.ok) Router.push('/'); else { const j=await r.json(); setErr(j.error||'Invalid'); } }
  return (<div className="container center-screen"><div className="card" style={{maxWidth:520}}><h1>ZumProtect — Admin login</h1><form onSubmit={submit}><input className="w-full p-2 mb-2" type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} /><div style={{display:'flex', gap:8, justifyContent:'flex-end'}}><button className="btn" type="submit">Sign in</button></div>{err && <div style={{color:'#f87171', marginTop:8}}>{err}</div>}</form></div></div>)
}
