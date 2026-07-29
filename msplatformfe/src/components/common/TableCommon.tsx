import { TableProps } from "../../types/type"

export function TableCommon<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "Nessun dato trovato.",
    className = "",
    tableClassName = "",
    colWidths
}: TableProps<T>) {
    return (
        <div className={`overflow-x-auto ${className}`.trim()}>
            <table className={`min-w-full divide-y divide-gray-200 border border-gray-300 ${tableClassName}`.trim()}>
                {colWidths && (
                    <colgroup>
                        {colWidths.map((w, i) => (
                            <col key={i} style={{ width: w }} />
                        ))}
                    </colgroup>
                )}
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300 ${
                                    col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                                }`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <tr key={keyExtractor(item)}>
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 text-sm border-b border-gray-200 break-words ${
                                            col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                                        }`}>
                                        {col.render(item)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-6 text-center text-sm text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
