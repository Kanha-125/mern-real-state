import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateListing = () => {
  const [files, setFiles] = React.useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = React.useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bathrooms: 1,
    bedrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = React.useState(false);
  const [uploadImageLoading, setImageUploadLoading] = React.useState(false);
  const [createListingError, setCreateListingError] = useState(false);
  const [createListingLoading, setCreateListingLoading] = useState(false);
  const navigate = useNavigate();
  const { listingId } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch(`/api/listing/get/${listingId}`);
      const data = await response.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    setImageUploadLoading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData?.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].size <= 2 * 1024 * 1024) {
          promises.push(storeImage(files[i]));
        } else {
          setImageUploadError('One or more images exceed the 2MB size limit');
          return;
        }
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, ...urls],
          });
          setImageUploadError(false);
          setImageUploadLoading(false);
        })
        .catch((error) => {
          setImageUploadError('Image Upload Fail (2MB max per image)');
          setImageUploadLoading(false);
        });
    } else {
      setImageUploadError('Maximum 6 images per listing and Minimum 1 image');
      setImageUploadLoading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              resolve(downloadUrl);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, indi) => indi !== index),
    });
  };

  const handleChangeInput = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    } else if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    setCreateListingLoading(true);
    e.preventDefault();
    if (formData?.imageUrls.length < 1 || formData.imageUrls.length > 6) {
      setCreateListingError('Please upload at least 1 and maximum 6 images');
      setCreateListingLoading(false);
      return;
    }
    if (+formData.discountedPrice > +formData.regularPrice) {
      setCreateListingError('Discounted Price must be lower than regular price');
      setCreateListingLoading(false);
      return;
    }

    try {
      setCreateListingError(false);

      const response = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await response.json();
      if (data.success === false) {
        setCreateListingError(data.message);
        setCreateListingLoading(false);
        return;
      }
      setCreateListingLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setCreateListingError(err);
      setCreateListingLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Update a Listing</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChangeInput}
            value={formData.name}
          />
          <textarea
            type="textarea"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChangeInput}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChangeInput}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChangeInput}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formData.type === 'rent'}
                onChange={handleChangeInput}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChangeInput}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChangeInput}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChangeInput} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChangeInput}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChangeInput}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={1000000}
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChangeInput}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span>($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min={0}
                  max={1000000}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChangeInput}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>DiscountedPrice</p>
                  <span>($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              disabled={uploadImageLoading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploadImageLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={index} className="flex justify-between p-3 border items-center">
                <img src={url} alt="listing Image" className="w-20 h-20 object-contain rounded-lg" />
                <button
                  type="button"
                  className="text-red-700 p-3 rounded-lg uppercase hover:opacity-75"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={createListingLoading || uploadImageLoading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {createListingLoading ? 'Updating' : 'Update Listing'}
          </button>
          {createListingError && <p className="text-red-700 text-sm mt-2 text-center">{createListingError}</p>}
          {imageUploadError && <p className="text-red-700 text-sm mt-2 text-center">{imageUploadError}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
