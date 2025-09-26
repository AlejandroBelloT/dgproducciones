"use client";
export default function Table({ columns, data, rowKey = 'id', actions }) {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left border-b border-neutral-200">
                        {columns.map((col) => (
                            <th key={col.key} className="py-2 px-3 font-medium text-neutral-600">
                                {col.header}
                            </th>
                        ))}
                        {actions ? <th className="py-2 px-3" /> : null}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row[rowKey]} className="border-b border-neutral-100 hover:bg-neutral-50">
                            {columns.map((col) => (
                                <td key={col.key} className="py-2 px-3 align-top">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {actions ? <td className="py-2 px-3 text-right">{actions(row)}</td> : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
