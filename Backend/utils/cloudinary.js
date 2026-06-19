import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // Upload the file on cloudinary
        const response = await cloudinary.uploader.unsigned_upload(localFilePath, "Semester Mentor", {
            resource_type: "auto"
        });
        // File has been uploaded successfully
        await fs.unlink(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Remove the locally saved temporary file as the upload operation got failed
        if (existsSync(localFilePath)) {
            await fs.unlink(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };
