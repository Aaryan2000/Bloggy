// import { ChangeEvent } from "react";
// import { Link } from "react-router-dom"

import { SignupInput } from "@100xdevs/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate=useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    username: "",
    password: "",
    name: "",
  });

  async function sendRequest(){
    try{
        const response=await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup"?"signup":"signin"}`,postInputs);
        const jwt=response.data;
       // console.log(jwt.token);//These i have written just to see whether jwt is object or value here variable jwt is object and jwt.token is value
        
        localStorage.setItem("token",jwt.token);
        navigate("/blogs")

    }catch(e){
        //alert the user here that request has failed
        alert("Error while signing up")
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an Account</div>
            <div className="text-slate-500">
              {type==="signin" ? "Don't have an Account" : "Already have an account?"}
              <Link className="pl-2 underline" to={type==="signin"? "/signup" : "/signin"}>
                {type === "signin" ? "signup" : "signin"}
              </Link>
            </div>
          </div>
          <div className="pt-4">
            {type==="signup"?<LabeledInput
              label="Name"
              placeholder="Aaryan Dubey..."
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,//it gives existing details like name in these case
                  name:e.target.value
                });
              }}
            ></LabeledInput>:null}

            <LabeledInput
              label="username"
              placeholder="aaryandube78@gmail.com"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,//it gives existing details like username in these case
                  username: e.target.value,
                });
              }}
            ></LabeledInput>

            <LabeledInput
              type={"password"}//these will ensure that u see star in the password field
              label="password"
              placeholder="123456"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,//it gives existing details like password in these case
                  password: e.target.value,
                });
              }}
            ></LabeledInput>
            <button onClick={sendRequest} type="button" className="mt-8 pt-2 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type==="signup" ? "sign up":"signin"}</button>

          </div>
        </div>
      </div>
    </div>
  );
};

interface LabeledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabeledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabeledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-900 dark:text-white text-black font-semibold pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"} //here only when i pass the password,type gets value of type={"password"} in all other case of name,username no need to pass type
        id="large-input"
        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
      ></input>
    </div>
  );
}
