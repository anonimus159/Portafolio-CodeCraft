const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar directorio de uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'productos');

// Asegurar que existe el directorio
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + nombre original
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`;
    cb(null, uniqueName);
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF o WebP.'), false);
  }
};

// Middleware de multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// Middleware para manejar errores de upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error de upload: ${err.message}`
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next();
};

module.exports = {
  upload,
  handleUploadError,
  uploadDir
};
