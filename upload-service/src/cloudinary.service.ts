import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(filePath: string): Promise<UploadApiResponse> {
        return await cloudinary.uploader.upload(filePath, {
            folder: "uploads",
            resource_type: "image",
        });
    }
}