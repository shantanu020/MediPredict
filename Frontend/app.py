import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import streamlit as st
import pandas as pd
import numpy as np
import joblib
from PIL import Image
from streamlit_option_menu import option_menu
from groq import Groq

from code.DiseaseModel import DiseaseModel
from code.helper import prepare_symptoms_array

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Multiple Disease Prediction",
    page_icon="🏥",
    layout="wide"
)

# ── Load all models (cached) ──────────────────────────────────────────────────
@st.cache_resource
def load_models():
    return {
        "diabetes":      joblib.load("models/diabetes_model.sav"),
        "heart":         joblib.load("models/heart_disease_model.sav"),
        "parkinson":     joblib.load("models/parkinsons_model.sav"),
        "lung_cancer":   joblib.load("models/lung_cancer_model.sav"),
        "breast_cancer": joblib.load("models/breast_cancer.sav"),
        "chronic":       joblib.load("models/chronic_model.sav"),
        "hepatitis":     joblib.load("models/hepititisc_model.sav"),
        "liver":         joblib.load("models/liver_model.sav"),
    }

@st.cache_resource
def load_disease_model():
    dm = DiseaseModel()
    dm.load_xgboost('model/xgboost_model.json')
    return dm

models            = load_models()
diabetes_model    = models["diabetes"]
heart_model       = models["heart"]
parkinson_model   = models["parkinson"]
lung_cancer_model = models["lung_cancer"]
breast_cancer_model = models["breast_cancer"]
chronic_disease_model = models["chronic"]
hepatitis_model   = models["hepatitis"]
liver_model       = models["liver"]


# ── Groq second opinion ───────────────────────────────────────────────────────
def get_groq_opinion(symptoms: list, ml_prediction: str, ml_confidence: float,
                     groq_api_key: str) -> str:
    """
    Ask Groq LLM for a second opinion given symptoms and the ML prediction.
    Returns the LLM response as a string.
    """
    try:
        client = Groq(api_key=groq_api_key)

        symptom_str = ", ".join(symptoms)
        prompt = f"""You are a helpful medical assistant providing a second opinion on a symptom-based disease prediction.

A machine learning model has analyzed the following symptoms and made a prediction.

Symptoms reported: {symptom_str}
ML Model prediction: {ml_prediction} (confidence: {ml_confidence*100:.1f}%)

Please provide:
1. Whether you agree or disagree with the ML prediction and why
2. Other possible conditions these symptoms could indicate
3. Key symptoms that would help differentiate between the possibilities
4. General advice on next steps (e.g., which type of doctor to consult)

Keep your response clear, concise and structured. Always remind the user this is not a substitute for professional medical advice."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.3,   # lower = more factual, less creative
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"⚠️ Groq API error: {str(e)}\nPlease check your API key."


def get_groq_chat_response(messages: list, groq_api_key: str) -> str:
    """General symptom chat with Groq."""
    try:
        client = Groq(api_key=groq_api_key)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"⚠️ Groq API error: {str(e)}"


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    selected = option_menu(
        'Multiple Disease Prediction',
        [
            'Disease Prediction',
            'Diabetes Prediction',
            'Heart Disease Prediction',
            'Parkinson Prediction',
            'Liver Prediction',
            'Hepatitis Prediction',
            'Lung Cancer Prediction',
            'Chronic Kidney Prediction',
            'Breast Cancer Prediction',
        ],
        icons=['activity', 'activity', 'heart', 'person', 'person',
               'person', 'person', 'bar-chart-fill', 'person'],
        default_index=0,
    )

    st.divider()
    st.markdown("### 🤖 Groq AI Second Opinion")
    groq_api_key = st.text_input(
        "Groq API Key",
        type="password",
        placeholder="gsk_...",
        help="Get your free key at https://console.groq.com"
    )
    if groq_api_key:
        st.success("✅ API key set")
    else:
        st.info("Enter your Groq API key to enable AI second opinion")


# ── Helper ────────────────────────────────────────────────────────────────────
def show_result(name, condition, positive_msg, negative_msg):
    if condition:
        try:
            st.image(Image.open('positive.jpg'))
        except FileNotFoundError:
            pass
        st.error(f"{name} — {positive_msg}")
    else:
        try:
            st.image(Image.open('negative.jpg'))
        except FileNotFoundError:
            pass
        st.success(f"{name} — {negative_msg}")


def show_groq_opinion_for_structured(disease_name: str, confidence: float,
                                      input_summary: str, groq_api_key: str):
    """Show Groq second opinion for structured disease pages (diabetes, heart etc.)"""
    if not groq_api_key:
        st.info("💡 Add your Groq API key in the sidebar to get an AI second opinion.")
        return

    with st.spinner("🤖 Getting AI second opinion from Groq..."):
        try:
            client = Groq(api_key=groq_api_key)
            prompt = f"""You are a helpful medical assistant providing a second opinion.

A machine learning model predicted: {disease_name}
Model confidence: {confidence*100:.1f}%
Patient data summary: {input_summary}

Please provide:
1. Brief assessment of the prediction
2. What additional tests or checks are recommended
3. Which type of specialist to consult
4. General lifestyle advice if applicable

Keep it concise and always remind the user to consult a real doctor."""

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.3,
            )
            opinion = response.choices[0].message.content
            st.divider()
            st.markdown("### 🤖 Groq AI Second Opinion")
            st.markdown(opinion)
            st.caption("⚠️ This is AI-generated information, not medical advice. Always consult a doctor.")
        except Exception as e:
            st.warning(f"Groq API error: {e}")


# ════════════════════════════════════════════════════════════════════════════
# 1. Disease Prediction (Symptom-based)
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Disease Prediction':
    disease_model = load_disease_model()

    st.title('🏥 Disease Prediction using Machine Learning + AI')
    st.info("💡 **Tip:** Select 3–6 symptoms that occur together for best accuracy.")

    symptoms = st.multiselect('What are your symptoms?',
                               options=list(disease_model.all_symptoms))
    X = prepare_symptoms_array(symptoms)

    if st.button('Predict', type='primary'):
        if not symptoms:
            st.warning("Please select at least one symptom.")
        elif len(symptoms) < 3:
            st.warning("Please select at least 3 symptoms for a reliable prediction.")
        else:
            prediction, prob = disease_model.predict(X)

            # ── Two columns: ML result | Groq result ──────────────────────
            col_ml, col_ai = st.columns(2)

            with col_ml:
                st.markdown("### 🔬 ML Model Prediction")
                st.success(f"**{prediction}**  \n{prob * 100:.1f}% confidence")

                if len(disease_model.top_predictions) > 1:
                    st.write("**Other possibilities:**")
                    for disease, p in disease_model.top_predictions[1:]:
                        if p > 0.05:
                            st.write(f"- {disease} — {p * 100:.1f}%")

                st.divider()
                tab1, tab2 = st.tabs(['📋 Description', '🛡️ Precautions'])
                with tab1:
                    st.write(disease_model.describe_predicted_disease())
                with tab2:
                    for i, p in enumerate(disease_model.predicted_disease_precautions(), 1):
                        st.write(f'{i}. {p}')

            with col_ai:
                st.markdown("### 🤖 Groq AI Second Opinion")
                if not groq_api_key:
                    st.info("Enter your Groq API key in the sidebar to get an AI second opinion here.")
                else:
                    with st.spinner("Asking Groq AI..."):
                        opinion = get_groq_opinion(
                            symptoms, prediction, prob, groq_api_key)
                    st.markdown(opinion)
                    st.caption("⚠️ AI-generated — not a substitute for medical advice.")


# ════════════════════════════════════════════════════════════════════════════
# 2. Diabetes Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Diabetes Prediction':
    st.title('Diabetes Disease Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        Pregnancies = st.number_input('Pregnancies', min_value=0)
    with col2:
        Glucose = st.number_input('Glucose Level', min_value=0)
    with col3:
        BloodPressure = st.number_input('Blood Pressure', min_value=0)
    with col1:
        SkinThickness = st.number_input('Skin Thickness', min_value=0)
    with col2:
        Insulin = st.number_input('Insulin', min_value=0)
    with col3:
        BMI = st.number_input('BMI', min_value=0.0, format='%.1f')
    with col1:
        DiabetesPedigreeFunction = st.number_input('Diabetes Pedigree Function',
                                                    min_value=0.0, format='%.3f')
    with col2:
        Age = st.number_input('Age', min_value=1)

    if st.button('Diabetes Test Result', type='primary'):
        pred = diabetes_model.predict(
            [[Pregnancies, Glucose, BloodPressure, SkinThickness,
              Insulin, BMI, DiabetesPedigreeFunction, Age]])
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to be diabetic.",
                    "You do not appear to be diabetic.")

        # Groq second opinion
        disease_name = "Diabetes" if condition else "No Diabetes"
        proba = diabetes_model.predict_proba(
            [[Pregnancies, Glucose, BloodPressure, SkinThickness,
              Insulin, BMI, DiabetesPedigreeFunction, Age]])[0]
        confidence = max(proba)
        summary = (f"Glucose={Glucose}, BMI={BMI}, Age={Age}, "
                   f"Pregnancies={Pregnancies}, BloodPressure={BloodPressure}, "
                   f"Insulin={Insulin}, DiabetesPedigreeFunction={DiabetesPedigreeFunction}")
        show_groq_opinion_for_structured(disease_name, confidence, summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 3. Heart Disease Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Heart Disease Prediction':
    st.title('Heart Disease Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.number_input('Age', min_value=1)
    with col2:
        sex = st.selectbox('Gender', ['Male', 'Female'])
        sex = 1 if sex == 'Male' else 0
    with col3:
        cp = st.selectbox('Chest Pain Type',
                           ['Typical Angina', 'Atypical Angina',
                            'Non-Anginal Pain', 'Asymptomatic'])
        cp = ['Typical Angina', 'Atypical Angina',
              'Non-Anginal Pain', 'Asymptomatic'].index(cp)
    with col1:
        trestbps = st.number_input('Resting Blood Pressure', min_value=0)
    with col2:
        chol = st.number_input('Serum Cholesterol', min_value=0)
    with col3:
        fbs = int(st.checkbox('Fasting Blood Sugar > 120 mg/dl'))
    with col1:
        restecg = st.selectbox('Resting ECG',
                                ['Normal', 'ST-T Wave Abnormality',
                                 'Left Ventricular Hypertrophy'])
        restecg = ['Normal', 'ST-T Wave Abnormality',
                   'Left Ventricular Hypertrophy'].index(restecg)
    with col2:
        thalach = st.number_input('Max Heart Rate Achieved', min_value=0)
    with col3:
        exang = int(st.checkbox('Exercise Induced Angina'))
    with col1:
        oldpeak = st.number_input('ST Depression', min_value=0.0, format='%.1f')
    with col2:
        slope = st.selectbox('Slope of Peak ST Segment',
                              ['Upsloping', 'Flat', 'Downsloping'])
        slope = ['Upsloping', 'Flat', 'Downsloping'].index(slope)
    with col3:
        ca = st.number_input('Major Vessels (0–3)', min_value=0, max_value=3, step=1)
    with col1:
        thal = st.selectbox('Thalassemia',
                             ['Normal', 'Fixed Defect', 'Reversible Defect'])
        thal = ['Normal', 'Fixed Defect', 'Reversible Defect'].index(thal)

    if st.button('Heart Test Result', type='primary'):
        pred = heart_model.predict(
            [[age, sex, cp, trestbps, chol, fbs, restecg,
              thalach, exang, oldpeak, slope, ca, thal]])
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to have heart disease.",
                    "You do not appear to have heart disease.")
        proba = heart_model.predict_proba(
            [[age, sex, cp, trestbps, chol, fbs, restecg,
              thalach, exang, oldpeak, slope, ca, thal]])[0]
        summary = (f"Age={age}, Cholesterol={chol}, BloodPressure={trestbps}, "
                   f"MaxHeartRate={thalach}, STDepression={oldpeak}")
        show_groq_opinion_for_structured(
            "Heart Disease" if condition else "No Heart Disease",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 4. Parkinson's Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Parkinson Prediction':
    st.title("Parkinson's Disease Prediction")
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    fields = [
        ('MDVP:Fo(Hz)', col1), ('MDVP:Fhi(Hz)', col2), ('MDVP:Flo(Hz)', col3),
        ('MDVP:Jitter(%)', col1), ('MDVP:Jitter(Abs)', col2), ('MDVP:RAP', col3),
        ('MDVP:PPQ', col1), ('Jitter:DDP', col2), ('MDVP:Shimmer', col3),
        ('MDVP:Shimmer(dB)', col1), ('Shimmer:APQ3', col2), ('Shimmer:APQ5', col3),
        ('MDVP:APQ', col1), ('Shimmer:DDA', col2), ('NHR', col3),
        ('HNR', col1), ('RPDE', col2), ('DFA', col3),
        ('spread1', col1), ('spread2', col2), ('D2', col3), ('PPE', col1),
    ]
    vals = {}
    for label, col in fields:
        with col:
            vals[label] = st.number_input(label)

    if st.button("Parkinson's Test Result", type='primary'):
        features = list(vals.values())
        pred = parkinson_model.predict([features])
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to have Parkinson's disease.",
                    "You do not appear to have Parkinson's disease.")
        proba = parkinson_model.predict_proba([features])[0]
        summary = f"Voice measurements: MDVP:Fo={vals.get('MDVP:Fo(Hz)',0):.3f}, HNR={vals.get('HNR',0):.3f}, RPDE={vals.get('RPDE',0):.3f}"
        show_groq_opinion_for_structured(
            "Parkinson's Disease" if condition else "No Parkinson's Disease",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 5. Liver Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Liver Prediction':
    st.title('Liver Disease Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        Sex = 0 if st.selectbox('Gender', ['Male', 'Female']) == 'Male' else 1
    with col2:
        age = st.number_input('Age', min_value=1)
    with col3:
        Total_Bilirubin = st.number_input('Total Bilirubin', min_value=0.0, format='%.2f')
    with col1:
        Direct_Bilirubin = st.number_input('Direct Bilirubin', min_value=0.0, format='%.2f')
    with col2:
        Alkaline_Phosphotase = st.number_input('Alkaline Phosphotase', min_value=0)
    with col3:
        Alamine_Aminotransferase = st.number_input('Alamine Aminotransferase', min_value=0)
    with col1:
        Aspartate_Aminotransferase = st.number_input('Aspartate Aminotransferase', min_value=0)
    with col2:
        Total_Protiens = st.number_input('Total Proteins', min_value=0.0, format='%.1f')
    with col3:
        Albumin = st.number_input('Albumin', min_value=0.0, format='%.1f')
    with col1:
        Albumin_and_Globulin_Ratio = st.number_input('Albumin/Globulin Ratio',
                                                      min_value=0.0, format='%.2f')
    if st.button('Liver Test Result', type='primary'):
        pred = liver_model.predict([[Sex, age, Total_Bilirubin, Direct_Bilirubin,
                                     Alkaline_Phosphotase, Alamine_Aminotransferase,
                                     Aspartate_Aminotransferase, Total_Protiens,
                                     Albumin, Albumin_and_Globulin_Ratio]])
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to have liver disease.",
                    "You do not appear to have liver disease.")
        proba = liver_model.predict_proba([[Sex, age, Total_Bilirubin, Direct_Bilirubin,
                                            Alkaline_Phosphotase, Alamine_Aminotransferase,
                                            Aspartate_Aminotransferase, Total_Protiens,
                                            Albumin, Albumin_and_Globulin_Ratio]])[0]
        summary = (f"Age={age}, TotalBilirubin={Total_Bilirubin}, "
                   f"AlkalinePhosphotase={Alkaline_Phosphotase}, Albumin={Albumin}")
        show_groq_opinion_for_structured(
            "Liver Disease" if condition else "No Liver Disease",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 6. Hepatitis Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Hepatitis Prediction':
    st.title('Hepatitis Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.number_input('Age', min_value=1)
    with col2:
        sex = 1 if st.selectbox('Gender', ['Male', 'Female']) == 'Male' else 2
    with col3:
        alb = st.number_input('ALB', min_value=0.0, format='%.2f')
    with col1:
        alp = st.number_input('ALP', min_value=0.0, format='%.2f')
    with col2:
        alt = st.number_input('ALT', min_value=0.0, format='%.2f')
    with col3:
        ast = st.number_input('AST', min_value=0.0, format='%.2f')
    with col1:
        bil = st.number_input('BIL', min_value=0.0, format='%.2f')
    with col2:
        che = st.number_input('CHE', min_value=0.0, format='%.2f')
    with col3:
        chol = st.number_input('CHOL', min_value=0.0, format='%.2f')
    with col1:
        crea = st.number_input('CREA', min_value=0.0, format='%.2f')
    with col2:
        ggt = st.number_input('GGT', min_value=0.0, format='%.2f')
    with col3:
        prot = st.number_input('PROT', min_value=0.0, format='%.2f')

    if st.button('Predict Hepatitis', type='primary'):
        user_data = pd.DataFrame({
            'Age': [age], 'Sex': [sex], 'ALB': [alb], 'ALP': [alp],
            'ALT': [alt], 'AST': [ast], 'BIL': [bil], 'CHE': [che],
            'CHOL': [chol], 'CREA': [crea], 'GGT': [ggt], 'PROT': [prot],
        })
        pred = hepatitis_model.predict(user_data)
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to have Hepatitis.",
                    "You do not appear to have Hepatitis.")
        proba = hepatitis_model.predict_proba(user_data)[0]
        summary = f"Age={age}, ALB={alb}, ALT={alt}, AST={ast}, BIL={bil}, GGT={ggt}"
        show_groq_opinion_for_structured(
            "Hepatitis" if condition else "No Hepatitis",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 7. Lung Cancer Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Lung Cancer Prediction':
    st.title('Lung Cancer Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)
    yn = ['NO', 'YES']

    with col1:
        gender = st.selectbox('Gender', ['Male', 'Female'])
        gender_val = 1 if gender == 'Male' else 2
    with col2:
        age = st.number_input('Age', min_value=1)
    with col3:
        smoking = st.selectbox('Smoking', yn)
    with col1:
        yellow_fingers = st.selectbox('Yellow Fingers', yn)
    with col2:
        anxiety = st.selectbox('Anxiety', yn)
    with col3:
        peer_pressure = st.selectbox('Peer Pressure', yn)
    with col1:
        chronic_disease = st.selectbox('Chronic Disease', yn)
    with col2:
        fatigue = st.selectbox('Fatigue', yn)
    with col3:
        allergy = st.selectbox('Allergy', yn)
    with col1:
        wheezing = st.selectbox('Wheezing', yn)
    with col2:
        alcohol_consuming = st.selectbox('Alcohol Consuming', yn)
    with col3:
        coughing = st.selectbox('Coughing', yn)
    with col1:
        shortness_of_breath = st.selectbox('Shortness of Breath', yn)
    with col2:
        swallowing_difficulty = st.selectbox('Swallowing Difficulty', yn)
    with col3:
        chest_pain = st.selectbox('Chest Pain', yn)

    if st.button('Predict Lung Cancer', type='primary'):
        encode = {'NO': 1, 'YES': 2}
        user_data = pd.DataFrame({
            'GENDER': [gender_val], 'AGE': [int(age)],
            'SMOKING': [encode[smoking]], 'YELLOW_FINGERS': [encode[yellow_fingers]],
            'ANXIETY': [encode[anxiety]], 'PEER_PRESSURE': [encode[peer_pressure]],
            'CHRONICDISEASE': [encode[chronic_disease]], 'FATIGUE': [encode[fatigue]],
            'ALLERGY': [encode[allergy]], 'WHEEZING': [encode[wheezing]],
            'ALCOHOLCONSUMING': [encode[alcohol_consuming]], 'COUGHING': [encode[coughing]],
            'SHORTNESSOFBREATH': [encode[shortness_of_breath]],
            'SWALLOWINGDIFFICULTY': [encode[swallowing_difficulty]],
            'CHESTPAIN': [encode[chest_pain]],
        })
        pred = lung_cancer_model.predict(user_data)
        condition = pred[0] == 'YES'
        show_result(name, condition,
                    "The model predicts a risk of Lung Cancer.",
                    "The model predicts no significant risk of Lung Cancer.")
        proba = lung_cancer_model.predict_proba(user_data)[0]
        summary = (f"Age={age}, Gender={gender}, Smoking={smoking}, "
                   f"Coughing={coughing}, ChestPain={chest_pain}, "
                   f"ShortnessOfBreath={shortness_of_breath}")
        show_groq_opinion_for_structured(
            "Lung Cancer Risk" if condition else "No Lung Cancer Risk",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 8. Chronic Kidney Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Chronic Kidney Prediction':
    st.title('Chronic Kidney Disease Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.slider('Age', 1, 100, 25)
    with col2:
        bp = st.slider('Blood Pressure', 50, 200, 120)
    with col3:
        sg = st.slider('Specific Gravity', 1.000, 1.050, 1.020, step=0.001, format='%.3f')
    with col1:
        al = st.slider('Albumin', 0, 5, 0)
    with col2:
        su = st.slider('Sugar', 0, 5, 0)
    with col3:
        rbc = 1 if st.selectbox('Red Blood Cells', ['Normal', 'Abnormal']) == 'Normal' else 0
    with col1:
        pc = 1 if st.selectbox('Pus Cells', ['Normal', 'Abnormal']) == 'Normal' else 0
    with col2:
        pcc = 1 if st.selectbox('Pus Cell Clumps', ['Present', 'Not Present']) == 'Present' else 0
    with col3:
        ba = 1 if st.selectbox('Bacteria', ['Present', 'Not Present']) == 'Present' else 0
    with col1:
        bgr = st.slider('Blood Glucose Random', 50, 500, 120)
    with col2:
        bu = st.slider('Blood Urea', 10, 200, 60)
    with col3:
        sc = st.slider('Serum Creatinine', 0, 10, 3)
    with col1:
        sod = st.slider('Sodium', 100, 200, 140)
    with col2:
        pot = st.slider('Potassium', 2, 7, 4)
    with col3:
        hemo = st.slider('Hemoglobin', 3, 17, 12)
    with col1:
        pcv = st.slider('Packed Cell Volume', 20, 60, 40)
    with col2:
        wc = st.slider('White Blood Cell Count', 2000, 20000, 10000)
    with col3:
        rc = st.slider('Red Blood Cell Count', 2, 8, 4)
    with col1:
        htn = 1 if st.selectbox('Hypertension', ['Yes', 'No']) == 'Yes' else 0
    with col2:
        dm = 1 if st.selectbox('Diabetes Mellitus', ['Yes', 'No']) == 'Yes' else 0
    with col3:
        cad = 1 if st.selectbox('Coronary Artery Disease', ['Yes', 'No']) == 'Yes' else 0
    with col1:
        appet = 1 if st.selectbox('Appetite', ['Good', 'Poor']) == 'Good' else 0
    with col2:
        pe = 1 if st.selectbox('Pedal Edema', ['Yes', 'No']) == 'Yes' else 0
    with col3:
        ane = 1 if st.selectbox('Anemia', ['Yes', 'No']) == 'Yes' else 0

    if st.button('Predict Chronic Kidney Disease', type='primary'):
        user_input = pd.DataFrame({
            'age': [age], 'bp': [bp], 'sg': [sg], 'al': [al], 'su': [su],
            'rbc': [rbc], 'pc': [pc], 'pcc': [pcc], 'ba': [ba],
            'bgr': [bgr], 'bu': [bu], 'sc': [sc], 'sod': [sod], 'pot': [pot],
            'hemo': [hemo], 'pcv': [pcv], 'wc': [wc], 'rc': [rc],
            'htn': [htn], 'dm': [dm], 'cad': [cad], 'appet': [appet],
            'pe': [pe], 'ane': [ane],
        })
        pred = chronic_disease_model.predict(user_input)
        condition = pred[0] == 1
        show_result(name, condition,
                    "You appear to have Chronic Kidney Disease.",
                    "You do not appear to have Chronic Kidney Disease.")
        proba = chronic_disease_model.predict_proba(user_input)[0]
        summary = (f"Age={age}, BloodPressure={bp}, Hemoglobin={hemo}, "
                   f"BloodUrea={bu}, SerumCreatinine={sc}, Sodium={sod}")
        show_groq_opinion_for_structured(
            "Chronic Kidney Disease" if condition else "No Chronic Kidney Disease",
            max(proba), summary, groq_api_key)


# ════════════════════════════════════════════════════════════════════════════
# 9. Breast Cancer Prediction
# ════════════════════════════════════════════════════════════════════════════
if selected == 'Breast Cancer Prediction':
    st.title('Breast Cancer Prediction')
    name = st.text_input('Name:')
    col1, col2, col3 = st.columns(3)

    with col1:
        radius_mean = st.slider('Radius Mean', 6.0, 30.0, 15.0)
        texture_mean = st.slider('Texture Mean', 9.0, 40.0, 20.0)
        perimeter_mean = st.slider('Perimeter Mean', 43.0, 190.0, 90.0)
    with col2:
        area_mean = st.slider('Area Mean', 143.0, 2501.0, 750.0)
        smoothness_mean = st.slider('Smoothness Mean', 0.05, 0.25, 0.1)
        compactness_mean = st.slider('Compactness Mean', 0.02, 0.3, 0.15)
    with col3:
        concavity_mean = st.slider('Concavity Mean', 0.0, 0.5, 0.2)
        concave_points_mean = st.slider('Concave Points Mean', 0.0, 0.2, 0.1)
        symmetry_mean = st.slider('Symmetry Mean', 0.1, 1.0, 0.5)
    with col1:
        fractal_dimension_mean = st.slider('Fractal Dimension Mean', 0.01, 0.1, 0.05)
        radius_se = st.slider('Radius SE', 0.1, 3.0, 1.0)
        texture_se = st.slider('Texture SE', 0.2, 2.0, 1.0)
    with col2:
        perimeter_se = st.slider('Perimeter SE', 1.0, 30.0, 10.0)
        area_se = st.slider('Area SE', 6.0, 500.0, 150.0)
        smoothness_se = st.slider('Smoothness SE', 0.001, 0.03, 0.01)
    with col3:
        compactness_se = st.slider('Compactness SE', 0.002, 0.2, 0.1)
        concavity_se = st.slider('Concavity SE', 0.0, 0.05, 0.02)
        concave_points_se = st.slider('Concave Points SE', 0.0, 0.03, 0.01)
    with col1:
        symmetry_se = st.slider('Symmetry SE', 0.1, 1.0, 0.5)
        fractal_dimension_se = st.slider('Fractal Dimension SE', 0.01, 0.1, 0.05)
    with col2:
        radius_worst = st.slider('Radius Worst', 7.0, 40.0, 20.0)
        texture_worst = st.slider('Texture Worst', 12.0, 50.0, 25.0)
        perimeter_worst = st.slider('Perimeter Worst', 50.0, 250.0, 120.0)
    with col3:
        area_worst = st.slider('Area Worst', 185.0, 4250.0, 1500.0)
        smoothness_worst = st.slider('Smoothness Worst', 0.07, 0.3, 0.15)
        compactness_worst = st.slider('Compactness Worst', 0.03, 0.6, 0.3)
    with col1:
        concavity_worst = st.slider('Concavity Worst', 0.0, 0.8, 0.4)
        concave_points_worst = st.slider('Concave Points Worst', 0.0, 0.2, 0.1)
        symmetry_worst = st.slider('Symmetry Worst', 0.1, 1.0, 0.5)
    with col2:
        fractal_dimension_worst = st.slider('Fractal Dimension Worst', 0.01, 0.2, 0.1)

    if st.button('Predict Breast Cancer', type='primary'):
        user_input = pd.DataFrame({
            'radius_mean': [radius_mean], 'texture_mean': [texture_mean],
            'perimeter_mean': [perimeter_mean], 'area_mean': [area_mean],
            'smoothness_mean': [smoothness_mean], 'compactness_mean': [compactness_mean],
            'concavity_mean': [concavity_mean], 'concave points_mean': [concave_points_mean],
            'symmetry_mean': [symmetry_mean], 'fractal_dimension_mean': [fractal_dimension_mean],
            'radius_se': [radius_se], 'texture_se': [texture_se],
            'perimeter_se': [perimeter_se], 'area_se': [area_se],
            'smoothness_se': [smoothness_se], 'compactness_se': [compactness_se],
            'concavity_se': [concavity_se], 'concave points_se': [concave_points_se],
            'symmetry_se': [symmetry_se], 'fractal_dimension_se': [fractal_dimension_se],
            'radius_worst': [radius_worst], 'texture_worst': [texture_worst],
            'perimeter_worst': [perimeter_worst], 'area_worst': [area_worst],
            'smoothness_worst': [smoothness_worst], 'compactness_worst': [compactness_worst],
            'concavity_worst': [concavity_worst], 'concave points_worst': [concave_points_worst],
            'symmetry_worst': [symmetry_worst], 'fractal_dimension_worst': [fractal_dimension_worst],
        })
        pred = breast_cancer_model.predict(user_input)
        condition = pred[0] == 1
        show_result(name, condition,
                    "The model predicts Breast Cancer.",
                    "The model predicts no Breast Cancer.")
        proba = breast_cancer_model.predict_proba(user_input)[0]
        summary = (f"RadiusMean={radius_mean}, TextureMean={texture_mean}, "
                   f"AreaMean={area_mean}, ConcavityMean={concavity_mean}")
        show_groq_opinion_for_structured(
            "Breast Cancer" if condition else "No Breast Cancer",
            max(proba), summary, groq_api_key)