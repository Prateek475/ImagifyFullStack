import { useEffect, useState } from "react";
import {assets} from "../assets/assets";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {motion} from 'framer-motion'
import axios from 'axios' 
import { toast } from "react-toastify";

const Login = () => {
  const [state,setState] = useState('Login');
  const {setUser,setShowLogin,backendurl,setToken} = useContext(AppContext);
  const[name,setname] = useState('');
  const[email,setemail] = useState('');
  const[password,setpassword] = useState('');
  //this is used to disable scrolling when login page is opened

  const onSubmitHandler = async (e) => {
    e.preventDefault();//this is to prevent the default mechanism of browser which is on submitting the form browser gets reloaded and then req gets sent but we dont want reloading part of the browser...
    try {
      if(state === 'Login') {
        //bcz in response there will be many things but we need data only that is res.json({}) from server which comes in data part only of response...
        const {data} = await axios.post(`${backendurl}/api/user/login`,
          {
            email,
            password
          }//2nd argument of axios automatcially becomes the body of req
        );
        if(data.success) {
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token',data.token);
            setShowLogin(false);
        } else {
          //here error occurred while logging in so we will display the error msg which we got in post notification WITH THE HELP of react toastify
          toast.error(data.message);
        }
      } else {
        const {data} = await axios.post(`${backendurl}/api/user/register`,
          {
            name,
            email,
            password
          }//2nd argument of axios automatcially becomes the body of req
        );
        if(data.success) {
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token',data.token);
            setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  }
  useEffect(()=>{
    document.body.style.overflow = "hidden";
    //this return function is called when this component get un mounted and removed from ui as clean up function to again start scrolling
    return ()=>{
      document.body.style.overflow = "unset";
    }
  },[]);
  return (
    <div
     className="fixed inset-0 z-9999 backdrop-blur-sm bg-black/30 flex justify-center items-center">

      <motion.form onSubmit={onSubmitHandler}
       initial = {{opacity:0.2 ,y:50}}
      transition={{duration: 0.3}}
      whileInView={{opacity:1, y:0 }}
      viewport={{once: true}}
       action="" className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{state
          }</h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state !== 'Login' && 
        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
          <img width={30} src={assets.profile_icon} alt="" />
          <input onChange={e => setname(e.target.value)} value={name} type="text" placeholder="Full Name" required className="outline-none text-sm"/>
        </div>
        }
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" />
          <input onChange={e => setemail(e.target.value)} value={email} type="email" placeholder="Email-id" required className="outline-none text-sm"/>
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input onChange={e => setpassword(e.target.value)} value={password} type="password" placeholder="Password" required className="outline-none text-sm"/>
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot Password?</p>

        <button type="submit" className="bg-blue-600 w-full text-white py-2 rounded-full">{state === 'Login' ? "Login" : "Create account"}</button>

        {state === "Login" ? <p className="mt-5 text-center">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState("SignUp")}>Sign Up</span></p>
        :
        <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState("Login")}>Log In</span></p>}

        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="cross_icon" className="absolute top-5 right-5 cursor-pointer" />
      </motion.form>
      
    </div>
  )
}

export default Login
