import joblib
import pandas as pd
import numpy as np


class DiseaseModel:

    def __init__(self):
        self.all_symptoms = None
        self.symptoms = None
        self.pred_disease = None
        self.model = None
        self.label_encoder = None
        self.top_predictions = []
        self.diseases = self._load_disease_list()

    def load_model(self, model_path, encoder_path='model/label_encoder.sav'):
        """Load the trained RandomForest model and label encoder."""
        self.model = joblib.load(model_path)
        self.label_encoder = joblib.load(encoder_path)
        print(f"✅ Model loaded from {model_path}")

    # keep old method name so app.py doesn't break
    def load_xgboost(self, model_path):
        sav_path = model_path.replace('.json', '.sav')
        encoder_path = 'model/label_encoder.sav'
        self.load_model(sav_path, encoder_path)

    def predict(self, X):
        self.symptoms = X
        pred_idx = self.model.predict(X)
        self.pred_disease = self.label_encoder.inverse_transform(pred_idx)[0]
        proba_array = self.model.predict_proba(X)
        prob = proba_array[0, pred_idx[0]]
        
        # Store top predictions sorted by probability
        top_proba = proba_array[0]
        top_indices = np.argsort(top_proba)[::-1]  # Sort descending
        self.top_predictions = [(self.label_encoder.inverse_transform([idx])[0], top_proba[idx]) 
                                for idx in top_indices]
        
        return self.pred_disease, prob

    def describe_disease(self, disease_name):
        if disease_name not in self.diseases.values:
            return "That disease is not in this model."
        desc_df = pd.read_csv('data/symptom_Description.csv')
        desc_df = desc_df.apply(lambda col: col.str.strip())
        match = desc_df[desc_df['Disease'] == disease_name]['Description']
        if match.empty:
            return "No description available."
        return match.values[0]

    def describe_predicted_disease(self):
        if self.pred_disease is None:
            return "No prediction made yet."
        return self.describe_disease(self.pred_disease)

    def disease_precautions(self, disease_name):
        if disease_name not in self.diseases.values:
            return ["No precautions available."] * 4
        prec_df = pd.read_csv('data/symptom_precaution.csv')
        prec_df = prec_df.apply(lambda col: col.str.strip())
        match = prec_df[prec_df['Disease'] == disease_name].filter(regex='Precaution')
        if match.empty:
            return ["No precautions available."] * 4
        return match.values.tolist()[0]

    def predicted_disease_precautions(self):
        if self.pred_disease is None:
            return ["No prediction made yet."] * 4
        return self.disease_precautions(self.pred_disease)

    def _load_disease_list(self):
        df = pd.read_csv('data/clean_dataset.tsv', sep='\t')
        X_data = df.iloc[:, :-1]
        y_data = df.iloc[:, -1]
        self.all_symptoms = X_data.columns
        return y_data.astype('category').cat.categories
