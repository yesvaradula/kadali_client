import React from 'react';
import moment from 'moment'

const PrintImagesScreen = ({ id, records }) => {
    console.log(records)
    let j = 0;
    const loadData = (p) => {
        return (
            <>
                <div className="row">
                    <div className="text-center">
                        <img src={p.image} height="120px" width="100px" />
                    </div>
                    <div className="text-center fw800">{p.hashcode} ({p.quantity})</div>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="row">
                <table className="table printtable">
                    <tr>
                        <td className="alignLeft">{records[0].type === 'draft' ? 'Quotation ' : 'Invoice '}  Number: {id}</td>
                        <td className="alignright">Date: {moment.utc(records[0].pStartDate).format('dddd - MMM Do, YYYY')}</td>
                    </tr>
                </table>
                <table className="table printtable">
                    {
                        records.map((p, i) => {
                            j = i + 1;
                            return (j % 5 == 0) ?
                                <><td>{loadData(p)}</td><tr></tr></>
                                : <><td>{loadData(p)}</td></>

                        })
                    }
                </table>
            </div>
        </>
    )
}

export default PrintImagesScreen