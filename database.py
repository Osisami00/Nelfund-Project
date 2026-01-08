import mysql.connector
from mysql.connector import pooling
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
import json
import re
from config import config

class Database:
    def __init__(self):
        self.pool = pooling.MySQLConnectionPool(
            pool_name="nelfund_pool",
            pool_size=5,
            pool_reset_session=True,
            host=config.DB_HOST,
            user=config.DB_USER,
            password=config.DB_PASSWORD,
            database=config.DB_NAME,
            port=config.DB_PORT
        )
        print("✅ Database connection pool created")
    
    def get_connection(self):
        return self.pool.get_connection()
    
    def create_tables(self):
        """Create simplified tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(36) PRIMARY KEY,
                    phone VARCHAR(20) UNIQUE NOT NULL,
                    full_name VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_phone (phone)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            # Chats table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chats (
                    id VARCHAR(36) PRIMARY KEY,
                    user_phone VARCHAR(20) NOT NULL,
                    message TEXT NOT NULL,
                    sender ENUM('user', 'ai') NOT NULL,
                    citations JSON,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_user_phone (user_phone),
                    INDEX idx_timestamp (timestamp)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            """)
            
            conn.commit()
            print("✅ Database tables created")
            
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            raise
        finally:
            cursor.close()
            conn.close()
    
    def signup_user(self, phone: str, full_name: str) -> Dict[str, Any]:
        """Signup user - create if not exists, return user if exists"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            clean_phone = re.sub(r'\D', '', phone)
            
            # Check if user exists
            cursor.execute("SELECT * FROM users WHERE phone = %s", (clean_phone,))
            existing = cursor.fetchone()
            
            if existing:
                # User exists - return existing user
                return {
                    "success": True,
                    "user_id": existing["id"],
                    "phone": existing["phone"],
                    "full_name": existing["full_name"],
                    "message": "Welcome back! You can start chatting."
                }
            
            # Create new user
            user_id = str(uuid.uuid4())
            
            cursor.execute("""
                INSERT INTO users (id, phone, full_name)
                VALUES (%s, %s, %s)
            """, (user_id, clean_phone, full_name.strip()))
            
            conn.commit()
            
            return {
                "success": True,
                "user_id": user_id,
                "phone": clean_phone,
                "full_name": full_name.strip(),
                "message": "Signup successful! You can start chatting."
            }
            
        except mysql.connector.Error as err:
            conn.rollback()
            return {
                "success": False,
                "message": f"Database error: {err}",
                "code": "DB_ERROR"
            }
        except Exception as e:
            conn.rollback()
            return {
                "success": False,
                "message": f"Signup failed: {str(e)}",
                "code": "UNKNOWN_ERROR"
            }
        finally:
            cursor.close()
            conn.close()
    
    def save_chat_message(self, phone: str, message: str, sender: str, citations: List[Dict] = None) -> str:
        """Save chat message"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            message_id = str(uuid.uuid4())
            citations_json = None
            if citations:
                citations_json = json.dumps(citations)
            
            clean_phone = re.sub(r'\D', '', phone)
            
            cursor.execute("""
                INSERT INTO chats (id, user_phone, message, sender, citations)
                VALUES (%s, %s, %s, %s, %s)
            """, (message_id, clean_phone, message, sender, citations_json))
            
            conn.commit()
            return message_id
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()
    
    def get_chat_history(self, phone: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get chat history for phone"""
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            clean_phone = re.sub(r'\D', '', phone)
            
            cursor.execute("""
                SELECT id, user_phone, message, sender, citations, timestamp
                FROM chats
                WHERE user_phone = %s
                ORDER BY timestamp ASC
                LIMIT %s
            """, (clean_phone, limit))
            
            history = cursor.fetchall()
            
            # Convert JSON citations
            for message in history:
                if message["citations"]:
                    try:
                        message["citations"] = json.loads(message["citations"])
                    except:
                        message["citations"] = []
                else:
                    message["citations"] = []
            
            return history
            
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []
        finally:
            cursor.close()
            conn.close()
    
    def clear_chat_history(self, phone: str) -> bool:
        """Clear chat history for phone"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            clean_phone = re.sub(r'\D', '', phone)
            cursor.execute("DELETE FROM chats WHERE user_phone = %s", (clean_phone,))
            deleted = cursor.rowcount
            
            conn.commit()
            return deleted > 0
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cursor.close()
            conn.close()

# Global database instance
db = Database()