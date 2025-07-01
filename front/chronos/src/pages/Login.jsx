import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo-chronos.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      })

      const token = response.data.access_token
      localStorage.setItem('token', response.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Email ou senha inválidos')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3B2F2F] px-4">
      <div className="bg-[#5E4B3C] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-0">
          <img src={logo} alt="Chronos Logo" className="w-15 h-15 mb-0" />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-300 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 transition text-white p-3 rounded-lg font-semibold"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-200">
          Não tem uma conta?{' '}
          <a href="/register" className="text-amber-300 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
