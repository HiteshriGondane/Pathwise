(() => {
  if (document.getElementById('pw-chat-launcher')) return;
  const config = window.PATHWISE_CHAT_CONFIG || {};
  const history = [];
  let busy = false;

  const launcher = document.createElement('button');
  launcher.id = 'pw-chat-launcher';
  launcher.className = 'pw-chat-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Pathwise AI Assistant');
  launcher.setAttribute('aria-expanded', 'false');
  launcher.innerHTML = '<span class="pw-launch-icon" aria-hidden="true">✦</span><span class="pw-launch-label">Ask AI</span>';

  const panel = document.createElement('section');
  panel.id = 'pw-chat-panel';
  panel.className = 'pw-chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Pathwise AI Assistant');
  panel.hidden = true;
  panel.innerHTML = `
    <header class="pw-chat-header">
      <div class="pw-chat-avatar" aria-hidden="true">✦</div>
      <div class="pw-chat-heading"><strong>Pathwise AI Assistant</strong><small><span class="pw-online-dot"></span> UCS learning helper</small></div>
      <button class="pw-chat-close" type="button" aria-label="Close chat">×</button>
    </header>
    <div class="pw-chat-notice">Ask about Uniform Cost Search, path costs, complexity, or numerical problems.</div>
    <div class="pw-chat-messages" aria-live="polite" aria-relevant="additions">
      <div class="pw-message pw-bot-message">Hi! 👋 I can help you understand UCS step by step. What are you working on?</div>
    </div>
    <div class="pw-chat-suggestions">
      <button type="button" data-question="Explain Uniform Cost Search with a simple example.">Explain UCS</button>
      <button type="button" data-question="How do I solve a UCS numerical problem step by step?">Solve a numerical</button>
      <button type="button" data-question="Explain the time and space complexity of UCS.">Complexity</button>
    </div>
    <form class="pw-chat-form">
      <label class="pw-sr-only" for="pw-chat-input">Your question</label>
      <textarea id="pw-chat-input" rows="1" maxlength="2000" placeholder="Ask your UCS question…" required></textarea>
      <button class="pw-chat-send" type="submit" aria-label="Send message">➤</button>
    </form>
    <div class="pw-chat-footnote">AI can make mistakes. Verify numerical answers.</div>`;

  document.body.append(launcher, panel);
  const closeBtn = panel.querySelector('.pw-chat-close');
  const form = panel.querySelector('.pw-chat-form');
  const input = panel.querySelector('#pw-chat-input');
  const messages = panel.querySelector('.pw-chat-messages');
  const sendBtn = panel.querySelector('.pw-chat-send');

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    launcher.innerHTML = open ? '<span class="pw-launch-icon" aria-hidden="true">×</span><span class="pw-launch-label">Close</span>' : '<span class="pw-launch-icon" aria-hidden="true">✦</span><span class="pw-launch-label">Ask AI</span>';
    if (open) setTimeout(() => input.focus(), 40);
  }
  launcher.addEventListener('click', () => setOpen(panel.hidden));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) setOpen(false); });

  function addMessage(text, who, typing = false) {
    const el = document.createElement('div');
    el.className = `pw-message ${who === 'user' ? 'pw-user-message' : 'pw-bot-message'}${typing ? ' pw-typing' : ''}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }
  function setBusy(value) {
    busy = value;
    sendBtn.disabled = value;
    input.disabled = value;
    sendBtn.textContent = value ? '…' : '➤';
    panel.querySelectorAll('.pw-chat-suggestions button').forEach(b => b.disabled = value);
  }
  async function ask(raw) {
    const question = String(raw || '').trim();
    if (!question || busy) return;
    addMessage(question, 'user');
    input.value = '';
    input.style.height = 'auto';
    setBusy(true);
    const typing = addMessage('Thinking through your question…', 'bot', true);
    try {
      if (!config.apiUrl) {
        typing.textContent = 'The chat interface is ready, but the AI backend is not connected yet. Follow the README steps to deploy the secure Cloudflare Worker, then add its /api/chat URL to chat-config.js.';
        return;
      }
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history: history.slice(-8) })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      if (!data.reply || typeof data.reply !== 'string') throw new Error('The assistant returned an empty response. Please try again.');
      typing.textContent = data.reply;
      history.push({ role: 'user', content: question }, { role: 'assistant', content: data.reply });
      if (history.length > 12) history.splice(0, history.length - 12);
    } catch (err) {
      typing.textContent = `Sorry, I couldn't reach the AI assistant. ${err.message || 'Check your connection and try again.'}`;
    } finally {
      typing.classList.remove('pw-typing');
      setBusy(false);
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  }
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; });
  panel.querySelectorAll('[data-question]').forEach(btn => btn.addEventListener('click', () => ask(btn.dataset.question)));
})();
