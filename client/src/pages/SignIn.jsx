import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="rounded-lg border p-3"
          id="email"
          onChange={handleInputChange}
        ></input>
        <input
          type="password"
          placeholder="password"
          className="rounded-lg border p-3"
          id="password"
          onChange={handleInputChange}
        ></input>
        <button
          disabled={userState.loading}
          className="p-3 text-white rounded-lg uppercase bg-slate-700 hover:opacity-95 disabled:opacity-80"
        >
          {userState.loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="mt-5 flex gap-2">
        <p>Dont have an account?</p>
        <Link to="/sign-up" className="text-blue-700">
          Sign up
        </Link>
      </div>
      {userState.error && (
        <p className="text-red-500 mt-5">{userState.error}</p>
      )}
    </div>
  );
};

export default SignIn;
