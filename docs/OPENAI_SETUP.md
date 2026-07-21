# OpenAI API key — Content desk (image → article)

Needed for **Admin → Content → Generate draft from image**.

## Get a key (about 2 minutes)

1. Go to [https://platform.openai.com](https://platform.openai.com) and sign in (or create an account).
2. Open **API keys**: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Click **Create new secret key** → name it `BTF Content` → Create.
4. **Copy the key once** (starts with `sk-…`). You won’t see it again.

## Add billing (required for API use)

1. [https://platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)
2. Add a payment method and a small credit balance (e.g. $10).  
   Image drafts use **gpt-4o-mini** by default — usually a few cents each.

## Put it on Vercel

1. Vercel project → **Settings → Environment Variables**
2. Add **Production**:
   - `OPENAI_API_KEY` = your `sk-…` key
   - Optional: `OPENAI_ARTICLE_MODEL` = `gpt-4o-mini` (default) or `gpt-4o` for higher quality
3. **Redeploy**

## Test

1. `/admin/content/`
2. Select an unused infographic (preview shows on the right/bottom)
3. **Generate draft from image** → proofread → **Post to site**

Never commit the key or paste it in chat.
