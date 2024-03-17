import axios from "axios"
import { Appbar } from "./Appbar"
import { BACKEND_URL } from "../config"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

export const Publish= ()=>{
    const [title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const navigate=useNavigate();
    return <div>
        <Appbar/>
        <div className="flex flex-col justify-center w-full "> 
        <textarea onChange={(e)=>{
            setTitle(e.target.value);
        }} className="pl-2 pt-2 block mb-2 text-sm font-medium text-gray-900  bg-gray-100 dark:text-white border-gray-400" placeholder="Title"></textarea>
        <textarea onChange={(e)=>{
            setDescription(e.target.value);
        }} id="message" className="block p-2.5 w-full text-md text-gray-900 bg-gray-100 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write Your Blog"></textarea>
    </div>
    <button onClick={async()=>{
        const response=await axios.post(`${BACKEND_URL}/api/v1/blog`,{
            title,
            content:description
        },{
            headers:{
                Authorizations:localStorage.getItem("token")
            }
        })
        navigate(`/blog/${response.data.id}`)
    }} type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 mr-4 pt-2 mt-6 ">Publish Post</button>

    </div>
}