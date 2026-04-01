from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import routes
from routers import users
app= FastAPI(title="Delivery Optimizer API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(routes.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "The delivery optimizer is running"}