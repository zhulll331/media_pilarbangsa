export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMimeType?: 'image/webp' | 'image/jpeg';
}

/**
 * Otomatis kompresi gambar di browser sebelum diunggah:
 * - Menyesuaikan resolusi (downscale jika melebihi batas maksimal, misal 1200px / 1400px)
 * - Mengonversi ke format modern WebP dengan efisiensi tinggi (menghemat storage hingga 85-95%)
 * - Menjaga rasio aspek gambar tetap proporsional & tajam
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // Hanya proses jika bertipe image
  if (!file.type || !file.type.startsWith('image/')) {
    return file;
  }

  // File SVG atau GIF animasi dibiarkan agar tidak merusak format vector / animasi
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality ?? 0.8;
  const targetMimeType = options.targetMimeType || 'image/webp';

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Downscale jika melebihi dimensi batas maksimal
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Jika hasil kompresi ternyata lebih besar dari file asli (sangat jarang), gunakan file asli
            if (blob.size >= file.size && file.type === targetMimeType) {
              resolve(file);
              return;
            }

            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const ext = targetMimeType === 'image/webp' ? 'webp' : 'jpg';
            const compressedFile = new File([blob], `${baseName}.${ext}`, {
              type: targetMimeType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          targetMimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}

/**
 * Format ukuran file menjadi string human-readable (misal: 120 KB, 1.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
