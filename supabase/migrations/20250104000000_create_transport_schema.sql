/*
# Creación del esquema completo para sistema de gestión de transportes

Migración que crea todas las tablas necesarias para el sistema de gestión de transportes,
incluyendo usuarios, clientes, vehículos y transportes con sus relaciones correspondientes.

## Query Description: 
Esta operación creará la estructura completa de la base de datos desde cero.
Es una operación segura que no afecta datos existentes ya que crea tablas nuevas.
Se incluyen índices para mejorar el rendimiento de consultas frecuentes.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabla usuarios: autenticación y acceso al sistema
- Tabla clientes: información de clientes del negocio
- Tabla vehiculos: flota de vehículos disponibles
- Tabla transportes: registro de servicios de transporte

## Security Implications:
- RLS Status: Enabled en todas las tablas
- Policy Changes: Yes
- Auth Requirements: Todas las operaciones requieren autenticación

## Performance Impact:
- Indexes: Se crean índices en campos de búsqueda frecuente
- Triggers: Ninguno
- Estimated Impact: Mínimo impacto, base de datos nueva
*/

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(255) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(20) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    dueño VARCHAR(255) NOT NULL,
    peso_placa DECIMAL(10,2) NOT NULL,
    tipo_vehiculo VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla transportes
CREATE TABLE IF NOT EXISTS transportes (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    id_placa INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE RESTRICT,
    id_cliente INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    condicion VARCHAR(100) NOT NULL,
    zona VARCHAR(100) NOT NULL,
    valor_referencial DECIMAL(12,2) NOT NULL,
    bultos INTEGER NOT NULL,
    peso DECIMAL(10,2) NOT NULL,
    zona_referencial VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    num_factura VARCHAR(100) NOT NULL,
    flete DECIMAL(12,2) NOT NULL,
    igv DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    vrp DECIMAL(12,2) NOT NULL,
    sp DECIMAL(12,2) NOT NULL,
    fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
    cancelado BOOLEAN DEFAULT FALSE,
    observacion TEXT,
    num_detraccion VARCHAR(100),
    pago_detraccion VARCHAR(100),
    fecha_pago_detraccion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_transportes_fecha ON transportes(fecha);
CREATE INDEX IF NOT EXISTS idx_transportes_cliente ON transportes(id_cliente);
CREATE INDEX IF NOT EXISTS idx_transportes_vehiculo ON transportes(id_placa);
CREATE INDEX IF NOT EXISTS idx_transportes_estado ON transportes(estado);
CREATE INDEX IF NOT EXISTS idx_clientes_ruc ON clientes(ruc);
CREATE INDEX IF NOT EXISTS idx_vehiculos_placa ON vehiculos(placa);

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportes ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para usuarios autenticados
CREATE POLICY "Permitir todas las operaciones para usuarios autenticados en usuarios" ON usuarios
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas las operaciones para usuarios autenticados en clientes" ON clientes
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas las operaciones para usuarios autenticados en vehiculos" ON vehiculos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir todas las operaciones para usuarios autenticados en transportes" ON transportes
    FOR ALL USING (auth.role() = 'authenticated');
