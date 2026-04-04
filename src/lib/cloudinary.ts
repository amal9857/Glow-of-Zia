import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'glow-of-zia' },
            (error, result) => error ? reject(error) : resolve(result!.secure_url)
        ).end(buffer);
    });
}
