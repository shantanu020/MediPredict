# MediPredict Project Report

## 1. Project Overview

MediPredict is a medical AI system for multi-disease prediction and clinical guidance. It combines a Python-based ML backend with a React frontend user interface and enriches predictions using the Groq LLM for second opinions and diet recommendations.

The project includes:

- A FastAPI backend with REST endpoints for structured disease prediction and symptom-based diagnosis.
- A Streamlit dashboard for interactive prediction and AI second opinion workflows.
- A React SPA in `medipredict/` for polished user-facing navigation and UI.
- Pretrained model artifacts in `backend/models/` and an encoded disease classifier in `backend/model/`.
- Data assets in `backend/data/` for disease descriptions, precautions, symptom severity, and training sets.

## 2. Objectives

The main objective is to provide an AI-assisted medical diagnostic system that:

- accepts user symptoms and clinical biomarker inputs,
- predicts multiple disease conditions,
- provides explainable information such as disease descriptions and precautions,
- offers a Groq LLM second opinion for every prediction,
- generates personalized diet recommendations.

## 3. System Architecture

### 3.1 Backend Components

The backend lives in the `backend/` folder and includes:

- `backend/api.py`: FastAPI service with prediction and Groq endpoints.
- `backend/app.py`: Streamlit dashboard for symptom-based and structured disease prediction.
- `backend/code/`: helper and training modules.
- `backend/models/`: serialized machine learning model files.
- `backend/model/`: label encoder and XGBoost-format model artifacts.
- `backend/data/`: CSV datasets and symptom metadata.

### 3.2 Frontend Components

The frontend lives in `medipredict/` and is built with React:

- `medipredict/src/App.js`: application shell, navigation, theme state, and API orchestration.
- `medipredict/src/pages/`: multiple pages including Home, Dashboard, Predictors, About, and Preferences.
- `medipredict/src/constants.js`: disease definitions and API endpoint config.
- `medipredict/src/utils.js`: reusable API call hook.

### 3.3 External Integrations

The application integrates with Groq AI via the `groq` Python client. The backend uses Groq for:

- symptom-based RAG analysis at `/symptoms/rag_analysis`
- structured second opinion at `/groq/opinion`
- diet recommendation generation at `/groq/diet`

The React frontend calls these APIs and displays AI-generated results alongside the ML predictions.

## 4. Data Sources and Preprocessing

### 4.1 Data Assets

The project stores clinical and symptom data in CSV files under `backend/data/`:

- `breast_cancer.csv`
- `diabetes.csv`
- `heart.csv`
- `hepatitis.csv`
- `kidney.csv`
- `liver.csv`
- `lung_cancer.csv`
- `parkinsons.csv`
- `symptom_Description.csv`
- `symptom_precaution.csv`
- `Symptom-severity.csv`
- `dataset.csv`

These files provide the training data, disease descriptions, precaution guidance, and symptom severity weights used by both the ML model and the RAG pipeline.

### 4.2 Training Pipeline

Training code is implemented in `backend/code/train.py`:

- reads `data/dataset.csv`
- strips whitespace from text columns
- applies one-hot encoding to symptom columns
- constructs a binary symptom feature set
- trains a `RandomForestClassifier` with 100 estimators and single-threaded execution
- saves the model and label encoder to `backend/model/xgboost_model.sav` and `backend/model/label_encoder.sav`

This pipeline also exports `backend/data/clean_dataset.tsv` as the cleaned one-hot encoded feature store.

## 5. Model Development and Assets

### 5.1 Disease Model

The `DiseaseModel` class in `backend/code/DiseaseModel.py` encapsulates:

- model and label encoder loading
- prediction and probability extraction
- disease description lookup from `symptom_Description.csv`
- disease precaution lookup from `symptom_precaution.csv`
- symptom feature vector creation via `backend/code/helper.py`

The symptom prediction workflow uses binary symptom feature vectors to determine the most probable disease and list top alternatives.

### 5.2 Saved Models

The backend loads models from `backend/models/` including:

- `diabetes_model.sav`
- `heart_disease_model.sav`
- `parkinsons_model.sav`
- `lung_cancer_model.sav`
- `breast_cancer_model.sav`
- `chronic_model.sav`
- `hepititisc_model.sav`
- `liver_model.sav`

The symptom/disease model is stored in `backend/model/xgboost_model.sav` with its label encoder at `backend/model/label_encoder.sav`.

## 6. Backend Prediction Workflow

### 6.1 FastAPI Endpoints

`backend/api.py` exposes the following endpoints:

- `GET /health`: service status and loaded models.
- `POST /predict/diabetes`
- `POST /predict/heart`
- `POST /predict/parkinson`
- `POST /predict/liver`
- `POST /predict/hepatitis`
- `POST /predict/lung_cancer`
- `POST /predict/chronic_kidney`
- `POST /predict/breast_cancer`
- `POST /predict/symptoms`
- `POST /symptoms/rag_analysis`
- `POST /groq/opinion`
- `POST /groq/diet`

### 6.2 Structured Predictors

Each structured predictor endpoint accepts disease-specific biomarker inputs, passes them to a preloaded scikit-learn model, and returns:

- `positive`: boolean disease detection result
- `confidence`: model confidence score
- `label`: readable prediction label
- `summary`: compact summary of key input values

Examples of input features:

- diabetes: pregnancies, glucose, blood pressure, BMI, age
- heart disease: age, cholesterol, max heart rate, exercise-induced angina
- parkinson: voice biomarker features such as HNR, RPDE, DFA
- liver: bilirubin, enzymes, albumin ratio

### 6.3 Symptom-Based Prediction

The symptom prediction endpoint `/predict/symptoms` performs:

- symptom validation (minimum 3 symptoms required)
- feature vector construction with `prepare_symptoms_array`
- disease prediction and probability extraction via `DiseaseModel.predict`
- retrieval of disease description and precautions
- generation of top alternative diagnoses from the model's probability ranking

Response fields include `disease`, `probability`, `alternatives`, `description`, and `precautions`.

## 7. Groq AI and RAG Enhancements

### 7.1 Groq Second Opinion for Structured Predictors

`/groq/opinion` accepts disease metadata and returns a structured clinical opinion from Groq:

- agreement or disagreement with the ML prediction
- alternative conditions
- recommended tests or exams
- suggested specialist type
- lifestyle and safety advice

This endpoint uses `llama-3.3-70b-versatile` with a 500-token cap.

### 7.2 Symptom RAG Analysis

`/symptoms/rag_analysis` builds a retrieval-augmented prompt using:

- symptom inputs
- model prediction and alternatives
- severity scoring from `Symptom-severity.csv`
- knowledge base content from `symptom_Description.csv` and `symptom_precaution.csv`

The RAG workflow retrieves up to 8 relevant document chunks, computes severity labels, and crafts a grounded prompt for Groq. The response includes analysis, metadata, and token usage.

### 7.3 Diet Recommendations

`/groq/diet` generates personalized nutrition guidance based on:

- disease name
- patient age
- condition summary

It returns recommended foods, foods to avoid, meal tips, and nutrient priorities.

## 8. Frontend Application Flow

### 8.1 Core UI

The React frontend provides:

- top navigation for Home, Dashboard, Predictors, About, and Preferences
- theme and language preferences persisted in localStorage
- a dynamic disease selector with nine prediction categories
- loading states and error handling for API calls

### 8.2 API Integration

The app uses `medipredict/src/utils.js` with `fetch` to call the backend via `API_BASE`. Requests are made in JSON and responses are parsed to update UI state.

The key disease definitions are declared in `medipredict/src/constants.js`, including labels, descriptions, and endpoint routes.

### 8.3 User Experience

The React UI emphasizes:

- animated content and polished cards
- clear disease navigation
- combined ML prediction output and AI opinion sections
- a preferences panel for theme, language, and units

## 9. Deployment and Runtime Environment

### 9.1 Python Backend Requirements

The backend targets `python-3.10.13` as specified in `runtime.txt`.

Relevant Python dependencies in `backend/requirements.txt` include:

- `fastapi`, `uvicorn`, `pydantic`
- `scikit-learn`, `numpy`, `pandas`, `xgboost`, `joblib`
- `streamlit`, `streamlit-option-menu`
- `groq`, `langchain`, `faiss-cpu`, `sentence-transformers`, `torch`
- `Pillow`, `requests`

### 9.2 Frontend Requirements

The React app is managed from `medipredict/package.json` and requires:

- `react` and `react-dom`
- `react-scripts`
- `lucide-react`
- test libraries for `@testing-library`

### 9.3 Service Configuration

The backend is designed to load a `GROQ_API_KEY` environment variable, optionally from `backend/.env` if `python-dotenv` is installed.

The frontend currently points at `https://medipredict-2.onrender.com` via `API_BASE` in `medipredict/src/constants.js`.

## 10. Limitations and Future Improvements

### 10.1 Missing Evaluation Metrics

The repository does not include explicit model evaluation metrics beyond a simple accuracy print statement in training. Reported model performance is not available for each disease endpoint.

### 10.2 Deployment Notes

There is no deployment automation provided (for example, Docker, CI/CD, or cloud provisioning scripts).

### 10.3 Suggested Enhancements

- add evaluation metrics and validation reports for each model
- centralize configuration for API base URLs and backend host
- add authentication and secure API access
- build a deployment pipeline with Docker or cloud service definitions
- add frontend integration with the Streamlit dashboard or unify the UX experience

## 11. Conclusion

MediPredict combines predictive ML models with interactive UI design and modern AI augmentation. The architecture supports both structured biomarker prediction and symptom-driven diagnosis, with Groq-provided second opinions to enhance explainability.

The project is ready for a formal report draft and can be extended with model validation, deployment automation, and production-grade security controls.

## Appendix: Key Files

- `backend/api.py`
- `backend/app.py`
- `backend/code/train.py`
- `backend/code/DiseaseModel.py`
- `backend/code/helper.py`
- `backend/data/`
- `backend/models/`
- `backend/model/xgboost_model.json`
- `medipredict/src/App.js`
- `medipredict/src/constants.js`
- `medipredict/src/utils.js`
- `backend/requirements.txt`
- `medipredict/package.json`
- `runtime.txt`
- `Final_project_report_format.docx`
