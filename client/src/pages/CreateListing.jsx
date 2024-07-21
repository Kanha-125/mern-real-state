import React from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const CreateListing = () => {
  const [files, setFiles] = React.useState([]);
  const [formData, setFormData] = React.useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = React.useState(false);
  const [uploadImageLoading, setImageUploadLoading] = React.useState(false);

  const handleImageSubmit = (e) => {
    setImageUploadLoading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length + formData?.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        if (files[i].size <= 2 * 1024 * 1024) {
          promises.push(storeImage(files[i]));
        } else {
          setImageUploadError("One or more images exceed the 2MB size limit");
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
          setImageUploadError("Image Upload Fail (2MB max per image)");
          setImageUploadLoading(false);
        });
    } else {
      setImageUploadError("Maximum 6 images per listing and Minimum 1 image");
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
        "state_changed",
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
        },
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, indi) => indi !== index),
    });
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="decription"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span>($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>DiscountedPrice</p>
                <span>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>
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
              {uploadImageLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing Image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="text-red-700 p-3 rounded-lg uppercase hover:opacity-75"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
          {imageUploadError && (
            <p className="text-red-700 text-sm mt-2 text-center">
              {imageUploadError}
            </p>
          )}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
