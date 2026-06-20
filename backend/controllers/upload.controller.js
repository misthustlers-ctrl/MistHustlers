import multer from "multer";
import sharp from "sharp";
import { join, extname, dirname, basename, resolve } from "path";
import { fileURLToPath } from "url";
import { mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import crypto from "crypto";
import prisma from "../prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");

function removeUploadUrl(value, targetUrl) {
  if (Array.isArray(value)) return value.map((item) => removeUploadUrl(item, targetUrl));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, removeUploadUrl(item, targetUrl)]));
  }
  return value === targetUrl ? "" : value;
}

async function cleanupUploadReferences(url) {
  let updatedContent = 0;
  let updatedDrafts = 0;
  await prisma.mediaAsset.delete({ where: { url } }).catch(() => null);

  const contentItems = await prisma.content.findMany();
  for (const item of contentItems) {
    const next = removeUploadUrl(item.data, url);
    if (JSON.stringify(next) !== JSON.stringify(item.data)) {
      await prisma.content.update({ where: { id: item.id }, data: { data: next } });
      updatedContent += 1;
    }
  }

  const draftItems = await prisma.contentDraft.findMany();
  for (const item of draftItems) {
    const next = removeUploadUrl(item.data, url);
    if (JSON.stringify(next) !== JSON.stringify(item.data)) {
      await prisma.contentDraft.update({ where: { id: item.id }, data: { data: next } });
      updatedDrafts += 1;
    }
  }

  return { updatedContent, updatedDrafts };
}

const storage = multer.diskStorage({
  destination: async (_, __, cb) => {
    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const name = crypto.randomUUID() + ext;
    cb(null, name);
  },
});

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (_, file, cb) => {
  const ext = extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"), false);
  }
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return cb(new Error("Invalid image type"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const inputPath = req.file.path;
    const ext = extname(req.file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      const outputFilename = req.file.filename.replace(ext, ".webp");
      const outputPath = join(UPLOAD_DIR, outputFilename);
      await sharp(inputPath)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);
      await unlink(inputPath).catch(() => {});
      return res.json({
        success: true,
        url: `/uploads/${outputFilename}`,
        filename: outputFilename,
      });
    }
    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { filename } = req.params;
    const safe = basename(filename);
    if (!/^[a-f0-9-]{36}\.[a-z]+$/.test(safe)) {
      return res.status(400).json({ success: false, message: "Invalid filename" });
    }
    const filePath = resolve(join(UPLOAD_DIR, safe));
    if (!filePath.startsWith(resolve(UPLOAD_DIR))) {
      return res.status(400).json({ success: false, message: "Invalid filename" });
    }
    if (existsSync(filePath)) await unlink(filePath);
    const references = await cleanupUploadReferences(`/uploads/${safe}`);
    res.json({ success: true, message: "Deleted", references });
  } catch (err) {
    next(err);
  }
}
