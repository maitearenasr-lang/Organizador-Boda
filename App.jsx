import { useState, useEffect, useCallback } from "react";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCRneVgF1PprhDaFl7wiZLVmgcQj_dGGks",
  authDomain: "weeding-planner-8ffee.firebaseapp.com",
  databaseURL: "https://weeding-planner-8ffee-default-rtdb.firebaseio.com",
  projectId: "weeding-planner-8ffee",
  storageBucket: "weeding-planner-8ffee.firebasestorage.app",
  messagingSenderId: "461376855406",
  appId: "1:461376855406:web:32fdef025016016bdd357f"
};

const weddingDate = new Date("2027-02-20");

const initialPhases = [
  {
    id: 1, month: "Junio · Julio 2026", label: "Fundamentos", color: "#b08d7a", icon: "⛪",
    tasks: [
      { id: "t1", category: "Iglesia", text: "Contactar al párroco", priority: true },
      { id: "t2", category: "Iglesia", text: "Inscribirse al curso prematrimonial", priority: true },
      { id: "t3", category: "Documentos", text: "Certificado de bautismo novios (menos de 6 meses)", priority: true },
      { id: "t4", category: "Documentos", text: "Certificados de soltería y cédulas", priority: false },
      { id: "t5", category: "Recepción", text: "Reservar centro de eventos", priority: true },
      { id: "t6", category: "Recepción", text: "Firmar contrato centro de eventos", priority: true },
      { id: "t7", category: "Recepción", text: "Cotizar banquetería / catering", priority: false },
      { id: "t8", category: "Anillos", text: "Reserva de argollas", priority: true },
      { id: "t9", category: "Vestimenta", text: "Reserva vestido novia civil", priority: true },
      { id: "t10", category: "Música", text: "Cotizar cantante Ave María", priority: true },
      { id: "t11", category: "Coordinación", text: "Agendar animador de fiesta", priority: true },
      { id: "t12", category: "Invitados", text: "Enviar pre-invitación boda", priority: false },
      { id: "t13", category: "Fotografía", text: "Sesión de fotos Pre-boda", priority: false },
    ]
  },
  {
    id: 2, month: "Agosto 2026", label: "Proveedores Clave", color: "#8a7968", icon: "📸",
    tasks: [
      { id: "t14", category: "Fotografía", text: "Contratar fotógrafo y/o videógrafo", priority: true },
      { id: "t15", category: "Música", text: "Contratar DJ", priority: true },
      { id: "t16", category: "Música", text: "Contratar coro para misa", priority: true },
      { id: "t17", category: "Música", text: "Contratar cantante Ave María", priority: true },
      { id: "t18", category: "Vestimenta", text: "Definir traje del novio (Osvaldo)", priority: true },
      { id: "t19", category: "Flores", text: "Contratar floristería", priority: false },
      { id: "t20", category: "Digital", text: "Diseñar invitación digital en Canva", priority: false },
      { id: "t21", category: "Belleza", text: "Agendar hora manicure y pedicure novia y novio", priority: true },
      { id: "t22", category: "Detalles", text: "Reservar habitación noche de bodas", priority: true },
    ]
  },
  {
    id: 3, month: "Septiembre 2026", label: "Preparación Litúrgica", color: "#7a8a78", icon: "🕊️",
    tasks: [
      { id: "t23", category: "Iglesia", text: "Elegir lecturas bíblicas con el sacerdote", priority: false },
      { id: "t24", category: "Iglesia", text: "Elegir cantos litúrgicos con el coro", priority: false },
      { id: "t25", category: "Misal", text: "Crear el Misal impreso para invitados", priority: true },
      { id: "t26", category: "Iglesia", text: "Definir padrinos iglesia y testigos civil", priority: true },
      { id: "t27", category: "Detalles", text: "Comprar cajita para presentar anillos", priority: false },
      { id: "t28", category: "Iglesia", text: "Definir ofrendas", priority: false },
      { id: "t29", category: "Detalles", text: "Definir letrero de bienvenida", priority: false },
      { id: "t30", category: "Detalles", text: "Diseño cajita con pañuelos y accesorios", priority: false },
      { id: "t31", category: "Vestimenta", text: "Primera prueba vestido novia iglesia", priority: true },
      { id: "t32", category: "Vestimenta", text: "Definir traje Maxi", priority: true },
      { id: "t33", category: "Vestimenta", text: "Definir vestido Emilia", priority: true },
    ]
  },
  {
    id: 4, month: "Octubre · Noviembre 2026", label: "Coordinación Fina", color: "#7d8799", icon: "📋",
    tasks: [
      { id: "t34", category: "Recepción", text: "Confirmar menú definitivo con banquetería", priority: true },
      { id: "t35", category: "Recepción", text: "Definir decoración del salón", priority: false },
      { id: "t36", category: "Recepción", text: "Planificar distribución de mesas", priority: false },
      { id: "t37", category: "Torta", text: "Diseñar y encargar torta nupcial", priority: false },
      { id: "t38", category: "Transporte", text: "Reservar auto para novios", priority: false },
      { id: "t39", category: "Personal", text: "Comprar libretas de votos nupciales", priority: false },
      { id: "t40", category: "Personal", text: "Preparación vals novios", priority: true },
      { id: "t41", category: "Detalles", text: "Selección cotillón novios", priority: false },
      { id: "t42", category: "Detalles", text: "Compra cotillón invitados", priority: false },
      { id: "t43", category: "Vestimenta", text: "Selección traje Emilia", priority: true },
    ]
  },
  {
    id: 5, month: "Diciembre 2026", label: "Últimos Detalles", color: "#997d7d", icon: "✉️",
    tasks: [
      { id: "t44", category: "Confirmaciones", text: "Confirmar asistencia con todos los invitados", priority: true },
      { id: "t45", category: "Iglesia", text: "Reunión final con el sacerdote", priority: true },
      { id: "t46", category: "Misal", text: "Imprimir Misales para la ceremonia", priority: true },
      { id: "t47", category: "Coordinación", text: "Entregar guión del día a proveedores y padrinos", priority: true },
      { id: "t48", category: "Belleza", text: "Prueba final de maquillaje y peinado", priority: false },
      { id: "t49", category: "Vestimenta", text: "Prueba final del vestido", priority: true },
      { id: "t50", category: "Digital", text: "Enviar sitio web de invitación por WhatsApp", priority: false },
      { id: "t51", category: "Anillos", text: "Compra argollas definitivas", priority: true },
      { id: "t52", category: "Vestimenta", text: "Ver vestido Emilia", priority: true },
      { id: "t53", category: "Vestimenta", text: "Ver traje Maxi", priority: true },
    ]
  },
  {
    id: 6, month: "Enero 2027", label: "Obra Fina", color: "#7a8070", icon: "📌",
    tasks: [
      { id: "t54", category: "Invitados", text: "Invitación de últimos invitados", priority: false },
      { id: "t55", category: "Música", text: "Enviar listado de playlist al DJ", priority: true },
      { id: "t56", category: "Personal", text: "Finiquitar votos nupciales", priority: true },
      { id: "t57", category: "Coordinación", text: "Finiquitar quienes darán palabras en la cena", priority: false },
      { id: "t58", category: "Coordinación", text: "Reunión con todos los proveedores en centro de eventos", priority: true },
      { id: "t59", category: "Música", text: "Selección final lista de música para fiesta", priority: false },
      { id: "t60", category: "Personal", text: "Ensayo de vals", priority: true },
    ]
  },
  {
    id: 7, month: "Semana del 20 de Febrero 2027", label: "¡La Gran Semana!", color: "#8c7aa0", icon: "💍",
    tasks: [
      { id: "t61", category: "Documentos", text: "Llevar todos los documentos a la parroquia", priority: true },
      { id: "t62", category: "Ensayo", text: "Ensayo de ceremonia en la iglesia con cortejo", priority: true },
      { id: "t63", category: "Coordinación", text: "Confirmar horarios con todos los proveedores", priority: true },
      { id: "t64", category: "Detalles", text: "Preparar presentación de anillos", priority: true },
      { id: "t65", category: "Belleza", text: "Cita de maquillaje y peinado (día anterior)", priority: true },
      { id: "t66", category: "Personal", text: "Palabras personales para el altar ✍️", priority: false },
      { id: "t67", category: "Belleza", text: "Sesión manitos novio", priority: false },
      { id: "t68", category: "Belleza", text: "Sesión manitos novia", priority: false },
      { id: "t69", category: "Vestimenta", text: "Retirar vestido Emilia", priority: true },
      { id: "t70", category: "Vestimenta", text: "Retirar traje Maxi", priority: true },
      { id: "t71", category: "Detalles", text: "Check-in habitación noche de bodas", priority: false },
      { id: "t72", category: "Personal", text: "¡Descansar y disfrutar el proceso! 🌸", priority: false },
    ]
  }
];

const categoryColors = {
  "Iglesia": "#b08d7a", "Documentos": "#8a7968", "Invitados": "#7d8799",
  "Recepción": "#997d7d", "Fotografía": "#8c7aa0", "Música": "#7a8c8a",
  "Vestimenta": "#9a8070", "Flores": "#7a9070", "Papelería": "#8a8070",
  "Detalles": "#907a8a", "Belleza": "#9a7a8a", "Torta": "#8a8a70",
  "Transporte": "#708090", "Anillos": "#b0906a", "Confirmaciones": "#8a7070",
  "Coordinación": "#707a8a", "Digital": "#7a8070", "Ensayo": "#807890",
  "Personal": "#908070", "Misal": "#7a6880", "Flores": "#7a9070",
};

let db = null;
let firestoreModule = null;

async function initFirebase() {
  if (db) return;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const mod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    firestoreModule = mod;
    const app = initializeApp(FIREBASE_CONFIG);
    db = mod.getFirestore(app);
  } catch (e) { console.error("Firebase error:", e); }
}

async function fbSet(docPath, data) {
  if (!db || !firestoreModule) return;
  try {
    const ref = firestoreModule.doc(db, docPath);
    await firestoreModule.setDoc(ref, data, { merge: true });
  } catch (e) { console.error(e); }
}

function fbListen(docPath, callback) {
  if (!db || !firestoreModule) return () => {};
  try {
    const ref = firestoreModule.doc(db, docPath);
    return firestoreModule.onSnapshot(ref, snap => { if (snap.exists()) callback(snap.data()); });
  } catch { return () => {}; }
}

export default function WeddingPlanner() {
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [firebaseOk, setFirebaseOk] = useState(false);
  const [doneTasks, setDoneTasks] = useState({});
  const [customTasks, setCustomTasks] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");
  const [activePhase, setActivePhase] = useState(1);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Iglesia");
  const [newTaskPriority, setNewTaskPriority] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "Recepción", paid: false });

  useEffect(() => {
    const iv = setInterval(() => {
      const diff = weddingDate - new Date();
      if (diff > 0) setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    initFirebase().then(async () => {
      if (!db) { setReady(true); return; }
      setFirebaseOk(true);
      fbListen("wedding/data", (data) => {
        if (data.done) setDoneTasks(data.done);
        if (data.custom) setCustomTasks(data.custom);
        if (data.expenses) setExpenses(data.expenses);
        if (data.notes !== undefined) setNotes(data.notes);
      });
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (done, custom, exps, nts) => {
    if (firebaseOk) {
      setSyncing(true);
      await fbSet("wedding/data", { done, custom, expenses: exps, notes: nts });
      setSyncing(false);
    }
  }, [firebaseOk]);

  const toggleTask = (id) => {
    const next = { ...doneTasks, [id]: !doneTasks[id] };
    setDoneTasks(next);
    persist(next, customTasks, expenses, notes);
  };

  const addCustomTask = () => {
    if (!newTaskText.trim()) return;
    const id = `c${Date.now()}`;
    const task = { id, text: newTaskText.trim(), category: newTaskCategory, priority: newTaskPriority };
    const next = { ...customTasks, [activePhase]: [...(customTasks[activePhase] || []), task] };
    setCustomTasks(next);
    persist(doneTasks, next, expenses, notes);
    setNewTaskText(""); setNewTaskPriority(false); setAddingTask(false);
  };

  const deleteCustomTask = (phaseId, taskId) => {
    const next = { ...customTasks, [phaseId]: (customTasks[phaseId] || []).filter(t => t.id !== taskId) };
    setCustomTasks(next);
    const nextDone = { ...doneTasks };
    delete nextDone[taskId];
    setDoneTasks(nextDone);
    persist(nextDone, next, expenses, notes);
  };

  const addExpense = () => {
    if (!newExpense.name.trim() || !newExpense.amount) return;
    const exp = { id: `e${Date.now()}`, ...newExpense, amount: parseFloat(newExpense.amount), date: new Date().toLocaleDateString("es-CL") };
    const next = [...expenses, exp];
    setExpenses(next);
    persist(doneTasks, customTasks, next, notes);
    setNewExpense({ name: "", amount: "", category: "Recepción", paid: false });
    setAddingExpense(false);
  };

  const toggleExpensePaid = (id) => {
    const next = expenses.map(e => e.id === id ? { ...e, paid: !e.paid } : e);
    setExpenses(next);
    persist(doneTasks, customTasks, next, notes);
  };

  const deleteExpense = (id) => {
    const next = expenses.filter(e => e.id !== id);
    setExpenses(next);
    persist(doneTasks, customTasks, next, notes);
  };

  const updateNotes = (v) => {
    setNotes(v);
    if (firebaseOk) fbSet("wedding/data", { notes: v });
  };

  const allTasks = initialPhases.flatMap(p => [...p.tasks, ...(customTasks[p.id] || [])]);
  const totalCount = allTasks.length;
  const doneCount = allTasks.filter(t => doneTasks[t.id]).length;
  const progress = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPaid = expenses.filter(e => e.paid).reduce((s, e) => s + e.amount, 0);

  const tabs = [
    { id: "timeline", label: "Agenda", icon: "📅" },
    { id: "expenses", label: "Gastos", icon: "💰" },
    { id: "iglesia", label: "Iglesia", icon: "⛪" },
    { id: "notes", label: "Notas", icon: "📝" },
  ];

  const churchSteps = [
    { step: 1, title: "Contactar al párroco", desc: "Solicitar reunión para reservar fecha y hora. Llevar cédulas de identidad de ambos.", when: "Junio — urgente" },
    { step: 2, title: "Curso prematrimonial", desc: "Obligatorio. Cupos limitados y fechas fijas. Consultar en la parroquia o diócesis.", when: "Junio · Julio 2026" },
    { step: 3, title: "Reunir documentos", desc: "Certificado de bautismo (máx 6 meses), confirmación, cédulas y certificado de soltería.", when: "Junio · Julio 2026" },
    { step: 4, title: "Elegir lecturas bíblicas", desc: "Una del AT, una del NT y un Evangelio. Léanlas juntos en voz alta para elegir.", when: "Septiembre 2026" },
    { step: 5, title: "Contratar coro o cantante", desc: "Los cantos deben ser aprobados por la parroquia.", when: "Agosto 2026" },
    { step: 6, title: "Crear el Misal", desc: "Documento con el orden de la misa, lecturas y cantos para los invitados.", when: "Septiembre 2026" },
    { step: 7, title: "Definir padrinos y testigos", desc: "Mínimo 2 testigos, idealmente católicos. Confirmar disponibilidad.", when: "Septiembre 2026" },
    { step: 8, title: "Definir ofrendas", desc: "Coordinar con el sacerdote qué ofrendas se llevarán durante la misa.", when: "Septiembre 2026" },
    { step: 9, title: "Ensayo en la iglesia", desc: "Con sacerdote y cortejo completo. Fundamental para que todo fluya con calma.", when: "Semana del matrimonio" },
  ];

  if (!ready) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5", fontFamily: "Georgia, serif", color: "#b08d7a" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💍</div>
        <div style={{ fontSize: 14, letterSpacing: 2 }}>Cargando...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "Georgia, serif", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #2c2320 0%, #4a3830 100%)", padding: "28px 20px 18px", textAlign: "center", position: "relative" }}>
        {firebaseOk && (
          <div style={{ position: "absolute", top: 10, right: 14, fontSize: 10, color: syncing ? "#ffd080" : "#90e090", letterSpacing: 1 }}>
            {syncing ? "⟳ Sincronizando..." : "● En línea"}
          </div>
        )}
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#c9a882", textTransform: "uppercase", marginBottom: 5 }}>Organizador de Boda</div>
        <div style={{ fontSize: 26, color: "#fff", fontStyle: "italic", marginBottom: 3 }}>Maité & Osvaldo</div>
        <div style={{ fontSize: 11, color: "#c9a882", letterSpacing: 2 }}>Matrimonio por la Iglesia · 2027</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
          {[["DÍAS", countdown.days], ["HRS", countdown.hours], ["MIN", countdown.minutes], ["SEG", countdown.seconds]].map(([label, val]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 8px", minWidth: 42 }}>
                <div style={{ fontSize: 20, color: "#fff", fontFamily: "monospace", fontWeight: "bold" }}>{String(val).padStart(2, "0")}</div>
              </div>
              <div style={{ fontSize: 8, color: "#c9a882", letterSpacing: 2, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "0 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#c9a882" }}>{doneCount}/{totalCount} tareas</span>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: "bold" }}>{progress}% completado</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#c9a882,#e8c9a0)", borderRadius: 3, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e8e0d8", position: "sticky", top: 0, zIndex: 10 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "11px 4px 9px", border: "none", background: "none", cursor: "pointer",
            borderBottom: activeTab === tab.id ? "2px solid #b08d7a" : "2px solid transparent",
            color: activeTab === tab.id ? "#b08d7a" : "#999", fontSize: 10, fontFamily: "Georgia",
          }}>
            <div style={{ fontSize: 15, marginBottom: 2 }}>{tab.icon}</div>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 14px 90px" }}>
        {activeTab === "timeline" && (
          <div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
              {initialPhases.map(p => {
                const allP = [...p.tasks, ...(customTasks[p.id] || [])];
                const doneP = allP.filter(t => doneTasks[t.id]).length;
                const isActive = activePhase === p.id;
                return (
                  <button key={p.id} onClick={() => setActivePhase(p.id)} style={{
                    flexShrink: 0, padding: "7px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: isActive ? p.color : "#f0ece6", color: isActive ? "#fff" : "#777",
                    fontSize: 11, fontFamily: "Georgia",
                  }}>
                    {p.icon} {p.label} <span style={{ opacity: 0.8, fontSize: 10 }}>{doneP}/{allP.length}</span>
                  </button>
                );
              })}
            </div>
            {initialPhases.filter(p => p.id === activePhase).map(phase => {
              const allPhaseTasks = [...phase.tasks, ...(customTasks[phase.id] || [])];
              return (
                <div key={phase.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 22 }}>{phase.icon}</span>
                    <div>
                      <div style={{ fontSize: 16, color: "#2c2320", fontStyle: "italic" }}>{phase.label}</div>
                      <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 1 }}>{phase.month}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {allPhaseTasks.map(task => {
                      const done = doneTasks[task.id];
                      const isCustom = task.id.startsWith("c");
                      return (
                        <div key={task.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div onClick={() => toggleTask(task.id)} style={{
                            flex: 1, background: done ? "#f5f0e8" : "#fff",
                            border: `1px solid ${done ? "#d4c4b0" : "#e8e0d8"}`,
                            borderLeft: `3px solid ${categoryColors[task.category] || phase.color}`,
                            borderRadius: 10, padding: "11px 12px",
                            display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", opacity: done ? 0.72 : 1,
                          }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                              background: done ? phase.color : "transparent",
                              border: `2px solid ${done ? phase.color : "#ccc"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {done && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, color: done ? "#aaa" : "#2c2320", textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>{task.text}</div>
                              <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: `${categoryColors[task.category] || phase.color}18`, color: categoryColors[task.category] || phase.color }}>{task.category}</span>
                                {task.priority && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: "#fff0e8", color: "#c08050" }}>⚡ Prioritario</span>}
                                {isCustom && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: "#f0f0ff", color: "#8080c0" }}>✎ Propia</span>}
                              </div>
                            </div>
                          </div>
                          {isCustom && (
                            <button onClick={() => deleteCustomTask(phase.id, task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", fontSize: 18, padding: "10px 4px" }}>×</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {addingTask ? (
                    <div style={{ marginTop: 14, background: "#fff", border: "1px solid #e0d8d0", borderRadius: 12, padding: 14 }}>
                      <input value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Describe la tarea..." autoFocus
                        style={{ width: "100%", border: "1px solid #e0d8d0", borderRadius: 8, padding: "9px 11px", fontSize: 13, fontFamily: "Georgia", boxSizing: "border-box", marginBottom: 10 }} />
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <select value={newTaskCategory} onChange={e => setNewTaskCategory(e.target.value)}
                          style={{ flex: 1, border: "1px solid #e0d8d0", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontFamily: "Georgia" }}>
                          {["Iglesia","Documentos","Música","Misal","Vestimenta","Fotografía","Recepción","Flores","Torta","Anillos","Invitados","Coordinación","Transporte","Belleza","Detalles","Personal","Digital"].map(c => <option key={c}>{c}</option>)}
                        </select>
                        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
                          <input type="checkbox" checked={newTaskPriority} onChange={e => setNewTaskPriority(e.target.checked)} /> Prioritaria
                        </label>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={addCustomTask} style={{ flex: 1, background: phase.color, color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia" }}>Agregar</button>
                        <button onClick={() => setAddingTask(false)} style={{ flex: 1, background: "#f0ece6", color: "#888", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia" }}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setAddingTask(true)} style={{ marginTop: 12, width: "100%", background: "none", border: `1px dashed ${phase.color}`, borderRadius: 10, padding: "10px", color: phase.color, fontSize: 12, cursor: "pointer", fontFamily: "Georgia" }}>
                      + Agregar tarea propia a este mes
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <div style={{ fontSize: 18, color: "#2c2320", fontStyle: "italic", marginBottom: 4 }}>Registro de Gastos</div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>Agrega cada gasto a medida que lo contratas</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[["Total", totalSpent, "#b08d7a"], ["Pagado", totalPaid, "#7a9070"], ["Por pagar", totalSpent - totalPaid, "#997d7d"]].map(([label, val, color]) => (
                <div key={label} style={{ flex: 1, background: "#fff", border: "1px solid #e8e0d8", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#aaa", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color, fontWeight: "bold" }}>${Math.round(val).toLocaleString("es-CL")}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {expenses.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#ccc", fontSize: 13, fontStyle: "italic" }}>Aún no hay gastos registrados</div>}
              {expenses.map(exp => (
                <div key={exp.id} style={{ background: "#fff", border: "1px solid #e8e0d8", borderLeft: `3px solid ${categoryColors[exp.category] || "#b08d7a"}`, borderRadius: 10, padding: "11px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" checked={exp.paid} onChange={() => toggleExpensePaid(exp.id)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                  <div style={{ flex: 1, opacity: exp.paid ? 0.6 : 1 }}>
                    <div style={{ fontSize: 13, color: "#2c2320", textDecoration: exp.paid ? "line-through" : "none" }}>{exp.name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 8, background: `${categoryColors[exp.category] || "#b08d7a"}18`, color: categoryColors[exp.category] || "#b08d7a" }}>{exp.category}</span>
                      <span style={{ fontSize: 10, color: "#aaa" }}>{exp.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, color: exp.paid ? "#7a9070" : "#2c2320", fontWeight: "bold" }}>${exp.amount.toLocaleString("es-CL")}</div>
                    <div style={{ fontSize: 9, color: exp.paid ? "#7a9070" : "#c08050" }}>{exp.paid ? "✓ Pagado" : "Pendiente"}</div>
                  </div>
                  <button onClick={() => deleteExpense(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", fontSize: 18 }}>×</button>
                </div>
              ))}
            </div>
            {addingExpense ? (
              <div style={{ background: "#fff", border: "1px solid #e0d8d0", borderRadius: 12, padding: 14 }}>
                <input value={newExpense.name} onChange={e => setNewExpense(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del gasto" autoFocus
                  style={{ width: "100%", border: "1px solid #e0d8d0", borderRadius: 8, padding: "9px 11px", fontSize: 13, fontFamily: "Georgia", boxSizing: "border-box", marginBottom: 10 }} />
                <input value={newExpense.amount} onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} type="number" placeholder="Monto en CLP"
                  style={{ width: "100%", border: "1px solid #e0d8d0", borderRadius: 8, padding: "9px 11px", fontSize: 13, fontFamily: "Georgia", boxSizing: "border-box", marginBottom: 10 }} />
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <select value={newExpense.category} onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))}
                    style={{ flex: 1, border: "1px solid #e0d8d0", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontFamily: "Georgia" }}>
                    {["Iglesia","Fotografía","Recepción","Música","Vestimenta","Flores","Torta","Transporte","Misal","Anillos","Invitación digital","Otros"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
                    <input type="checkbox" checked={newExpense.paid} onChange={e => setNewExpense(p => ({ ...p, paid: e.target.checked }))} /> Pagado
                  </label>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addExpense} style={{ flex: 1, background: "#b08d7a", color: "#fff", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia" }}>Guardar</button>
                  <button onClick={() => setAddingExpense(false)} style={{ flex: 1, background: "#f0ece6", color: "#888", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: "Georgia" }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingExpense(true)} style={{ width: "100%", background: "none", border: "1px dashed #b08d7a", borderRadius: 10, padding: "11px", color: "#b08d7a", fontSize: 13, cursor: "pointer", fontFamily: "Georgia" }}>
                + Agregar gasto
              </button>
            )}
          </div>
        )}

        {activeTab === "iglesia" && (
          <div>
            <div style={{ fontSize: 18, color: "#2c2320", fontStyle: "italic", marginBottom: 4 }}>Guía Litúrgica</div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Pasos para casarse por la iglesia católica</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {churchSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, background: "#fff", border: "1px solid #e8e0d8", borderRadius: 12, padding: "13px 14px" }}>
                  <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#b08d7a,#8a6858)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: "bold" }}>{s.step}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: "#2c2320", fontWeight: "bold", marginBottom: 3 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 6 }}>{s.desc}</div>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: "#f0ece6", color: "#b08d7a" }}>📅 {s.when}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, background: "#2c2320", borderRadius: 12, padding: 16, color: "#c9a882" }}>
              <div style={{ fontSize: 13, fontStyle: "italic", marginBottom: 10 }}>📖 Lecturas sugeridas</div>
              {[["Gn 1, 26-28.31a","Creacion del hombre y la mujer"],["1 Cor 13, 4-13","El himno al amor (San Pablo)"],["Jn 15, 9-12","Permanezcan en mi amor"],["Tb 8, 5-7","Oracion de los jovenes esposos"]].map(([ref, title]) => (
                <div key={ref} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(201,168,130,0.2)" }}>
                  <div style={{ fontSize: 12, fontWeight: "bold" }}>{ref}</div>
                  <div style={{ fontSize: 11, opacity: 0.75 }}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div style={{ fontSize: 18, color: "#2c2320", fontStyle: "italic", marginBottom: 4 }}>Mis Notas</div>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 14 }}>Contactos, ideas, pendientes libres</div>
            <textarea value={notes} onChange={e => updateNotes(e.target.value)}
              placeholder={"Telefono del parroco:\nNombre del fotografo:\nIdeas para el vestido:\nCantos elegidos:\n\nSe guarda automaticamente"}
              style={{ width: "100%", minHeight: 300, padding: 14, boxSizing: "border-box", border: "1px solid #e8e0d8", borderRadius: 12, fontSize: 13, fontFamily: "Georgia", color: "#2c2320", lineHeight: 1.6, background: "#fff", resize: "vertical" }} />
            <div style={{ fontSize: 10, color: firebaseOk ? "#7a9070" : "#bbb", marginTop: 5, textAlign: "right" }}>
              {firebaseOk ? "En la nube" : "Guardado en este dispositivo"}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 500, background: "rgba(250,248,245,0.96)", borderTop: "1px solid #e8e0d8", padding: "7px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#c9a882", letterSpacing: 2 }}>MAITE & OSVALDO · 2027</div>
      </div>
    </div>
  );
}
