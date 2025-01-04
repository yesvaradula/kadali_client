import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import moment from 'moment'
require('dotenv').config()
import logo from '../../../src/assets/images/logop.png'
var converter = require('number-to-words');

const ReturnPrint = (props) => {
    const [id, setId] = useState(props.match.params.id)
    const envType = props.match.params.type

    const reducer = (state, action) => {
        switch (action.type) {
            case 'new': {
                let toaddress = action.payload.data[0].to_name
                    ? action.payload.data[0].to_name + ' - ' + action.payload.data[0].to_city
                    : ''

                return {
                    ...state,
                    inv: action.payload.inv,
                    to_details: toaddress,
                    toName: action.payload.data[0].to_name,
                    city: action.payload.data[0].to_city,
                    address: action.payload.data[0].to_address,
                    gst: action.payload.data[0].gst,
                    dated: action.payload.data[0].rents_start_on,
                    data: action.payload.data,
                    status: action.payload.data[0].is_value,
                    payment: action.payload.data[0].ip_value,
                    discount: action.payload.data[0].discount,
                    gstpercentage: action.payload.data[0].gstpercentage,
                    vendoraddress: action.payload.data[0].vendoraddress,
                    finalamount: action.payload.data[0].finalamount,
                    payableamount: action.payload.data[0].payableamount
                }
            }
        }
    }

    const [invoiceDetails, dispatch] = useReducer(reducer, {
        inv: '',
        to_details: '',
        toName: '',
        city: '',
        address: '',
        status: '',
        payment: '',
        gst: '',
        dated: '',
        data: [],
    })

    const thisPage = {
        width: '1100px',
        margin: 'auto',
        // marginTop: '200px'
    }
    const logoSize = {
        height: 120,
        width: 350,
    }

    const styles = {
        margin: 'auto'
    }

    const inWords = (num) => {
        let n = num.split('.');
        let r = converter.toWords(n[0])
        let p = converter.toWords(n[1])
        return `${r} and ${p} paise`;
    }

    const getDetails = async id => {

        await axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/return/${id}/${envType}`)
            .then(response => {
                dispatch({ type: 'new', payload: { data: response.data, inv: id } })
            })

    }

    useEffect(async () => {
        await getDetails(id)
        setTimeout(() => {
            window.print()
        }, 3000);
    }, [id])

    const replaceCommaLine = (data) => {
        return data.split(',').map(item => item.trim());
    }

    return (
        <>
            {invoiceDetails.data[0] != undefined ?
                (<>
                    <div className="printdiv mragin-auto" style={thisPage}>
                        <div className="row">
                            {/* <div className="col-3 logo-color"></div> */}
                            <div className="col-6 logo-color" style={styles}>
                                <img src={logo} style={logoSize} />
                            </div>
                            <div className="col-6 logo-color"></div>
                        </div>
                        <div className="row align-center tblheader">
                            <table className="table printtable">
                                <tr>
                                    <th width="20%">Invoice Number:</th>
                                    <td width="15%">{invoiceDetails.data[0].invoice_id}</td>
                                    <th width="10%">From:</th>
                                    <td width="20%">{moment.utc(invoiceDetails.data[0].pStartDate).format('dddd - MMM Do, YYYY')}</td>
                                    <th width="10%">To:</th>
                                    <td width="20%">{moment.utc(invoiceDetails.data[0].pEndDate).format('dddd - MMM Do, YYYY')}</td>
                                </tr>
                                <tr>
                                    <th>M/S:</th>
                                    <td>{invoiceDetails.data[0].to_name ? invoiceDetails.data[0].to_name : ''}</td>
                                    <th>Location:</th>
                                    <td>{invoiceDetails.data[0].to_address}</td>
                                    <th>Content:</th>
                                    <td>{invoiceDetails.data[0].content_type}</td>
                                </tr>

                            </table>
                        </div>
                        <hr />
                        <div>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th width="10%">Code</th>
                                        <th width="25%">Name</th>
                                        <th width="5%">Qty</th>
                                        <th width="10%">From</th>
                                        <th width="10%">To</th>
                                        <th width="2%">Days</th>
                                        {
                                            (envType === 'damaged') ?
                                                <th width="10%" className="money">Hire Cost</th> :
                                                <></>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceDetails.data.map((p) => (
                                        <tr key={p.product_code}>
                                            <td>{p.product_hashcode}</td>
                                            <td>{p.product_name}</td>
                                            <td>{p.quantity}</td>
                                            <td>{moment.utc(p.pStartDate).format('DD/MM/yyyy')}</td>
                                            <td>{moment.utc(p.pEndDate).format('DD/MM/yyyy')}</td>
                                            <td className="money">{p.rent_days}</td>
                                            {
                                                (envType === 'damaged') ?
                                                    <td className="money">{p.damage_cost}</td>
                                                    :
                                                    <></>
                                            }
                                            {/*  */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr />
                        </div>
                    </div>
                </>)
                :
                (<>Printing in process... </>)
            }
        </>
    )
}




export default ReturnPrint;