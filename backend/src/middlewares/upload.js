const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

/**
 * Crea un middleware di upload generico per una sottocartella specifica.
 * Esempio: createUploader("products") → salva in /uploads/products
 */
function createUploader(subfolder) {
  const uploadDir = path.join(__dirname, "..", "..", "uploads", subfolder);

  // Crea la cartella se non esiste
  fs.mkdirSync(uploadDir, { recursive: true });

  // Configurazione storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueName = uuidv4() + ext; // nome file univoco
      cb(null, uniqueName);
    },
  });

  // Filtra solo immagini
  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);

    if (mimetype && ext) return cb(null, true);
    cb(new Error("Tipo file non supportato. Usa solo JPG, JPEG, PNG o WEBP."));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // massimo 2 MB
  });
}

module.exports = { createUploader };
