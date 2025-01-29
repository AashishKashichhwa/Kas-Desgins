import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import  { toast } from 'react-hot-toast';
export default function Login() {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

       const handleSubmit= async(e)=>{
        e.preventDefault();
          console.log(email,password)
          try {
              const request= await post('/api/auth/login',{email,password})
              const reponse= request.data 

              if(request.status === 200){
                toast.success(reponse.message)
              }

              console.log(reponse)
          } catch (error) {
            console.log(error)
          }
       }
  return (
    <>

        <div className='login-container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor="Email">Email</label>
                    <input type="email" name="" id="email" 
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div className='input-group'>
                    <label htmlFor="passowrd">Password</label>
                    <input type="password" name=""
                      onChange={(e)=>setPassword(e.target.value)} id="password" />
                </div>
                <button type='submit'>Login</button>
                <p className='register-link'>
                Not registered? <Link to={'/register'}>Register here</Link>
                </p>
            </form>
        </div>




    </>
  )
}