const FIVE_MB_BYTES = 5 * 1024 * 1024;
const sourceAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const targetAlphabet = "q8Lm4X0aK2nYzR1bC7vD5sEfG6hJiPjN9kMlOopQrStUuVwWxHyIzA3BcdFeTg";

export type UploadedImageResult = {
    id: string
    displayUrl: string
    shortCode: string
    shortUrl: string
}

type ImgbbResponse = {
    data: {
        id: string
        url: string
        url_viewer?: string
        display_url: string
        delete_url: string
        image?: {
            filename?: string
        }
    }
    success: boolean
}

export function isValidImageFile(file: File | Blob): boolean {
    return file.type.startsWith("image/");
}

export function isUnderFiveMb(file: File | Blob): boolean {
    return file.size <= FIVE_MB_BYTES;
}

function translateAlphabet(value: string, from: string, to: string): string {
    return value.split("").map((character) => {
        const index = from.indexOf(character);
        if (index === -1) {
            throw new Error("invalid_image_id");
        }

        return to[index];
    }).join("");
}

export function encodeRedirectCode(id: string): string {
    return translateAlphabet(id, sourceAlphabet, targetAlphabet);
}

export function decodeRedirectCode(code: string): string {
    return translateAlphabet(code, targetAlphabet, sourceAlphabet);
}

export function buildShortImageUrl(shortCode: string): string {
    return `${window.location.origin}/img/${shortCode}`;
}

export async function uploadImageToImgbb(apiKey: string, file: Blob, filename?: string): Promise<UploadedImageResult> {
    const formData = new FormData();
    formData.append("image", file, filename ?? "image");
    if (filename) {
        formData.append("name", filename);
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        body: formData
    });

    let data: ImgbbResponse | {error?: {message?: string}} | null = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok || !data || !("success" in data) || !data.success) {
        const errorMessage = data && "error" in data ? data.error?.message : undefined;
        throw new Error(errorMessage || "upload_failed");
    }

    const imageId = data.data.id;
    const shortCode = encodeRedirectCode(imageId);

    return {
        id: imageId,
        displayUrl: data.data.display_url,
        shortCode,
        shortUrl: buildShortImageUrl(shortCode)
    };
}
