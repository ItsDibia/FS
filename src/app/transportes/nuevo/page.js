'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '../../../components/Navbar'
import { Save, ArrowLeft, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function NuevoTransportePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    origen: '',
    destino: '',
    ID_placa: '',
    ID_cliente: '',
    condicion: '',
    zona: '',
    valor_referencial: '',
    bultos: '',
    peso: '',
    zona_referencial: '',
    estado: 'Pendiente',
    destinatario: '',
    num_factura: '',
    flete: '',
    igv: '',
    total: '',
    vrp: '',
    sp: '',
    fecha_vencimiento: '',
    observacion: '',
    num_detraccion: '',
    pago_detraccion: '',
    fecha_pago_detraccion: ''
  })

  const estadosTransporte = [
    'Pendiente',
    'En Proceso',
    'Completado',
    'Cancelado'
  ]

  const condicionesTransporte = [
    'Normal',
    'Urgente',
    'Frágil',
    'Refrigerado'
  ]

  useEffect(() => {
    fetchClientes()
    fetchVehiculos()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchVehiculos = async () => {
    try {
      const response = await fetch('/api/vehiculos')
      const data = await response.json()
      setVehiculos(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const calcularTotal = () => {
    const flete = parseFloat(formData.flete) || 0
    const igv = parseFloat(formData.igv) || 0
    const total = flete + igv
    setFormData(prev => ({ ...prev, total: total.toString() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        ID_placa: parseInt(formData.ID_placa),
        ID_cliente: parseInt(formData.ID_cliente),
        valor_referencial: parseFloat(formData.valor_referencial) || 0,
        bultos: parseInt(formData.bultos) || 0,
        peso: parseFloat(formData.peso) || 0,
        flete: parseFloat(formData.flete) || 0,
        igv: parseFloat(formData.igv) || 0,
        total: parseFloat(formData.total) || 0,
        vrp: parseFloat(formData.vrp) || 0,
        sp: parseFloat(formData.sp) || 0
      }

      const response = await fetch('/api/transportes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      })

      if (response.ok) {
        router.push('/transportes')
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
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/transportes"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Transportes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Transporte</h1>
          <p className="mt-1 text-sm text-gray-600">
            Registra un nuevo servicio de transporte
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    required
                    value={formData.fecha}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label htmlFor="ID_cliente" className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    id="ID_cliente"
                    name="ID_cliente"
                    required
                    value={formData.ID_cliente}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="origen" className="block text-sm font-medium text-gray-700 mb-1">
                    Origen *
                  </label>
                  <input
                    type="text"
                    id="origen"
                    name="origen"
                    required
                    value={formData.origen}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ciudad de origen"
                  />
                </div>

                <div>
                  <label htmlFor="destino" className="block text-sm font-medium text-gray-700 mb-1">
                    Destino *
                  </label>
                  <input
                    type="text"
                    id="destino"
                    name="destino"
                    required
                    value={formData.destino}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ciudad de destino"
                  />
                </div>

                <div>
                  <label htmlFor="ID_placa" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehículo *
                  </label>
                  <select
                    id="ID_placa"
                    name="ID_placa"
                    required
                    value={formData.ID_placa}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Selecciona un vehículo</option>
                    {vehiculos.map((vehiculo) => (
                      <option key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.placa} - {vehiculo.tipo_vehiculo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    required
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {estadosTransporte.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Detalles del Envío */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles del Envío</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="condicion" className="block text-sm font-medium text-gray-700 mb-1">
                    Condición
                  </label>
                  <select
                    id="condicion"
                    name="condicion"
                    value={formData.condicion}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Selecciona condición</option>
                    {condicionesTransporte.map((condicion) => (
                      <option key={condicion} value={condicion}>
                        {condicion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bultos" className="block text-sm font-medium text-gray-700 mb-1">
                    Bultos
                  </label>
                  <input
                    type="number"
                    id="bultos"
                    name="bultos"
                    min="0"
                    value={formData.bultos}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Número de bultos"
                  />
                </div>

                <div>
                  <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    min="0"
                    step="0.01"
                    value={formData.peso}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="zona" className="block text-sm font-medium text-gray-700 mb-1">
                    Zona
                  </label>
                  <input
                    type="text"
                    id="zona"
                    name="zona"
                    value={formData.zona}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Zona de destino"
                  />
                </div>

                <div>
                  <label htmlFor="destinatario" className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatario
                  </label>
                  <input
                    type="text"
                    id="destinatario"
                    name="destinatario"
                    value={formData.destinatario}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nombre del destinatario"
                  />
                </div>

                <div>
                  <label htmlFor="num_factura" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Factura
                  </label>
                  <input
                    type="text"
                    id="num_factura"
                    name="num_factura"
                    value={formData.num_factura}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="F001-000001"
                  />
                </div>
              </div>
            </div>

            {/* Información Financiera */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Financiera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="flete" className="block text-sm font-medium text-gray-700 mb-1">
                    Flete
                  </label>
                  <input
                    type="number"
                    id="flete"
                    name="flete"
                    min="0"
                    step="0.01"
                    value={formData.flete}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="igv" className="block text-sm font-medium text-gray-700 mb-1">
                    IGV
                  </label>
                  <input
                    type="number"
                    id="igv"
                    name="igv"
                    min="0"
                    step="0.01"
                    value={formData.igv}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="total"
                      name="total"
                      min="0"
                      step="0.01"
                      value={formData.total}
                      onChange={handleChange}
                      className="form-input rounded-r-none"
                      placeholder="0.00"
                    />
                    <button
                      type="button"
                      onClick={calcularTotal}
                      className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                    >
                      <Calculator className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="valor_referencial" className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Referencial
                  </label>
                  <input
                    type="number"
                    id="valor_referencial"
                    name="valor_referencial"
                    min="0"
                    step="0.01"
                    value={formData.valor_referencial}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="fecha_vencimiento" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    id="fecha_vencimiento"
                    name="fecha_vencimiento"
                    value={formData.fecha_vencimiento}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label htmlFor="observacion" className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                id="observacion"
                name="observacion"
                rows={3}
                value={formData.observacion}
                onChange={handleChange}
                className="form-input"
                placeholder="Observaciones adicionales..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/transportes"
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
                {loading ? 'Guardando...' : 'Guardar Transporte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
