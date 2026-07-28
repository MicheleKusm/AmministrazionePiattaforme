import { TableProps } from "../../types/type"

export function TableCommon<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "Nessun dato trovato.",
    className = "",
    tableClassName = ""
}: TableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <tr>
                <td
                    colSpan={columns.length}
                    className="px-6 py-6 text-center text-sm text-500">
                    {emptyMessage}
                </td>
            </tr>
        )
    }
    return (
        <div className={`overflow-x-auto ${className}`.trim()}>
            <table className={`min-w-full divide-y divide-gray-200 border border-gray-300 ${tableClassName}`.trim()}>
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)}>
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 text-sm border-b border-gray-200 break-words">
                                    {col.render(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
