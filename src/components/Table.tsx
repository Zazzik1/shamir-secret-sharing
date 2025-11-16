import styled from '@emotion/styled';

const TableWrapper = styled.table`
    border-collapse: collapse;
    border: 1px solid rgb(59, 32, 32);
    td,
    th {
        padding: 4px 6px;
    }
    th {
        border-bottom: 1px solid rgb(59, 32, 32);
        background-color: rgb(24, 13, 13);
    }
    tr:nth-of-type(2n) {
        background-color: rgb(24, 13, 13);
    }
    tr:not(:last-child) td {
        min-width: 50px;
        border-bottom: 1px solid rgb(59, 32, 32);
    }
    tr:hover td {
        background-color: rgb(25, 36, 20);
    }
`;

export type CellContent = string | number | null | undefined;

export type TableProps<T extends Record<string, CellContent>> = {
    schema: {
        key: keyof T;
        label: string;
        align?: 'left' | 'right' | 'center';
    }[];
    data: T[];
};

const Table = <T extends Record<string, CellContent>>({
    schema,
    data,
}: TableProps<T>) => {
    return (
        <TableWrapper>
            <thead>
                <tr>
                    {schema.map((cell, id) => (
                        <th
                            key={id}
                            style={{ textAlign: cell.align ?? 'left' }}
                        >
                            {cell.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowId) => (
                    <tr key={rowId}>
                        {schema.map((cell, cellId) => (
                            <td
                                key={cellId}
                                style={{ textAlign: cell.align ?? 'left' }}
                            >
                                {row[cell.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </TableWrapper>
    );
};

export default Table;
