import pandas as pd
import numpy as np


def prepare_symptoms_array(symptoms):
    """
    Convert a list of symptom strings into a binary feature vector
    that matches the shape expected by the trained model.

    Returns a DataFrame (not a numpy array) so sklearn doesn't warn
    about missing feature names.
    """
    df = pd.read_csv('data/clean_dataset.tsv', sep='\t')

    # All columns except the last (Disease) are symptom features
    feature_cols = df.columns[:-1]

    # Build a zero DataFrame with the correct column names
    symptoms_df = pd.DataFrame(
        data=np.zeros((1, len(feature_cols)), dtype=int),
        columns=feature_cols
    )

    for symptom in symptoms:
        if symptom in feature_cols:
            symptoms_df[symptom] = 1

    return symptoms_df
