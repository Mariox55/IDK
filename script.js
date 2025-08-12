// script.js — logica centralizzata e robusta per lingua + commenti
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = "https://sheetdb.io/api/v1/ryfrpvo1jz2sp";

  // Elementi DOM
  const languageOverlay = document.getElementById('languageOverlay');
  const langItBtn = document.getElementById('langIt');
  const langEnBtn = document.getElementById('langEn');

  const acceptOverlay = document.getElementById('acceptOverlay');
  const acceptBtn = document.getElementById('acceptBtn');
  const declineBtn = document.getElementById('declineBtn');

  const titleEl = document.getElementById('title');
  const subtitleEl = document.getElementById('subtitle');
  const updateTitleEl = document.getElementById('updateTitle');
  const updateTextEl = document.getElementById('updateText');
  const downloadBtnEl = document.getElementById('downloadBtn');
  const commentsTitleEl = document.getElementById('commentsTitle');
  const warningTitleEl = document.getElementById('warningTitle');
  const warningTextEl = document.getElementById('warningText');
  const commentsDiv = document.getElementById('comments');
  const commentForm = document.getElementById('commentForm');
  const commentInput = document.getElementById('commentInput');
  const sendBtn = document.getElementById('sendBtn');

  // Traduzioni
  const translations = {
    it: {
      title: "🎮 Il Mio Videogioco",
      subtitle: "Aggiornamenti e Download",
      updateTitle: "📢 Aggiornamento 1.0",
      updateText: "Finalmente il gioco è disponibile per il download! Scaricalo qui sotto.",
      downloadBtn: "⬇️ Scarica il Gioco",
      commentsTitle: "💬 Commenti",
      warningTitle: "⚠️ Avviso",
      warningText: "I commenti sono pubblici e non moderati in tempo reale.<br>L'autore del sito non è responsabile di contenuti offensivi o inappropriati.<br>Proseguendo, accetti di leggere i commenti senza filtro.",
      acceptBtn: "✅ Accetto",
      declineBtn: "❌ Rifiuto",
      sendBtn: "Invia",
      placeholder: "Scrivi un commento...",
      loading: "<p>Caricamento commenti...</p>",
      noComments: "<p>Nessun commento ancora. Scrivi il primo!</p>",
      disabled: "<p>❌ Visualizzazione commenti disattivata.</p>",
      loadError: "<p>Errore nel caricamento dei commenti 😢</p>"
    },
    en: {
      title: "🎮 My Video Game",
      subtitle: "Updates and Download",
      updateTitle: "📢 Update 1.0",
      updateText: "The game is finally available for download! Get it below.",
      downloadBtn: "⬇️ Download Game",
      commentsTitle: "💬 Comments",
      warningTitle: "⚠️ Notice",
      warningText: "Comments are public and not moderated in real time.<br>The site owner is not responsible for offensive or inappropriate content.<br>By continuing, you agree to read comments without any filter.",
      acceptBtn: "✅ I accept",
      declineBtn: "❌ Decline",
      sendBtn: "Send",
      placeholder: "Write a comment...",
      loading: "<p>Loading comments...</p>",
      noComments: "<p>No comments yet. Be the first!</p>",
      disabled: "<p>❌ Comment viewing disabled.</p>",
      loadError: "<p>Error loading comments 😢</p>"
    }
  };

  // Nickname generator
  const colors = ["Cyan", "Blu", "Azzurro", "Turchese", "VerdeAcqua"];
  const animals = ["Falco", "Lupo", "Tigre", "Pantera", "Drago"];
  function generateNickname(){
    const color = colors[Math.floor(Math.random()*colors.length)];
    const animal = animals[Math.floor(Math.random()*animals.length)];
    const number = Math.floor(Math.random()*1001);
    return `${color}${animal}${number}`;
  }

  // Data formattata GG/MM/AAAA
  function getFormattedDate(){
    const d = new Date();
    const day = String(d.getDate()).padStart(2,'0');
    const month = String(d.getMonth()+1).padStart(2,'0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Imposta lingua dell'interfaccia
  function setLanguage(lang){
    const t = translations[lang] || translations.it;
    titleEl.innerHTML = t.title;
    subtitleEl.innerHTML = t.subtitle;
    updateTitleEl.innerHTML = t.updateTitle;
    updateTextEl.innerHTML = t.updateText;
    downloadBtnEl.innerHTML = t.downloadBtn;
    commentsTitleEl.innerHTML = t.commentsTitle;
    warningTitleEl.innerHTML = t.warningTitle;
    warningTextEl.innerHTML = t.warningText;
    acceptBtn.innerHTML = t.acceptBtn;
    declineBtn.innerHTML = t.declineBtn;
    sendBtn.innerHTML = t.sendBtn;
    commentInput.placeholder = t.placeholder;
  }

  // Load comments (solo quando consentito)
  async function loadComments(lang = getStoredLang()){
    const t = translations[lang];
    commentsDiv.innerHTML = t.loading;
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0){
        commentsDiv.innerHTML = t.noComments;
        return;
      }
      commentsDiv.innerHTML = "";
      // Mostra dal più recente
      data.reverse().forEach(c => {
        const el = document.createElement('div');
        el.className = 'comment';
        // fallback fields safety
        const user = c.user || 'Anon';
        const date = c.date || '';
        const comment = c.comment || '';
        el.innerHTML = `<strong>${escapeHtml(user)}</strong> <em>(${escapeHtml(date)})</em><br>${escapeHtml(comment)}`;
        commentsDiv.appendChild(el);
      });
    } catch (err){
      commentsDiv.innerHTML = t.loadError;
      console.error('loadComments error', err);
    }
  }

  // Invio commento
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    const lang = getStoredLang();
    if (!text) return;
    const newComment = {
      user: generateNickname(),
      comment: text,
      date: getFormattedDate()
    };
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newComment] })
      });
      commentInput.value = '';
      // ricarica
      loadComments(lang);
    } catch (err) {
      alert(lang === 'it' ? 'Errore nell\'invio del commento 😢' : 'Error sending comment 😢');
      console.error('send comment error', err);
    }
  });

  /* --- gestione overlay lingua --- */
  function getStoredLang(){ return localStorage.getItem('preferredLang') || 'it'; }
  function setStoredLang(lang){ localStorage.setItem('preferredLang', lang); }

  // Se l'utente ha già scelto la lingua, applicala e non mostrare overlay lingua
  const savedLang = localStorage.getItem('preferredLang');
  if (savedLang){
    setLanguage(savedLang);
    languageOverlay.style.display = 'none';
    languageOverlay.setAttribute('aria-hidden','true');
  } else {
    // mostra overlay lingua
    languageOverlay.style.display = 'flex';
    languageOverlay.setAttribute('aria-hidden','false');
  }

  // Eventi scelta lingua
  langItBtn.addEventListener('click', () => {
    setStoredLang('it');
    setLanguage('it');
    languageOverlay.style.display = 'none';
    languageOverlay.setAttribute('aria-hidden','true');
    // dopo scelta lingua, procedi a verifica comment acceptance
    proceedAfterLanguage();
  });
  langEnBtn.addEventListener('click', () => {
    setStoredLang('en');
    setLanguage('en');
    languageOverlay.style.display = 'none';
    languageOverlay.setAttribute('aria-hidden','true');
    proceedAfterLanguage();
  });

  // Se lingua salvata, dobbiamo anche procedere alla fase commenti
  if (savedLang){
    proceedAfterLanguage();
  }

  // Dopo scelta lingua: gestisci overlay di accettazione (persistente)
  function proceedAfterLanguage(){
    const storedDecision = localStorage.getItem('commentsAccepted'); // 'accepted' | 'declined' | null
    const lang = getStoredLang();

    if (storedDecision === 'accepted'){
      // mostra commenti e form subito
      acceptOverlay.style.display = 'none';
      acceptOverlay.setAttribute('aria-hidden','true');
      commentForm.style.display = 'block';
      commentForm.setAttribute('aria-hidden','false');
      loadComments(lang);
    } else if (storedDecision === 'declined'){
      acceptOverlay.style.display = 'none';
      acceptOverlay.setAttribute('aria-hidden','true');
      commentsDiv.innerHTML = translations[lang].disabled;
      commentForm.style.display = 'none';
      commentForm.setAttribute('aria-hidden','true');
    } else {
      // nessuna decisione: mostra overlay di accettazione
      acceptOverlay.style.display = 'flex';
      acceptOverlay.setAttribute('aria-hidden','false');
      // aggiorna testi (nel caso lingua appena impostata)
      setLanguage(lang);
    }
  }

  // Gestione accetta/rifiuta (overlay commenti)
  acceptBtn.addEventListener('click', () => {
    const lang = getStoredLang();
    localStorage.setItem('commentsAccepted', 'accepted');
    acceptOverlay.style.display = 'none';
    acceptOverlay.setAttribute('aria-hidden','true');
    commentForm.style.display = 'block';
    commentForm.setAttribute('aria-hidden','false');
    loadComments(lang);
  });

  declineBtn.addEventListener('click', () => {
    const lang = getStoredLang();
    localStorage.setItem('commentsAccepted', 'declined');
    acceptOverlay.style.display = 'none';
    acceptOverlay.setAttribute('aria-hidden','true');
    commentsDiv.innerHTML = translations[lang].disabled;
    commentForm.style.display = 'none';
    commentForm.setAttribute('aria-hidden','true');
  });

  // Utility: escapeHtml (piccolo hardening contro injection)
  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;')
      .replaceAll('\n','<br>');
  }
});
