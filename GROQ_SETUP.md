
# How to Use Groq AI for Better Symptom Predictions

## The Problem

Your ML models sometimes give inaccurate symptom-based diagnoses (e.g., predicting "Paralysis" for fever/headache/abdominal pain).

## The Solution: Groq AI Integration

Now your app can use **Groq AI** to intelligently validate and rerank symptom predictions using **medical reasoning** instead of just ML model scores.

---

## Step 1: Get a Groq API Key (FREE)

1. Go to https://console.groq.com
2. Sign up or log in
3. Click "API Keys"
4. Create a new API key
5. Copy the key (keep it secret!)

> Free tier: 30 requests/minute is plenty for testing

---

## Step 2: Configure in MediPredict App

1. Open MediPredict in your browser (usually `http://localhost:3000`)
2. Click the **⚙️ Settings** button in the bottom-left sidebar
3. Paste your Groq API key in the "Groq API Key" field
4. You should see confirmation that it's been saved

---

## Step 3: Use Groq for Symptom Predictions

1. Go to **"⚕️ Symptom Checker"** module
2. Select 3+ symptoms (e.g., "headache, abdominal pain, high fever")
3. Click **"Run Prediction"**

### What You'll See:

**ML Model Result:**

- Your XGBoost predictions (may be inaccurate)
- Example: "Paralysis (brain hemorrhage) — 17% confidence"

**Groq AI Second Opinion** (NEW!):

- Medical reasoning for each disease
- Intelligent confidence ranking based on clinical knowledge
- Example: "Flu-like illness (85%), Viral gastroenteritis (60%), Dengue fever (45%)"

---

## How It Works

```
Your Symptoms (e.g. headache, fever, cough)
    ↓
ML Model (XGBoost) generates predictions
    ↓
Groq AI analyzes symptoms clinically
    ↓
Groq ranks diseases by medical likelihood
    ↓
You get BOTH results to compare
    ↓
Groq opinion is usually more accurate for symptom-based diagnosis!
```

---

## Advanced: Behind the Scenes

### New Endpoint: `/predict/symptoms/groq-enhanced`

**Request:**

```json
POST /predict/symptoms/groq-enhanced?api_key=YOUR_API_KEY
{
  "symptoms": ["headache", "abdominal pain", "high fever"]
}
```

**Response:**

```json
{
  "disease": "Flu-like Illness",
  "probability": 0.45,
  "alternatives": [
    {"disease": "Cholera", "probability": 0.23},
    {"disease": "Dengue Fever", "probability": 0.16}
  ],
  "description": "...",
  "precautions": [...],
  "groq_analysis": "Based on the reported symptoms... [detailed medical reasoning]"
}
```

---

## Troubleshooting

| Issue                          | Solution                                         |
| ------------------------------ | ------------------------------------------------ |
| "API error" in Groq panel      | Check your API key is correct and has quota left |
| Groq panel shows "unavailable" | Make sure API key is saved in Settings           |
| Slow response                  | Groq API is thinking (normal takes 2-5 sec)      |
| Different results each time    | Normal! Groq uses reasoning, not pure ML         |

---

## Important: Medical Disclaimer

⚠️ **This is NOT a substitute for professional medical advice.**

- Always consult a qualified healthcare provider for medical decisions
- Use this tool for educational purposes and symptom exploration
- In medical emergencies, call emergency services

---

## Tips for Best Results

✅ **DO:**

- Provide at least 3 symptoms for better accuracy
- Include duration if relevant ("cough for 3 days")
- Be specific ("severe headache" vs "mild headache")
- Trust Groq's reasoning over ML scores

❌ **DON'T:**

- Rely solely on this for diagnosis
- Use outdated/incomplete symptom information
- Ignore your doctor's advice
- Use for self-diagnosis in emergencies

---

## Example Session

**User inputs:** "headache, abdominal pain, high fever, vomiting"

**ML Prediction:** Paralysis - 17% (❌ Wrong!)

**Groq Analysis:**

```
1. Acute Gastroenteritis/Food Poisoning: 78%
   - Abdominal pain + vomiting + fever = classic presentation

2. Influenza (Flu): 65%
   - High fever + headache + body aches patterns

3. Salmonella/Enteric Fever: 42%
   - Similar symptom constellation but less common
```

**Next Steps:** Patient should see a doctor for fluid/electrolyte assessment, not worry about paralysis!

---

## Questions?

Check the main README.md or review the code in:

- `Frontend/api.py` - Backend endpoints
- `medipredict/src/App.js` - Frontend integration
