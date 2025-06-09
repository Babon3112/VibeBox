import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResponse {
  url?: string;
  error?: string;
}

export interface CloudinaryError {
  error: string;
}

export interface CloudinaryDeleteResponse {
  result?: string;
  error?: string;
}

export const uploadOnCloudinary = async (
  buffer: Buffer,
  cloudinaryFolder: string
): Promise<UploadResponse> => {
  try {
    if (!buffer || !cloudinaryFolder) {
      throw new Error("Invalid buffer or folder");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: cloudinaryFolder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject({ error: error.message });
          } else {
            resolve({ url: result?.secure_url });
          }
        }
      );

      sharp(buffer)
        .pipe(uploadStream)
        .on("error", (error: unknown) => {
          if (error instanceof Error) {
            reject({ error: error.message });
          } else {
            reject({ error: "Unknown sharp error" });
          }
        });
    });
  } catch (error: unknown) {
    console.error("Error uploading to Cloudinary:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return { error: message };
  }
};

export const deleteFromCloudinary = async (
  url: string,
  resourceType: string = "image"
): Promise<CloudinaryDeleteResponse> => {
  const publicId = extractPublicId(url);

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response as CloudinaryDeleteResponse;
  } catch (error: unknown) {
    console.error("Error deleting from Cloudinary:", error);
    const message =
      error instanceof Error ? error.message : "Delete failed";
    return { error: message };
  }
};
