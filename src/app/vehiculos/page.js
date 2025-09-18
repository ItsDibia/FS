'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '../../components/Navbar'
import { Plus, Edit, Trash2, Truck } from 'lucide-react'

export default function VehiculosPage() {
  const { data: session } = useSession()
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchVehiculos()
    }
  }, [session])

  const fetchVehiculos = async () => {
    try {
      const response = await fetch('/api/vehiculos')
      const data = await response.json()
      setVehiculos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return

    try {
      const response = await fetch(`/api/vehiculos/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchVehiculos()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Truck className="h-8 w-8 mr-3 text-green-600" />
              Gestión de Vehículos
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administra la flota de vehículos
            </p>
          </div>
          <Link
            href="/vehiculos/nuevo"
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Vehículo
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dueño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso Placa (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {vehiculo.placa}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehiculo.dueño}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {vehiculo.tipo_vehiculo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {vehiculo.peso_placa} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(vehiculo.created_at).toLocaleDateString('es-CO')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/vehiculos/${vehiculo.id}/editar`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(vehiculo.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {vehiculos.length === 0 && (
                <div className="text-center py-12">
                  <Truck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay vehículos registrados
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza agregando tu primer vehículo.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
