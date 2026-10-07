"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })



  if (error) {
    setErrorMsg(error.message)
    setSuccessMsg('')
  } else {
    setSuccessMsg('Account created! Check your email to confirm.')
    setErrorMsg('')
  }
}
  return (
    <div>
      <h1>Sign Up</h1>
      <input
         type="email"
         placeholder="Email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
        />
      <input 
        placeholder="Password" 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Create Account</button>
      {errorMsg && <p>{errorMsg}</p>}
      {successMsg && <p>{successMsg}</p>}
    </div>
  )
}

export default SignUp
