from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth
import traceback

app = FastAPI(title="Arwa Edu Quiz API", debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print(f"ERROR: {tb}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "traceback": tb}
    )

from routers import guardian, admin, student

app.include_router(auth.router)
app.include_router(guardian.router)
app.include_router(admin.router)
app.include_router(student.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Arwa Edu API"}
