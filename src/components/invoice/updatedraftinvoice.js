import React, { useEffect, useState, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import { getPercentagesForNew, getPercentagesForOld } from './daycounter'
import DatePicker from 'react-datepicker'
import Alert from 'react-bootstrap/Alert'

import 'react-datepicker/dist/react-datepicker.css'

const UpdateDraftInvoice = (props) => {
  const history = useHistory()
  const PRTYPES = {
    NEW: 'new',
    OLD: 'old',
    ANTIQUE: 'antique',
    DAMAGE: 'damage'
  }

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

  let isProceed = false

  const PAY_METHOD = ['Google Pay', 'Paytm', 'PhonePe', 'Internet Banking', 'Cheque', 'Cash', 'Card Swipe']

  const ADVANCE_PAY = 4 // PAYMENT TYPE FROM DB. 1. NOT PAID, 2. PAID, 3. PARTIALLY PAID, 4. ADVANCE PAY

  const [state, setState] = useState({
    toName: '',
    companyPhone: '',
    toAddress: '',
    contactPhone: '',
    contactName: '',
    artDirector: '',
    artPhone: '',
    contentType: '',
    propReceiver: '',
    propReceiverName: '',
    gst: '',
    showAddressForm: false,
    startDate: new Date(),
    endDate: new Date(),
    totalCost: 0,
    initialDays: 1,
    advancePay: '',
    chequeNo: '',
    bank: '',
    transactionId: '',
    discount: '',
    invoiceAmount: '',
    gstpercentage: '',
    finalamount: 0,
    payableamount: 0,
    paymentMethod: '',
    isWhatName: '',
    isWhat: '',
    vendoraddress: '',
    formValues: [{
      code: '',
      name: '',
      price: 0,
      days: 0,
      tcost: 0,
      prtype: '',
      quantity: 0,
      prtype: '',
      from: new Date(),
      to: new Date(),
      totalinstock: 0,
      consumed: 0,
      remaining: 0,
      showalert: false,
      isProceed: false
    }]
  })


  useEffect(() => {
    // perform some action which will get fired everytime when myArr gets updated
    console.log('Updated State', state.formValues)
    setState(prevState => ({
      ...prevState,
      totalCost: parseFloat(updateTotalCost()).toFixed(2),
      finalamount: parseFloat(updateTotalCost()).toFixed(2),
      payableamount: parseFloat(updateTotalCost()).toFixed(2)
    }));
  }, [state.formValues])

  let handleSubmit = async (event) => {
    event.preventDefault()
    setState(prevState => ({
      ...prevState,
      showAddressForm: true
    }));
  }

  const getProductDetails = async (id) => {
    const results = await axios.get(`${process.env.REACT_APP_API_URL}/products/details/${id}`)
    return results.data[0]
  }

  const getProductAvailiablity = async (id, s, end) => {
    let payLoad = {
      code: id,
      sdate: s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate(),
      edate: end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate()
    }
    const results = await axios.post(`${process.env.REACT_APP_API_URL}/products/consumed/`, payLoad)
    return results.data;
  }

  const editCode = (i, e) => { }

  const calculateCostByType = (product) => {
    switch (product.prtype) {
      case PRTYPES.ANTIQUE:
      case PRTYPES.NEW: {
        return (
          (((parseInt(product.price) * getPercentagesForNew(parseInt(product.days))) / 100) *
            parseInt(product.quantity)).toFixed(2)
        )
      }
      case PRTYPES.DAMAGE:
      case PRTYPES.OLD: {
        return (
          (((parseInt(product.price) * getPercentagesForOld(parseInt(product.days))) / 100) *
            parseInt(product.quantity)).toFixed(2)
        )
      }
    }
  }

  const updateTotalCost = () => {
    let f = [...state.formValues]
    f.pop();
    let c = f.reduce((a, b) => parseFloat(a) + parseFloat(b.tcost), 0);
    return c
  }

  const changeCode = async (i, e) => {
    const details = await getProductDetails(e.target.value)
    let remaining = 0;
    let consumed = 0;
    if (details) {
      consumed = await getProductAvailiablity(e.target.value, state.startDate, state.endDate);
      remaining = parseInt(details.quantity - consumed);
      remaining = (remaining < 1) ? 0 : remaining;
    }

    let newFormValues = [...state.formValues]

    newFormValues[i]['name'] = ''
    newFormValues[i]['price'] = 0
    newFormValues[i]['days'] = state.initialDays
    newFormValues[i]['tcost'] = 0
    newFormValues[i]['quantity'] = 0
    newFormValues[i]['from'] = state.startDate
    newFormValues[i]['to'] = state.endDate


    if (details) {
      newFormValues[i][e.target.name] = e.target.value
      newFormValues[i]['name'] = details.name
      newFormValues[i]['price'] = details.price
      newFormValues[i]['prtype'] = details.prtype
      newFormValues[i]['totalinstock'] = details.quantity
      newFormValues[i]['consumed'] = consumed
      newFormValues[i]['remaining'] = details.quantity - consumed;
      newFormValues[i]['showalert'] = remaining > 0 ? false : true;
    }

    newFormValues[i].tcost = calculateCostByType(newFormValues[i])

    if (state.formValues.length - 1 == i) {
      if (details) {
        newFormValues.push({
          code: '',
          name: '',
          price: 0,
          days: 0,
          tcost: 0,
          quantity: 0,
          prtype: '',
          from: state.startDate,
          to: state.endDate,
          totalinstock: 0,
          consumed: 0,
          remaining: 0,
          showalert: false,
          isProceed: false
        })
      }
    }

    let tcost = newFormValues.reduce((a, b) => (a.tcost != '') ? a + b.tcost : a, 0)
    tcost = parseFloat(tcost).toFixed(2);
    setState(prevState => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: newFormValues
    }));
  }

  const calculateCostByQuantity = (product, index) => (event) => {
    // TODO:: add validation for availability 
    if (product.remaining < event.target.value) {
      alert(`Maximum quantity allowed is ${product.remaining}`)
    } else {
      state.formValues[index].isProceed = true
      state.formValues[index].quantity = event.target.value
      state.formValues[index].tcost = calculateCostByType(product)
      let tcost = updateTotalCost();
      tcost = parseFloat(tcost).toFixed(2);

      setState(prevState => ({
        ...prevState,
        totalCost: tcost,
        finalamount: tcost,
        payableamount: tcost,
        formValues: [...state.formValues]
      }));

    }
  }

  const updateStartDate = (date, product, i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['from'] = date
    if (date > newFormValues[i]['to']) newFormValues[i]['to'] = date
    let d = newFormValues[i]['to'].getTime() - date.getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    newFormValues[i]['days'] = d
    newFormValues[i]['tcost'] = calculateCostByType(product)
    let tcost = updateTotalCost();
    tcost = parseFloat(tcost).toFixed(2);
    setState(prevState => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: [...newFormValues]
    }));
  }

  const updateEndDate = (date, product, i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['to'] = date
    let d = date.getTime() - newFormValues[i]['from'].getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    newFormValues[i]['days'] = d
    newFormValues[i]['tcost'] = calculateCostByType(product)
    let tcost = updateTotalCost();
    tcost = parseFloat(tcost).toFixed(2);
    setState(prevState => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: [...newFormValues]
    }));
  }

  const closeAlert = (i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['showalert'] = false
    setState(prevState => ({
      ...prevState,
      formValues: [...newFormValues]
    }));
  }

  const setDaysinForm = async (days, startThisDate = '', endThisDate = '') => {
    let newFormValues = [...state.formValues]
    await newFormValues.map((f) => {
      if (startThisDate !== '') {
        f.from = startThisDate
        if (f.from > f.to) f.to = startThisDate
      }

      if (endThisDate !== '') {
        f.to = endThisDate
      }
      f.days = days
      f.tcost = calculateCostByType(f)
    })
    let tcost = updateTotalCost();
    tcost = parseFloat(tcost).toFixed(2);
    setState(prevState => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      initialDays: days,
      startDate: startThisDate != '' ? startThisDate : state.startDate,
      endDate: endThisDate != '' ? endThisDate : state.endDate,
      formValues: [...newFormValues]
    }));
  }

  const countDays = (from, to) => {
    let d = 0
    d = to.getTime() - from.getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    d = d == 0 ? 1 : d
    return d
  }

  const resetEndDate = (date) => {
    // setStartDate(date)
    let endDate = '';
    if (date > state.endDate) endDate = date;
    let d = countDays(date, state.endDate)
    // setDaysinForm(d, date, '')
    let newFormValues = [...state.formValues]

    newFormValues.map(async i => {
      if (i.code !== '') {
        let details = await getProductDetails(i.code)
        let consumed = await getProductAvailiablity(i.code, i.from, i.to);
        i.totalinstock = details.quantity
        i.consumed = consumed
        i.remaining = details.quantity - consumed;
        i.showalert = (details.quantity - consumed > 1) ? false : true
        i.from = date
        if (i.from > i.to) i.to = date
        if (endDate !== '') {
          i.to = endDate
        }
        i.days = d
        i.tcost = calculateCostByType(i)
      }
    })
    let tcost = updateTotalCost();
    tcost = parseFloat(tcost).toFixed(2);
    console.log('newValues', newFormValues)
    setState(prevState => ({
      ...prevState,
      initialDays: d,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      startDate: date,
      endDate: endDate !== '' ? endDate : state.endDate,
      formValues: [...newFormValues]
    }));
  }

  const checkAvail = () => {

  }

  let removeFormFields = (code, i) => {
    let newFormValues = [...state.formValues];
    newFormValues = newFormValues.filter((p) => p.code != code);
    // let tcost = updateTotalCost();
      // tcost = parseFloat(tcost).toFixed(2);
      // console.log("tcost -", tcost);
      // setState(prevState => ({
      //   ...prevState,
      //   totalCost: tcost,
      //   finalamount: tcost,
      //   payableamount: tcost,
      //   formValues: [...newFormValues]
      // }));
      setState(prevState => ({
        ...prevState,
        formValues: [...newFormValues]
      }));
  }

  const changeEndDateAndCountDays = (date) => {
    let d = countDays(state.startDate, date)
    setDaysinForm(d, '', date)
  }

  const displayRecords = (element, index) => {
    return (<>
      <CRow className="mb-4" key={index}>
        <div className="col-sm-2">
          {element.name !== '' ? (
            <CFormInput
              name="code"
              autoComplete="off"
              type="text"
              readOnly={true}
              id="productCode"
              value={element.code}
              onChange={(e) => editCode(index, e)}
            />
          ) : (
            <CFormInput
              name="code"
              autoComplete="off"
              type="text"
              id="productCode"
              onChange={(e) => changeCode(index, e, element)}
              placeholder="Code(Ex: PR-12345)"
            />
          )}
        </div>
        <div className="col-sm-3">
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
          {/* {element.prtype} */}
          <CFormInput
            name="prtype"
            autoComplete="off"
            type="text"
            value={element.prtype || ''}
          />
        </div>

        <div className="col-sm-1">
          {element.price ? (
            <DatePicker
              className="form-control"
              selected={element.from}
              onChange={(date: Date) => updateStartDate(date, element, index)}
            />
          ) : (
            <DatePicker
              disabled={true}
              className="form-control"
              selected={element.from}
            />
          )}
        </div>
        <div className="col-sm-1">
          {element.price ? (
            <DatePicker
              minDate={element.from}
              onChange={(date: Date) => updateEndDate(date, element, index)}
              className="form-control"
              selected={element.to}
            />
          ) : (
            <DatePicker
              disabled={true}
              minDate={element.from}
              className="form-control"
              selected={element.to}
            />
          )}
        </div>

        <div className="col-sm-1">
          {element.price ? (
            <CFormInput
              name="quantity"
              required
              autoComplete="off"
              onChange={calculateCostByQuantity(element, index)}
              placeholder={`Max ${element.remaining}`}
            />
          ) : (
            <CFormInput
              name="quantity"
              autoComplete="off"
              readOnly
              placeholder="Quantity"
            />
          )}
        </div>
        <div className="col-sm-1">
          {element.price ? (
            <CFormInput
              name="days"
              readOnly
              value={element.days}
              required
              autoComplete="off"
              onChange={(e) => changeDaysAndCost(index, e, element)}
              placeholder="Days Off"
            />
          ) : (
            <CFormInput
              value={element.days}
              name="days"
              autoComplete="off"
              readOnly
              placeholder="Days"
            />
          )}
        </div>
        <div className="col-sm-1">
          <CFormInput
            name="tcost"
            autoComplete="off"
            id="cost"
            value={element.tcost || 0}
            placeholder="Cost"
            readOnly
          />
        </div>
        <div className="col-sm-1">
          {element.code && index < state.formValues.length - 1 ? (
            <button
              type="button"
              className="button remove"
              onClick={() => removeFormFields(element.code, index)}
            >
              Remove
            </button>
          ) : null}
        </div>
      </CRow>
    </>)
  }

  const updateFinalAmountByGST = (e) => {
    let f = parseFloat(state.finalamount);
    if (e != '') {

      e = parseInt(e)
      let gst = parseFloat(f * (e / 100))
      f = f + gst;
    }

    setState(prevState => ({
      ...prevState, gstpercentage: e, payableamount: f.toFixed(2)
    }))
  }

  const updateFinalAmount = (e) => {
    let f = parseFloat(state.finalamount);
    let gst = 0;
    let fgst = parseFloat(state.finalamount);
    if (e != '') {
      e = parseInt(e)
      let d = state.totalCost * (e / 100);
      f = parseFloat(state.totalCost - d);
      fgst = f;
      if (state.gstpercentage > 0) {
        gst = parseFloat(f * (state.gstpercentage / 100))
        fgst = f + gst;
      }
    }
    setState(prevState => ({
      ...prevState, discount: e, finalamount: f.toFixed(2), payableamount: fgst.toFixed(2)
    }))
  }

  const renderResults = () => {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Update Quotation Invoice</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <div className="row col-sm-3">
                    <div className="col-sm-4">
                      <strong className="align-middle">From Date :</strong>
                    </div>
                    <div className="col-sm-6">
                      <DatePicker
                        className="form-control"
                        selected={state.startDate}
                        onChange={(date: Date) => resetEndDate(date)}
                      />
                    </div>
                  </div>
                  <div className="row col-sm-3">
                    <div className="col-sm-4 align-text-bottom">
                      <strong className="align-middle">To Date :</strong>
                    </div>
                    <div className="col-sm-6">
                      <DatePicker
                        className="form-control"
                        minDate={state.startDate}
                        selected={state.endDate}
                        onChange={(date: Date) => changeEndDateAndCountDays(date)}
                      />
                    </div>
                  </div>
                </CRow>
                <CRow>&nbsp;</CRow>
                <CRow className="mb-4">
                  <div className="col-sm-2">
                    <strong>Code</strong>
                  </div>
                  <div className="col-sm-3">
                    <strong>Name</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>Type of Prop</strong>
                  </div>

                  <div className="col-sm-1">
                    <strong>From</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>To</strong>
                  </div>

                  <div className="col-sm-1">
                    <strong>Quantity</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>Num of Days</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>Hire</strong>
                  </div>
                </CRow>

                {
                  // setTimeout(() => {
                  state.formValues.map((element, index) => (
                    <>
                      {displayRecords(element, index)}
                      {
                        // alert(element.showalert)
                        // element.showalert === true ?
                        //   <Alert variant="danger"
                        //     onClose={() => closeAlert(index)} dismissible>
                        //     The requested product <strong>({element.name})</strong> is not
                        //     available with dates specified.
                        //     Try on other dates or quantity for product availability.
                        //   </Alert>
                        //   : <></>
                      }
                    </>
                  ))
                  // }, 2000)
                }

              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    )
  }


  const DetailsPopUp = () => {
    return (
      <>
        <div>
          <CRow>
            <CCol xs={12}>
              <div className="col-sm-12">
                <Modal show={state.showAddressForm}
                  onHide={() => setState(prevState => ({
                    ...prevState, showAddressForm: false
                  }))}
                  size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <fieldset>
                      <legend>Company details</legend>
                      <div className="row">
                        <div className="col">
                          <input
                            value={state.toName}
                            type="text"
                            onChange={(e) => setState(prevState => ({
                              ...prevState, toName: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="col-sm-12 mt-2">
                          <input
                            placeholder="Location"
                            value={state.toAddress}
                            onChange={(e) => setState(prevState => ({
                              ...prevState, toAddress: e.target.value
                            }))}
                            className="form-control col-sm-12"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col">
                          <input
                            value={state.artDirector}
                            type="text"
                            onChange={(e) => setState(prevState => ({
                              ...prevState, artDirector: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Art Director Name"
                          />
                        </div>
                        <div className="col">
                          <select
                            className="form-control"
                            onChange={(e) =>
                              setState(prevState => ({
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
                      <div className="row mt-2">
                        <div className="col">
                          <select
                            className="form-control"
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, isWhat: e.target.value
                              }))
                            }
                          >
                            <option>Hero/Director</option>
                            <option value="hero">Hero</option>
                            <option value="director">Director</option>
                          </select>
                        </div>
                        <div className="col">
                          <input
                            value={state.isWhatName}
                            type="text"
                            onChange={(e) => setState(prevState => ({
                              ...prevState, isWhatName: e.target.value
                            }))}
                            className="form-control"
                            placeholder={`${state.isWhat} Name`}
                          />
                        </div>

                      </div>
                      <div className="row mt-2">

                        <div className="col">
                          <input
                            value={state.contactName}
                            type="text"
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, contactName: e.target.value
                              }))
                            }
                            className="form-control"
                            placeholder="Responsible Person Name"
                          />
                        </div>
                        <div className="col">
                          <input
                            value={state.contactPhone}
                            onChange={(e) => setState(prevState => ({
                              ...prevState, contactPhone: e.target.value
                            }))}
                            type="text"
                            className="form-control"
                            placeholder="Responsible Person Phone Number"
                          />
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col">
                          <select
                            className="form-control"
                            onChange={(e) =>
                              setState(prevState => ({
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

                        <div className="col">
                          <input
                            value={state.propReceiverName}
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, propReceiverName: e.target.value
                              }))
                            }
                            type="text"
                            className="form-control"
                            placeholder="Receiver Name"
                          />
                        </div>

                        <div className="col">
                          <input
                            value={state.artPhone}
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, artPhone: e.target.value
                              }))
                            }
                            type="text"
                            className="form-control"
                            placeholder="Receiver Phone"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div>&nbsp;</div>

                    <fieldset>
                      <legend>Amount Details</legend>
                      <div className="row mt-2">
                        <div className="col-4">
                          <input
                            value={state.totalCost}
                            type="text"
                            readOnly
                            className="form-control"
                            placeholder="Invoice Amount"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            value={state.discount}
                            type="text"
                            onChange={(e) => updateFinalAmount(e.target.value)}
                            className="form-control"
                            placeholder="Discount Percentage"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            value={state.finalamount}
                            type="text"
                            readOnly
                            className="form-control"
                            placeholder="Final Amount"
                          />
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-4">
                          <input
                            value={state.gstpercentage}
                            type="text"
                            onChange={(e) =>
                              updateFinalAmountByGST(e.target.value)
                            }
                            className="form-control"
                            placeholder="GST Percentage"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            value={state.payableamount}
                            type="text"
                            readOnly
                            className="form-control"
                            placeholder="Payable Amount"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            value={state.advancePay}
                            type="text"
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, advancePay: e.target.value
                              }))
                            }
                            className="form-control"
                            placeholder="Advance Amount"
                          />
                        </div>
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend>Payment Details</legend>
                      <div className="row mt-2">
                        <div className="col">
                          <select
                            onChange={(e) =>
                              setState(prevState => ({
                                ...prevState, paymentMethod: e.target.value
                              }))
                            }
                            className="form-control"
                          >
                            <option value="">Select Method</option>
                            {PAY_METHOD.map((i) => (
                              <option value={i}>{i}</option>
                            ))}
                          </select>
                        </div>

                        {state.paymentMethod !== 'Cheque' ? (
                          <div className="col">
                            <input
                              value={state.transactionId}
                              type="text"
                              onChange={(e) =>
                                setState(prevState => ({
                                  ...prevState, transactionId: e.target.value
                                }))
                              }
                              className="form-control"
                              placeholder="Transaction Id"
                            />
                          </div>
                        ) : (
                          <></>
                        )}

                        {state.paymentMethod === 'Cheque' ? (
                          <div className="col">
                            <input
                              value={state.chequeNo}
                              type="text"
                              onChange={(e) =>
                                setState(prevState => ({
                                  ...prevState, chequeNo: e.target.value
                                }))
                              }
                              className="form-control"
                              placeholder="Cheque No"
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      {state.paymentMethod === 'Cheque' ? (
                        <div className="row mt-2">
                          <div className="col">
                            <input
                              value={state.bank}
                              type="text"
                              onChange={(e) =>
                                setState(prevState => ({
                                  ...prevState, bank: e.target.value
                                }))
                              }
                              className="form-control"
                              placeholder="Enter Bank Details - Name, Branch"
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}

                      <div className="row mt-2">
                        <div className="col">
                          <input
                            type="text"
                            value={state.gst}
                            onChange={(e) => setState(prevState => ({
                              ...prevState, gst: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Add GST/TIN"
                          />
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            value={state.vendoraddress}
                            onChange={(e) => setState(prevState => ({
                              ...prevState, vendoraddress: e.target.value
                            }))}
                            className="form-control"
                            placeholder="Vendor Address"
                          />
                        </div>
                      </div>

                    </fieldset>
                    <div>&nbsp;</div>

                  </Modal.Body>
                  <Modal.Footer>
                    <button onClick={addDraftInvoice} className="btn btn-primary">
                      Add Details
                    </button>
                  </Modal.Footer>
                </Modal>
              </div>
            </CCol>
          </CRow>
        </div>
      </>
    )
  }

  const addDraftInvoice = () => {

    let invId = Date.now()
    let p = {
      invoice_id: invId,
      toName: state.toName,
      companyPhone: state.companyPhone,
      address: state.toAddress,
      contactName: state.contactName,
      contactPhone: state.contactPhone,
      artDirector: state.artDirector,
      contentType: state.contentType,
      receiver: state.propReceiver,
      receiver_name: state.propReceiverName,
      artPhone: state.artPhone,
      gst: state.gst,
      method: state.paymentMethod,
      payment_type: state.paymentMethod !== '' ? ADVANCE_PAY : 1,
      vendoraddress: state.vendoraddress,
      amt: state.advancePay ? state.advancePay : 0,
      startDate:
        state.startDate.getFullYear() + '-' + (state.startDate.getMonth() + 1) + '-' + state.startDate.getDate(),
      endDate: state.endDate.getFullYear() + '-' + (state.endDate.getMonth() + 1) + '-' + state.endDate.getDate(),
      transId: state.transactionId,
      chequeno: state.chequeNo,
      bank: state.bank,
      discount: state.discount,
      gstpercentage: state.gstpercentage,
      finalamount: state.finalamount,
      payableamount: state.payableamount,
      totalCost: state.totalCost,
      isWhatName: state.isWhatName,
      isWhat: state.isWhat
    }

    axios.post(`${process.env.REACT_APP_API_URL}/invoice/new`, p).then((response) => {
      console.log(response)
      state.formValues.map(async (product) => {
        if (product.code !== '') {
          let s = product.from
          let t = product.to
          let payload = {
            invoice_id: response.data,
            code: product.code,
            days: product.days,
            quantity: product.quantity,
            cost: product.tcost,
            startDate: s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate(),
            endDate: t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate(),
          }
          await axios.post(`${process.env.REACT_APP_API_URL}/invoice/draft`, payload)
        }
      })
      history.push('/invoice/quotation')
    })

  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {renderResults()}
        <CRow className="mb-12">
          <div className="col-sm-10 text-right">Total Cost:</div>
          <div className="col-sm-1">
            <CFormInput
              name="price"
              autoComplete="off"
              type="text"
              readOnly={true}
              id="price"
              value={state.totalCost}
            />
          </div>
        </CRow>
        {state.formValues.length > 1 ? (
          <div className="text-right">
            <input type="submit" value="Create Quotation" className="btn btn-primary" />
          </div>
        ) : (
          <></>
        )}
      </form>
      {DetailsPopUp()}
    </>
  )
}
export default UpdateDraftInvoice