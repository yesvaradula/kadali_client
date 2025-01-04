import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import moment from 'moment'
import axios from 'axios'

const UpdateForm = ({ invoice, show, handleClose, isInvoice, isPaid, cb }) => {
    console.log(invoice)
    const PROPRECEIVER = [
        'Production Designer',
        'Art Director',
        'Art Assistant',
        'Prop Master',
        'Set Assistant',
        'Set Boy',
        'Production Manager',
        'Production Cashier',
    ]

    const PROPTO = [
        'Movie',
        'Web Series',
        'TV Series',
        'Reality Show',
        'Commercial/Ad Film',
        'OTT Movie',
        'Short Film',
        'Documentary',
        'Pre-Wedding Event',
        'Private Event',
    ]

    let moreData = invoice.data[0];
    const [updateInv, setUpdatedInv] = useState({
        toName: invoice.toName,
        companyPhone: '',
        toAddress: invoice.address,
        contactPhone: moreData.contactPhone,
        contactName: moreData.contactName,
        artDirector: moreData.art_director_name,
        artPhone: moreData.art_phone,
        contentType: moreData.content_type,
        propReceiver: moreData.prop_receiver,
        propReceiverName: moreData.prop_receiver_name,
        gst: moreData.gst,
        showAddressForm: false,
        startDate: new Date(moreData.startDate),
        endDate: new Date(moreData.endDate),
        totalCost: moreData.totalCost,
        discount: invoice.discount,
        gstpercentage: invoice.gstpercentage,
        finalamount: invoice.finalamount,
        isWhatName: moreData.name,
        isWhat: moreData.herodirector,
        payableamount: moreData.payableamount,
        vendoraddress: moreData.vendoraddress
    })

    const DetailsPopUp = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose} size="xl">
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <div className="row">
                                <fieldset>
                                    <legend>Company details</legend>
                                    <div className="row">
                                        <div className="col-sm-1 mt-2">
                                            <label><strong>Name</strong></label>
                                        </div>
                                        <div className="col-sm-10">
                                            <input
                                                value={updateInv.toName}
                                                type="text"
                                                onChange={(e) => setUpdatedInv(prevState => ({
                                                    ...prevState, toName: e.target.value
                                                }))}
                                                className="form-control"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-1 mt-2">
                                            <label><strong>Location</strong></label>
                                        </div>
                                        <div className="col-sm-10">
                                            <input
                                                placeholder="Location"
                                                value={updateInv.toAddress}
                                                onChange={(e) => setUpdatedInv(prevState => ({
                                                    ...prevState, toAddress: e.target.value
                                                }))}
                                                className="form-control col-sm-12"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Art Director Name</strong></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input
                                                placeholder="Art Director Name"
                                                value={updateInv.artDirector}
                                                onChange={(e) => setUpdatedInv(prevState => ({
                                                    ...prevState, toAddress: e.target.value
                                                }))}
                                                className="form-control col-sm-12"
                                            />
                                        </div>
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Content Type</strong></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select
                                                value={updateInv.contentType}
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, contentType: e.target.value
                                                    }))
                                                }
                                            >
                                                <option>Select Content Type</option>
                                                {PROPTO.map((i) => (
                                                    <option value={i}>{i}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Hero / Director</strong></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <select
                                                value={updateInv.isWhat}
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, isWhat: e.target.value
                                                    }))
                                                }
                                            >
                                                <option>Hero/Director</option>
                                                <option value="hero">Hero</option>
                                                <option value="director">Director</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Name</strong></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input
                                                value={updateInv.isWhatName}
                                                type="text"
                                                onChange={(e) => setUpdatedInv(prevState => ({
                                                    ...prevState, isWhatName: e.target.value
                                                }))}
                                                className="form-control"
                                                placeholder={`${updateInv.isWhat} Name`}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-3 mt-2">
                                            <label><strong>Responsible Person Name</strong></label>
                                        </div>
                                        <div className="col-sm-4">
                                            <input
                                                value={updateInv.contactName}
                                                type="text"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, contactName: e.target.value
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Responsible Person Name"
                                            />
                                        </div>
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Phone Number</strong></label>
                                        </div>
                                        <div className="col-sm-2">
                                            <input
                                                value={updateInv.contactPhone}
                                                type="text"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, contactPhone: e.target.value
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Responsible Person Phone"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-1 mt-2">
                                            <label><strong>Receiver</strong></label>
                                        </div>
                                        <div className="col-sm-3">
                                            <input
                                                value={updateInv.propReceiverName}
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, propReceiverName: e.target.value
                                                    }))
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="Receiver Name"
                                            />
                                        </div>
                                        <div className="col-sm-3">
                                            <select
                                                value={updateInv.propReceiver}
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, propReceiver: e.target.value
                                                    }))
                                                }
                                            >
                                                <option>Select Property Receiver</option>
                                                {PROPRECEIVER.map((i) => (
                                                    <option value={i}>{i}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-sm-2 mt-2">
                                            <label><strong>Phone Number</strong></label>
                                        </div>
                                        <div className="col-sm-2">
                                            <input
                                                value={updateInv.artPhone}
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, artPhone: e.target.value
                                                    }))
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-3 mt-2">
                                            <label><strong>Company GST/TIN details</strong></label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input
                                                value={updateInv.gst}
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, gst: e.target.value
                                                    }))
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="GST/TIN"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-sm-3 mt-2">
                                            <label><strong>Vendor Address</strong></label>
                                        </div>
                                        <div className="col-sm-9">
                                            <input
                                                value={updateInv.vendoraddress}
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, vendoraddress: e.target.value
                                                    }))
                                                }
                                                type="text"
                                                className="form-control"
                                                placeholder="Vendor Address"
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Amount Details</legend>
                                    <div className="row mt-2">
                                        <div className="col-4">
                                            <input
                                                value={updateInv.totalCost}
                                                type="text"
                                                readOnly
                                                className="form-control"
                                                placeholder="Invoice Amount"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <input
                                                value={updateInv.discount}
                                                type="text"
                                                onChange={(e) => updateFinalAmount(e.target.value)}
                                                className="form-control"
                                                placeholder="Discount Percentage"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <input
                                                value={updateInv.finalamount}
                                                type="text"
                                                onChange={(e) =>
                                                    setUpdatedInv(prevState => ({
                                                        ...prevState, finalamount: e.target.value
                                                    }))
                                                }
                                                className="form-control"
                                                placeholder="Final Amount"
                                            />
                                        </div>

                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6">
                                            <input
                                                value={updateInv.gstpercentage}
                                                type="text"
                                                onChange={(e) =>
                                                    updateFinalAmountByGST(e.target.value)
                                                }
                                                className="form-control"
                                                placeholder="GST Percentage"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input
                                                value={updateInv.payableamount}
                                                type="text"
                                                readOnly
                                                className="form-control"
                                                placeholder="Final Amount"
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={updateInvoice} className="btn btn-primary">
                            Update Invoice Details
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

    const updateInvoice = () => {
        let p = {
            invoice_id: invoice.inv,
            toName: updateInv.toName,
            companyPhone: updateInv.companyPhone,
            address: updateInv.toAddress,
            contactName: updateInv.contactName,
            contactPhone: updateInv.contactPhone,
            artDirector: updateInv.artDirector,
            contentType: updateInv.contentType,
            receiver: updateInv.propReceiver,
            receiverName: updateInv.propReceiverName,
            artPhone: updateInv.artPhone,
            gst: updateInv.gst,
            startDate:
                updateInv.startDate.getFullYear() + '-' + (updateInv.startDate.getMonth() + 1) + '-' + updateInv.startDate.getDate(),
            endDate: updateInv.endDate.getFullYear() + '-' + (updateInv.endDate.getMonth() + 1) + '-' + updateInv.endDate.getDate(),
            discount: updateInv.discount,
            gstpercentage: updateInv.gstpercentage,
            finalamount: updateInv.finalamount,
            totalCost: updateInv.totalCost,
            isWhatName: updateInv.isWhatName,
            isWhat: updateInv.isWhat,
            vendoraddress: updateInv.vendoraddress,
            payableamount: updateInv.payableamount,
        }

        axios.post(`${process.env.REACT_APP_API_URL}/invoice/update`, p).then((response) => {
            handleClose()
            cb()
        });
    }

    const updateFinalAmountByGST = (e) => {
        let f = parseFloat(updateInv.finalamount);
        if (e != '') {

            e = parseInt(e)
            let gst = parseFloat(f * (e / 100))
            f = f + gst;
        }

        setUpdatedInv(prevState => ({
            ...prevState, gstpercentage: e, payableamount: f.toFixed(2)
        }))
    }

    const updateFinalAmount = (e) => {
        let f = parseFloat(updateInv.finalamount);
        let gst = 0;
        let fgst = parseFloat(updateInv.finalamount);
        if (e != '') {
            e = parseInt(e)
            let d = updateInv.totalCost * (e / 100);
            f = parseFloat(updateInv.totalCost - d);
            fgst = f;
            if (updateInv.gstpercentage > 0) {
                gst = parseFloat(f * (updateInv.gstpercentage / 100))
                fgst = f + gst;
            }
        }
        setUpdatedInv(prevState => ({
            ...prevState, discount: e, finalamount: f.toFixed(2), payableamount: fgst.toFixed(2)
        }))
    }

    return (
        <>
            <div>
                <CRow>
                    <CCol xs={12}>
                        {DetailsPopUp()}
                    </CCol>
                </CRow>
            </div>
        </>
    )
}

export default UpdateForm;
