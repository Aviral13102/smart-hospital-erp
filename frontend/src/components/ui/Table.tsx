interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T extends { id?: number | string }> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function Table<T extends { id?: number | string }>({
    data,
    columns,
    onRowClick,
    emptyMessage = 'No data available',
}: TableProps<T>) {
    if (data.length === 0) {
        return (
            <div
                style={{
                    padding: '48px',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)'
                }}
            >
                {emptyMessage}
            </div>
        );
    }

    return (
        <div
            style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr
                            style={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderBottom: '1px solid var(--color-border)'
                            }}
                        >
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    style={{
                                        padding: '16px 24px',
                                        textAlign: 'left',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, rowIdx) => (
                            <tr
                                key={item.id ?? rowIdx}
                                onClick={() => onRowClick?.(item)}
                                style={{
                                    borderBottom: rowIdx < data.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    transition: 'background-color 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((column, colIdx) => (
                                    <td
                                        key={colIdx}
                                        style={{
                                            padding: '16px 24px',
                                            fontSize: '14px',
                                            color: 'var(--color-text-primary)'
                                        }}
                                    >
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : String(item[column.accessor] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
