import { useState, useEffect, useRef } from "react";
const boomSound = new Audio("https://www.soundjay.com/explosion/explosion-01.mp3");
const winSound = new Audio("https://www.soundjay.com/human/cheering-01.mp3");

// Background music - starts on game start, loops till result screen
const backgroundMusic = new Audio("/Sound/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.7;

// KBC sound - plays when next question is clicked
const kbcSound = new Audio("/Sound/kbc.mp3");
kbcSound.volume = 1.0;

// Applause sound - for winner/runner-up (loops on result pages)
const applauseSound = new Audio("/Sound/applause.mp3");
applauseSound.loop = true;
applauseSound.volume = 1.0;

// Funny fanfare sound - for winner page (loops on winner page)
const funnyFanfare = new Audio("/Sound/funnyfanfare.mp3");
funnyFanfare.loop = true;
funnyFanfare.volume = 0.7;

// Heartbeat sound - for result transition
const heartbeatSound = new Audio("https://www.soundjay.com/human/heartbeat-01.mp3");
heartbeatSound.volume = 0.6;

// Buzzer sound - plays when 2 seconds remain on timer
const buzzerSound = new Audio("/Sound/buzzer.mp3");
buzzerSound.volume = 1.0;

const TEAMS_DEFAULT = ["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"];

const ROUNDS = [
  { id:1, name:"Define It!", emoji:"🔵", color:"#3B82F6", points:10, timer:20, format:"Written",
    questions:[
      {q:"Blue Ocean Strategy",a:"A strategy that creates new uncontested market space instead of competing in existing markets."},
      {q:"ATL Marketing",a:"Above The Line – mass media advertising like TV, radio, print aimed at a broad audience."},
      {q:"BTL Marketing",a:"Below The Line – targeted, direct marketing like events, email, and in-store promotions."},
      {q:"USP",a:"Unique Selling Proposition – the distinct benefit that makes a product stand out from competitors."},
      {q:"STP Model",a:"Segmentation, Targeting, and Positioning – a core marketing strategy framework."},
      {q:"CAC",a:"Customer Acquisition Cost – total cost spent to acquire a new customer."},
      {q:"Brand Equity",a:"The value a brand adds to a product based on consumer perception, loyalty, and recognition."},
      {q:"Market Penetration",a:"A growth strategy focused on increasing sales of existing products in existing markets."},
      {q:"Co-branding",a:"A partnership between two brands to market a product together, leveraging both brand equities."},
      {q:"Positioning",a:"Creating a specific image or identity for a product in the mind of the consumer."},
      {q:"AIDA Model",a:"Awareness, Interest, Desire, Action – stages a consumer goes through before purchase."},
      {q:"Ansoff Matrix",a:"A strategic planning tool showing growth options via market/product combinations."},
      {q:"CLV",a:"Customer Lifetime Value – total revenue a business expects from one customer over their relationship."},
      {q:"Guerrilla Marketing",a:"Unconventional, low-cost marketing tactics designed to create surprise and word-of-mouth."},
      {q:"Porter's 5 Forces",a:"A framework analyzing competitive forces: rivalry, suppliers, buyers, substitutes, new entrants."},
    ]},
  { id:2, name:"Fill in the Blank", emoji:"🟡", color:"#EAB308", points:15, timer:15, format:"Buzzer",
    questions:[
      {q:"The process of dividing a market into distinct groups is called ______.",a:"Market Segmentation"},
      {q:"______ marketing refers to advertising on platforms like Facebook, Instagram, and LinkedIn.",a:"Social Media Marketing"},
      {q:"A ______ is a visual representation of a consumer's experience with a brand over time.",a:"Customer Journey Map"},
      {q:"The ______ is the additional revenue generated from selling one more unit.",a:"Marginal Revenue"},
      {q:"______ is the percentage of users who click on a link out of total who see it.",a:"CTR (Click-Through Rate)"},
      {q:"The BCG Matrix classifies products into Stars, Cash Cows, Question Marks, and ______.",a:"Dogs"},
      {q:"______ bias occurs when consumers prefer products they have seen more frequently.",a:"Mere Exposure"},
      {q:"The strategy of setting a low price to gain market share quickly is called ______.",a:"Penetration Pricing"},
      {q:"______ is unwanted, unsolicited commercial email or messages.",a:"Spam"},
      {q:"______ is the practice of charging different prices to different customer segments.",a:"Price Discrimination"},
      {q:"A ______ is a marketing technique where a cheaper item attracts customers, who are then upsold.",a:"Loss Leader"},
      {q:"______ refers to the total market demand available if a product achieved 100% market share.",a:"TAM (Total Addressable Market)"},
    ]},
  { id:3, name:"Logo to Lingo", emoji:"🟠", color:"#F97316", points:20, timer:30, format:"Written",
    questions:[
      {q:"Nike's 'Just Do It' campaign",a:"Emotional Branding / Aspirational Marketing"},
      {q:"Coca-Cola's 'Share a Coke' campaign",a:"Personalization Marketing / Mass Customization"},
      {q:"Apple launching the iPhone at a premium price",a:"Skimming Pricing Strategy"},
      {q:"Amazon's 'Customers who bought this also bought...'",a:"Cross-selling / Recommendation Engine"},
      {q:"Dove's 'Real Beauty' campaign",a:"Cause Marketing / Social Purpose Marketing"},
      {q:"Red Bull sponsoring extreme sports events",a:"Experiential Marketing / Event Sponsorship"},
      {q:"McDonald's 'I'm Lovin' It' jingle",a:"Sonic Branding / Jingle Marketing"},
      {q:"Zomato's witty social media posts going viral",a:"Content Marketing / Viral Marketing"},
      {q:"Amazon Prime offering free shipping for subscribers",a:"Loyalty Program / Subscription Marketing"},
      {q:"Puma & Ferrari co-branded merchandise",a:"Co-branding / Brand Collaboration"},
    ]},
  { id:4, name:"Speed Lingo", emoji:"🔴", color:"#EF4444", points:25, timer:10, format:"Buzzer",
    questions:[
      {q:"What does NPS stand for?",a:"Net Promoter Score"},
      {q:"What is 'Churn Rate'?",a:"The percentage of customers who stop using a product or service in a given period."},
      {q:"What does ROI stand for?",a:"Return on Investment"},
      {q:"Which pricing strategy sets a high initial price that decreases over time?",a:"Price Skimming"},
      {q:"What is 'Viral Marketing'?",a:"A strategy where content spreads rapidly through word-of-mouth, often via social media."},
      {q:"Full form of SEO?",a:"Search Engine Optimization"},
      {q:"What is 'Cognitive Dissonance' in consumer behaviour?",a:"Post-purchase doubt or discomfort a buyer feels after making a decision."},
      {q:"What does CPC stand for in digital ads?",a:"Cost Per Click"},
      {q:"What is a 'Unique Selling Point' also called?",a:"USP or Value Proposition"},
      {q:"What is 'Retargeting'?",a:"Showing ads to users who previously visited your website or engaged with your brand."},
      {q:"What is the 'Halo Effect' in marketing?",a:"A consumer's overall positive impression of a brand influencing perception of its products."},
      {q:"What does ROAS stand for?",a:"Return on Ad Spend"},
      {q:"What is 'Freemium'?",a:"A pricing model where basic features are free, and premium features are paid."},
      {q:"What is 'Brand Ambassador'?",a:"A person who officially represents and promotes a brand, typically a celebrity or influencer."},
      {q:"What is 'Impulse Buying'?",a:"Unplanned purchase made on the spot without prior intention."},
      {q:"What does B2B stand for?",a:"Business to Business"},
      {q:"What is 'Cause Marketing'?",a:"A collaborative marketing strategy between a for-profit business and a non-profit organization."},
      {q:"What is 'Market Share'?",a:"The percentage of total sales in a market captured by a particular company."},
      {q:"What is a 'Brand Recall'?",a:"The ability of consumers to remember a brand when prompted by a product category."},
      {q:"What is 'Omnichannel Marketing'?",a:"A strategy that provides a seamless customer experience across all channels and touchpoints."},
    ]},
];

// ── Confetti ────────────────────────────────────────────────────────────────
function Confetti({ colors = ["#FF4444","#FFD700","#00BFFF","#FF69B4","#7B68EE","#00FF7F"] }) {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const pieces = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * 3 + 2, vx: (Math.random() - 0.5) * 2,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

// ── Floating Particles ───────────────────────────────────────────────────────
function Particles() {
  const items = Array.from({length:20},(_,i)=>i);
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {items.map(i=>{
        const size=Math.random()*6+2, left=Math.random()*100, delay=Math.random()*8, dur=Math.random()*10+8;
        return <div key={i} style={{
          position:"absolute", left:`${left}%`, bottom:"-10px",
          width:size, height:size, borderRadius:"50%",
          background:`rgba(139,92,246,${Math.random()*0.6+0.2})`,
          boxShadow:`0 0 ${size*2}px rgba(139,92,246,0.8)`,
          animation:`floatUp ${dur}s ${delay}s infinite linear`,
        }}/>;
      })}
      <style>{`
        @keyframes shake{0%{transform:translate(0,0);}25%{transform:translate(5px,-5px);}50%{transform:translate(-5px,5px);}75%{transform:translate(5px,5px);}100%{transform:translate(0,0);}}
        @keyframes fadeOut{from{opacity:1;}to{opacity:0;}}
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0.8}100%{transform:translateY(-110vh) scale(0);opacity:0}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.08);opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.5)}50%{box-shadow:0 0 40px rgba(239,68,68,0.9),0 0 60px rgba(139,92,246,0.4)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        @keyframes zoomIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes curtainLeft{from{transform:translateX(0)}to{transform:translateX(-100%)}}
        @keyframes curtainRight{from{transform:translateX(0)}to{transform:translateX(100%)}}
        @keyframes timerPulse{0%,100%{box-shadow:0 0 15px rgba(239,68,68,0.6)}50%{box-shadow:0 0 35px rgba(239,68,68,1),0 0 50px rgba(239,68,68,0.4)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(2.5);opacity:0}}
      `}</style>
    </div>
  );
}

// ── Timer ────────────────────────────────────────────────────────────────────
function Timer({seconds, running, timerKey}) {
  const [left,setLeft]=useState(seconds);
  const [hasBuzzed,setHasBuzzed]=useState(false);
  const ref=useRef();
  useEffect(()=>{setLeft(seconds);setHasBuzzed(false);},[timerKey]);
  useEffect(()=>{
    if(!running){clearInterval(ref.current);return;}
    ref.current=setInterval(()=>{
      setLeft(p=>{
        // Play buzzer sound when 2 seconds remain
        if(p<=2 && !hasBuzzed){
          setHasBuzzed(true);
          // Lower background music to 20% and play buzzer at 100%
          backgroundMusic.volume = 0.2;
          buzzerSound.currentTime = 0;
          buzzerSound.play().catch(e => console.log("Buzzer play failed:", e));
          // Restore background music after buzzer ends
          setTimeout(() => {
            backgroundMusic.volume = 0.7;
          }, 3000);
        }
        if(p<=1){clearInterval(ref.current);return 0;}return p-1;
      });
    },1000);
    return()=>clearInterval(ref.current);
  },[running,hasBuzzed]);
  const pct=(left/seconds)*100;
  const col=pct>50?"#22C55E":pct>25?"#EAB308":"#EF4444";
  const mm=String(Math.floor(left/60)).padStart(2,"0"), ss=String(left%60).padStart(2,"0");
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{fontSize:42,fontWeight:900,fontFamily:"monospace",color:col,
        textShadow:`0 0 20px ${col}`,animation:running&&left<=2?"timerPulse 0.5s infinite":"none"}}>
        {mm}:{ss}
      </div>
      <div style={{width:"100%",height:6,background:"rgba(255,255,255,0.1)",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${col},${col}99)`,
          transition:"width 1s linear",boxShadow:`0 0 10px ${col}`}}/>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("home");
  const [teams,setTeams]=useState(TEAMS_DEFAULT);
  const [teamInput,setTeamInput]=useState(TEAMS_DEFAULT.join("\n"));
  const [scores,setScores]=useState({});
  const [roundIdx,setRoundIdx]=useState(0);
  const [qIdx,setQIdx]=useState(0);
  const [showAnswer,setShowAnswer]=useState(false);
  const [timerKey,setTimerKey]=useState(0);
  const [timerRunning,setTimerRunning]=useState(false);
  const [awarded,setAwarded]=useState({});
  const [eliminated,setEliminated]=useState([]);
  const [curtainOpen,setCurtainOpen]=useState(false);
  const [flash,setFlash]=useState(false);useEffect(() => {if (!flash) return;const clearFlash = setTimeout(() => {setFlash(false);}, 700);return () => clearTimeout(clearFlash);}, [flash]);
  const [showHeartbeat,setShowHeartbeat]=useState(false);
  const [prevScreen,setPrevScreen]=useState("home");

  // Handle background music - play during quiz, pause on result screen
  useEffect(() => {
    if (screen === "resultMenu" || screen === "results" || screen === "home" || screen === "setup") {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }, [screen]);

  // Handle looping sounds for runner-up and winner pages
  useEffect(() => {
    if (screen === "runnerup") {
      applauseSound.currentTime = 0;
      applauseSound.play().catch(e => console.log("Applause play failed:", e));
    } else if (prevScreen === "runnerup" && screen !== "runnerup") {
      applauseSound.pause();
      applauseSound.currentTime = 0;
    }
    if (screen === "winner") {
      applauseSound.currentTime = 0;
      applauseSound.play().catch(e => console.log("Applause play failed:", e));
      funnyFanfare.currentTime = 0;
      funnyFanfare.play().catch(e => console.log("Funny fanfare play failed:", e));
    } else if (prevScreen === "winner" && screen !== "winner") {
      applauseSound.pause();
      applauseSound.currentTime = 0;
      funnyFanfare.pause();
      funnyFanfare.currentTime = 0;
    }
    setPrevScreen(screen);
  }, [screen]);

  // Restore background music volume to 70% after KBC sound ends
  useEffect(() => {
    kbcSound.onended = () => {
      backgroundMusic.volume = 0.7;
    };
  }, []);

  const round=ROUNDS[roundIdx];
  const question=round?.questions[qIdx];
  const sortedTeams=[...teams].sort((a,b)=>(scores[b]||0)-(scores[a]||0));
  const activeTeams=teams.filter(t=>!eliminated.includes(t));

  function startGame(){
    const t=teamInput.split("\n").map(s=>s.trim()).filter(Boolean);
    setTeams(t);const s={};t.forEach(n=>s[n]=0);
    setScores(s);setEliminated([]);setRoundIdx(0);setQIdx(0);
    setShowAnswer(false);setTimerRunning(false);setAwarded({});setTimerKey(0);
    setScreen("round");
    // Start background music
    backgroundMusic.play().catch(e => console.log("Audio play failed:", e));
  }

  function awardPoints(team,pts){
    setScores(prev=>({...prev,[team]:(prev[team]||0)+pts}));
    setAwarded(prev=>({...prev,[team]:(prev[team]||0)+pts}));
  }

  function nextQuestion(){
    const isLastQ=qIdx+1>=round.questions.length;
    const isLastR=roundIdx+1>=ROUNDS.length;

    // If this is the last question of the last round, show heartbeat animation then result menu
    if(isLastQ && isLastR){
      setShowHeartbeat(true);
      heartbeatSound.currentTime = 0;
      heartbeatSound.play().catch(e => console.log("Heartbeat play failed:", e));
      // Show heartbeat for 3 seconds then show result menu
      setTimeout(() => {
        setShowHeartbeat(false);
        setScreen("resultMenu");
      }, 3000);
      return;
    } else {
      // Lower background music to 20% and play KBC sound at 100%
      backgroundMusic.volume = 0.2;
      kbcSound.currentTime = 0;
      kbcSound.volume = 1.0;
      kbcSound.play().catch(e => console.log("KBC sound play failed:", e));
    }

    if(isLastQ){
      if(roundIdx===0){
        const s=[...teams].sort((a,b)=>(scores[b]||0)-(scores[a]||0));
        setEliminated(s.slice(Math.max(4,Math.ceil(teams.length/2))));
      }
      if(isLastR){setScreen("resultMenu");}
      else{setRoundIdx(r=>r+1);setQIdx(0);reset();}
    }else{setQIdx(q=>q+1);reset();}
  }

  function reset(){setShowAnswer(false);setTimerRunning(false);setAwarded({});setTimerKey(k=>k+1);}

  const base={minHeight:"100vh",background:"#050814",fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflow:"hidden"};
  const glass={background:"rgba(255,255,255,0.05)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16};
  const glowBtn=(col="#EF4444")=>({
    background:`linear-gradient(135deg,${col},${col}99)`,color:"#fff",border:"none",
    borderRadius:10,padding:"14px 32px",fontSize:15,fontWeight:700,cursor:"pointer",
    boxShadow:`0 0 20px ${col}66`,transition:"all 0.2s",
  });

  // ── HOME ──────────────────────────────────────────────────────────────────
  if(screen==="home") return (
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <Particles/>
      {/* Glow rings */}
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(139,92,246,0.2)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"ring 4s infinite"}}/>
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",border:"1px solid rgba(239,68,68,0.2)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"ring 4s 1s infinite"}}/>

      <div style={{textAlign:"center",animation:"fadeIn 0.8s ease",position:"relative",zIndex:2}}>
        <div style={{fontSize:64,marginBottom:4,marginTop:-20,animation:"bounce 2s infinite"}}>🎯</div>
        <div style={{fontSize:20,letterSpacing:8,color:"#94A3B8",fontWeight:600,textTransform:"uppercase"}}>MARKETING</div>
        <div style={{fontSize:72,fontWeight:900,background:"linear-gradient(135deg,#EF4444,#8B5CF6,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,marginBottom:8}}>LINGO</div>
        <div style={{color:"#64748B",fontSize:15,marginBottom:40}}>The Ultimate Marketing Terminology Showdown</div>

        {/* Features */}
        <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:32,flexWrap:"wrap"}}>
          {[["🎮","4 Rounds","Exciting Challenges"],["👥","Team Play","4–16 Teams"],["⏱","Timed","Think Fast!"],["🏆","Top Score","Be the Champion!"]].map(([ic,t,s])=>(
            <div key={t} style={{...glass,padding:"16px 20px",textAlign:"center",minWidth:100}}>
              <div style={{fontSize:28,marginBottom:6}}>{ic}</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:13}}>{t}</div>
              <div style={{color:"#64748B",fontSize:11}}>{s}</div>
            </div>
          ))}
        </div>

        {/* Competition Overview */}
        <div style={{...glass,padding:24,maxWidth:500,margin:"0 auto 32px",textAlign:"left"}}>
          <div style={{color:"#94A3B8",fontSize:13,fontWeight:700,letterSpacing:2,marginBottom:16,textTransform:"uppercase"}}>Competition Overview</div>
          {ROUNDS.map(r=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <span style={{fontSize:18}}>{r.emoji}</span>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:600,fontSize:13}}>Round {r.id}: {r.name}</div>
                <div style={{color:"#64748B",fontSize:11}}>{r.questions.length} Questions · {r.timer}s · {r.format}</div>
              </div>
              <div style={{background:"rgba(34,197,94,0.15)",color:"#22C55E",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>+{r.points}</div>
            </div>
          ))}
        </div>

        <button style={{...glowBtn(),fontSize:18,padding:"16px 48px",borderRadius:12,animation:"pulse 2s infinite"}}
          onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
          onClick={()=>setScreen("setup")}>
          🚀 Start Competition →
        </button>
      </div>
    </div>
  );

  // ── SETUP ────────────────────────────────────────────────────────────────
  if(screen==="setup") return (
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <Particles/>
      <div style={{position:"relative",zIndex:2,width:"100%",maxWidth:480,animation:"fadeIn 0.6s ease"}}>
        <button onClick={()=>setScreen("home")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#94A3B8",borderRadius:8,padding:"8px 16px",cursor:"pointer",marginBottom:24,fontSize:13}}>← Back</button>
        <div style={{...glass,padding:40,textAlign:"center"}}>
          <div style={{fontSize:64,marginBottom:12}}>👥</div>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:6}}>CHOOSE YOUR TEAM</div>
          <div style={{color:"#64748B",fontSize:13,marginBottom:28}}>One team per line · 4–16 teams recommended</div>
          <textarea value={teamInput} onChange={e=>setTeamInput(e.target.value)}
            style={{width:"100%",minHeight:160,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:10,padding:16,fontSize:15,color:"#fff",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          <div style={{color:"#64748B",fontSize:12,margin:"8px 0 24px"}}>{teamInput.split("\n").filter(s=>s.trim()).length} teams entered</div>
          <button style={{...glowBtn(),width:"100%",fontSize:16,padding:"16px",animation:"pulse 2s infinite"}}
            onMouseEnter={e=>e.target.style.transform="scale(1.03)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
            onClick={startGame}>🚀 Start Round 1: Define It!</button>
        </div>
      </div>
    </div>
  );

  // ── HEARTBEAT SCREEN ───────────────────────────────────────────────────────
  if(showHeartbeat) {
    return (
      <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <Particles/>
        <style>{`
          @keyframes heartbeat{
            0%,100%{transform:scale(1);opacity:0.8;}
            10%{transform:scale(1.15);opacity:1;}
            20%{transform:scale(1);opacity:0.8;}
            30%{transform:scale(1.25);opacity:1;}
            40%{transform:scale(1);opacity:0.8;}
            50%{transform:scale(1.35);opacity:1;}
            60%{transform:scale(1);opacity:0.8;}
            70%{transform:scale(1.45);opacity:1;}
            80%{transform:scale(1);opacity:0.8;}
            90%{transform:scale(1.5);opacity:1;}
          }
          @keyframes heartbeatRing{
            0%{transform:scale(1);opacity:0.6;}
            50%{transform:scale(1.8);opacity:0;}
            100%{transform:scale(1);opacity:0.6;}
          }
        `}</style>
        <div style={{textAlign:"center",position:"relative",zIndex:2}}>
          <div style={{fontSize:120,animation:"heartbeat 1.5s ease-in-out infinite",display:"inline-block",filter:"drop-shadow(0 0 40px rgba(239,68,68,0.8))"}}>❤️</div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,border:"3px solid rgba(239,68,68,0.6)",borderRadius:"50%",animation:"heartbeatRing 1.5s ease-in-out infinite"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,height:280,border:"2px solid rgba(239,68,68,0.3)",borderRadius:"50%",animation:"heartbeatRing 1.5s 0.3s ease-in-out infinite"}}/>
        </div>
        <div style={{position:"absolute",bottom:"20%",color:"#EF4444",fontSize:24,fontWeight:800,letterSpacing:4,animation:"pulse 1.5s ease-in-out infinite",textShadow:"0 0 20px rgba(239,68,68,0.8)"}}>
          RESULTS COMING UP...
        </div>
      </div>
    );
  }

  // ── RESULT MENU ───────────────────────────────────────────────────────────
  if(screen==="resultMenu") {
    const winner = sortedTeams[0];
    const runnerUp = sortedTeams[1];

    return (
      <div style={{
        ...base,
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
      }}>
        <Particles/>

        <div style={{textAlign:"center"}}>
          <div style={{fontSize:50,color:"#fff",marginBottom:20}}>
            🎉 Results Ready!
          </div>

          <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
            <button
              style={glowBtn("#3B82F6")}
              onClick={()=>{setFlash(true);setScreen("runnerup");}}
            >
             🥈 Show Runner-Up
            </button>

            <button
            style={glowBtn("#FFD700")}
            onClick={()=>{setFlash(true);setScreen("winner");}}
            >
            🏆 Show Winner
            </button>
          </div>
        </div>
      </div>
    );
  }
  // ── RUNNER-UP ────────────────────────────────────────────────────────────
  if(screen==="runnerup") {
    const runnerUp=sortedTeams[1];
    return (
      <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden",animation:"shake 0.4s"}}>
        {/* 💥 FLASH EFFECT */}{flash && (<div style={{position:"absolute",inset:0,background:"#fff",zIndex:20,animation:"fadeOut 0.5s forwards"}}/>)}
        <Confetti colors={["#3B82F6","#60A5FA","#93C5FD","#FFD700","#fff"]}/>

        {/* Content */}
        <div style={{textAlign:"center",zIndex:2,animation:"slideUp 1s 1.5s both"}}>
          {/* Spotlight */}
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:300,height:400,
            background:"radial-gradient(ellipse at top,rgba(59,130,246,0.3),transparent 70%)",pointerEvents:"none"}}/>
          <div style={{fontSize:14,letterSpacing:4,color:"#60A5FA",fontWeight:700,textTransform:"uppercase",marginBottom:12}}>INCREDIBLE PERFORMANCE!</div>
          <div style={{fontSize:56,fontWeight:900,color:"#fff",lineHeight:1,marginBottom:8,textShadow:"0 0 40px rgba(59,130,246,0.8)"}}>You're the Runner-Up!</div>
          <div style={{color:"#94A3B8",fontSize:16,marginBottom:48}}>Amazing teamwork and effort!</div>
          {/* Podium */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0,marginBottom:40}}>
            <div style={{fontSize:48,marginBottom:8}}>🥈</div>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8}}>
              {[0.6,0.7,0.6].map((h,i)=><div key={i} style={{width:60,height:80*h,background:"rgba(59,130,246,0.3)",border:"1px solid rgba(59,130,246,0.5)",borderRadius:"8px 8px 0 0"}}/>)}
            </div>
            <div style={{...glass,background:"rgba(59,130,246,0.2)",border:"1px solid rgba(59,130,246,0.5)",padding:"16px 40px",borderRadius:12,marginTop:0}}>
              <div style={{color:"#fff",fontSize:24,fontWeight:900}}>{runnerUp||"Runner-Up"}</div>
              <div style={{color:"#60A5FA",fontSize:16,fontWeight:700}}>{scores[runnerUp]||0} Points</div>
            </div>
          </div>
          <button style={{...glowBtn("#3B82F6"),fontSize:16,animation:"pulse 2s infinite"}}
            onClick={()=>setScreen("resultMenu")}>
            🔙 Back to Results
          </button>
        </div>
      </div>
    );
  }

  // ── WINNER ───────────────────────────────────────────────────────────────
  if(screen==="winner") {
    const winner=sortedTeams[0];
    return (
      <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1A0505,#2D0A0A,#1A0515)",animation:"shake 0.6s"}}>{/* 💥 WINNER FLASH */}{flash && (<div style={{position:"absolute",inset:0,background:"#fff",zIndex:20,animation:"fadeOut 0.7s forwards"}}/>)}
        <Confetti colors={["#FFD700","#EF4444","#FF69B4","#FFA500","#fff"]}/>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:400,height:500,
          background:"radial-gradient(ellipse at top,rgba(239,68,68,0.4),transparent 70%)",pointerEvents:"none"}}/>
        {/* Red curtain sides */}
        <div style={{position:"absolute",top:0,left:0,width:80,height:"100%",background:"linear-gradient(90deg,#8B0000,transparent)",opacity:0.6}}/>
        <div style={{position:"absolute",top:0,right:0,width:80,height:"100%",background:"linear-gradient(270deg,#8B0000,transparent)",opacity:0.6}}/>

        <div style={{textAlign:"center",zIndex:2,animation:"zoomIn 0.8s ease"}}>
          <div style={{fontSize:80,animation:"bounce 1s infinite",filter:"drop-shadow(0 0 30px #FFD700)"}}>🏆</div>
          <div style={{fontSize:16,letterSpacing:4,color:"#EF4444",fontWeight:700,textTransform:"uppercase",marginTop:8,marginBottom:8}}>CHAMPIONS!</div>
          <div style={{fontSize:52,fontWeight:900,color:"#FFD700",lineHeight:1,marginBottom:8,textShadow:"0 0 40px rgba(255,215,0,0.8)"}}>You're the Winner!</div>
          <div style={{color:"#94A3B8",fontSize:15,marginBottom:40}}>Outstanding performance and true champions!</div>
          {/* Podium */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:40}}>
            <div style={{fontSize:48,marginBottom:8}}>🥇</div>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8}}>
              {[0.6,1,0.7].map((h,i)=><div key={i} style={{width:60,height:80*h,background:i===1?"rgba(239,68,68,0.4)":"rgba(239,68,68,0.2)",border:`1px solid rgba(239,68,68,${i===1?0.8:0.4})`,borderRadius:"8px 8px 0 0",boxShadow:i===1?"0 0 20px rgba(239,68,68,0.6)":""}}/>)}
            </div>
            <div style={{...glass,background:"rgba(239,68,68,0.2)",border:"1px solid rgba(239,68,68,0.6)",padding:"20px 48px",borderRadius:12,boxShadow:"0 0 40px rgba(239,68,68,0.3)"}}>
              <div style={{color:"#FFD700",fontSize:28,fontWeight:900}}>{winner||"Winner"}</div>
              <div style={{color:"#EF4444",fontSize:18,fontWeight:700}}>{scores[winner]||0} Points</div>
            </div>
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button style={{...glowBtn(),fontSize:15}} onClick={()=>setScreen("results")}>📊 View Leaderboard</button>
            <button style={{background:"transparent",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}
              onClick={()=>{setScreen("setup");setTeamInput(teams.join("\n"));}}>🔄 Play Again</button>
            <button
              style={{background:"transparent",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}
              onClick={()=>setScreen("resultMenu")}
            >
              🔙 Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LEADERBOARD ──────────────────────────────────────────────────────────
  if(screen==="results") return (
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <Particles/>
      <div style={{position:"relative",zIndex:2,width:"100%",maxWidth:500,animation:"fadeIn 0.6s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48}}>🏆</div>
          <div style={{fontSize:36,fontWeight:900,background:"linear-gradient(135deg,#FFD700,#EF4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Final Leaderboard</div>
        </div>
        {sortedTeams.map((team,i)=>{
          const medals=["🥇","🥈","🥉"];
          const glows=["rgba(255,215,0,0.3)","rgba(192,192,192,0.2)","rgba(205,127,50,0.2)"];
          return (
            <div key={team} style={{...glass,display:"flex",alignItems:"center",gap:16,padding:"16px 24px",marginBottom:12,
              boxShadow:i<3?`0 0 20px ${glows[i]}`:"none",border:i===0?"1px solid rgba(255,215,0,0.4)":"1px solid rgba(255,255,255,0.1)",animation:`fadeIn ${0.3+i*0.1}s ease`}}>
              <div style={{fontSize:28,minWidth:36,textAlign:"center"}}>{medals[i]||`${i+1}`}</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{team}</div>
                {eliminated.includes(team)&&<div style={{color:"#64748B",fontSize:11}}>Eliminated after Round 1</div>}
              </div>
              <div style={{fontSize:24,fontWeight:900,color:i===0?"#FFD700":"#fff"}}>{scores[team]||0}<span style={{fontSize:12,color:"#64748B",fontWeight:400}}> pts</span></div>
            </div>
          );
        })}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:24}}>
          <button style={{background:"transparent",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer"}}
            onClick={()=>setScreen("home")}>🏠 Home</button>
          <button style={glowBtn()} onClick={()=>{setScreen("setup");setTeamInput(teams.join("\n"));}}>🔄 Play Again</button>
        </div>
      </div>
    </div>
  );

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  return (
    <div style={{...base,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <Particles/>
      {/* Top Bar */}
      <div style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:10}}>
        <button onClick={()=>setScreen("home")} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.15)",color:"#94A3B8",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13}}>← Back</button>
        <div style={{textAlign:"center"}}>
          <div style={{color:"#64748B",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Round {round.id} of {ROUNDS.length}</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:16}}>{round.emoji} {round.name}</div>
        </div>
        <div style={{...glass,padding:"6px 16px",fontSize:13,color:"#94A3B8"}}>Q {qIdx+1}/{round.questions.length}</div>
      </div>

      {/* Progress */}
      <div style={{display:"flex",gap:3,padding:"8px 24px",background:"rgba(0,0,0,0.4)",position:"relative",zIndex:10}}>
        {round.questions.map((_,i)=>(
          <div key={i} style={{flex:1,height:4,borderRadius:2,background:i<qIdx?"#8B5CF6":i===qIdx?`${round.color}99`:"rgba(255,255,255,0.1)",
            boxShadow:i<qIdx?"0 0 6px rgba(139,92,246,0.8)":""}}/>
        ))}
      </div>

      <div style={{display:"flex",flex:1,position:"relative",zIndex:2}}>
        {/* Main */}
        <div style={{flex:1,padding:"24px",overflowY:"auto",display:"flex",flexDirection:"column",gap:16}}>
          {/* Question Card */}
          <div style={{...glass,padding:32,position:"relative",boxShadow:`0 0 40px ${round.color}22`,border:`1px solid ${round.color}33`,animation:"fadeIn 0.4s ease"}}>
            <div style={{position:"absolute",top:-1,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent,${round.color},transparent)`,borderRadius:"16px 16px 0 0"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{background:`${round.color}22`,color:round.color,borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700}}>+{round.points} pts</div>
              <div style={{background:"rgba(255,255,255,0.08)",color:"#94A3B8",borderRadius:8,padding:"5px 12px",fontSize:12}}>{round.format==="Buzzer"?"🔔 Buzzer Round":"✍️ Written Round"}</div>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:12,textAlign:"center",textShadow:`0 0 30px ${round.color}66`}}>
              {question.q}
            </div>

            {/* Buttons */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24,justifyContent:"center"}}>
              {!timerRunning&&!showAnswer&&(
                <button style={glowBtn(round.color)} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}
                  onClick={()=>{setTimerKey(k=>k+1);setTimerRunning(true);}}>▶ Start Timer</button>
              )}
              {timerRunning&&!showAnswer&&(
                <button style={glowBtn("#EAB308")} onClick={()=>setTimerRunning(false)}>⏸ Stop Timer</button>
              )}
              {!timerRunning&&timerKey>0&&!showAnswer&&(
                <button style={glowBtn(round.color)} onClick={()=>setTimerRunning(true)}>▶ Resume</button>
              )}
              {!showAnswer&&(
                <button style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}
                  onClick={()=>{setTimerRunning(false);setShowAnswer(true);}}>👁 Reveal Answer</button>
              )}
              {showAnswer&&(
                <button style={glowBtn("#22C55E")} onClick={nextQuestion}>
                  {qIdx+1 === round.questions.length && roundIdx+1 === ROUNDS.length
                    ? "Show Result 🎉"
                    : "Next Question →"}
                </button>
              )}
            </div>

            {/* Answer */}
            {showAnswer&&(
              <div style={{marginTop:20,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.4)",borderRadius:10,padding:20,animation:"fadeIn 0.4s ease"}}>
                <div style={{color:"#22C55E",fontSize:11,fontWeight:700,letterSpacing:2,marginBottom:6}}>✅ ANSWER</div>
                <div style={{color:"#fff",fontSize:17,fontWeight:600,lineHeight:1.5}}>{question.a}</div>
              </div>
            )}
          </div>

          {/* Award Points */}
          {showAnswer&&(
            <div style={{...glass,padding:20,animation:"fadeIn 0.4s ease"}}>
              <div style={{color:"#94A3B8",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Award Points</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {activeTeams.map(team=>(
                  <div key={team} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    background:awarded[team]?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.03)",borderRadius:10,
                    border:`1px solid ${awarded[team]?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.07)"}`}}>
                    <div style={{flex:1,color:"#fff",fontWeight:600,fontSize:14}}>{team}</div>
                    <div style={{color:"#64748B",fontSize:13}}>{scores[team]||0} pts</div>
                    {!awarded[team]?(
                      <button style={{...glowBtn("#22C55E"),padding:"6px 16px",fontSize:13}}
                        onClick={()=>awardPoints(team,round.points)}>+{round.points}</button>
                    ):(
                      <div style={{background:"rgba(34,197,94,0.2)",color:"#22C55E",borderRadius:8,padding:"6px 14px",fontSize:13,fontWeight:700}}>+{awarded[team]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timer Bottom Display */}
          <div style={{display:"flex",gap:12}}>
            <div style={{...glass,flex:1,padding:"16px 20px"}}>
              <div style={{color:"#64748B",fontSize:11,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>⏱ Time Left</div>
              <Timer key={timerKey} seconds={round.timer} running={timerRunning} timerKey={timerKey} />
            </div>
            <div style={{...glass,flex:1,padding:"16px 20px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{color:"#64748B",fontSize:11,letterSpacing:2,marginBottom:4,textTransform:"uppercase"}}>Current Round</div>
              <div style={{color:"#fff",fontWeight:800,fontSize:16}}>Round {round.id} of {ROUNDS.length}</div>
              <div style={{color:"#64748B",fontSize:12,marginTop:2}}>{round.name}</div>
            </div>
          </div>
        </div>

        {/* Scoreboard Sidebar */}
        <div style={{width:220,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(12px)",borderLeft:"1px solid rgba(255,255,255,0.08)",padding:"20px 14px",overflowY:"auto"}}>
          <div style={{color:"#94A3B8",fontSize:11,letterSpacing:2,fontWeight:700,textTransform:"uppercase",marginBottom:16}}>Scoreboard</div>
          {sortedTeams.map((team,i)=>{
            const isElim=eliminated.includes(team);
            const medalColors=["#FFD700","#C0C0C0","#CD7F32"];
            return (
              <div key={team} style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,opacity:isElim?0.35:1,
                padding:"8px 10px",borderRadius:10,background:i===0?"rgba(255,215,0,0.06)":"transparent",
                border:i===0?"1px solid rgba(255,215,0,0.15)":"1px solid transparent"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:i<3?`${medalColors[i]}22`:"rgba(255,255,255,0.08)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:i<3?medalColors[i]:"#64748B",fontWeight:700,flexShrink:0,border:`1px solid ${i<3?medalColors[i]+"44":"rgba(255,255,255,0.1)"}`}}>
                  {i+1}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{team}</div>
                  {isElim&&<div style={{color:"#64748B",fontSize:10}}>eliminated</div>}
                </div>
                <div style={{fontSize:14,fontWeight:800,color:i===0?"#FFD700":"#fff"}}>{scores[team]||0}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}