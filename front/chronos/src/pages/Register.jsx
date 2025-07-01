import { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') 
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      await axios.post('http://localhost:5000/register', {
        name,
        email,
        password
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      } , 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário')
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-[#3B2F2F] px-4">
      <div className="bg-[#5E4B3C] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-3"> 
          <h1 className="text-3xl font-bold text-amber-400">Cadastro</h1>
        </div>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          {error && <p className="text-red-300 text-sm text-center mb-4">{error}</p>}
          {success && <p className="text-green-300 text-sm text-center mb-4">Registrado com sucesso, Bem vindo ao Chronos!</p>}
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 transition text-white p-3 rounded-lg font-semibold"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-200">
          Já tem conta?{' '}
          <a href="/" className="text-amber-300 hover:underline">
            Fazer login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register