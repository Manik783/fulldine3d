const express = require("express");
const router = express.Router();
const DishModel = require("../models/dish.model");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
require("dotenv").config();
const authMiddleware = require("../middleware/auth.middleware");

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
});

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME) {
  console.error(
    "Azure Storage connection string or container name is missing in environment variables."
  );
  process.exit(1);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

// API endpoint to upload .usdz file
router.post(
  "/upload_usdz",
  authMiddleware.adminAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (fileExtension !== ".usdz") {
        return res.status(400).json({ error: "Only .usdz files are allowed" });
      }

      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(file.buffer, file.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      const fileUrl = blockBlobClient.url;
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// API endpoint to upload .glb file
router.post(
  "/upload_glb",
  authMiddleware.adminAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (fileExtension !== ".glb") {
        return res.status(400).json({ error: "Only .glb files are allowed" });
      }

      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(file.buffer, file.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      const fileUrl = blockBlobClient.url;
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// API endpoint to upload photo
router.post(
  "/upload_photo",
  authMiddleware.adddish, // changing the auth middleware to allow both client and admin use the same
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      // Check if file is provided
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Validate file extension
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
          error: "Only image files (.jpg, .jpeg, .png, .webp) are allowed",
        });
      }

      // Generate a unique blob name
      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload file to Azure Blob Storage
      await blockBlobClient.upload(file.buffer, file.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype,
        },
      });

      // Return the file URL
      const fileUrl = blockBlobClient.url;
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  }
);

module.exports = router;
