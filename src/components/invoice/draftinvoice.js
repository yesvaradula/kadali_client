import React, { useEffect, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import useState from 'react-usestateref'
require('dotenv').config()
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import { getPercentagesForNew, getPercentagesForOld } from './daycounter'
import DatePicker from 'react-datepicker'
import Alert from 'react-bootstrap/Alert'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Archive } from 'react-bootstrap-icons'
import { useLocation } from 'react-router-dom'

import 'react-datepicker/dist/react-datepicker.css'

const DraftInvoice = (props) => {
  const history = useHistory()
  const location = useLocation()
  const PRTYPES = {
    NEW: 'new',
    OLD: 'used',
    ANTIQUE: 'antique',
    DAMAGE: 'damage',
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

  const PAY_METHOD = [
    'Google Pay',
    'Paytm',
    'PhonePe',
    'Internet Banking',
    'Cheque',
    'Cash',
    'Card Swipe',
  ]

  const ADVANCE_PAY = 4 // PAYMENT TYPE FROM DB. 1. NOT PAID, 2. PAID, 3. PARTIALLY PAID, 4. ADVANCE PAY

  const [items, setItems, refItems] = useState([])

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
    pickedon: new Date(),
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
    isBlocked: 0,
    isProceed: false,
    formValues: [
      {
        code: '',
        name: '',
        price: 0,
        days: 0,
        tcost: 0,
        prtype: '',
        quantity: 0,
        prtype: '',
        pickedon: new Date(),
        from: new Date(),
        to: new Date(),
        totalinstock: 0,
        consumed: 0,
        remaining: 0,
        showalert: false,
      },
    ],
  })

  const [selectedScannedItem, setSelectedScannedItem] = useState(0)

  const loadItemsIntoForm = async (event) => {
    setSelectedScannedItem(event.target.value)
    let sItems = refItems.current.filter((a) => a.id == event.target.value)[0].items.split(',')

    let newFormValues = []

    console.log(sItems)

    let i = 0
    await sItems.map(async (s) => {
      let p = s.toLowerCase()
      const details = await getProductDetails(p)

      let consumed = 0
      let remaining = 0

      if (details?.status) {
        consumed = await getProductAvailiablity(p, state.startDate, state.endDate)
        remaining = parseInt(details.quantity - consumed)
        remaining = remaining < 1 ? 0 : remaining

        newFormValues.push({
          code: s,
          name: details.name,
          price: details.price,
          days: 0,
          tcost: 0,
          quantity: 0,
          prtype: details.prtype,
          from: state.startDate,
          to: state.endDate,
          totalinstock: 0,
          consumed: consumed,
          remaining: details.quantity - consumed,
          showalert: remaining > 0 ? false : true,
          message: `There are only ${remaining} items remaining between ${state.startDate.toLocaleDateString()} and ${state.endDate.toLocaleDateString()}`,
        })
      } else {
        if (details !== undefined) {
          newFormValues.push({
            code: sItems[i],
            name: details.name,
            price: details.price,
            showalert: true,
            message: `This item is inactive. This item cannot be added to invoice.`,
          })
        }
      }

      i = i + 1
      if (i === sItems.length) {
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
        })
      }

      setState((prevState) => ({
        ...prevState,
        formValues: newFormValues,
      }))
    })

    // setState((prevState) => ({
    //   ...prevState,
    //   formValues: newFormValues,
    // }))

    // newFormValues = [...state.formValues]

    // setState((prevState) => ({
    //   ...prevState,
    //   formValues: newFormValues,
    // }))
  }

  const getScannedItems = async () => {
    const results = await axios.get(`${process.env.REACT_APP_API_URL}/items/scanned`)
    setItems(results.data)
  }

  useEffect(() => {
    // get if any scanned items.
    getScannedItems()
  }, [location])

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      totalCost: parseFloat(updateTotalCost()).toFixed(2),
      finalamount: parseFloat(updateTotalCost()).toFixed(2),
      payableamount: parseFloat(updateTotalCost()).toFixed(2),
    }))
  }, [state.formValues])

  let handleSubmit = async (event) => {
    event.preventDefault()
    setState((prevState) => ({
      ...prevState,
      showAddressForm: true,
    }))
  }

  const getProductDetails = async (id) => {
    const results = await axios.get(`${process.env.REACT_APP_API_URL}/products/details/${id}`)
    return results.data[0]
  }

  const getProductAvailiablity = async (id, s, end) => {
    let payLoad = {
      code: id,
      sdate: s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate(),
      edate: end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate(),
    }
    const results = await axios.post(`${process.env.REACT_APP_API_URL}/products/consumed/`, payLoad)
    return results.data
  }

  const editCode = (i, e) => {}

  const calculateCostByType = (product) => {
    switch (product.prtype) {
      case PRTYPES.ANTIQUE:
      case PRTYPES.NEW: {
        return (
          ((parseInt(product.price) * getPercentagesForNew(parseInt(product.days))) / 100) *
          parseInt(product.quantity)
        ).toFixed(2)
      }
      case PRTYPES.DAMAGE:
      case PRTYPES.OLD:
      default: {
        return (
          ((parseInt(product.price) * getPercentagesForOld(parseInt(product.days))) / 100) *
          parseInt(product.quantity)
        ).toFixed(2)
      }
    }
  }

  const updateTotalCost = () => {
    let f = [...state.formValues]
    f.pop()
    let c = f.reduce((a, b) => parseFloat(a) + parseFloat(b.tcost), 0)
    return c
  }

  const changeCode = async (i, e) => {
    let newFormValues = [...state.formValues]
    let p = e.target.value.toLowerCase()
    const details = await getProductDetails(p)
    let remaining = 0
    let consumed = 0
    if (details?.status) {
      consumed = await getProductAvailiablity(p, state.startDate, state.endDate)
      remaining = parseInt(details.quantity - consumed)
      remaining = remaining < 1 ? 0 : remaining
    }

    newFormValues[i]['code'] = e.target.value
    newFormValues[i]['name'] = ''
    newFormValues[i]['price'] = 0
    newFormValues[i]['days'] = state.initialDays
    newFormValues[i]['tcost'] = 0
    newFormValues[i]['quantity'] = 0
    newFormValues[i]['from'] = state.startDate
    newFormValues[i]['to'] = state.endDate

    if (details?.status) {
      newFormValues[i][e.target.name] = e.target.value
      newFormValues[i]['name'] = details.name
      newFormValues[i]['price'] = details.price
      newFormValues[i]['prtype'] = details.prtype
      newFormValues[i]['totalinstock'] = details.quantity
      newFormValues[i]['consumed'] = consumed
      newFormValues[i]['remaining'] = details.quantity - consumed
      newFormValues[i]['showalert'] = remaining > 0 ? false : true
      newFormValues[i][
        'message'
      ] = `There are only <strong>{element.remaining}</strong> items remaining between <strong>{state.startDate.toLocaleDateString()}</strong> and <strong>{state.endDate.toLocaleDateString()}</strong>`
    } else {
      if (details !== undefined) {
        newFormValues[i]['showalert'] = true
        newFormValues[i]['message'] = 'This item is inactive. This item cannot be added to invoice.'
      }
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
        })
      }
    }

    let tcost = newFormValues.reduce((a, b) => (a.tcost != '' ? a + b.tcost : a), 0)
    tcost = parseFloat(tcost).toFixed(2)
    setState((prevState) => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: newFormValues,
    }))
  }

  const calculateCostByQuantity = (product, index) => (event) => {
    // TODO:: add validation for availability
    if (product.remaining < event.target.value) {
      // alert(`Maximum quantity allowed is ${product.remaining}`)
      // element.showalert
      state.formValues[index].showalert = true

      setState((prevState) => ({
        ...prevState,
        isProceed: false,
        formValues: [...state.formValues],
      }))
    } else {
      // state.formValues[index].isProceed = true
      state.formValues[index].quantity = event.target.value
      state.formValues[index].showalert = false
      state.formValues[index].tcost = calculateCostByType(product)
      let tcost = updateTotalCost()
      tcost = parseFloat(tcost).toFixed(2)

      setState((prevState) => ({
        ...prevState,
        isProceed: true,
        totalCost: tcost,
        finalamount: tcost,
        payableamount: tcost,
        formValues: [...state.formValues],
      }))
    }
  }

  const updatePickUpDate = (date, product, i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['pickedon'] = date
    setState((prevState) => ({
      ...prevState,
      formValues: [...newFormValues],
    }))
  }

  const updateStartDate = (date, product, i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['from'] = date
    if (date > newFormValues[i]['to']) newFormValues[i]['to'] = date
    let d = newFormValues[i]['to'].getTime() - date.getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    newFormValues[i]['days'] = d
    newFormValues[i]['tcost'] = calculateCostByType(product)
    let tcost = updateTotalCost()
    tcost = parseFloat(tcost).toFixed(2)
    setState((prevState) => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: [...newFormValues],
    }))
  }

  const updateEndDate = (date, product, i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['to'] = date
    let d = date.getTime() - newFormValues[i]['from'].getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    newFormValues[i]['days'] = d
    newFormValues[i]['tcost'] = calculateCostByType(product)
    let tcost = updateTotalCost()
    tcost = parseFloat(tcost).toFixed(2)
    setState((prevState) => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      formValues: [...newFormValues],
    }))
  }

  const closeAlert = (i) => {
    let newFormValues = [...state.formValues]
    newFormValues[i]['showalert'] = false
    setState((prevState) => ({
      ...prevState,
      formValues: [...newFormValues],
    }))
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
    let tcost = updateTotalCost()
    tcost = parseFloat(tcost).toFixed(2)
    setState((prevState) => ({
      ...prevState,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      initialDays: days,
      startDate: startThisDate != '' ? startThisDate : state.startDate,
      endDate: endThisDate != '' ? endThisDate : state.endDate,
      formValues: [...newFormValues],
    }))
  }

  const countDays = (from, to) => {
    let d = 0
    d = to.getTime() - from.getTime()
    d = Math.ceil(d / (1000 * 3600 * 24)) + 1
    d = d == 0 ? 1 : d
    return d
  }

  const resetPickupDate = (date) => {
    let newFormValues = [...state.formValues]
    setState((prevState) => ({
      ...prevState,
      pickupon: date,
      formValues: [...newFormValues],
    }))
  }

  const resetEndDate = (date) => {
    // setStartDate(date)
    let endDate = ''
    if (date > state.endDate) endDate = date
    let d = countDays(date, state.endDate)
    // setDaysinForm(d, date, '')
    let newFormValues = [...state.formValues]

    newFormValues.map(async (i) => {
      if (i.code !== '') {
        let details = await getProductDetails(i.code)
        let consumed = await getProductAvailiablity(i.code, i.from, i.to)
        i.totalinstock = details.quantity
        i.consumed = consumed
        i.remaining = details.quantity - consumed
        i.showalert = details.quantity - consumed > 1 ? false : true
        i.from = date
        if (i.from > i.to) i.to = date
        if (endDate !== '') {
          i.to = endDate
        }
        i.days = d
        i.tcost = calculateCostByType(i)
      }
    })
    let tcost = updateTotalCost()
    tcost = parseFloat(tcost).toFixed(2)
    setState((prevState) => ({
      ...prevState,
      initialDays: d,
      totalCost: tcost,
      finalamount: tcost,
      payableamount: tcost,
      startDate: date,
      endDate: endDate !== '' ? endDate : state.endDate,
      formValues: [...newFormValues],
    }))
  }

  const checkAvail = () => {}

  let removeFormFields = (code, i) => {
    let newFormValues = [...state.formValues]
    newFormValues = newFormValues.filter((p) => p.code != code)
    setState((prevState) => ({
      ...prevState,
      formValues: [...newFormValues],
    }))
  }

  const changeEndDateAndCountDays = (date) => {
    let d = countDays(state.startDate, date)
    setDaysinForm(d, '', date)
  }

  const displayRecords = (element, index) => {
    return (
      <>
        <CRow className="mb-4" key={index}>
          <div className="col-sm-2">
            {/* {element.name !== '' ? (
            <CFormInput
              name="code"
              autoComplete="off"
              type="text"
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
          )} */}

            {/* <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              items={items}
              onChange={(e) => changeCode(index, e, element)}
              autoFocus
              styling={{
                // height: "34px",
                // margin: "0px",
                border: "1px solid darkgreen",
                borderRadius: "4px",
                backgroundColor: "white",
                boxShadow: "none",
                hoverBackgroundColor: "lightgreen",
                color: "darkgreen",
                fontSize: "12px",
                fontFamily: "Courier",
                iconColor: "green",
                lineColor: "lightgreen",
                placeholderColor: "darkgreen",
                clearIconMargin: "3px 8px 0 0",
                zIndex: 9999,
              }}
            /></div> */}
            {selectedScannedItem ? (
              <CFormInput
                name="code"
                autoComplete="off"
                type="text"
                autoFocus
                id="productCode"
                value={element.code}
                onChange={(e) => changeCode(index, e)}
                placeholder="Code(Ex: PR-12345)"
              />
            ) : (
              <CFormInput
                name="code"
                autoComplete="off"
                type="text"
                autoFocus
                id="productCode"
                onChange={(e) => changeCode(index, e)}
                placeholder="Code(Ex: PR-12345)"
              />
            )}
          </div>
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
            {/* {element.prtype} */}
            <CFormInput
              name="prtype"
              autoComplete="off"
              type="text"
              value={element.prtype?.charAt(0).toUpperCase() + element.prtype?.slice(1) || ''}
            />
          </div>

          <div className="col-sm-1">
            {element.price ? (
              <DatePicker
                className="form-control"
                selected={element.pickedon}
                onChange={(date: Date) => updatePickUpDate(date, element, index)}
              />
            ) : (
              <DatePicker disabled={true} className="form-control" selected={element.pickedon} />
            )}
          </div>

          <div className="col-sm-1">
            {element.price ? (
              <DatePicker
                className="form-control"
                selected={element.from}
                onChange={(date: Date) => updateStartDate(date, element, index)}
              />
            ) : (
              <DatePicker disabled={true} className="form-control" selected={element.from} />
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
                type="number"
                min={1}
                max={`${element.remaining}`}
                required
                autoComplete="off"
                onChange={calculateCostByQuantity(element, index)}
                placeholder={`Max ${element.remaining}`}
              />
            ) : (
              <CFormInput
                name="quantity"
                type="number"
                readOnly
                min={1}
                max={`${element.remaining}`}
                required
                autoComplete="off"
                onChange={calculateCostByQuantity(element, index)}
                placeholder={`Max ${element.remaining}`}
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
          <div className="col-sm-1 mt-1">
            {element.code && index < state.formValues.length - 1 ? (
              <button
                type="button"
                className="button remove"
                onClick={() => removeFormFields(element.code, index)}
              >
                <Archive title={`Remove the product`} size={10} />
              </button>
            ) : null}
          </div>
        </CRow>
      </>
    )
  }

  const updateFinalAmountByGST = (e) => {
    let f = parseFloat(state.finalamount)
    if (e != '') {
      e = parseInt(e)
      let gst = parseFloat(f * (e / 100))
      f = f + gst
    }

    setState((prevState) => ({
      ...prevState,
      gstpercentage: e,
      payableamount: f.toFixed(2),
    }))
  }

  const updateFinalAmount = (e) => {
    let f = parseFloat(state.finalamount)
    let gst = 0
    let fgst = parseFloat(state.finalamount)
    if (e != '') {
      e = parseInt(e)
      let d = state.totalCost * (e / 100)
      f = parseFloat(state.totalCost - d)
      fgst = f
      if (state.gstpercentage > 0) {
        gst = parseFloat(f * (state.gstpercentage / 100))
        fgst = f + gst
      }
    }
    setState((prevState) => ({
      ...prevState,
      discount: e,
      finalamount: f.toFixed(2),
      payableamount: fgst.toFixed(2),
    }))
  }

  const isBlocked = (value) => {
    let v = value ? 1 : 0
    setState((prevState) => ({
      ...prevState,
      isBlocked: v,
    }))
  }

  const renderResults = () => {
    return (
      <>
        <CRow>
          {refItems.current.length && (
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody>
                  <CRow>
                    <div className="col-sm-2">
                      <strong>Select Scanned Items</strong>
                    </div>
                    <div className="col-sm-4">
                      <select className="form-control" onChange={loadItemsIntoForm}>
                        <option>Select</option>
                        {refItems.current.map((i) => (
                          <option value={i.id}>{i.company}</option>
                        ))}
                      </select>
                    </div>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          )}

          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Create Quotation Invoice</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <div className="row col-sm-3">
                    <div className="col-sm-4">
                      <strong className="align-middle">Pickup Date :</strong>
                    </div>
                    <div className="col-sm-6">
                      <DatePicker
                        className="form-control"
                        selected={state.startDate}
                        onChange={(date: Date) => resetPickupDate(date)}
                      />
                    </div>
                  </div>
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
                  <div className="row col-sm-4">
                    <div className="col-sm-4 align-text-bottom">
                      <strong className="align-middle">
                        <label>
                          <input
                            type="checkbox"
                            name="isBlocked"
                            onChange={(event) => isBlocked(event.target.checked)}
                          />
                          &nbsp;&nbsp; Booked Items
                        </label>
                      </strong>
                    </div>
                    <div className="col-sm-6"></div>
                  </div>
                </CRow>
                <CRow>&nbsp;</CRow>
                <CRow className="mb-4">
                  <div className="col-sm-2">
                    <strong>Code</strong>
                  </div>
                  <div className="col-sm-2">
                    <strong>Name</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>Type of Prop</strong>
                  </div>
                  <div className="col-sm-1">
                    <strong>Pickup Date</strong>
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
                    <strong>Hire Cost</strong>
                  </div>
                </CRow>

                {
                  // setTimeout(() => {
                  state.formValues.map((element, index) => (
                    <>
                      {displayRecords(element, index)}
                      {element.showalert === true ? (
                        <Alert variant="danger" onClose={() => closeAlert(index)} dismissible>
                          {element.message}
                        </Alert>
                      ) : (
                        <></>
                      )}
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
                <Modal
                  show={state.showAddressForm}
                  onHide={() =>
                    setState((prevState) => ({
                      ...prevState,
                      showAddressForm: false,
                    }))
                  }
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={addDraftInvoice}>
                      <fieldset>
                        <legend>Company details</legend>
                        <div className="row">
                          <div className="col">
                            <input
                              name="companyName"
                              required
                              value={state.toName}
                              type="text"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  toName: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder="Company Name"
                            />
                          </div>
                          <div className="col-sm-12 mt-2">
                            <input
                              required
                              placeholder="Location"
                              value={state.toAddress}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  toAddress: e.target.value,
                                }))
                              }
                              className="form-control col-sm-12"
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col">
                            <input
                              required
                              value={state.artDirector}
                              type="text"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  artDirector: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder="Art Director Name"
                            />
                          </div>
                          <div className="col">
                            <select
                              required
                              className="form-control"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  contentType: e.target.value,
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
                              required
                              className="form-control"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  isWhat: e.target.value,
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
                              required
                              value={state.isWhatName}
                              type="text"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  isWhatName: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder={`${state.isWhat} Name`}
                            />
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col">
                            <input
                              required
                              value={state.contactName}
                              type="text"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  contactName: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder="Responsible Person Name"
                            />
                          </div>
                          <div className="col">
                            <input
                              required
                              value={state.contactPhone}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  contactPhone: e.target.value,
                                }))
                              }
                              type="text"
                              maxlength="10"
                              className="form-control"
                              placeholder="Responsible Person Phone Number"
                            />
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col">
                            <select
                              required
                              className="form-control"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  propReceiver: e.target.value,
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
                              required
                              value={state.propReceiverName}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  propReceiverName: e.target.value,
                                }))
                              }
                              type="text"
                              className="form-control"
                              placeholder="Receiver Name"
                            />
                          </div>

                          <div className="col">
                            <input
                              required
                              value={state.artPhone}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  artPhone: e.target.value,
                                }))
                              }
                              type="text"
                              maxlength="10"
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
                              required
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
                              required
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
                              onChange={(e) => updateFinalAmountByGST(e.target.value)}
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
                              type="number"
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  advancePay: e.target.value,
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
                              required={state.advancePay > 0 ? true : false}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  paymentMethod: e.target.value,
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
                                required={state.advancePay > 0 ? true : false}
                                value={state.transactionId}
                                type="text"
                                onChange={(e) =>
                                  setState((prevState) => ({
                                    ...prevState,
                                    transactionId: e.target.value,
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
                                required={state.advancePay > 0 ? true : false}
                                value={state.chequeNo}
                                type="text"
                                onChange={(e) =>
                                  setState((prevState) => ({
                                    ...prevState,
                                    chequeNo: e.target.value,
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
                                required={state.advancePay > 0 ? true : false}
                                value={state.bank}
                                type="text"
                                onChange={(e) =>
                                  setState((prevState) => ({
                                    ...prevState,
                                    bank: e.target.value,
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
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  gst: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder="Add GST/TIN"
                            />
                          </div>
                          <div className="col">
                            <input
                              required={state.advancePay ? true : false}
                              type="text"
                              value={state.vendoraddress}
                              onChange={(e) =>
                                setState((prevState) => ({
                                  ...prevState,
                                  vendoraddress: e.target.value,
                                }))
                              }
                              className="form-control"
                              placeholder="Vendor Address"
                            />
                          </div>
                        </div>
                      </fieldset>
                      <div>&nbsp;</div>
                      <div className="row mt-2 ">
                        <div className="col alignright">&nbsp;</div>
                        <div className="col alignright">
                          <input
                            type="submit"
                            value="Create Quotation"
                            className="btn btn-primary"
                          />
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <hr />
                  </Modal.Footer>
                </Modal>
              </div>
            </CCol>
          </CRow>
        </div>
      </>
    )
  }

  const addDraftInvoice = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    console.log(form.checkValidity())
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    // return false;

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
      payment_type: state.advancePay > 0 ? ADVANCE_PAY : 1,
      vendoraddress: state.vendoraddress,
      amt: state.advancePay ? state.advancePay : 0,
      pickedon:
        state.pickedon.getFullYear() +
        '-' +
        (state.pickedon.getMonth() + 1) +
        '-' +
        state.pickedon.getDate(),
      startDate:
        state.startDate.getFullYear() +
        '-' +
        (state.startDate.getMonth() + 1) +
        '-' +
        state.startDate.getDate(),
      endDate:
        state.endDate.getFullYear() +
        '-' +
        (state.endDate.getMonth() + 1) +
        '-' +
        state.endDate.getDate(),
      transId: state.transactionId,
      chequeno: state.chequeNo,
      bank: state.bank,
      discount: state.discount,
      gstpercentage: state.gstpercentage,
      finalamount: state.finalamount,
      payableamount: state.payableamount,
      totalCost: state.totalCost,
      isWhatName: state.isWhatName,
      isWhat: state.isWhat,
      isBlocked: state.isBlocked,
      scannedItemId: selectedScannedItem,
    }

    axios.post(`${process.env.REACT_APP_API_URL}/invoice/new`, p).then((response) => {
      state.formValues.map(async (product) => {
        if (product.code !== '') {
          let s = product.from
          let t = product.to
          let p = product.pickedon
          let payload = {
            invoice_id: response.data,
            code: product.code,
            days: product.days,
            quantity: product.quantity,
            cost: product.tcost,
            isBlocked: state.isBlocked,
            pickedon: p?.getFullYear() + '-' + (p?.getMonth() + 1) + '-' + p?.getDate(),
            startDate: s?.getFullYear() + '-' + (s?.getMonth() + 1) + '-' + s?.getDate(),
            endDate: t?.getFullYear() + '-' + (t?.getMonth() + 1) + '-' + t?.getDate(),
          }
          await axios.post(`${process.env.REACT_APP_API_URL}/invoice/draft`, payload)
        }
      })
      if (state.paymentMethod == '') history.push('/invoice/quotation')
      else history.push('/invoice/list')
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

        {state.formValues.length > 1 && state.isProceed ? (
          <div className="text-right">
            <input type="submit" value="Create Quotation" className="btn btn-primary" />
          </div>
        ) : (
          <>
            <div className="text-right">
              <input
                type="button"
                value="Create Quotation"
                disabled
                className="btn btn-secondary"
              />
            </div>
          </>
        )}
      </form>
      {DetailsPopUp()}
    </>
  )
}
export default DraftInvoice
