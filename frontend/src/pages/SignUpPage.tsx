import logo from "../icons/logoapp.svg";
import google from "../icons/googleicon.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const SignUpPage = () => {
  const { register, logInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  /*i will make a function here in order to validate the email and password*/
  const validate = () => {
    let currentErrors = { name: "", email: "", password: "" };
    let isValid = true;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    function checkRegex() {
      return emailRegex.test(email);
    }

    //first if the email doesn t match the basic regex then it is not a valid one
    if (!checkRegex()) {
      currentErrors.email = "This is a required field!";
      isValid = false;
    }
    //second we need to also validate the password
    if (password.length === 0) {
      currentErrors.password =
        "The password field is required, do not leave it empty!";
      isValid = false;
    }
    //now we also need to check if the name is not empty
    if (name.length === 0) {
      currentErrors.name = "The name field is required, do not leave it empty!";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await register(name, email, password);
        navigate("/");
      } catch (error) {
        setErrors({ ...errors, email: "Registration failed" });
      }
    }
  };

  return (
    <div className="bg-slate-50 w-full min-h-screen">
      <div className="flex flex-col gap-[10px] justify-center items-center h-full">
        <div className="flex flex-row gap-[8px] md:gap-[15px] mt-15">
          <img src={logo} className="w-5 h-5 md:w-10 md:h-10" />
          <h2 className="font-montserrat text-[15px] md:text-[30px] text-black">
            CC Route Optimizer
          </h2>
        </div>
        <div className="flex flex-col gap-[5px] justify-center items-center">
          <h1 className="font-montserrat text-[25px] md:text-[50px] text-black font-bold">
            Create an account
          </h1>
          <h1 className="font-montserrat text-[15px] md:text-[30px] text-gray-500 font-normal">
            Sign up to get started
          </h1>
        </div>
        <button
          type="button"
          className="bg-white box-border border border-slate-200 hover:bg-slate-100 focus:ring-1 focus:ring-slate-200 rounded-md shadow-xs leading-5 w-[250px] h-[30px] md:w-[400px] md:h-[50px] focus:outline-none"
        >
          <div
            className="flex flex-row gap-[10px] items-center justify-center"
            onClick={logInWithGoogle}
          >
            <img src={google} className="w-5 h-5" />
            <h1 className="font-montserrat text-[10px] md:text-[18px] text-black font-semibold">
              Continue with Google
            </h1>
          </div>
        </button>
        <div className="flex flex-row items-center gap-[10px] w-[250px] md:w-[400px]">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="font-montserrat text-[10px] md:text-[18px] text-gray-500">
            or
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <form
          className="flex flex-col gap-1 md:gap-1 justify-start items-start w-[250px] md:w-[400px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2.5 text-[15px] font-medium font-montserrat"
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="bg-white box-border border border-slate-200 hover:bg-slate-100 focus:ring-1 focus:ring-slate-200 rounded-md shadow-xs leading-5 w-[250px] h-[30px] md:w-[400px] md:h-[50px] focus:outline-none placeholder:text-body pl-[10px]"
              placeholder="Carina Costache"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] md:text-sm font-montserrat mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2.5 text-[15px] font-medium font-montserrat"
            >
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-white box-border border border-slate-200 hover:bg-slate-100 focus:ring-1 focus:ring-slate-200 rounded-md shadow-xs leading-5 w-[250px] h-[30px] md:w-[400px] md:h-[50px] focus:outline-none placeholder:text-body pl-[10px]"
              placeholder="carina@route.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] md:text-sm font-montserrat mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2.5 text-[15px] font-medium font-montserrat"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="bg-white box-border border border-slate-200 hover:bg-slate-100 focus:ring-1 focus:ring-slate-200 rounded-md shadow-xs leading-5 w-[250px] h-[30px] md:w-[400px] md:h-[50px] focus:outline-none placeholder:text-body pl-[10px]"
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-[10px] md:text-sm font-montserrat mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-lime-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-lime-700 font-montserrat w-full"
          >
            Sign up
          </button>
        </form>
        <p className="font-montserrat text-[10px] md:text-[18px] text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-lime-600 hover:text-lime-700">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
