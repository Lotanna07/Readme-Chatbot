"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'


const Login = () => {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) {
        setErrorMsg(error.message)
    }else {
        setErrorMsg('')
        console.log('Login successful:', data)
    }
}
  return (
    <div>
        <h1>Login</h1>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {errorMsg && <p>{errorMsg}</p>}
    </div>
  )
}

export default Login
