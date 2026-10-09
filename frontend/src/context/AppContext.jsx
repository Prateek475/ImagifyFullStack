import { createContext, useEffect } from "react";
import { useState } from 'react'
import axios from 'axios' 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user,setUser] = useState(null);
  const [showLogin,setShowLogin] = useState(false);
  const [token,setToken] = useState(localStorage.getItem('token'));
  const [credit,setCredit] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL;//we imported the backend url in our frontends context so that it will be accessible to every component...
  const navigate = useNavigate();//this usenavigate hook will be used for navigating through various pages

  //this is the api call for load credits..
  const loadCredits = async () => {
    try {
      const {data} = await axios.get(`${backendurl}/api/user/credits`,
      {
        headers : {
          token
        }
      }
      );
      if(data.success) {
        setUser(data.user);
        setCredit(data.credits);
      } else {
        toast.error(data.message);
      }
    } catch(err) {
      toast.error(err.message);
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCredit(false);
    setToken(false);
  }

  const generateImage = async (prompt) => {
    try {
      const {data} = await axios.post(`${backendurl}/api/image/generate-image`,
        {
          prompt
        },
        {
          headers : {
            token
          }
        }
      );
      if(data.success) {
        loadCredits();
        return data.resultImage;
      } else {
        toast.error(data.message);
        if(credit === 0) {
          navigate('/buy');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }


  useEffect(()=>{
    if(token) {
      loadCredits();
    }
  },[token]
  );

  const value = {
    user,setUser, showLogin, setShowLogin,backendurl,token,setToken,credit,setCredit,loadCredits,logout,generateImage
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;