import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./wasteshadow.db")

is_sqlite = DATABASE_URL.startswith("sqlite")
is_postgres = DATABASE_URL.startswith("postgresql") or DATABASE_URL.startswith("postgres")

if is_sqlite:
    # SQLite: single-thread check needed
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
elif is_postgres:
    # Neon / PostgreSQL: SSL required, use NullPool for serverless compatibility
    # Neon connection strings may use 'postgres://' scheme — normalize it
    db_url = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(
        db_url,
        poolclass=NullPool,          # Prevents stale connections on Neon
        connect_args={"sslmode": "require"},
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
