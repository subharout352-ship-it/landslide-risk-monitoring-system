import joblib # type: ignore
import os


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)


model = joblib.load(MODEL_PATH)


def predict_risk(
    rainfall,
    soil_moisture,
    temperature,
    humidity,
    slope
):
    data = [[
        rainfall,
        soil_moisture,
        temperature,
        humidity,
        slope
    ]]

    prediction = model.predict(data)[0]

    if prediction == 0:
        return "LOW"

    elif prediction == 1:
        return "MEDIUM"

    else:
        return "HIGH"