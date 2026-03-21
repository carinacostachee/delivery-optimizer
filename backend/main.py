from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI(title="Delivery Optimizer API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "The delivery optimizer is running"}