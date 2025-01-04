import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import moment from 'moment'
require('dotenv').config()
import logo from '../../../src/assets/images/logop.png'
var converter = require('number-to-words');

const InvoicePrint = (props) => {
    const [id, setId] = useState(props.match.params.id)
    const [payments, setPayments] = useState([])

    // const [pm, setpm] = useState(() => invoice.payableamount)
    // const [tm, settm] = useState(() => invoice.data.reduce((a, b) => a + b.cost, 0).toFixed(2))

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

    const camelCase = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        });
    }

    const inWords = (num) => {
        let n = num.split('.');
        let r = camelCase(converter.toWords(n[0]))
        let p = camelCase(converter.toWords(n[1]))
        r = r.charAt(0).toUpperCase() + r.slice(1);
        p = p.charAt(0).toUpperCase() + p.slice(1);
        return `${r} and ${p} Paise`;
    }

    const getDetails = async id => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/payments`)
            .then(async (response) => {
                setPayments(response.data)
            })
        await axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/${id}/details`)
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
                                    <th width="20%">{payments[0].amount ? 'Invoice' : 'Quotation'} Number:</th>
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
                                {/* <tr>
                                    <th>Art Director:</th>
                                    <td colSpan="2">{invoiceDetails.data[0].art_director_name}</td>
                                    <th>Hero/Director:</th>
                                    <td colSpan="2">{invoiceDetails.data[0].name}({invoiceDetails.data[0].herodirector})</td>
                                </tr>
                                <tr>
                                    <th>Contact Name / Phone:</th>
                                    <td colSpan="2">{invoiceDetails.data[0].contactName} / {invoiceDetails.data[0].contactPhone}</td>
                                    <th>Received By / Phone:</th>
                                    <td colSpan="2">{invoiceDetails.data[0].prop_receiver_name}({invoiceDetails.data[0].prop_receiver}) / {invoiceDetails.data[0].art_phone}</td>
                                </tr> */}
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
                                        <th width="10%" className="money">Hire Cost</th>
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
                                            <td className="money">{p.cost.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <hr />
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <td colSpan="2">
                                            {inWords((invoiceDetails.payableamount / 1).toFixed(2))}
                                        </td>
                                        <td className="money">
                                            <strong>Cost</strong>
                                        </td>
                                        <td className="money">
                                            {invoiceDetails.data.reduce((a, b) => a + b.cost, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                    <tr>

                                        <td className="">
                                            <strong>Discount&nbsp;:&nbsp;</strong>
                                            {invoiceDetails.data[0].discount} %
                                        </td>
                                        <td className="">
                                            <strong>GST&nbsp;:&nbsp;</strong>
                                            {invoiceDetails.data[0].gstpercentage} %
                                        </td>
                                        <td className="money">
                                            <strong>Payable Amount</strong>
                                        </td>
                                        <td className="money">{invoiceDetails.payableamount}</td>

                                    </tr>

                                    <tr>
                                        <td className="money" colSpan={3}>
                                            <strong>Total Paid till now</strong>
                                        </td>
                                        <td className="money">{payments.reduce((a, b) => a + b.amount, 0).toFixed(2)}</td>

                                    </tr>
                                    <tr>
                                        <td className="money" colSpan={3}>
                                            <strong>Remaining / Refund</strong>
                                        </td>
                                        <td className="money">
                                            {(invoiceDetails.payableamount -
                                                payments.reduce((a, b) => a + b.amount, 0)).toFixed(2)}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                            {
                                payments[0].amount
                                    ?
                                    <div className="row mt-5">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Payment Type</th>
                                                    <th>Payment Method</th>
                                                    <th>Transaction Id</th>
                                                    <th>Amount</th>
                                                    <th>Paid On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map((p, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{p.paidby}</td>
                                                        <td>
                                                            {p.method}
                                                            {p.method == 'cheque' ? (
                                                                <span>
                                                                    &nbsp; / {p.cheque_no} / {p.bank}{' '}
                                                                </span>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </td>
                                                        <td>{p.transaction_id}</td>
                                                        <td>{p.amount}</td>
                                                        <td>{moment.utc(p.paid_on).format('DD/MM/yyyy')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </>)
                :
                (<>Printing in process... </>)
            }
        </>
    )
}




export default InvoicePrint;