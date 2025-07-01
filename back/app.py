from database import init_db
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'segredo-super-seguro'
jwt = JWTManager(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# Rota para registrar usuário
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])

    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
        conn.commit()
        return jsonify(message="Usuário registrado com sucesso"), 201
    except sqlite3.IntegrityError:
        return jsonify(message="Email já cadastrado"), 400
    finally:
        conn.close()

# Rota para login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']


    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=str(user['id']))
        return jsonify(access_token=access_token)
    else:
        return jsonify(message="Email ou senha inválidos"), 401

# ---------------- LEMBRETES ---------------- #

# Criar lembrete
@app.route('/reminders', methods=['POST'])
@jwt_required()
def create_reminder():
    current_user = int(get_jwt_identity())
    data = request.get_json(force=True)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO reminders (user_id, title, description, date) VALUES (?, ?, ?, ?)', 
                   (current_user, data['title'], data['description'], data['date']))
    conn.commit()
    reminder_id = cursor.lastrowid
    conn.close()

    return jsonify({'id': reminder_id, 'message': 'Lembrete criado com sucesso!'}), 201

# Buscar lembretes
@app.route('/reminders', methods=['GET'])
@jwt_required()
def get_reminders():
    current_user = int(get_jwt_identity())
    conn = get_db_connection()
    reminders = conn.execute('SELECT * FROM reminders WHERE user_id = ?', (current_user,)).fetchall()
    conn.close()
    return jsonify([dict(reminder) for reminder in reminders]), 200

# Atualizar lembrete
@app.route('/reminders/<int:id>', methods=['PUT'])
@jwt_required()
def update_reminder(id):
    current_user = int(get_jwt_identity())
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE reminders
        SET title = ?, description = ?, date = ?
        WHERE id = ? AND user_id = ?
    ''', (data['title'], data['description'], data['date'], id, current_user))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Lembrete atualizado com sucesso!'}), 200

# Deletar lembrete
@app.route('/reminders/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_reminder(id):
    current_user = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM reminders WHERE id = ? AND user_id = ?', (id, current_user))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Lembrete deletado com sucesso!'}), 200

# ---------------- NOTAS ---------------- #

# Criar nota
@app.route('/notes', methods=['POST'])
@jwt_required()
def create_note():
    current_user = int(get_jwt_identity())
    data = request.get_json(force=True)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', 
                   (current_user, data['title'], data['content']))
    conn.commit()
    note_id = cursor.lastrowid
    conn.close()

    return jsonify({'id': note_id, 'message': 'Nota criada com sucesso!'}), 201

# Buscar notas
@app.route('/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user = int(get_jwt_identity())
    conn= get_db_connection()
    notes = conn.execute('SELECT * FROM notes WHERE user_id = ?', (current_user,)).fetchall()
    conn.close()
    return jsonify([dict(note) for note in notes]), 200

# Atualizar nota
@app.route('/notes/<int:id>', methods=['PUT'])
@jwt_required()
def update_note(id):
    current_user = int(get_jwt_identity())
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE notes
        SET title = ?, content = ?
        WHERE id = ? AND user_id = ?
    ''', (data['title'], data['content'], id, current_user))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Nota atualizada com sucesso!'}), 200

# Deletar nota
@app.route('/notes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_note(id):
    current_user = int(get_jwt_identity())

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM notes WHERE id = ? AND user_id = ?', (id, current_user))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Nota deletada com sucesso!'}), 200

# Rota raiz
@app.route('/')
def home():
    return jsonify(message="API Tester")

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
# Para rodar a aplicação, execute o seguinte comando no terminal:
# python app.py 