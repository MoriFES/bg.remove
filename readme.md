# Background Removal Made Easy! 🌟

![Background Removal](https://img.shields.io/badge/Download%20Latest%20Release-Click%20Here-brightgreen)

Welcome to the **bg.remove** repository! This project provides a simple solution for removing backgrounds from images using Python and Flask. Whether you're a developer looking to integrate background removal into your application or a hobbyist wanting to play around with image processing, this tool is for you.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Easy to Use**: The application has a user-friendly interface that allows you to upload images and remove backgrounds effortlessly.
- **Fast Processing**: The background removal process is quick, ensuring you spend less time waiting and more time creating.
- **Open Source**: This project is open for contributions. You can enhance it or customize it according to your needs.
- **Cross-Platform**: Works on any platform that supports Python and Flask.

## Technologies Used

This project leverages a variety of technologies to deliver its functionality:

- **Python 3**: The core programming language used for backend development.
- **Flask**: A lightweight WSGI web application framework for Python.
- **HTML5**: For structuring the web application.
- **CSS**: For styling the application.
- **JavaScript**: To enhance interactivity and improve user experience.
- **rembg**: A powerful library that performs background removal.

## Installation

To get started with bg.remove, follow these simple steps:

1. **Clone the Repository**:

   Open your terminal and run the following command:

   ```bash
   git clone https://github.com/MoriFES/bg.remove.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd bg.remove
   ```

3. **Install Required Packages**:

   Make sure you have Python 3 installed. Then, run:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:

   Start the Flask application with:

   ```bash
   python app.py
   ```

5. **Access the Application**:

   Open your web browser and go to `http://127.0.0.1:5000`.

For the latest version, please visit the [Releases section](https://github.com/MoriFES/bg.remove/releases).

## Usage

Using bg.remove is straightforward:

1. **Upload an Image**: Click on the upload button and select the image from which you want to remove the background.
2. **Remove Background**: Once the image is uploaded, click on the "Remove Background" button.
3. **Download the Result**: After processing, you can download the image with the background removed.

![Image Upload](https://via.placeholder.com/600x300?text=Upload+Image)

## Contributing

We welcome contributions! If you want to help improve bg.remove, follow these steps:

1. **Fork the Repository**: Click on the "Fork" button at the top right of the page.
2. **Create a Branch**: Create a new branch for your feature or bug fix.

   ```bash
   git checkout -b feature-name
   ```

3. **Make Changes**: Implement your changes.
4. **Commit Your Changes**:

   ```bash
   git commit -m "Add your message here"
   ```

5. **Push to Your Fork**:

   ```bash
   git push origin feature-name
   ```

6. **Create a Pull Request**: Go to the original repository and click on "New Pull Request".

For detailed guidelines, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [MoriFES](https://github.com/MoriFES)
- **Email**: morifesteam@example.com

Thank you for checking out **bg.remove**! We hope you find it useful. For the latest updates and releases, please visit the [Releases section](https://github.com/MoriFES/bg.remove/releases). Happy coding! 🎉

---

## New Modern UI (2025 Refresh)

The application now includes a redesigned interface with:

- Sleek responsive layout (desktop & mobile)
- Drag & drop uploading with progress animation
- Side‑by‑side original vs transparent preview
- Animated skeleton placeholder while processing
- One‑click dark / light theme toggle (persists via `localStorage`)
- Accessible keyboard navigation (press Enter/Space on the drop zone)

### Theme Customization

Themes are powered by CSS custom properties defined in `static/css/style.css` under the `:root` selector and the `html[data-theme='light']` override. To adjust branding:

1. Edit the `--accent` and `--accent-accent` variables.
2. Optionally add a `html[data-theme='solarized'] { ... }` block and toggle it via a custom control.

### File Size & Limits

The backend restricts uploads to 16MB (`app.config['MAX_CONTENT_LENGTH']`). You can raise this in `app.py` if needed.

### Clearing Temporary Files

Temporary originals and processed outputs are stored in `uploads/` and `processed/`. A placeholder "Clear Temp Files" button exists; you can implement a secure route to remove old files (ensure you **never** allow arbitrary path deletion).

Example route (add to `app.py` if desired):

```python
@app.post('/admin/clear-cache')
def clear_cache():
   for folder in [app.config['UPLOAD_FOLDER'], app.config['PROCESSED_FOLDER']]:
      for name in os.listdir(folder):
         path = os.path.join(folder, name)
         if os.path.isfile(path):
            try: os.remove(path)
            except OSError: pass
   return jsonify({'status': 'ok'})
```

> Secure this endpoint (API key / auth) before exposing publicly.

### Roadmap Ideas

- Batch processing / queue
- Transparent background color replacement (e.g., pick white or custom color)
- Cropping / smart subject centering
- Download as ZIP for batches
- Progressive enhancement for offline mode

Feel free to open issues or PRs with suggestions!