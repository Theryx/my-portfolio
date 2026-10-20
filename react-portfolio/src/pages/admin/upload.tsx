import { useState } from 'react';
import { Upload } from 'lucide-react';

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

/* Opens the Cloudinary upload widget and reports the uploaded URL. */
export function CloudinaryUploadButton({ onUpload, label, small, primary }: {
  onUpload: (url: string) => void;
  label?: string;
  small?: boolean;
  primary?: boolean;
}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
  const ready = Boolean(cloudName && uploadPreset);
  const [missing, setMissing] = useState(false);

  const handleClick = () => {
    if (!window.cloudinary || !ready) {
      setMissing(true);
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      { cloudName, uploadPreset, multiple: false, maxFiles: 1, resourceType: 'image' },
      (error, result) => {
        if (!error && result?.event === 'success') onUpload(result.info.secure_url);
      },
    );
    widget.open();
  };

  const cls = ['cms-btn', small && 'cms-btn--sm', primary && 'cms-btn--primary'].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={cls}
      onClick={handleClick}
      title={missing ? 'Cloudinary is not configured: set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.' : undefined}
    >
      <Upload size={small ? 13 : 15} aria-hidden="true" /> {missing ? 'Upload unavailable' : (label ?? 'Upload')}
    </button>
  );
}
