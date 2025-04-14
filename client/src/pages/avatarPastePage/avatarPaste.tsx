import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './avatarPaste.css';

interface AvatarUploadProps {
    onAvatarUpload: (file: File) => void;
    currentAvatar?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onAvatarUpload, currentAvatar }) => {
    const [preview, setPreview] = useState<string>(currentAvatar || '/assets/avatar.avif');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onAvatarUpload(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="avatar-upload-container">
            <div className="avatar-preview" onClick={handleClick}>
                <img src={preview} alt="Avatar preview" />
                <div className="avatar-overlay">
                    <span>Choose Avatar</span>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );
};

const AvatarPastePage = () => {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch('http://localhost:3001/auth/upload-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                navigate('/main');
            } else {
                console.error('Failed to upload avatar');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleContinueWithDefault = async () => {
        setIsUploading(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await fetch('http://localhost:3001/auth/set-default-avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                navigate('/main');
            } else {
                console.error('Failed to set default avatar');
            }
        } catch (error) {
            console.error('Error setting default avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="avatar-paste-page">
            <h1>Choose Your Avatar</h1>
            <AvatarUpload 
                onAvatarUpload={handleAvatarUpload}
                currentAvatar="/assets/avatar.avif"
            />
            <div className="avatar-actions">
                <button 
                    className="continue-button"
                    onClick={handleContinueWithDefault}
                    disabled={isUploading}
                >
                    {isUploading ? 'Processing...' : 'Continue with Default Avatar'}
                </button>
            </div>
        </div>
    );
};

export default AvatarPastePage;