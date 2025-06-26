import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import folderService from '../services/folderService';
import imageService from '../services/imageService';
import './FolderDetail.css';

const FolderDetail = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchFolderData = async () => {
    try {
      const folderRes = await folderService.getFolderById(folderId);
      setFolder(folderRes.data);

      const imagesRes = await imageService.getImagesInFolder(folderId);
      setImages(imagesRes.data);
    } catch (err) {
      setError('Failed to fetch folder data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderData();
  }, [folderId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploadProgress(0); // Reset progress
        await imageService.uploadImage(file, folderId, (event) => {
          setUploadProgress(Math.round((100 * event.loaded) / event.total));
        });
        fetchFolderData(); // Refresh data
      } catch (err) {
        setError('Failed to upload image.');
      } finally {
        setUploadProgress(0);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await imageService.deleteImage(imageId);
      fetchFolderData(); // Refresh data
    } catch (err) {
      setError('Failed to delete image.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>{folder?.name}</h2>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        {uploadProgress > 0 && <progress value={uploadProgress} max="100"></progress>}
      </div>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.url} alt={image.filename} />
            <p>{image.filename}</p>
            <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderDetail; 