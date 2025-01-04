import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import moment from 'moment'
import axios from 'axios'
import logo from '../../../src/assets/images/logo.png'

const logoSize = {
    height: 120,
    width: 350,
}

const printThisInvoice = (invoice, iType) => {
    const win = window.open(`#/invoice/received/${invoice}/${iType}`, "_blank");
    win.focus();
}

const printImages = (invoice, iType) => {
    const win = window.open(`#/invoice/imageprint/${invoice}/${iType}`, "_blank");
    win.focus();
}

const ItemsModel = ({ invoice, show, handleClose, listType = '' }) => {
    const [modalData, setModalData] = useState(() => invoice.data)

    useEffect(() => {
        setModalData((old) => invoice.data)
    }, [invoice.inv])

    const displayItems = (items) => {
        console.log(items)
        return (
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th width="4%">Image</th>
                        <th width="10%">Code</th>
                        <th width="25%">Name</th>
                        {listType === 'damaged' ? <th width="25%">D/Type</th> : <></>}
                        <th width="5%">Qty</th>
                        <th width="10%">From</th>
                        <th width="10%">Recieved</th>
                        <th width="2%">Days</th>
                        {listType === 'damaged' ? <th width="25%">D/Cost</th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((p) => (
                        <tr key={p.product_code}>
                            <td>
                                <img src={p.product_image} width="30" height="30" />
                            </td>
                            <td>{p.product_code}</td>
                            <td>{p.product_name}</td>
                            {listType === 'damaged' ? <td>{p.damaged_type.charAt(0).toUpperCase() + p.damaged_type.slice(1)}</td> : <></>}
                            <td>{p.quantity}</td>
                            <td>{moment.utc(p.pStartDate).format('DD/MM/yyyy')}</td>
                            <td>{moment.utc(p.pEndDate).format('DD/MM/yyyy')}</td>
                            <td className="money">{p.rent_days}</td>
                            {listType === 'damaged' ? <td>{p.damage_cost}</td> : <></>}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header className="logo-color logo">
                    <div className="row">
                        <div className="col-8 logo-color columnLeft">
                            <img src={logo} style={logoSize} />
                        </div>
                        <div className="col-2 printRight">
                            <button
                                className="btn btn-primary"
                                onClick={() => printThisInvoice(invoice.inv, listType)}
                            >
                                Print
                            </button>
                        </div>
                        <div className="col-2 printRight">
                            <button
                                className="btn btn-primary"
                                onClick={() => printImages(invoice.inv, listType)}
                            >
                                Image Print
                            </button>
                        </div>
                    </div>

                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <hr />
                        <div className="row mt-4">
                            <div className="col-sm-4">
                                <strong>Invoice Number:</strong>&nbsp;&nbsp;
                                {invoice.inv}
                            </div>
                            <div className="col-sm-4">
                                <strong>From:</strong>&nbsp;&nbsp;
                                {moment.utc(invoice.data[0].startDate).format('dddd - MMM Do, YYYY')}
                            </div>
                            <div className="col-sm-4">
                                <strong>To:</strong>&nbsp;&nbsp;
                                {moment.utc(invoice.data[0].endDate).format('dddd - MMM Do, YYYY')}
                            </div>
                        </div>
                        <div>
                            <div className="row mt-4">
                                <div className="col-sm-6">
                                    <strong>M/s</strong>&nbsp;&nbsp;
                                    <span className="border-bottom">{invoice.data[0].to_name ? invoice.data[0].to_name : ''}</span>
                                </div>

                                <div className="col-sm-6">
                                    <strong>Location</strong>&nbsp;&nbsp;
                                    <span className="border-bottom">{invoice.data[0].to_address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-5">
                            {displayItems(modalData)}
                        </div>
                        <hr />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ItemsModel