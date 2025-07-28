# Technology Stack

## Backend

### Framework & Language
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Python**: Programming language used for backend development.

### Key Libraries & Tools
- **torch (PyTorch)**: Deep learning framework used here for loading and running the CLIP model.
- **clip**: OpenAI’s CLIP model for generating image embeddings.
- **faiss**: Facebook AI Similarity Search library for efficient similarity search and clustering of dense vectors.
- **PIL (Pillow)**: Python Imaging Library for image processing.
- **concurrent.futures.ThreadPoolExecutor**: For parallel processing of frames extracted from videos.
- **subprocess**: To run `ffmpeg` commands for video frame extraction.
- **tempfile**: To manage temporary directories and files.
- **base64**: Encoding images to base64 for sending over HTTP.
- **ffmpeg (external tool)**: Used to extract frames from video files at 1 frame per second.

### Infrastructure & Environment
- **Device Support**: Supports GPU acceleration using CUDA if available; otherwise runs on CPU.
- **In-memory Caching**: Stores embeddings and images in memory for fast querying.

---

## Frontend

### Framework & Language
- **Next.js (v15.3.2)**: React framework for server-side rendering and static site generation.
- **React (v19.0.0)**: UI library for building the frontend components.
- **TypeScript (v5)**: Typed superset of JavaScript for safer and more maintainable code.

### Styling
- **Tailwind CSS (v4)**: Utility-first CSS framework for rapid UI styling.
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind CSS integration.

### Libraries & Tools
- **axios**: HTTP client to communicate with the backend API.
- **framer-motion**: Animation library for React.
- **js-cookie**: For handling cookies on client-side.
- **jwt-decode**: To decode JWT tokens, if used for authentication.
- **react-router-dom**: For client-side routing.
- **uuid**: For generating unique IDs.

### Development & Build Tools
- **Next.js Scripts**:
  - `dev`: Run development server.
  - `build`: Build production app.
  - `start`: Start production server.
  - `lint`: Run linter to check code quality.

---

## Summary

| Layer       | Technology            | Purpose                                    |
|-------------|----------------------|--------------------------------------------|
| Backend     | FastAPI, Python      | API server and business logic               |
| AI/ML Model | PyTorch, CLIP        | Image embedding and feature extraction     |
| Search      | FAISS                | Vector similarity search                     |
| Image Proc. | Pillow, ffmpeg       | Image processing and video frame extraction |
| Frontend    | Next.js, React, TS   | User interface and client-side logic       |
| Styling     | Tailwind CSS         | UI styling                                 |
| HTTP Client | Axios                | API communication                           |
| Animations  | Framer Motion        | UI animations                              |
| Routing     | React Router DOM     | Client-side routing                         |

