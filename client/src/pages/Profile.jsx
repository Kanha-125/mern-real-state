import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const imageRef = React.useRef(null);
  const [file, setFile] = React.useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState();

  useEffect(() => {
    if (file) {
      uploadFile(file);
    }
  }, [file]);

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      },
    );
  };

  const inputChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-4">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          accept="image/*"
          ref={imageRef}
        />
        <img
          src={formData.avatar || currentUser?.avatar}
          alt="Profile"
          className="rounded-full h-20 w-20 object-cover hover:cursor-pointer self-center mt-2"
          onClick={() => imageRef.current.click()}
        />
        <p className="text-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">
              Image Upload Error (Image must be less than 2 MB)
            </span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={inputChangeHandler}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={inputChangeHandler}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={inputChangeHandler}
        />
        <button className="bg-slate-700 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-white">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
