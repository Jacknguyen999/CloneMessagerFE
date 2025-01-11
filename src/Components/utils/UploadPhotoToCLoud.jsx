const upload_preset = "ChattingWeb";
const cloud_name = "dlb8hg8kg";
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const UploadPhotoToCLoud = async (file) => {
    const data = new FormData();
    data.append("file", file); // Add the file itself
    data.append("upload_preset", upload_preset); // Correct preset name

    try {
        const res = await fetch(api_url, {
            method: 'POST',
            body: data,
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const fileData = await res.json();
        return { url : fileData.secure_url}; // Return the secure URL
    } catch (error) {
        console.error("Image upload error:", error);
        throw error; // Re-throw the error for calling function to handle
    }
};
