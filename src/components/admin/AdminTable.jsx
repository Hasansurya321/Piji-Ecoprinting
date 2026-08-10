function AdminTable({ columns = [], rows = [], emptyState, loading }) {
  if (loading) {
    return emptyState || null;
  }

  if (rows.length === 0) {
    return emptyState || null;
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="admin-table__head">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="admin-table__row">
              {columns.map((col) => (
                <td key={col.key} className="admin-table__cell">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
