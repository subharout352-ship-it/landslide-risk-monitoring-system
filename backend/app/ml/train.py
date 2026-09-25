import pandas as pd # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
import joblib # type: ignore


# Sample training data
data = {
    "rainfall": [
        10, 20, 30, 40, 50,
        60, 70, 80, 90, 100,
        110, 120, 130, 140, 150
    ],

    "soil_moisture": [
        20, 25, 30, 35, 40,
        45, 50, 55, 60, 65,
        70, 75, 80, 85, 90
    ],

    "temperature": [
        30, 30, 29, 29, 28,
        28, 27, 27, 26, 26,
        25, 25, 24, 24, 23
    ],

    "humidity": [
        40, 45, 50, 55, 60,
        65, 70, 72, 75, 78,
        80, 82, 85, 88, 90
    ],

    "slope": [
        5, 8, 10, 12, 15,
        18, 20, 22, 25, 28,
        30, 32, 35, 38, 40
    ],

    # 0 = Low, 1 = Medium, 2 = High
    "risk": [
        0, 0, 0, 0, 0,
        1, 1, 1, 1, 1,
        2, 2, 2, 2, 2
    ]
}


df = pd.DataFrame(data)

X = df[
    [
        "rainfall",
        "soil_moisture",
        "temperature",
        "humidity",
        "slope"
    ]
]

y = df["risk"]


# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)


# Save model
joblib.dump(model, "app/ml/model.pkl")

print("Model trained successfully!")
print("Model saved as app/ml/model.pkl")