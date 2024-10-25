import os

from flask import Flask, render_template, jsonify, session, redirect, url_for, request

app = Flask(__name__)
app.secret_key = os.urandom(24) # Will be useful later

@app.route('/home')
def home():
    # Load the appropriate panel based on login status
    if 'logged_in' in session and session['logged_in']:
        return render_template('index.html', initial_panel='join')
    return render_template('index.html', initial_panel='welcome')

@app.route('/panels/<panel_type>', methods=['GET'])
def load_panel(panel_type):
    # Return appropriate panel based on requested panel type
    if panel_type == 'welcome':
        return render_template('panels/welcome.html')
    elif panel_type == 'login':
        return render_template('panels/login.html')
    elif panel_type == 'join':
        if 'logged_in' in session and session['logged_in']:
            return render_template('panels/join.html')

    return jsonify(success=False, message='Panel not found'), 404

@app.route('/login', methods=['POST'])
def login():
    # Handle login logic
    username = request.form.get('username')
    password = request.form.get('password') 

    # Simple credential check (replace with real validation)
    if username == 'user' and password == 'pass':
        session['logged_in'] = True  # Set login status
        return jsonify(success=True)
    return jsonify(success=False, message='Invalid credentials'), 401

@app.route('/logout')
def logout():
    session.pop('logged_in', None)  # Remove the logged_in status
    return redirect(url_for('home'))

@app.route('/panels/check_login', methods=['GET'])
def check_login():
    is_logged_in = 'logged_in' in session and session['logged_in']
    return jsonify(logged_in=is_logged_in)

@app.route('/')
def meeting():
    return render_template('meeting.html')

# Store the uploaded video frames and meeting data in memory or files as needed
uploaded_frames = []
meeting_data = {
    'transcript': 'Initial transcription data...',
    'summary': 'Initial summary data...',
    'todos': ['Task 1', 'Task 2', 'Task 3'],
}

@app.route('/upload_frame', methods=['POST'])
def upload_frame():
    # Handle the uploaded video frame
    if 'video_frame' in request.files:
        video_frame = request.files['video_frame']
        # Save or process the frame (here we just append it to a list for demonstration)
        uploaded_frames.append(video_frame)
        return '', 204  # No content response

@app.route('/get_meeting_data', methods=['GET'])
def get_meeting_data():
    # Send back the meeting data
    return jsonify(meeting_data)

if __name__ == '__main__':
    app.run(debug=True)
