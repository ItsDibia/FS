'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '../../../components/Navbar'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/clientes')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/clientes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Clientes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
          <p className="mt-1 text-sm text-gray-600">
            Registra un nuevo cliente en el sistema
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingresa el nombre del cliente"
              />
            </div>

            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">
                RUC
              </label>
              <input
                type="text"
                id="ruc"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingresa el RUC (opcional)"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/clientes"
                className="btn-secondary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
