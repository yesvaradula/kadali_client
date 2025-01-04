import React, { useEffect, useState, useReducer } from 'react'
import { useHistory, Link } from 'react-router-dom'
import moment from 'moment'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import ItemsModel from './ItemsModel'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import NoDataComponent from '../common/NoDataComponent'
import Loader from '../common/loading'
import { cilDelete, cilFlipToBack } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const RetList = ({ type }) => {

    const [show, setShow] = useState(() => false)
    const handleClose = () => setShow(() => false)
    const handleShow = () => setShow(() => true)

    const ACTIONS = {
        ADD_NEW: 'new',
        UPDATE_ADDRESS: 'address',
        RESET: 'reset',
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case ACTIONS.ADD_NEW: {
                let toaddress = action.payload.data[0].to_name
                    ? action.payload.data[0].to_name + ' - ' + action.payload.data[0].to_city
                    : ''

                return {
                    ...state,
                    inv: action.payload.inv,
                    to_details: toaddress,
                    toName: action.payload.data[0].to_name ? action.payload.data[0].to_name : '',
                    city: action.payload.data[0].to_city,
                    address: action.payload.data[0].to_address,
                    gst: action.payload.data[0].gst,
                    dated: action.payload.data[0].rents_start_on,
                    data: action.payload.data,
                    status: action.payload.data[0].is_value,
                    payment: action.payload.data[0].ip_value,
                    discount: action.payload.data[0].discount,
                    gstpercentage: action.payload.data[0].gstpercentage,
                    payableamount: action.payload.data[0].payableamount,
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

    const [state, setState] = useState(() => ({
        isLoaded: false,
        loading: true,
        inventory: []
    }))

    const getList = async (isArchieved = 0) => {
        isArchieved ? setArchieved(true) : setArchieved(false)
        let listOfInvoices = await axios.post(`${process.env.REACT_APP_API_URL}/invoice/return/list`, {
            type: type ? type : '',
            is_archieved: isArchieved
        })
        setState((p) => ({
            ...p,
            isLoaded: true, inventory: listOfInvoices.data, loading: false
        }))
    }

    const getDetail = (invoice) => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/invoice/return/${invoice}/${type}`)
            .then(async (response) => {
                dispatch({ type: ACTIONS.ADD_NEW, payload: { data: response.data, inv: invoice } })
                handleShow()
            })
    }

    useEffect(() => {
        getList()
    }, [state.isLoaded])

    const archieveInv = (inv, iType, doArchieve) => {
        let payLoad = {
            invoice: inv,
            iType: iType,
            archieve: doArchieve
        }
        axios
            .post(`${process.env.REACT_APP_API_URL}/invoice/archieve`, payLoad)
            .then(async (response) => {
                getList(!doArchieve)
            })
    }

    const [archieved, setArchieved] = useState(false)


    const display = inventory => {
        return (
            <>
                <table className="table table-stripped">
                    <thead>
                        <th>S.No</th>
                        <th>Invoice Number</th>
                        <th>Quoted To</th>
                        <th>Address</th>
                        <th>Content</th>
                        <th>Contact Name</th>
                        <th>Product(s)</th>
                        <th>
                            {
                                type === 'pending' ? 'Ordered' : type.charAt(0).toUpperCase() + type.slice(1)
                            } Date
                        </th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        {
                            inventory.length ?
                                inventory.map((inv, index) => {
                                    return (<tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Link
                                                to="#"
                                                path="#"
                                                onClick={() => getDetail(inv.invoice)}>
                                                {inv.invoice}
                                            </Link>
                                        </td>
                                        <td>{inv.to_name}</td>
                                        <td>{inv.to_address}</td>
                                        <td>{inv.content_type}</td>
                                        <td>{inv.contactname}</td>
                                        <td>{inv.totalProducts}</td>
                                        <td>
                                            {
                                                type === 'pending'
                                                    ?
                                                    moment.utc(inv.fromDate).format('DD/MM/yyyy')
                                                    :
                                                    moment.utc(inv.returned_date).format('DD/MM/yyyy')
                                            }
                                        </td>
                                        <td>
                                            {
                                                !archieved ?
                                                    <Link title="Archieve Invoice" to="#" path="#"
                                                        onClick={() => archieveInv(inv.invoice, type, 1)}>
                                                        <CIcon icon={cilDelete} className="cricon" />
                                                    </Link>
                                                    :
                                                    <Link title="Active Invoice" to="#" path="#" onClick={() => archieveInv(inv.invoice, type, 0)}>
                                                        <CIcon icon={cilFlipToBack} className="cricon" />
                                                    </Link>
                                            }

                                        </td>
                                    </tr>)
                                })
                                : <tr><td colSpan="8"><NoDataComponent /></td></tr>
                        }
                    </tbody>
                </table>
            </>
        )
    }
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <CRow className="align-middle p-2">
                                <div className="col-sm-9">
                                    <h4>
                                        {
                                            type.charAt(0).toUpperCase() + type.slice(1)
                                        }
                                        &nbsp;List
                                        {
                                            archieved ? <>(Archieved)</> : <>(Active)</>
                                        }
                                    </h4>
                                </div>
                                <div className="col-sm-3" style={{ 'text-align': 'right' }}>
                                    {
                                        archieved ?
                                            <button className="btn btn-primary"
                                                onClick={() => getList()}
                                            >View Active
                                            </button> :
                                            <button className="btn btn-secondary"
                                                onClick={() => getList(1)}
                                            >View Archieved
                                            </button>
                                    }

                                </div>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            {
                                state.loading && !state.isLoaded ?
                                    <Loader />
                                    :
                                    state.inventory.length ?
                                        <div>
                                            {display(state.inventory)}
                                        </div>
                                        :
                                        <div>
                                            <NoDataComponent />

                                        </div>
                            }
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CRow>

                {invoiceDetails.data[0] != undefined ? (
                    <ItemsModel
                        invoice={invoiceDetails}
                        show={show}
                        handleClose={handleClose}
                        listType={type}
                    />
                ) : (
                    <></>
                )}
            </CRow>
        </div >
    )
}

export default RetList