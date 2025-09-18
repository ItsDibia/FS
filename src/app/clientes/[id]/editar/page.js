'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '../../../../components/Navbar'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditarClientePage({ params }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState({
    nombre: '',
    ruc: ''
  })

  useEffect(() => {
    fetchCliente()
  }, [])

  const fetchCliente = async () => {
    try {
      const response = await fetch(`/api/clientes/${params.id}`)
      const cliente = await response.json()
      setFormData({
        nombre: cliente.nombre || '',
        ruc: cliente.ruc || ''
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/clientes/${params.id}`, {
        method: 'PUT',
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

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="mt-1 text-sm text-gray-600">
            Modifica la información del cliente
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
                {loading ? 'Guardando...' : 'Actualizar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
