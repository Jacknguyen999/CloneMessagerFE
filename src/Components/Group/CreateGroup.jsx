// components/CreateGroup.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    Modal,
    Box,
    Button,
    TextField,
    IconButton,
    Typography,
    MenuItem,
    Chip,
    CircularProgress,
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { AddAPhoto, Close as RemoveIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createGroupChat } from '../../Redux/Chat/Action';
import { UploadPhotoToCLoud } from './../utils/UploadPhotoToCLoud';
import debounce from 'lodash.debounce'; // Install lodash.debounce if not already
import { searchUser } from '../../Redux/Auth/Action';

const CreateGroup = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store); 
    const token = localStorage.getItem('jwt'); 

    const [tempPicture, setTempPicture] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((keyword) => {
            dispatch(searchUser({ keyword, token }));
        }, 300),
        [dispatch, token]
    );

    useEffect(() => {
        debouncedSearch(searchKeyword);
        // Cleanup function to cancel debounce on unmount
        return debouncedSearch.cancel;
    }, [searchKeyword, debouncedSearch]);

    const handleAddMember = (member) => {
        if (!selectedMembers.find((m) => m.id === member.id)) {
            setSelectedMembers([...selectedMembers, member]);
        }
        setSearchKeyword('');
    };

    const handleRemoveMember = (member) => {
        setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    };

    // Filter out already selected members
    const filteredSuggestions = auth.searchUser.filter(
        (user) => 
            user.full_name.toLowerCase().includes(searchKeyword.toLowerCase()) &&
            !selectedMembers.find((m) => m.id === user.id)
    );

    const formik = useFormik({
        initialValues: {
            chat_name: '',
            chat_image: '',
        },
        onSubmit: async (values) => {
            const userIds = selectedMembers.map((user) => user.id);
            const chatData = {
                chat_name: values.chat_name,
                chat_image: values.chat_image,
                userIds: userIds,
            };

            dispatch(createGroupChat({ data: chatData }));
            onClose(); // Close the modal after saving
        },
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setTempPicture(true);

        try {
            const image = await UploadPhotoToCLoud(file);
            if (image && image.url) {
                formik.setFieldValue('chat_image', image.url);
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        } finally {
            setTempPicture(false);
        }
    };

    const handleRemoveImage = () => {
        formik.setFieldValue('chat_image', '');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <IconButton onClick={onClose} variant="outlined" size="small">
                        <KeyboardBackspaceIcon style={{ color: 'black' }} />
                    </IconButton>
                    <Typography variant="h6" align="center" className="flex-grow">
                        Create Group
                    </Typography>
                </div>

                {/* Body */}
                <form onSubmit={formik.handleSubmit} className="flex flex-col items-center space-y-4">
                    {/* Group Picture */}
                    <div className="relative w-24 h-24 rounded-full border border-gray-400 overflow-hidden flex items-center justify-center cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            id="groupImageInput"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="groupImageInput" className="absolute inset-0 group-hover:bg-black/40 flex items-center justify-center">
                            {formik.values.chat_image ? (
                                <>
                                    {/* Uploaded Image */}
                                    <img
                                        src={formik.values.chat_image}
                                        alt="Group"
                                        className="w-full h-full object-cover group-hover:filter group-hover:blur-sm"
                                    />
                                    {/* Remove Icon */}
                                    <RemoveIcon
                                        className="absolute text-black top-2 right-2 opacity-0 group-hover:opacity-100 cursor-pointer"
                                        onClick={handleRemoveImage}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Default Image */}
                                    <img
                                        src="https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png"
                                        alt="Default Group"
                                        className="w-full h-full object-cover group-hover:filter group-hover:blur-sm"
                                    />
                                    {/* Add Photo Icon */}
                                    <AddAPhoto
                                        className="absolute text-black opacity-0 group-hover:opacity-100"
                                    />
                                </>
                            )}
                        </label>
                        {tempPicture && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <CircularProgress />
                            </div>
                        )}
                    </div>

                    {/* Group Name */}
                    <TextField
                        fullWidth
                        label="Group Name"
                        variant="outlined"
                        name="chat_name"
                        value={formik.values.chat_name}
                        onChange={formik.handleChange}
                        required
                    />

                    {/* Add Members */}
                    <div className="w-full">
                        <Typography variant="subtitle1" gutterBottom>
                            Add Members
                        </Typography>
                        <TextField
                            fullWidth
                            label="Search Members"
                            variant="outlined"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        {filteredSuggestions.length > 0 && (
                            <Box
                                sx={{
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    backgroundColor: '#f9f9f9',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    marginTop: '8px',
                                }}
                            >
                                {filteredSuggestions.map((user) => (
                                    <MenuItem key={user.id} onClick={() => handleAddMember(user)}>
                                        <Box display="flex" alignItems="center">
                                            <img
                                                src={user.profile_pic}
                                                alt={user.full_name}
                                                style={{ width: 30, height: 30, borderRadius: '50%', marginRight: 10 }}
                                            />
                                            <span>{user.full_name}</span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Box>
                        )}
                        {auth.searchUser.length === 0 && searchKeyword !== '' && (
                            <Typography variant="body2" color="textSecondary" sx={{ marginTop: '8px' }}>
                                No users found.
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                marginTop: '16px',
                            }}
                        >
                            {selectedMembers.map((member) => (
                                <Chip
                                    key={member.id}
                                    label={member.full_name}
                                    avatar={<img src={member.profile_pic} alt={member.full_name} style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                                    onDelete={() => handleRemoveMember(member)}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 w-full">
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={selectedMembers.length === 0 || !formik.values.chat_name}
                        >
                            Create Group Chat
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default CreateGroup;
