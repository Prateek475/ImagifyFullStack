import React from 'react'
import { assets, plans } from '../assets/assets'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import axios from 'axios' 
import { toast } from 'react-toastify';

const BuyCredit = () => {
  const {user,backendurl,loadCredits,token,setShowLogin} = useContext(AppContext);

  let navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits payment",
      description: "Credits payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (res) => {
        let {razorpay_order_id} = res;
        try {
          const {data} = await axios.post(`${backendurl}/api/user/verify-razor`,{
            razorpay_order_id
          });
          if(data.success) {
            await loadCredits();
            toast.success("Payment Successful!!");
            navigate('/');
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          toast.error(err.message);
        }
      }//this is the function which client side razorpay call backs when razorpy checkout invokes success and in this res is info about the payment done by client...
    };
    const rzp = new window.Razorpay(options);//this is the razor pay checkout objetc
    rzp.open();
  }//this fn will initialise the payment...

  //this fn will run when we click the payment button
  const paymentrazorpay = async (planId) => {
    try {
      //means user is currently not logged in..
      if(!user) {
        setShowLogin(true);
      } else {
        const {data} = await axios.post(`${backendurl}/api/user/pay-razor`,
          {
            planId
          },
          {
            headers: {
              token
            }
          }
        )
        //now in this data we will get order from backend side with the help of which we will complete payment with razor pay and initialize it first..
        if(data.success) {
          initPay(data.order);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <motion.div
     initial = {{opacity:0.2 ,y:100}}
      transition={{duration: 1}}
      whileInView={{opacity:1, y:0 }}
      viewport={{once: true}}
     className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item,index) => (
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={40} src={assets.logo_icon} alt="" />
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'><span className='text-3xl font-medium'>{item.price}</span>/{item.credits} credits</p>
            <button onClick={() => paymentrazorpay(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{!user ? "Get Started" : "Purchase"}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit
