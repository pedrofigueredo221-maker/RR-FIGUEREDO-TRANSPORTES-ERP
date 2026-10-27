export default function EmptyState({ message = 'Nenhum registro encontrado.' }) {
  return <div className="empty-state">{message}</div>;
}
