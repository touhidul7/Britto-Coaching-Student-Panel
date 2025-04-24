/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";

const Login = ({fuction}) => {
  const [username, setUsername] = useState();
  const handleSubmit = (e) => {
    toast("Logging In....");
    e.preventDefault();

    setTimeout(() => {
        fuction({ username });
    }, 2000);
  };
  return (
    <div className="flex flex-col w-full overflow-hidden relative min-h-screen radial-gradient items-center justify-center g-0 px-4">
      <div className="justify-center items-center w-full card lg:flex max-w-md">
        <div className="w-full card-body">
          <a href="../" className="py-4 block">
            <img src="/logo.jpg" alt="Logo" className="mx-auto w-24" />
          </a>
          <p className="mb-4 text-gray-400 text-sm text-center">
            মেধা বিকাশ শিশু নিকেতন এন্ড কুরআন একাডেমি
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="studentid"
                className="block text-sm mb-2 text-gray-400"
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentid"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="py-3 px-4 block w-full border-gray-200 border rounded-sm text-sm focus:border-blue-600 focus:ring-0"
                aria-describedby="hs-input-helper-text"
              />
            </div>

            <div className="grid my-6">
              <button
                type="submit"
                className="btn py-[10px] text-base text-white font-medium bg-blue-700 hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
