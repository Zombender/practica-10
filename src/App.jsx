import { useEffect, useState } from 'react'
import { api } from './services/api.js'

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [prioridad, setPrioridad] = useState('TODAS')
  const [estado, setEstado] = useState('TODOS')

  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      try {
        setCargando(true)
        setError('')

        const respuesta = await api.get('/solicitudes', {
          signal: controller.signal
        })

        setSolicitudes(respuesta.data)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError('No fue posible consultar las solicitudes.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargar()

    return () => controller.abort()
  }, [])

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincidePrioridad =
      prioridad === 'TODAS' ||
      solicitud.prioridad === prioridad

    const coincideEstado =
      estado === 'TODOS' ||
      solicitud.estado === estado

    return coincidePrioridad && coincideEstado
  })

  return (
    <main>
      <h1>Solicitudes desde Spring Boot</h1>

      {cargando && (
        <p role="status">Cargando solicitudes...</p>
      )}

      {error && <p role="alert">{error}</p>}

      {!cargando && !error && (
        <>
          <section aria-label="Filtros de solicitudes">
            <label htmlFor="filtro-prioridad">
              Prioridad:
            </label>

            <select
              id="filtro-prioridad"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="TODAS">Todas</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>

            <label htmlFor="filtro-estado">
              Estado:
            </label>

            <select
              id="filtro-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="APROBADA">Aprobada</option>
              <option value="RECHAZADA">Rechazada</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setPrioridad('TODAS')
                setEstado('TODOS')
              }}
            >
              Limpiar filtros
            </button>
          </section>

          <p>
            Solicitudes encontradas:{' '}
            <strong>{solicitudesFiltradas.length}</strong>
          </p>

          {solicitudesFiltradas.length === 0 ? (
            <p>No se encontraron solicitudes con esos filtros.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td>{solicitud.id}</td>
                      <td>{solicitud.titulo}</td>
                      <td>{solicitud.descripcion}</td>
                      <td>{solicitud.prioridad}</td>
                      <td>{solicitud.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Solicitudes
