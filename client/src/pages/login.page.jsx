import React, { useState } from "react";
import CollegeLogo from "../assets/logo.png";
import axios from "axios";
import { FaAtom } from "react-icons/fa";
import {ADMIN_LOGIN} from  "../config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);

  const submitLoginAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    alert("Form submitted");
    try {
      console.log("We are here");
      const {status, data} = await axios.post(ADMIN_LOGIN, {
        email,
        password,
      });
      const {token} = data;
      if(status === 200) {
        localStorage.setItem("token",token);
        window.location.reload();
      }else {
          setFailedLogin(true);
          setLoading(false);
      }
    } catch (error) {
      setFailedLogin(true);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-secondary">
      <form
        className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col md:w-96"
        onSubmit={submitLoginAction}
      >
        <div className="flex justify-center mb-5">
          <img src={CollegeLogo} alt="college logo" className="w-40 h-40" />
        </div>
        <p
          className={
            failedLogin ? "text-red-500 text-base" : "text-base opacity-0"
          }
        >
          Invalid email / password
        </p>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            name="password"
            type="password"
            placeholder="******"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-40 h-14 flex justify-center items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <FaAtom size={30} className="spinner text-white" />
            ) : (
              "Sign In"
            )}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-700 hover:text-blue-800"
            type="button"
            onClick={() =>
              alert(
                "Please contact the IT support at +977-XXXXXXXXX for resetting password."
              )
            }
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
