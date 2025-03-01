
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Upload } from "lucide-react";

interface ImageUploadButtonProps {
    onImageUpload: (imageUrl: string) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onImageUpload }) => {
    return (
        <CldUploadWidget
            options={{ sources: ['local', 'url', 'unsplash'] }}
            uploadPreset="coffee-shop-image"
            onSuccess={(result) => {
                if (result && result.info) {
                    const imageUrl = (result.info as CloudinaryUploadWidgetInfo).secure_url;
                    onImageUpload(imageUrl);
                }
            }}
            onQueuesEnd={(result, { widget }) => {
                widget.close();
            }}
        >
            {({ open }) => {
                function handleOnClick() {
                    open();
                }
                return (
                    <Button variant="link" onClick={handleOnClick}>
                        <Upload />Upload an Image
                    </Button>
                );
            }}
        </CldUploadWidget>
    );
};

export default ImageUploadButton;