"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const SignUp = () => {
    const [email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Success:', data)
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
    </div>
  )
}

export default SignUp
