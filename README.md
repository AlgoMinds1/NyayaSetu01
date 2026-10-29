# NyayaSetu AI (CaseBridge AI)

> **Integrated Institution-Related Complaint Tracking & Cross-Bureau Overlap Monitoring Dashboard for AICTE**  
> *Category: Software • Theme: Smart Automation • All India Council for Technical Education (AICTE)*

Built with **pure React + Vite + JavaScript** (no Next.js, no TypeScript).

---

## 🚀 Deploying to Vercel

The project is fully pre-configured for Vercel with [`vercel.json`](file:///c:/Users/Admin/NyayaSetu01/vercel.json) (handling SPA client-side routing rewrites).

### Option 1: Via GitHub (Recommended)
1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: working prototype with Vercel deployment configuration"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository: `AlgoMinds1/NyayaSetu01`.
4. Vercel will automatically detect the Vite preset:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your app will be live with full client-side route support.

---

### Option 2: Via Vercel CLI
If you have the Vercel CLI installed:
```bash
npm i -g vercel
vercel
```
For production deployment:
```bash
vercel --prod
```

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start local development server (with HMR)
npm run dev

# Test production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🏛 Four Stakeholder Portals Included
- **AICTE Headquarters**: Single-window executive grid, automated Regulation Bureau (RB) vs PGRC cross-bureau overlap detection & linking, master case registry, 360° institution dossiers, and CSV statutory report exports.
- **Student / Alumnus**: 3-step complaint filing wizard with AICTE ID lookup and real-time timeline tracking.
- **Faculty GRC Member**: Committee hearing observations, defense submissions, and conflict-of-interest recusal audit logging.
- **College Management**: Affiliated institution compliance desk and delegation to faculty committee members.
