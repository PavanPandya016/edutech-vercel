// middleware/upload.js
// Handles file uploads - stores on server (VPS)

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/profiles',
  'uploads/courses',
  'uploads/events',
  'uploads/blog',
  'uploads/materials'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on field name
    let folder = 'uploads/';
    
    if (file.fieldname === 'profilePicture') {
      folder += 'profiles/';
    } else if (file.fieldname === 'thumbnail' && req.baseUrl.includes('course')) {
      folder += 'courses/';
    } else if (file.fieldname === 'thumbnail' && req.baseUrl.includes('event')) {
      folder += 'events/';
    } else if (file.fieldname === 'featuredImage') {
      folder += 'blog/';
    } else if (file.fieldname === 'file') {
      folder += 'materials/';
    } else {
      folder = 'uploads/';
    }
    
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-randomnumber-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

// File filter - validate file types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImages = /jpeg|jpg|png|gif|webp/;
  const allowedDocs = /pdf|doc|docx|txt/;
  const allowedVideos = /mp4|avi|mov|wmv|webm/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  
  // Check if file type is allowed
  if (
    allowedImages.test(ext) || 
    allowedDocs.test(ext) || 
    allowedVideos.test(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and videos allowed.'));
  }
};

// Create multer upload instances
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  }
});

// Export different upload configurations
module.exports = {
  // Single file upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload
  multiple: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  
  // Multiple fields
  fields: (fields) => upload.fields(fields),
  
  // Upload path
  uploadPath: 'uploads/'
};

/*
USAGE IN ROUTES:

const { single, multiple } = require('../middleware/upload');

// Single file
router.post('/profile/picture', auth, single('profilePicture'), uploadProfilePic);

// Multiple files
router.post('/course/materials', auth, multiple('files', 10), uploadMaterials);

// Access uploaded file in controller:
const filePath = req.file.path; // e.g., "uploads/profiles/image-123456.jpg"
const fileUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

FILE TYPES ALLOWED:
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf, doc, docx, txt
- Videos: mp4, avi, mov, wmv, webm

MAX SIZE: 100MB per file
*/