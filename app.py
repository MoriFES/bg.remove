import os
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from rembg import remove
from PIL import Image
from io import BytesIO

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PROCESSED_FOLDER'] = 'processed'

# Ensure upload and processed directories exist
for folder in [app.config['UPLOAD_FOLDER'], app.config['PROCESSED_FOLDER']]:
    os.makedirs(folder, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        return jsonify({'error': 'Invalid file format'}), 400

    bg_color = request.form.get('bg_color', '').strip()  # optional color input

    try:
        # Open image
        input_image = Image.open(file.stream).convert("RGBA")

        # Remove background
        output_image = remove(input_image)

        # If background color is provided, fill it in
        if bg_color:
            # Create new background with the given color
            bg = Image.new("RGBA", output_image.size, bg_color)
            output_image = Image.alpha_composite(bg, output_image)

        # Save to BytesIO object
        img_io = BytesIO()
        output_image.save(img_io, 'PNG', optimize=True)
        img_io.seek(0)

        return send_file(
            img_io,
            mimetype='image/png',
            as_attachment=True,
            download_name='removed_bg.png'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)