import React, { useState } from 'react';
import {
    Modal,
    Box,
    Button,
    TextField,
    IconButton,
    CircularProgress,

} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddAPhoto from '@mui/icons-material/AddAPhoto';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, updateUser } from '../../Redux/Auth/Action';
import { UploadPhotoToCLoud } from './../utils/UploadPhotoToCLoud';


const UserProfile = ({ open, onClose }) => {
    const { auth } = useSelector((store) => store);
    const dispatch = useDispatch();
    const jwt = localStorage.getItem('jwt');
    const [tempPicture, setTempPicture] = useState(false);



    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setTempPicture(true);

        try {
            const image = await UploadPhotoToCLoud(file);
            console.log("Uploaded Image Response:", image);

            // Handle both object and string responses
            if (typeof image === "string") {
                formik.setFieldValue("profile_picture", image);
            } else if (image && image.url) {
                formik.setFieldValue("profile_picture", image.url);
            } else {
                console.error("Invalid response from UploadPhotoToCLoud:", image);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setTempPicture(false);
        }
    };


    const handleRemoveImage = () => {
        formik.setFieldValue('profile_picture', '');
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        onClose();
        window.location.reload();
    };

    const formik = useFormik({
        initialValues: {
            full_name: auth.reqUser?.full_name || '',
            profile_picture: auth.reqUser?.profile_picture || '',
        },
        onSubmit: async (values) => {
            try {
                await dispatch(updateUser({ data: values, jwt })); // Call the action
                onClose(); // Close the modal
                dispatch(currentUser(jwt)); // Refresh the user data
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
    });
    // console.log("Formik Values:", formik.values);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    backgroundColor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <IconButton onClick={onClose} size="small">
                        <KeyboardBackspaceIcon style={{ color: 'black' }} />
                    </IconButton>
                    <h2 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2">
                        Profile
                    </h2>
                    <button
                        className="text-sm font-semibold text-white bg-red-500 px-4 py-1 rounded-md hover:bg-red-600 transition"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                        {/* Image Upload Input */}
                        <input
                            accept="image/*"
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="fileInput" className="relative cursor-pointer">
                            <div
                                className="w-24 h-24 border border-gray-400 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden"
                                style={{ position: 'relative' }}
                            >
                                {formik.values.profile_picture ? (
                                    <img
                                        className="w-full h-full object-cover"
                                        src={formik.values.profile_picture}
                                        alt="Uploaded Profile"
                                    />
                                ) : (
                                    <AddAPhoto className="text-gray-500" />
                                )}

                                {tempPicture && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-75">
                                        <CircularProgress />
                                    </div>
                                )}
                            </div>
                        </label>

                        {/* Remove Image Button */}
                        {formik.values.profile_picture && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={handleRemoveImage}
                                className="mt-2"
                            >
                                Remove Image
                            </Button>
                        )}
                    </div>

                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        value={auth.reqUser?.email || 'user@example.com'}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="full_name"
                        value={formik.values.full_name}
                        onChange={formik.handleChange}
                    />
                </div>

                {/* Save Profile Button */}
                <div className="mt-6">
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={formik.handleSubmit}
                        disabled={!formik.dirty || formik.isSubmitting}
                    >
                        Save Profile
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default UserProfile;
