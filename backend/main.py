# main.py
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from database import supabase

app = FastAPI(
    title="Care-AI Analytics API",
    description="The central API for the Care-AI Analytics platform.",
    version="1.0.0"
)

# Pydantic model to validate incoming user credentials
# This ensures the email is a valid format and the password meets a minimum length
class UserCredentials(BaseModel):
    email: EmailStr
    password: str

@app.get("/", tags=["Status"])
def read_root():
    """A simple endpoint to check if the API is running."""
    return {"status": "Care-AI Analytics API is running!"}

@app.post("/auth/register", status_code=status.HTTP_201_CREATED, tags=["Authentication"])
async def create_user(credentials: UserCredentials):
    """Creates a new user in the Supabase authentication system."""
    try:
        # Use the Supabase auth.sign_up function to create the user
        res = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password,
        })
        
        # Supabase returns an error in the response if something goes wrong
        if res.user is None and res.session is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="User could not be created. The email may already be in use."
            )
        
        return {"message": "User created successfully. Please check your email for a verification link."}

    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.post("/auth/login", tags=["Authentication"])
async def login_user(credentials: UserCredentials):
    """Authenticates a user and returns a session access token."""
    try:
        # Use the Supabase function to sign in
        res = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })

        if res.session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid email or password."
            )

        return {"message": "Login successful", "access_token": res.session.access_token, "user_id": res.user.id}

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))