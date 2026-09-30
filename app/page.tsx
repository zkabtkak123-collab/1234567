'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minus, X } from 'lucide-react'

const cameras = [
  ['CAM-01', 'TARGET RESIDENCE / LIVING ROOM', 'IR 850nm'],
  ['CAM-02', 'ALLEYWAY SOUTH', 'F1.8 / 4K'],
  ['CAM-03', 'BUILDING ENTRANCE B1', 'THERMAL OFF'],
  ['CAM-04', 'YEONHUI-RO CROSSING', 'ZOOM x2.4'],
  ['CAM-05', 'STAIRWELL EAST', 'LOW LIGHT'],
  ['CAM-06', 'PARKING LOT B1', 'WIDE 120°'],
]
const logs = [
  ['14:30:12', 'CAM-01', 'Living room lights on. Attempting phone call'],
  ['14:34:08', 'GPS-TRACE', 'Moving along Yanghwa-ro (speed 4.2 km/h)'],
  ['14:38:44', 'AUDIO', 'Voice detected: “Arriving in 10 minutes”'],
  ['14:42:18', 'CAM-05', 'Entered stairwell, descended to B2 at steady pace'],
]

function WindowBar({ onMenu }: { onMenu: () => void }) {
  return <div className="window-bar"><div className="window-brand"><span className="window-mark">◈</span><span>OC x CANON / TARGET SURVEILLANCE</span></div><nav><button onClick={onMenu}>FILE</button><button onClick={onMenu}>VIEW</button><button onClick={onMenu}>ARCHIVE</button><button onClick={onMenu}>HELP</button></nav><div className="window-controls"><button aria-label="Minimize"><Minus size={12}/></button><button aria-label="Maximize"><Maximize2 size={11}/></button><button aria-label="Close"><X size={12}/></button></div></div>
}

function Camera({ cam, index }: { cam: string[]; index: number }) {
  const [state, setState] = useState<'live' | 'signal' | 'off'>('live')
  useEffect(() => { const timer = setTimeout(() => setState(index === 1 ? 'signal' : index === 4 ? 'off' : 'live'), 500); return () => clearTimeout(timer) }, [index])
  return <motion.div className={`camera ${state}`} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .06 }}>
    {state === 'live' && <img src={`https://picsum.photos/seed/cctv${index + 11}/640/400`} alt="" className="feed" />}
    <div className="crt-glass" /><div className="camera-label">{cam[0]} <span>[{cam[1]}]</span></div>
    <div className="rec">{state === 'live' ? <><i /> REC</> : state === 'signal' ? '◼ LOST' : '◼ OFF'}</div>
    {state !== 'live' && <div className="camera-message">{state === 'signal' ? <>NO SIGNAL<small>LINK LOST / RECONNECTING</small></> : <>DISPLAY OFF<small>CAMERA POWER CUT</small></>}</div>}
    <div className="camera-time">2026-09-30 14:42:18<br/><span>{cam[2]}</span></div>
  </motion.div>
}

function Graph({ type, color = '#5dffc0' }: { type: 'ecg' | 'bars' | 'spectrum'; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => { const canvas = ref.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; let frame = 0; let raf = 0
    const draw = () => { const dpr = window.devicePixelRatio || 1; const w = canvas.clientWidth; const h = canvas.clientHeight; canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h); ctx.strokeStyle='#14302a'; ctx.lineWidth=1; for(let y=1;y<4;y++){ctx.beginPath();ctx.moveTo(0,h*y/4);ctx.lineTo(w,h*y/4);ctx.stroke()} for(let x=1;x<12;x++){ctx.beginPath();ctx.moveTo(w*x/12,0);ctx.lineTo(w*x/12,h);ctx.stroke()}
      if(type==='bars'){ for(let i=0;i<30;i++){const bh=(.2+.8*Math.abs(Math.sin(i*.7+frame*.035)))*(h-5);ctx.fillStyle=i>21?'#ff3b3b':i>15?'#ffb93b':color;ctx.fillRect(i*w/30+2,h-bh,w/30-4,bh)}}
      else if(type==='spectrum'){for(let i=0;i<36;i++){const bh=(.12+.8*Math.abs(Math.sin(i*.52+frame*.04)))*(h-3);ctx.fillStyle=i%5===0?'#ffb93b':'#6fb8ff';ctx.fillRect(i*w/36+1,h-bh,w/36-2,bh)}}
      else {ctx.beginPath(); for(let i=0;i<180;i++){const p=(i/180+frame*.002)%1; const spike=Math.exp(-Math.pow((p-.28)/.015,2))*1.1-Math.exp(-Math.pow((p-.25)/.015,2))*.25; const y=h*.55-spike*h*.46+Math.sin(i*.16+frame*.025)*1.2; i?ctx.lineTo(i*w/179,y):ctx.moveTo(0,y)} ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=7;ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0}
      frame++; raf=requestAnimationFrame(draw)}; draw(); return()=>cancelAnimationFrame(raf)
  }, [type,color]); return <canvas ref={ref} className="graph" aria-label={`${type} live chart`} />
}

function Metric({ title, value, children, wide=false }: { title:string; value:string; children:React.ReactNode; wide?:boolean }) { return <div className={`metric ${wide?'wide':''}`}><div className="metric-label"><span>{title}</span><strong>{value}</strong></div>{children}</div> }

export default function Page() {
  const [menu, setMenu] = useState(false); const [selected, setSelected] = useState('/archive'); const [entries, setEntries] = useState(logs)
  useEffect(()=>{const t=setInterval(()=>setEntries(e=>[...e, ['14:'+String(Math.floor(Math.random()*60)).padStart(2,'0')+':'+String(Math.floor(Math.random()*60)).padStart(2,'0'),'GPS-TRACE','Target movement confirmed / heading SE']].slice(-7)),4200); return()=>clearInterval(t)},[])
  return <main className="desktop"><section className="window"><WindowBar onMenu={()=>setMenu(true)} /><div className="window-menu"><button onClick={()=>setMenu(true)}>TARGET PROFILE</button><button>LIVE FEED</button><button>STATUS MONITOR</button><span className="window-status">● SECURE LINK / 09 SATELLITES</span></div><div className="workspace"><section className="camera-grid">{cameras.map((c,i)=><Camera key={c[0]} cam={c} index={i}/>)}</section><aside className="sidebar"><section className="panel profile"><h2>TARGET PROFILE <em>● LIVE</em><button onClick={()=>setMenu(true)}>MENU ≡</button></h2><div className="profile-row"><img src="https://picsum.photos/seed/subject7704/240/300" alt="Target profile"/><dl><dt>NAME</dt><dd>“Kang Sucheon”</dd><dt>STATUS</dt><dd className="red">UNDER DIRECT SURVEILLANCE</dd><dt>RISK</dt><dd className="amber">LEVEL 4 / ELEVATED</dd><dt>CASE</dt><dd>#KR-2291-A</dd></dl></div></section><section className="panel coords"><h2>LIVE COORDINATES <span>GPS FIX 9 SAT</span></h2><div className="coordinate">LAT <b>37.562241°N</b> LON <b>126.924812°E</b></div><dl className="compact"><dt>ALT</dt><dd>28.4 m</dd><dt>SPD</dt><dd>4.2 km/h</dd><dt>UPDATED</dt><dd>14:42:18</dd></dl></section><section className="panel timeline"><h2>ACTIVITY TIMELINE <span>{entries.length} ENTRIES</span></h2><div className="log">{entries.map((l,i)=><motion.div key={`${l[0]}-${i}`} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}><span>{l[0]}</span> <b className={l[1].includes('GPS')?'amber':l[1]==='AUDIO'?'pink':''}>[{l[1]}]</b> {l[2]}</motion.div>)}</div></section><section className="panel monitor"><h2>STATUS MONITOR <span className="amber">MOVING</span></h2><div className="metrics"><Metric title="ECG / HEART RATE" value="84 bpm" wide><Graph type="ecg" color="#ff6b6b"/></Metric><Metric title="THREAT GAUGE" value="36%"><div className="gauge"><span style={{transform:'rotate(-22deg)'}} /></div></Metric><Metric title="STRESS HISTORY" value="42"><Graph type="bars"/></Metric><Metric title="AUDIO SPECTRUM" value="-18 dB" wide><Graph type="spectrum"/></Metric></div></section></aside></div></section><AnimatePresence>{menu&&<motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setMenu(false)}><motion.div className="archive-window" initial={{y:18,scale:.97}} animate={{y:0,scale:1}} exit={{y:18,scale:.97}} onClick={e=>e.stopPropagation()}><div className="archive-title">OC x CANON / BACKUP ARCHIVE <button onClick={()=>setMenu(false)}>CLOSE (ESC)</button></div>{['/archive','/subjects','/canon','/casefile','/intercepts','/about'].map(p=><button key={p} className={selected===p?'selected':''} onClick={()=>{setSelected(p);setMenu(false)}}><b>{p}</b><span>{p==='/archive'?'작품 백업':p==='/subjects'?'OC 파일':p==='/canon'?'원작 자료':p==='/casefile'?'연재 로그':p==='/intercepts'?'단편과 메모':'안내'}</span><small>OC x CANON 기록 보관소</small></button>)}<footer>LAST BACKUP 2026-09-30 / ARCHIVE NODE: 04</footer></motion.div></motion.div>}</AnimatePresence></main>
}
