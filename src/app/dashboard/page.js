'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import { 
  Users, 
  Truck, 
  Package, 
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalVehiculos: 0,
    totalTransportes: 0,
    ingresosMes: 0,
    transportesPendientes: 0,
    transportesHoy: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const [clientesRes, vehiculosRes, transportesRes] = await Promise.all([
        fetch('/api/clientes'),
        fetch('/api/vehiculos'),
        fetch('/api/transportes')
      ])

      const clientes = await clientesRes.json()
      const vehiculos = await vehiculosRes.json()
      const transportes = await transportesRes.json()

      const today = new Date().toISOString().split('T')[0]
      const thisMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0')

      const transportesHoy = transportes.filter(t => 
        t.fecha.startsWith(today)
      ).length

      const transportesMes = transportes.filter(t => 
        t.fecha.startsWith(thisMonth)
      )

      const ingresosMes = transportesMes.reduce((sum, t) => sum + parseFloat(t.total || 0), 0)
      
      const transportesPendientes = transportes.filter(t => 
        t.estado === 'Pendiente' || t.estado === 'En Proceso'
      ).length

      setStats({
        totalClientes: clientes.length,
        totalVehiculos: vehiculos.length,
        totalTransportes: transportes.length,
        ingresosMes,
        transportesPendientes,
        transportesHoy
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return <div>Cargando...</div>
  if (!session) return null

  const statCards = [
    {
      title: 'Total Clientes',
      value: stats.totalClientes,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Vehículos',
      value: stats.totalVehiculos,
      icon: Truck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Transportes',
      value: stats.totalTransportes,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.ingresosMes.toLocaleString('es-CO')}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Transportes Hoy',
      value: stats.transportesHoy,
      icon: Calendar,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Transportes Pendientes',
      value: stats.transportesPendientes,
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Resumen general del sistema de gestión de transportes
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div key={index} className={`card ${card.bgColor}`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm text-gray-700">
                  Sistema funcionando correctamente
                </span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm text-gray-700">
                  {stats.transportesHoy} transportes registrados hoy
                </span>
              </div>
              {stats.transportesPendientes > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-gray-700">
                    {stats.transportesPendientes} transportes pendientes de atención
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <a
                href="/transportes/nuevo"
                className="block w-full btn-primary text-center"
              >
                Nuevo Transporte
              </a>
              <a
                href="/clientes/nuevo"
                className="block w-full btn-secondary text-center"
              >
                Nuevo Cliente
              </a>
              <a
                href="/vehiculos/nuevo"
                className="block w-full btn-secondary text-center"
              >
                Nuevo Vehículo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
