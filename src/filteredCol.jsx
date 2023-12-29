import React, { useState } from "react";

const res = [
    {
        Created_date: "2022-12-07 6:49:14",
        Updated_date: "2022-12-07 6:50:33",
        is_delete: "0",
        status: "Active",
        _id: "6390376a31254d58c9b66b32",
        company_id: "637c759a1cd62e42a99f36a0",
        unit: "kg",
        __v: 0
    },
]

const StatusCom = () => {
    return (
        <div>com</div>
    )
}

const Column = () => {
    const [tableCols, setTableCols] = useState([
        {
            id: 1,
            label: 'Unit Name',
            key: 'unit',
            active: true,
        },
        {
            id: 2,
            label: 'Status',
            key: 'status',
            active: true,
        },
        {
            id: 3,
            label: 'Deleted',
            component: <StatusCom />,
            active: true,
        },
    ]);

    const filteredCol = tableCols.filter((col) => col.active);

    function toogleCheck(id) {
        const temp = tableCols.map((col) => {
            if (col.id === id) {
                return {
                    ...col,
                    active: !col.active,
                };
            }
            return col;
        });
        setTableCols(temp);
    }


    return (
        <>
            <div>
                {tableCols.map((col, i) => (
                    <>
                        {col.label}
                        <button onClick={() => toogleCheck(col.id)}>
                            {col.active ? 'uncheck' : 'check'}
                        </button>
                    </>
                ))}
            </div>
            <br />
            <br />
            <table border={2} cellPadding={10}>
                <tr>
                    {filteredCol.map((col, i) => {
                        return <th>{col.label}</th>;
                    })}
                </tr>
                {res.map((unit, i) => (
                    <tr>
                        {filteredCol.map((col, i) => {
                            return col.key ? <td>{unit[col.key]}</td> : col.component
                        })}
                    </tr>
                ))}
            </table>
        </>
    );
};

export default Column;