# Ghid de Lansare: Chatbot ZenixWeb pe Vercel

Felicitări! Am pregătit structura specială pentru Vercel, care suportă funcții serverless gratuit.

## Ce conține acest folder:
- `index.html`, `style.css`, `app.js` -> Partea vizuală a site-ului.
- `api/chat.js` -> "Creierul" chatbot-ului (funcție serverless Vercel).
- `vercel.json` -> Configurația de routing pentru Vercel.

## Pașii pentru Deploy pe Vercel:

1. **Creează un cont pe Vercel:** Intră pe [vercel.com](https://vercel.com) și conectează-te.
2. **Instalează Vercel CLI (Opțional dar recomandat):** Sau pur și simplu urcă folderul pe GitHub și importă-l în Vercel.
3. **Metoda cea mai simplă (GitHub):**
   - Creează un repository nou pe GitHub.
   - Urcă toate fișierele din acest folder (`ZenixWeb_Vercel_Deploy`) în repository.
   - Pe Vercel, dă click pe "New Project" și selectează repository-ul tău.
   - Vercel va detecta automat folderul `api/` și va configura totul.
4. **GATA!** Site-ul tău va fi live cu tot cu chatbot funcțional.

**Notă:** Am inclus deja cheia ta Nvidia direct în `api/chat.js`, deci nu mai trebuie să configurezi Environment Variables manual, va merge din prima!
