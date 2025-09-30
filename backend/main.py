from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from database import supabase
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables from .env file (including SECRET_KEY)
load_dotenv()

app = FastAPI(
    title="Care-AI Analytics API",
    description="The central API for the Care-AI Analytics platform."
)

# --- CORS Configuration (Added for Frontend Communication) ---
# IMPORTANT: Replace this with your actual LIVE FRONTEND URL from Vercel
origins = [
    "https://care-ai-analytics-capstone-9zwh.vercel.app", 
    "http://localhost:3000",  # For local testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],      # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],      # Allow all headers (like Authorization)
)
# --- END CORS Configuration ---


# --- Pydantic Models ---
class UserCredentials(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    message: str
    access_token: str = None
    user_id: str = None

# --- Security Dependency ---
security = HTTPBearer()
# Load the secret key from the .env file you just updated
SECRET_KEY = os.environ.get("SECRET_KEY") 

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifies the JWT token sent by the frontend."""
    token = credentials.credentials
    try:
        # Decode the token using the secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Endpoints (All remain the same) ---
# ... (All your existing @app.get and @app.post routes go here) ...
# (The rest of your code from the previous step should be here)
@app.get("/", tags=["Status"])
def read_root():
    return {"status": "Care-AI Analytics API is running!"}

@app.post("/auth/register", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def create_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password,
        })
        
        if res.user is None and res.session is None:
            raise HTTPException(status_code=400, detail="User could not be created. Email may already exist.")
        
        return {"message": "User created successfully. Please check your email to verify."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/auth/login", tags=["Authentication"])
async def login_user(credentials: UserCredentials):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })
        
        if res.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        
        # Check if email is confirmed
        if res.user and not res.user.email_confirmed_at:
            raise HTTPException(
                status_code=403, 
                detail="Email not confirmed. Please check your inbox and verify your email."
            )
        
        return {
            "message": "Login successful",
            "access_token": res.session.access_token,
            "user_id": res.user.id,
            "email": res.user.email  # Add email to response
        }
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/users/me", tags=["Authentication"])
async def get_current_user(payload: dict = Depends(verify_token)):
    """Returns the decoded user data from the valid JWT token."""
    return {
        "message": "User data retrieved",
        "email": payload.get('email'),
        "user_id": payload.get('sub')
    }