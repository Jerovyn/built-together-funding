# Google Maps address suggestions (/apply/)

Used for home + business address autocomplete on the apply funnel.

## Setup (same Google Cloud project as Calendar is fine)

1. [Google Cloud Console](https://console.cloud.google.com) → your project  
2. **APIs & Services → Library** → enable:
   - **Maps JavaScript API**
   - **Places API** (and/or Places API (New) if prompted)
3. **Credentials → Create credentials → API key**
4. Restrict the key:
   - **Application restrictions:** HTTP referrers → add  
     `https://builttogetherfunding.com/*`  
     `https://*.vercel.app/*`  
     `http://localhost:3000/*` (for local testing)
   - **API restrictions:** limit to Maps JavaScript API + Places API
5. Vercel → Environment Variables (Production):
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = that key  
6. **Redeploy** (NEXT_PUBLIC_* is baked at build time)

Without this key, address fields still work — users just type manually. With it, typing shows US address suggestions and fills street / city / state / ZIP.
