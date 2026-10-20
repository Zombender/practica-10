export default function SolicitudCard({ titulo, prioridad, estado }) {
    return (
        <article>
            <h3>{titulo}</h3>
            <p>Prioridad: {prioridad}</p>
            <p>Estado: {estado}</p>
        </article>
    )
}