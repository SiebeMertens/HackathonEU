# QUICKSTART CARD

## ⚡ 30-Second Setup

```bash
cd prototype
npm install
npm run dev
```

Open http://localhost:5173 ✅

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `src/CyberAssessmentTool.jsx` | Main React component (350+ lines) |
| `src/i18n.js` | 8 languages with full translations |
| `src/main.jsx` | React entry point |
| `index.html` | HTML template |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | How to deploy |
| `ARCHITECTURE.md` | API specs & future roadmap |
| `PROJECT_SUMMARY.md` | This project's overview |

---

## 🌐 Language Support

Dropdown selector on home screen:
- English (en)
- Estonian (et) 🇪🇪
- Hungarian (hu) 🇭🇺
- Lithuanian (lt) 🇱🇹
- Polish (pl) 🇵🇱
- Portuguese (pt) 🇵🇹
- Slovak (sk) 🇸🇰
- Slovenian (sl) 🇸🇮

---

## 🎯 Features at a Glance

✅ Adaptive questions (rule-based)  
✅ 3 domains × 5 questions = 15 total  
✅ Real-time feedback & explanations  
✅ Gamification (badges, progress)  
✅ Personalized learning paths  
✅ Mobile-friendly & accessible  
✅ localStorage persistence  
✅ No backend required (prototype)

---

## 🚀 Deploy in 2 Minutes

### Option A: Netlify (Easiest)
1. Connect GitHub repo to Netlify
2. Set build: `npm run build`
3. Publish dir: `dist`
4. Done! (auto-deploys on push)

### Option B: GitHub Pages
```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

### Option C: Vercel
1. Import GitHub repo
2. Deploy (auto-detected Vite config)
3. Done!

---

## 🛠️ Key Commands

```bash
npm run dev       # Local dev server (http://localhost:5173)
npm run build     # Production build → dist/ folder
npm run preview   # Preview production build
npm run test      # Run tests (optional)
```

---

## 📊 What's Inside

### Components
- `CyberAssessmentTool` (Home, Assessment, Results screens)
- Responsive UI using Tailwind CSS
- Icons from Lucide React

### Data
- 15 questions across 3 domains
- Adaptive branching logic
- Skill level progression (Beginner → Intermediate → Advanced)

### Localization
- 8 full translations
- Easy to add more languages

---

## 🔐 Privacy

✅ All data stays on device (localStorage)  
✅ No external API calls  
✅ No personal data collection  
✅ GDPR-ready architecture

---

## 📈 Next: Backend Integration (Optional)

When ready for Phase 2:
1. See `ARCHITECTURE.md` for API spec
2. Implement Node.js/Python backend
3. Add authentication (OAuth2)
4. Connect database (PostgreSQL)
5. Deploy with Docker

---

## ❓ Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 5174
```

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Translations not showing?**
- Check language dropdown (top-right)
- Check browser console for errors (F12)

---

## 📞 Help

- 📖 Read `README.md` for full docs
- 🏗️ Read `ARCHITECTURE.md` for technical details
- 🚀 Read `DEPLOYMENT.md` for deployment options
- 💬 Open an issue or reach out to the team

---

## 🎉 You're Ready!

```bash
npm run dev
```

Share the URL with learners. Watch them discover their cybersecurity strengths! 🔐

**Happy Learning!** 🚀
