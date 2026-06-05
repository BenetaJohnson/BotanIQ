import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/botaniq"
)

def create_db_engine(url):
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})
    else:
        return create_engine(url, pool_pre_ping=True)

# Initialize engine and sessionmaker
engine = create_db_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Connection validation block for Postgres
if not DATABASE_URL.startswith("sqlite"):
    try:
        # Perform quick connection test
        with engine.connect() as conn:
            pass
    except Exception as e:
        print(f"PostgreSQL connection refused: {str(e)}")
        print("Fallback initiated: Redirecting db session to local SQLite file (sqlite:///./botaniq_fallback.db)...")
        DATABASE_URL = "sqlite:///./botaniq_fallback.db"
        engine = create_db_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f"Database session error: {str(e)}")
        raise
    finally:
        db.close()
