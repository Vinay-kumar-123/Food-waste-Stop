from dotenv import load_dotenv
import os
load_dotenv()

class Settings :
     def __init__(self):
        self.MONGO_URI: str = os.getenv("MONGO_URI") or ""
        self.DB_NAME: str = os.getenv("DB_NAME") or ""
        self.JWT_SECRET: str = os.getenv("JWT_SECRET") or ""

        if not self.MONGO_URI:
            raise RuntimeError("MONGO_URI missing in .env")
        if not self.DB_NAME:
            raise RuntimeError("DB_NAME missing in .env")
        if not self.JWT_SECRET:
            raise RuntimeError("JWT_SECRET missing in .env")

settings = Settings()