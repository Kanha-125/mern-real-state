import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        console.error("error while signing in with google", data.message);
      }

      dispatch(signInSuccess(data));
      navigate("/home");
    } catch (err) {
      console.log("error while google authentication", err);
    }
  };

  return (
    <button
      type="button"
      className="bg-red-700 rounded-lg text-white uppercase p-3 hover:opacity-90"
      onClick={handleGoogleClick}
    >
      continue with google
    </button>
  );
};

export default OAuth;
