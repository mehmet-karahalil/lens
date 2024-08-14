import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    const [sourceImage, setSourceImage] = useState(null);
    const [targetImage, setTargetImage] = useState(null);
    const [responseImage, setResponseImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e, setImage) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result.split(',')[1]; // Remove the prefix
            setImage(base64Image);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sourceImage || !targetImage) {
            setMessage('Please upload both images.');
            return;
        }

        setLoading(true);
        setMessage('');

        const payload = {
            source_image: sourceImage,
            target_image: targetImage,
            source_faces_index: [0],
            face_index: [0],
            upscaler: "None",
            scale: 1,
            upscale_visibility: 1,
            face_restorer: "None",
            restorer_visibility: 1,
            codeformer_weight: 0.5,
            restore_first: 1,
            model: "inswapper_128.onnx",
            gender_source: 0,
            gender_target: 0,
            save_to_file: 0,
            result_file_path: "",
            device: "GPU",
            mask_face: 0,
            select_source: 0,
            face_model: "None",
            source_folder: "",
            random_image: 0,
            upscale_force: 0,
            det_thresh: 0.5,
            det_maxnum: 0
        };

        try {
            const response = await axios.post('https://ai.github.rocks/reactor/image', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            const responseImageBase64 = response.data.image; // Assuming the API returns a single image
            setResponseImage(`data:image/png;base64,${responseImageBase64}`);
            setMessage('Request successful.');
        } catch (error) {
            setMessage('Request failed.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Upload Source Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSourceImage)} />
                </div>
                <div>
                    <label>Upload Target Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setTargetImage)} />
                </div>
                <button type="submit" disabled={loading}>Submit</button>
            </form>
            {message && <p>{message}</p>}
            {responseImage && <img height={500} src={responseImage} alt="Response" />}
        </div>
    );
};

export default ImageUpload;
