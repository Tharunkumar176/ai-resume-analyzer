# 🚀 AI Resume Analyzer - Quick Start

## **ONE COMMAND TO RUN EVERYTHING:**

```bash
./run-all.sh
```

This single script will:
- ✅ Check all prerequisites (Python, Node.js)
- ✅ Install all dependencies automatically
- ✅ Set up virtual environments
- ✅ Start all three services
- ✅ Open the app in your browser

## **What You Get:**

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:5000
- 🤖 **ML API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

## **First Time Setup:**

Just run this once:
```bash
chmod +x run-all.sh
./run-all.sh
```

## **Features:**

- 📝 Upload Resume (PDF/DOCX)
- 🎯 AI-Powered Analysis
- 📊 ATS Compatibility Score
- 🔍 Keyword Matching
- 💼 Skills Analysis
- ✨ Personalized Suggestions
- 📈 Analysis History

## **Stop Services:**

Press `Ctrl+C` in the terminal

## **View Logs:**

```bash
tail -f logs/ml-api.log
tail -f logs/server.log
tail -f logs/client.log
```

## **Need Help?**

- Read `QUICKSTART.md` for detailed instructions
- Check `TESTING.md` for testing guide
- See `ARCHITECTURE.md` for system design

---

**That's it! Just run `./run-all.sh` and you're ready to go! 🎉**
