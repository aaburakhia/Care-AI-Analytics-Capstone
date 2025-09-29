# database.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# This line loads the environment variables from your .env file
load_dotenv()

# Get the Supabase URL and Key from the loaded environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Create the Supabase client instance
supabase: Client = create_client(url, key)