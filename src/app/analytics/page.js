'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '../../components/Navbar'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Truck, 
  Package,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    ingresosPorMes: [],
    transportesPorEstado: [],
    clientesTop: [],
    vehiculosUtilizacion: [],
    tendenciasIngresos: []
  })

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  useEffect(() => {
    if (session) {
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    try {
      const [clientesRes, vehiculosRes, transportesRes] = await Promise.all([
        fetch('/api/clientes'),
        fetch('/api/vehiculos'),
        fetch('/api/transportes')
      ])

      const clientes = await clientesRes.json()
      const vehiculos = await vehiculosRes.json()
      const transportes = await transportesRes.json()

      // Analizar datos
      const ingresosPorMes = analizarIngresosPorMes(transportes)
      const transportesPorEstado = analizarTransportesPorEstado(transportes)
      const clientesTop = analizarClientesTop(transportes, clientes)
      const vehiculosUtilizacion = analizarVehiculosUtilizacion(transportes, vehiculos)
      const tendenciasIngresos = analizarTendenciasIngresos(transportes)

      setAnalytics({
        ingresosPorMes,
        transportesPorEstado,
        clientesTop,
        vehiculosUtilizacion,
        tendenciasIngresos
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const analizarIngresosPorMes = (transportes) => {
    const ingresosPorMes = {}
    
    transportes.forEach(transporte => {
      const fecha = new Date(transporte.fecha)
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      
      if (!ingresosPorMes[mesAno]) {
        ingresosPorMes[mesAno] = 0
      }
      
      ingresosPorMes[mesAno] += parseFloat(transporte.total || 0)
    })

    return Object.entries(ingresosPorMes)
      .map(([mes, ingresos]) => ({
        mes,
        ingresos: Math.round(ingresos)
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6) // Últimos 6 meses
  }

  const analizarTransportesPorEstado = (transportes) => {
    const estadoCounts = {}
    
    transportes.forEach(transporte => {
      const estado = transporte.estado || 'Sin Estado'
      estadoCounts[estado] = (estadoCounts[estado] || 0) + 1
    })

    return Object.entries(estadoCounts).map(([estado, cantidad]) => ({
      name: estado,
      value: cantidad
    }))
  }

  const analizarClientesTop = (transportes, clientes) => {
    const clienteStats = {}
    
    transportes.forEach(transporte => {
      const clienteId = transporte.ID_cliente
      if (!clienteStats[clienteId]) {
        const cliente = clientes.find(c => c.id === clienteId)
        clienteStats[clienteId] = {
          nombre: cliente?.nombre || 'Cliente Desconocido',
          transportes: 0,
          ingresos: 0
        }
      }
      
      clienteStats[clienteId].transportes += 1
      clienteStats[clienteId].ingresos += parseFloat(transporte.total || 0)
    })

    return Object.values(clienteStats)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5)
      .map(cliente => ({
        ...cliente,
        ingresos: Math.round(cliente.ingresos)
      }))
  }

  const analizarVehiculosUtilizacion = (transportes, vehiculos) => {
    const vehiculoStats = {}
    
    transportes.forEach(transporte => {
      const vehiculoId = transporte.ID_placa
      if (!vehiculoStats[vehiculoId]) {
        const vehiculo = vehiculos.find(v => v.id === vehiculoId)
        vehiculoStats[vehiculoId] = {
          placa: vehiculo?.placa || 'Vehículo Desconocido',
          tipo: vehiculo?.tipo_vehiculo || 'N/A',
          usos: 0
        }
      }
      
      vehiculoStats[vehiculoId].usos += 1
    })

    return Object.values(vehiculoStats)
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 8)
  }

  const analizarTendenciasIngresos = (transportes) => {
    const ultimosSieteDias = []
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date()
      fecha.setDate(fecha.getDate() - i)
      const fechaStr = fecha.toISOString().split('T')[0]
      
      const ingresosDia = transportes
        .filter(t => t.fecha.startsWith(fechaStr))
        .reduce((sum, t) => sum + parseFloat(t.total || 0), 0)
      
      ultimosSieteDias.push({
        fecha: fecha.toLocaleDateString('es-CO', { weekday: 'short' }),
        ingresos: Math.round(ingresosDia)
      })
    }
    
    return ultimosSieteDias
  }

  if (!session) return null

  if (loading) {
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
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-indigo-600" />
            Análisis y Estadísticas
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Dashboard analítico con métricas del negocio
          </p>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ingresos por mes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Ingresos por Mes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ingresosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString('es-CO')}`, 'Ingresos']} />
                <Bar dataKey="ingresos" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transportes por estado */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-green-600" />
              Transportes por Estado
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.transportesPorEstado}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.transportesPorEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendencia de ingresos últimos 7 días */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Tendencia de Ingresos - Últimos 7 Días
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.tendenciasIngresos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString('es-CO')}`, 'Ingresos']} />
              <Area type="monotone" dataKey="ingresos" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top clientes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-yellow-600" />
              Top 5 Clientes por Ingresos
            </h3>
            <div className="space-y-3">
              {analytics.clientesTop.map((cliente, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                    <div className="text-xs text-gray-500">{cliente.transportes} transportes</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    ${cliente.ingresos.toLocaleString('es-CO')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Utilización de vehículos */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-red-600" />
              Utilización de Vehículos
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.vehiculosUtilizacion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="placa" type="category" width={80} />
                <Tooltip formatter={(value) => [value, 'Usos']} />
                <Bar dataKey="usos" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
