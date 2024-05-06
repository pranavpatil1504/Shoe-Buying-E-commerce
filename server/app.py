from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from bcrypt import hashpw, gensalt, checkpw

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLite3 database
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    print('conn')
    return conn

# Initialize the database
def init_db():
    try:
        with app.app_context():
            db = get_db_connection()
            cursor = db.cursor()
            with open('schema.sql', mode='r') as f:
                cursor.executescript(f.read())
            db.commit()
            return jsonify({'message': 'Database initialized successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        db.close()

# Initialize the database when the application starts
init_db()

@app.route('/signup', methods=['POST'])
def sign_up():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        print(username)
        print(password)
        db = get_db_connection()
        cursor = db.cursor()
        # Check if username already exists
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400

        # Hash the password
        hashed_password = hashpw(password.encode('utf-8'), gensalt())

        # Store username and hashed password in SQLite3
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        db.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        db.close()

@app.route('/signin', methods=['POST'])
def sign_in():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        db = get_db_connection()
        cursor = db.cursor()
        # Find user by username
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user and checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        db.close()

@app.route('/purchase', methods=['POST'])
def purchase():
    try:
        data = request.get_json()
        print(data)
        username = data.get('username')
        product_id = data.get('productId')
        size = data.get('size')
        quantity = data.get('quantity')
        total_price = data.get('totalPrice')

        db = get_db_connection()
        cursor = db.cursor()

        # Insert purchase details into the database
        cursor.execute('INSERT INTO purchases (username, product_id, size, quantity, total_price) VALUES (?, ?, ?, ?, ?)',
                       (username, product_id, size, quantity, total_price))
        db.commit()

        return jsonify({'message': 'Purchase details stored successfully'}), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        db.close()

@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        username = data.get('username')
        product_id = data['id']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the product is already in the cart
        cursor.execute('SELECT * FROM cart WHERE username = ? AND product_id = ?', (username, product_id))
        existing_cart_item = cursor.fetchone()
        if existing_cart_item:
            return jsonify({'message': 'Product already in cart'}), 400

        # Add the product to the cart
        cursor.execute('INSERT INTO cart (username, product_id) VALUES (?, ?)', (username, product_id))
        conn.commit()

        return jsonify({'message': 'Product added to cart successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        conn.close()

@app.route('/add-to-favorites', methods=['POST'])
def add_to_favorites():
    try:
        data = request.get_json()
        username = data.get('username')
        product_id = data['id']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the product is already in favorites
        cursor.execute('SELECT * FROM favorites WHERE username = ? AND product_id = ?', (username, product_id))
        existing_favorite = cursor.fetchone()
        if existing_favorite:
            return jsonify({'message': 'Product already in favorites'}), 400

        # Add the product to favorites
        cursor.execute('INSERT INTO favorites (username, product_id) VALUES (?, ?)', (username, product_id))
        conn.commit()

        return jsonify({'message': 'Product added to favorites successfully'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        conn.close()
        
        
@app.route('/favorite-items', methods=['GET'])
def get_favorite_items():
    try:
        # Get username from the request query parameters
        username = request.args.get('username')

        # Connect to the database
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Fetch favorite items' IDs from the database based on the username
        cursor.execute('SELECT product_id FROM favorites WHERE username = ?', (username,))
        favorite_items = cursor.fetchall()

        # Close the database connection
        conn.close()
        print(favorite_items)
        # Return favorite items' IDs as a JSON response
        return jsonify({'favorite_items': favorite_items}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/cart-items', methods=['GET'])
def get_cart_items():
    try:
        # Get username from the request query parameters
        username = request.args.get('username')

        # Connect to the database
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()

        # Fetch cart items' IDs from the database based on the username
        cursor.execute('SELECT product_id FROM cart WHERE username = ?', (username,))
        cart_items = cursor.fetchall()
        print(cart_items)
        # Close the database connection
        conn.close()

        # Return cart items' IDs as a JSON response
        return jsonify({'cart_items': cart_items}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
