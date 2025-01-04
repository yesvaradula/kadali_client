import { CCard, CCardBody, CCardHeader, CCardFooter, CCol, CFormInput, CRow } from '@coreui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const getProductDetails = async (id, pid) => {
    const results = await axios.get(`${process.env.REACT_APP_API_URL}/invoice/return/${id}/items/${pid}`)
    return results.data[0] ? results.data[0] : 0;
}

const changeCode = async (invoice, i, e, formValues, setFormValues) => {

    const details = await getProductDetails(invoice, e.target.value);
    let newFormValues = [...formValues];

    if (details) {
        newFormValues[i]['code'] = e.target.value
        newFormValues[i]['error'] = ''
        newFormValues[i]['rquantity'] = 0
        newFormValues[i]['name'] = details.name
        newFormValues[i]['quantity'] = details.quantity
        newFormValues[i + 1] = {
            code: '',
            name: '',
            error: '',
            quantity: 0,
            rquantity: 0,
            damaged_cost: 0,
            damaged_type: '',
            isDamaged: false,
            isRecieved: false
        }
    } else {
        newFormValues[i]['code'] = e.target.value
        newFormValues[i]['error'] = "Invalid Code."
    }
    setFormValues(prev => [...newFormValues])
}
const updateRvalue = (i, event, formValues, setFormValues) => {
    let newFormValues = [...formValues];
    newFormValues[i].rquantity = event.target.value;
    setFormValues(prev => [...newFormValues])
}

const updateDamageType = (i, event, formValues, setFormValues) => {
    let newFormValues = [...formValues];
    newFormValues[i].damaged_type = event.target.value;
    setFormValues(prev => [...newFormValues])
}

const updateDamageCost = (i, event, formValues, setFormValues) => {
    let newFormValues = [...formValues];
    newFormValues[i].damaged_cost = event.target.value;
    setFormValues(prev => [...newFormValues])
}

const isDamagedFun = (i, event, formValues, setFormValues) => {
    let newFormValues = [...formValues];
    newFormValues[i].isDamaged = event.target.checked;
    newFormValues[i].damaged_cost = event.target.checked ? newFormValues[i].damaged_cost : 0
    setFormValues(prev => [...newFormValues])
    console.log(formValues)
}

const receiveProducts = async (e, i, formValues, recieveProduct, returnInvoice, setFormValues) => {
    e.preventDefault()

    // let f = formValues.filter(f => f.rquantity)

    let newFormValues = [...formValues];
    newFormValues[i].isRecieved = true
    setFormValues(prev => [...newFormValues])
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/invoice/return/`, {
            formValues: recieveProduct,
            invoice_id: returnInvoice.invoice
        })
    } catch (e) {

    }

    // await Promise.all(f.map(async i => {
    //     return await new Promise(async (resolve, reject) => {
    //         try {
    //             await axios.post(`${process.env.REACT_APP_API_URL}/invoice/return/`, {
    //                 formValues: i,
    //                 invoice_id: returnInvoice.invoice
    //             })
    //             return await resolve(0)
    //         } catch (e) {
    //             return reject(e);
    //         }
    //     })
    // })).then(() => {
    //     h.push('/returns/list')
    // })
}

const goBack = (h) => {
    h.push('/returns/list')
}

const displayReadOnlyForm = (element, index, returnInvoice) => {
    return (
        <CRow className="mb-4" key={index}>
            <div className="col-sm-2">
                <CFormInput
                    name="code"
                    autoComplete="off"
                    type="text"
                    id="productCode"
                    readOnly={true}
                    placeholder="Code(Ex: PR-12345)"
                />
            </div>
            {
                element.error != '' ?
                    <>
                        <div className="col-sm-6 error-message">
                            Product code is invalid OR does not exist in this Invoice
                        </div>
                    </> :
                    <>
                        <div className="col-sm-2">
                            <CFormInput
                                name="name"
                                autoComplete="off"
                                type="text"
                                id="name"
                                readOnly={true}
                                value={element.name || ''}
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="col-sm-1">
                            <CFormInput
                                name="quantity"
                                readOnly={true}
                                autoComplete="off"
                                type="number"
                                min="1" max={element.quantity}
                                placeholder={`${element.quantity || ''} Products`}
                            />
                        </div>
                        <div className="col-sm-1 m-10imp">
                            <label>
                                <input type="checkbox"
                                    readOnly={true}
                                    name="isDamaged" /> Is Damaged
                            </label>
                        </div>
                        {
                            element.isDamaged
                                ?
                                <>
                                    <div className="col-sm-2">
                                        <select className="form-control"
                                            required
                                            readOnly={true}
                                        >
                                            <option value="">Select</option>
                                            <option value="partial">Partially Damaged</option>
                                            <option value="full">Full Damaged</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <CFormInput
                                            required={element.isDamaged}
                                            readOnly={true}
                                            autoComplete="off"
                                            type="text"
                                            placeholder={`Enter damaged cost`}
                                        />
                                    </div>
                                </>
                                : null
                        }

                        <div className="col-sm-1">
                            <input type="button" value="Received" className="btn btn-secondary" />
                        </div>
                    </>
            }
        </CRow>
    );
}

const displayForm = (element, index, returnInvoice, formValues, setFormValues) => {
    return (
        <CRow className="mb-4" key={index}>
            <div className="col-sm-2">
                <CFormInput
                    name="code"
                    autoComplete="off"
                    type="text"
                    id="productCode"
                    readonly={element.isRecieved ? true : false}
                    onChange={(e) => changeCode(returnInvoice.invoice, index, e, formValues, setFormValues)}
                    placeholder="Code(Ex: PR-12345)"
                />
            </div>
            {
                element.error != '' ?
                    <>
                        <div className="col-sm-6 error-message">
                            Product code is invalid OR does not exist in this Invoice
                        </div>
                    </> :
                    <>
                        <div className="col-sm-2">
                            <CFormInput
                                name="name"
                                autoComplete="off"
                                type="text"
                                id="name"
                                readOnly={true}
                                value={element.name || ''}
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="col-sm-1">
                            <CFormInput
                                name="quantity"

                                required={element.name !== ''}
                                onChange={e => updateRvalue(index, e, formValues, setFormValues)}
                                autoComplete="off"
                                type="number"
                                min="1" max={element.quantity}
                                placeholder={`${element.quantity || ''} Products`}
                            />
                        </div>
                        <div className="col-sm-1 m-10imp">
                            <label>
                                <input type="checkbox"

                                    onChange={e => isDamagedFun(index, e, formValues, setFormValues)}
                                    name="isDamaged" /> Is Damaged
                            </label>
                        </div>
                        {
                            element.isDamaged
                                ?
                                <>
                                    <div className="col-sm-2">
                                        <select className="form-control"
                                            required

                                            onChange={e => updateDamageType(index, e, formValues, setFormValues)}
                                        >
                                            <option value="">Select</option>
                                            <option value="partial">Partially Damaged</option>
                                            <option value="full">Full Damaged</option>
                                        </select>
                                    </div>
                                    <div className="col-sm-2">
                                        <CFormInput
                                            required={element.isDamaged}
                                            onChange={e => updateDamageCost(index, e, formValues, setFormValues)}
                                            autoComplete="off"
                                            type="text"
                                            placeholder={`Enter damaged cost`}
                                        />
                                    </div>
                                </>
                                : null
                        }

                        <div className="col-sm-1">
                            {
                                element.isRecieved ?
                                    <input type="button" value="Received" className="btn btn-secondary" />
                                    :
                                    <input type="button"
                                        onClick={e => receiveProducts(e, index, formValues, element, returnInvoice, setFormValues)}
                                        className="btn btn-primary" value="Recieve" />
                            }
                        </div>
                    </>
            }
        </CRow>
    )
}

export const loadDataTable = (formValues, setFormValues, returnInvoice) => {
    const history = useHistory()
    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <form method="post"
                        onSubmit={e => goBack(history)}
                    >
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>Receive Invoice Items for {returnInvoice.invoice}</strong>
                            </CCardHeader>
                            <CCardBody>
                                {
                                    formValues.map((element, index) => (
                                        element.isRecieved ?
                                            displayReadOnlyForm(element, index, returnInvoice)
                                            :
                                            displayForm(element, index, returnInvoice, formValues, setFormValues)
                                    ))
                                }
                            </CCardBody>
                            <CCardFooter>
                                <CRow>
                                    <div className="col-sm-6"></div>
                                    <div className="col-sm-6 alignright">
                                        <input type="submit" className="btn btn-secondary" value="Go Back to List" />

                                    </div>
                                </CRow>
                            </CCardFooter>
                        </CCard>
                    </form>
                </CCol>
            </CRow>
        </>
    )
}

export const loadOptions = (invoices, displaySelectedInvoice) => {
    return (
        <div>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-2">
                        <CCardHeader>
                            <CRow className="p-2">
                                <div className="col-sm-2">
                                    <h6>Invoices found {invoices.length}</h6>
                                </div>
                                <div className="col-sm-6">
                                    <select className="form-control"
                                        onChange={displaySelectedInvoice}
                                    >
                                        <option value="0">Select Return Invoice Number</option>
                                        {invoices.map((i) => (
                                            <option
                                                key={i.invoice}
                                                value={i.invoice}>
                                                {i.to_name} - {i.invoice}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </CRow>
                        </CCardHeader>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

export const searchInvoices = (setSearchString, getInvoices) => {
    return (
        <div>
            <form onSubmit={getInvoices}>
                <CRow>
                    <CCol xs={12}>
                        <CCard className="mb-2">
                            <CCardHeader>
                                <CRow className="p-2">
                                    <div className="col-sm-10">
                                        <h4>Receive Invoice form</h4>
                                    </div>

                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>

                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setSearchString(e.target.value)
                                            }}
                                            className="form-control"
                                            placeholder="Search by Company Name/Invoice Number/Director/Hero"
                                        />
                                    </div>
                                    <div className="col-sm-5">
                                        <button type="submit"
                                            className="btn btn-primary"
                                        >
                                            Get Invoices
                                        </button>
                                    </div>

                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow></form>
        </div>
    )
}