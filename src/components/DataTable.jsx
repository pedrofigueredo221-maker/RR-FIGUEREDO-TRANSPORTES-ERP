export function DataTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">Nenhum registro encontrado.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id ?? row.key ?? JSON.stringify(row)}>
              {columns.map((column) => (
                <td key={`${row.id ?? row.key ?? JSON.stringify(row)}-${column.key}`}>
                  {column.render ? column.render(row) : row[column.key] ?? '-' }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
