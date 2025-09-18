'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '../../../components/Navbar'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NuevoVehiculoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    placa: '',
    dueño: '',
    peso_placa: '',
    tipo_vehiculo: ''
  })

  const tiposVehiculo = [
    'Camión',
    'Camioneta',
    'Furgón',
    'Trailer',
    'Moto',
    'Otro'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        peso_placa: parseFloat(formData.peso_placa)
      }

      const response = await fetch('/api/vehiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        router.push('/vehiculos')
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
            href="/vehiculos"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Vehículos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Vehículo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Registra un nuevo vehículo en la flota
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-1">
                Placa *
              </label>
              <input
                type="text"
                id="placa"
                name="placa"
                required
                value={formData.placa}
                onChange={handleChange}
                className="form-input"
                placeholder="Ejemplo: ABC-123"
              />
            </div>

            <div>
              <label htmlFor="dueño" className="block text-sm font-medium text-gray-700 mb-1">
                Dueño *
              </label>
              <input
                type="text"
                id="dueño"
                name="dueño"
                required
                value={formData.dueño}
                onChange={handleChange}
                className="form-input"
                placeholder="Nombre del propietario"
              />
            </div>

            <div>
              <label htmlFor="tipo_vehiculo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Vehículo *
              </label>
              <select
                id="tipo_vehiculo"
                name="tipo_vehiculo"
                required
                value={formData.tipo_vehiculo}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Selecciona un tipo</option>
                {tiposVehiculo.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="peso_placa" className="block text-sm font-medium text-gray-700 mb-1">
                Peso de la Placa (kg) *
              </label>
              <input
                type="number"
                id="peso_placa"
                name="peso_placa"
                required
                min="0"
                step="0.01"
                value={formData.peso_placa}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/vehiculos"
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
                {loading ? 'Guardando...' : 'Guardar Vehículo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
