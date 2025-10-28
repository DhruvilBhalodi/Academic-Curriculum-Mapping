from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# ✅ Connection Pool for Stability
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "dhruvil",
    "database": "project"
}
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,
    pool_reset_session=True,
    **dbconfig
)

def get_db_connection():
    return connection_pool.get_connection()

# ✅ LOGIN
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT email, pass, user_name, user_type FROM users WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and user["pass"] == password:
        return jsonify({
            "status": "success",
            "user": user["user_name"],
            "user_type": user["user_type"]
        })
    else:
        return jsonify({
            "status": "failed",
            "message": "Invalid email or password"
        })

# ✅ GET ALL TABLE DATA
@app.route('/api/tables', methods=['GET'])
def get_tables():
    search = request.args.get('search', '')
    like_search = f"%{search}%"

    query = """
        SELECT applications.application_id,
            student.student_name,
            student.enrollment_no,
            topics.topic_id,
            topics.topic_name,
            subjects.subject_id,
            subjects.subject_name,
            internship.internship_id,
            internship.company_name,
            internship.internship_description
        FROM applications
        JOIN internship ON applications.internship_id = internship.internship_id
        JOIN student ON internship.student_id = student.student_id
        JOIN topics ON applications.topic_id = topics.topic_id
        JOIN subjects ON topics.subject_id = subjects.subject_id
        WHERE student.student_name LIKE %s OR student.enrollment_no LIKE %s
        OR topics.topic_name LIKE %s OR subjects.subject_name LIKE %s
        OR internship.company_name LIKE %s OR internship.internship_description LIKE %s
    """

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, (like_search,) * 6)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# ✅ UPDATE ROW
@app.route('/api/update_row', methods=['PUT'])
def update_row():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if 'topic_id' in data and 'topic_name' in data:
            cursor.execute("""
                UPDATE topics
                SET topic_name = %s
                WHERE topic_id = %s
            """, (data['topic_name'], data['topic_id']))

        if 'subject_id' in data and 'subject_name' in data:
            cursor.execute("""
                UPDATE subjects
                SET subject_name = %s
                WHERE subject_id = %s
            """, (data['subject_name'], data['subject_id']))

        if 'internship_id' in data:
            cursor.execute("""
                UPDATE internship
                SET company_name = %s,
                    internship_description = %s
                WHERE internship_id = %s
            """, (
                data.get('company_name'),
                data.get('internship_description'),
                data['internship_id']
            ))

        conn.commit()
        return jsonify({"status": "success"})

    except Exception as e:
        conn.rollback()
        print("Error in update_row:", e)
        return jsonify({"status": "error", "message": str(e)})
    finally:
        cursor.close()
        conn.close()

# ✅ DELETE ROW
@app.route('/api/delete_application/<int:application_id>', methods=['DELETE', 'OPTIONS'])
def delete_application(application_id):
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT internship_id FROM applications WHERE application_id = %s",
            (application_id,)
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"success": False, "message": "Record not found"}), 404

        internship_id = row[0]
        cursor.execute("DELETE FROM applications WHERE application_id = %s", (application_id,))
        cursor.execute("DELETE FROM internship WHERE internship_id = %s", (internship_id,))
        conn.commit()
        return jsonify({"success": True, "message": "Deleted successfully"}), 200

    except Exception as e:
        conn.rollback()
        print("Error deleting record:", e)
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ✅ ADD INTERNSHIP
@app.route('/api/add_internship', methods=['POST'])
def add_internship():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        student_id = data.get('student_id')
        topic_id = data.get('topic_id')
        company_name = data.get('company_name')
        internship_description = data.get('internship_description')

        cursor.execute("""
            INSERT INTO internship (student_id, company_name, internship_description)
            VALUES (%s, %s, %s)
        """, (student_id, company_name, internship_description))
        internship_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO applications (internship_id, topic_id)
            VALUES (%s, %s)
        """, (internship_id, topic_id))

        conn.commit()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        conn.rollback()
        print("Error adding internship:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ✅ STUDENTS, SUBJECTS, TOPICS
@app.route('/api/students', methods=['GET'])
def get_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT student_id, student_name FROM student")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT subject_id, subject_name FROM subjects")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

@app.route('/api/topics/<int:subject_id>', methods=['GET'])
def get_topics(subject_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT topic_id, topic_name FROM topics WHERE subject_id = %s", (subject_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

# ✅ RUN APP
if __name__ == '__main__':
    app.run(debug=True)
