import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Let Cloudinary auto-detect the file type
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

// Function to delete files from Cloudinary
const deleteFromCloudinary = async (url, resourceType = "image") => {
  try {
    // Extract the public ID from the Cloudinary URL
    const publicIdWithFolder = url.split("/").slice(-2).join("/").split(".")[0];

    // Delete from Cloudinary by public ID
    const response = await cloudinary.uploader.destroy(publicIdWithFolder, {
      resource_type: resourceType, // Specify resource type (e.g., "image", "video")
    });

    if (response.result === "ok") {
      return response;
    } else {
      throw new Error(`Failed to delete resource. Response: ${response.result}`);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete from Cloudinary.");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
