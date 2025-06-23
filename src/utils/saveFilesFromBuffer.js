// src/utils/saveFilesFromBuffer.js
const fs = require("fs");
const path = require("path");

/**
 * Lưu danh sách file từ buffer vào thư mục uploads
 * @param {Array} files - Danh sách file từ multer (memoryStorage)
 * @param {String} uploadDir - Thư mục lưu ảnh (mặc định là /uploads)
 * @returns {Array} Danh sách file đã lưu (filename, path)
 */
const saveFilesFromBuffer = (files, uploadDir = "uploads") => {
  const savedFiles = [];

  // Tạo thư mục nếu chưa có
  const fullUploadPath = path.join(__dirname, "../../", uploadDir);
  if (!fs.existsSync(fullUploadPath)) {
    fs.mkdirSync(fullUploadPath, { recursive: true });
  }

  for (const file of files) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    const fullPath = path.join(fullUploadPath, uniqueName);
    fs.writeFileSync(fullPath, file.buffer);
    savedFiles.push({
      filename: uniqueName,
      path: `${uploadDir}/${uniqueName}`,
    });
  }

  return savedFiles;
};

module.exports = saveFilesFromBuffer;
