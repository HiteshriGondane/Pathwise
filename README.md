# Pathwise Lab — Uniform Cost Search

A responsive multi-page educational website for learning Uniform Cost Search (UCS). Built with plain HTML, CSS, and JavaScript; no frontend build tools or external libraries are required.

## Pages
- `index.html` — welcome page
- `ucs.html` — UCS introduction and applicability conditions
- `algorithm.html` — algorithm steps, pseudocode, time and space complexity
- `applications.html` — real-world uses and comparisons
- `demo.html` — live weighted graph visualizer with editable edges, start/goal nodes, Run, Step, Pause/Resume, and Reset
- `quiz.html` — 3D flashcards and a scored MCQ test
- `conclusion.html` — final recap

## New feature: floating AI chatbot
Every page now includes a floating **Ask AI** button for the Pathwise AI Assistant. It can explain UCS concepts, guide users through numerical problems, and answer questions about graph-search complexity. It follows the site's light/dark theme.

**Important:** GitHub Pages is a static host, so it cannot safely store an AI API key. The chatbot frontend is included, and the secure backend is in `worker/`. To activate AI answers, deploy that backend and configure `chat-config.js` as described below. Until then, the widget displays a setup message instead of pretending that AI is connected.

## Activate the AI backend (Cloudflare Worker + OpenAI API)

### 1. Get an API key
1. Create an API key in your OpenAI API platform account.
2. API usage may incur charges; review your API billing and usage limits before enabling the public chatbot.
3. **Never put the key in `chat-config.js`, `site.js`, HTML, or any public GitHub file.** The key belongs only in the Worker secret.

### 2. Deploy the Worker
1. Install Node.js if needed, then open a terminal.
2. Install Wrangler: `npm install -g wrangler`
3. Log in: `wrangler login`
4. Open the `worker` folder in the terminal: `cd worker`
5. Edit `wrangler.toml`. Replace `https://YOUR-GITHUB-USERNAME.github.io` with your website's **origin**. For a GitHub Pages URL like `https://username.github.io/pathwise-lab/`, the origin is just `https://username.github.io` (no repository path and no trailing slash).
6. Add the API key as a secret: `wrangler secret put OPENAI_API_KEY` and paste the key when prompted.
7. Deploy: `wrangler deploy`
8. Copy the deployed Worker URL shown by Wrangler. It usually looks like `https://pathwise-lab-chatbot.<your-subdomain>.workers.dev`.

### 3. Connect the website to the Worker
1. Open `chat-config.js` in the website root.
2. Set `apiUrl` to your Worker URL, for example:

   `apiUrl: "https://pathwise-lab-chatbot.YOUR-SUBDOMAIN.workers.dev/api/chat"`

3. Save and upload the changed `chat-config.js` to the root of the GitHub repository.
4. Wait for GitHub Pages to publish, then refresh the site with **Ctrl + Shift + R** and test a question.

The Worker accepts POST requests and handles CORS for the configured website origin. It limits question length and response size and sends `store: false` to the Responses API. Questions are still transmitted to the Worker and OpenAI to generate replies. Do not enter passwords, private information, or sensitive data.

### 4. Usage and abuse protection
The chatbot is publicly accessible once enabled, so visitors can generate API usage. Set spending limits/alerts on your API account and monitor usage. The Worker includes basic input validation and an origin allowlist, but CORS alone is not authentication and does not stop all automated requests. For a larger public deployment, add server-side rate limiting or an authenticated access layer.

## Run the website locally
Open `index.html` in a browser to view the pages and widget UI. To test live API requests, use a local web server and add its exact origin to `ALLOWED_ORIGIN` in the Worker configuration temporarily. `chat-config.js` must contain the deployed Worker URL.

## GitHub Pages deployment
1. Extract this ZIP.
2. Upload the website files to the repository root. Keep all HTML files, `styles.css`, `site.js`, `chat-config.js`, and `chat-widget.js` together in the same folder.
3. Keep the `worker/` folder in the repository if you want to version the backend code, but do not put API keys in it.
4. Open **Settings → Pages**, select **Deploy from a branch**, branch `main`, folder `/(root)`, and save.
5. Wait for deployment and open the published URL.

## Existing and new features
- Live UCS graph demo with editable weighted edges and user-selected start/goal.
- Flashcards with a 3D flip effect and an MCQ test.
- Light/dark theme toggle remembered in the browser.
- Dedicated conclusion page.
- Floating AI chatbot on every page (requires the backend setup above for AI-generated responses).
- UCS formula reference on the UCS Basics and Algorithm pages, with explanations of f(n), g(n), parent(n), and edge cost c, plus a worked mini-example.

Designed by Hiteshri Gondane.
