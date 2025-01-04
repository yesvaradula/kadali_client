import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import axios from 'axios'
require('dotenv').config()

import QrCode from './QRCode'
import Barcode from 'react-barcode'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
  CRow,
} from '@coreui/react'

const EditProduct = (props) => {
  const history = useHistory()
  const [validated, setValidated] = useState(false)
  const [state, setState] = useState({
    id: '',
    code: '',
    name: '',
    sname: '',
    brand: '',
    category: '',
    subcategory: '',
    cost: '',
    price: '',
    quantity: '',
    alertnum: '',
    model: '',
    prtype: '',
    unit: '',
    prodimage: '',
    godawan: '',
    showOriginalImage: true,
  })

  const [categoryList, setCategoryList] = useState([])
  const [resultLoaded, setResultLoaded] = useState(false)

  const printGodawns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const getCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/category`).then((data) => {
      setCategoryList(data.data)
      setResultLoaded(true)
    })
  }

  useEffect(() => {
    console.log(props.match.params)
    if (resultLoaded === false) {
      // get product details
      axios
        .get(`${process.env.REACT_APP_API_URL}/products/details/${props.match.params.id}`)
        .then((response) => {
          let p = response.data[0]
          setState((prevState) => ({
            ...prevState,
            id: p.id,
            code: p.code,
            name: p.name,
            sname: p.nickname,
            brand: p.brand,
            category: p.category,
            subcategory: p.subcategory,
            cost: p.cost,
            price: p.price,
            quantity: p.quantity,
            alertnum: p.alert,
            model: p.model,
            prtype: p.prtype,
            unit: p.unit,
            godawan: p.godawan,
            prodimage: p.image,
            secretCode: p.code,
          }))
          getCategories()
        })
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)

    axios.post(`${process.env.REACT_APP_API_URL}/products/update`, state).then((response) => {
      if (response.status === 200) {
        console.log(props.match.params)
        if (props.match.params.s !== '') {
          history.push(`/products/list/${props.match.params.p}/${props.match.params.s}`)
        } else {
          history.push(`/products/list/${props.match.params.p}`)
        }
      }
    })
  }

  const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    let bytes = [].slice.call(new Uint8Array(buffer))
    bytes.forEach((b) => (binary += String.fromCharCode(b)))
    return window.btoa(binary)
  }

  const create_src = (type, buffer) => {
    let base64Flag = 'data:image/' + type + ';base64,'
    let base64string = arrayBufferToBase64(buffer)
    let result = base64Flag + base64string
    return result
  }

  const baseImage = (e) => {
    let img = new Image()
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    let maxW = 512
    let maxH = 512
    img.onload = () => {
      let iw = img.width
      let ih = img.height
      let scale = Math.min(maxW / iw, maxH / ih)
      let iwScaled = iw * scale
      let ihScaled = ih * scale
      canvas.width = iwScaled
      canvas.height = ihScaled
      ctx.drawImage(img, 0, 0, iwScaled, ihScaled)
      let imageCode = canvas.toDataURL('image/jpeg', 0.5)
      setState((prevState) => ({
        ...prevState,
        prodimage: imageCode,
        showOriginalImage: false,
      }))
    }
    img.src = URL.createObjectURL(e.target.files[0])
  }

  const listOptions = () => {
    return categoryList.map((c) => <option value={c.name}>{c.name}</option>)
  }

  const updateFinalPrice = (e) => {
    let c = parseInt(e.target.value)
    let p = parseFloat(c + c * 0.1).toFixed(2)

    setState((prevState) => ({
      ...prevState,
      cost: c,
      price: p,
    }))
  }

  const getFirstLetter = (words) => {
    let matches = words.match(/\b(\w)/g)
    return matches.join('').toUpperCase()
  }

  const setSubC = (e) => {
    if (e.target.value !== '') {
      let categoryFL = getFirstLetter(state.category)
      let fLetters = getFirstLetter(e.target.value)
      fLetters = categoryFL + fLetters
      const first3 = state.secretCode.substring(0, 3)

      if (first3 !== fLetters) {
        axios
          .get(`${process.env.REACT_APP_API_URL}/products/getNextCode/${fLetters}`)
          .then((res) => {
            setState((prevState) => ({
              ...prevState,
              code: res.data,
            }))
          })
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        code: state.secretCode,
      }))
    }
  }

  return setResultLoaded ? (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Products to Store</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-4">
                <div className="col-sm-1">
                  <CFormLabel htmlFor="category" className="col-form-label">
                    Category
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  {categoryList.length ? (
                    <CFormSelect
                      value={state.category}
                      required
                      id="category"
                      onChange={(e) =>
                        setState((prevState) => ({
                          ...prevState,
                          category: e.target.value,
                          subcategory: '',
                        }))
                      }
                    >
                      <option value="">Choose Category</option>
                      {listOptions()}
                    </CFormSelect>
                  ) : (
                    <></>
                  )}
                  <CFormFeedback invalid>Please Select category.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="subcategory" className="col-form-label">
                    Sub-Category
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    type="text"
                    value={state.subcategory}
                    autocomplete="off"
                    id="subcategory"
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        subcategory: e.target.value,
                      }))
                    }
                    onBlur={(e) => setSubC(e)}
                    placeholder="Enter Sub Category"
                  />
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="productCode" className="col-form-label">
                    code
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    required
                    value={state.code}
                    autocomplete="off"
                    type="text"
                    id="productCode"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        code: e.target.value,
                      }))
                    }}
                    placeholder="Enter Product Code(Ex: PR-12345)"
                  />
                  <CFormFeedback invalid>Please provide product code.</CFormFeedback>
                </div>
              </CRow>
              <CRow className="mt-2 mb-4">
                <div className="col-sm-1">
                  <CFormLabel htmlFor="productName" className="col-form-label">
                    Name
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    required
                    value={state.name}
                    autocomplete="off"
                    type="text"
                    id="productName"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }))
                    }}
                    placeholder="Enter Product Name"
                  />
                  <CFormFeedback invalid>Please enter product name.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="productName" className="col-form-label">
                    NickName
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    required
                    value={state.sname}
                    autocomplete="off"
                    type="text"
                    maxlength="25"
                    id="productNickName"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        sname: e.target.value,
                      }))
                    }}
                    placeholder="Enter Product Nick(Short) Name"
                  />
                  <CFormFeedback invalid>Please enter nick product name.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="prtype" className="col-form-label">
                    Pr.Type
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormSelect
                    required
                    id="prtype"
                    value={state.prtype}
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        prtype: e.target.value,
                      }))
                    }}
                  >
                    <option value="">Choose...</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="antique">Antique</option>
                    <option value="damage">Damage</option>
                  </CFormSelect>
                  <CFormFeedback invalid>Please select product type.</CFormFeedback>
                </div>
              </CRow>
              <CRow className="mt-2 mb-4">
                <div className="col-sm-1">
                  <CFormLabel htmlFor="model" className="col-form-label">
                    Brand
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    required
                    value={state.model}
                    autocomplete="off"
                    type="text"
                    id="model"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        model: e.target.value,
                      }))
                    }}
                    placeholder="Enter Brand"
                  />
                  <CFormFeedback invalid>Please enter model.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="brandName" className="col-form-label">
                    Size
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    type="text"
                    value={state.brand}
                    autocomplete="off"
                    id="brandName"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        brand: e.target.value,
                      }))
                    }}
                    placeholder="Enter Size"
                  />
                  <CFormFeedback invalid>Please enter Brand.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="unitchange" className="col-form-label">
                    Unit
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    type="text"
                    value={state.unit}
                    autocomplete="off"
                    id="unitchange"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        unit: e.target.value,
                      }))
                    }}
                    placeholder="Unit. Eg: Kgs/Dozens"
                  />
                </div>
              </CRow>
              <hr />
              <CRow className="mb-4">
                <div className="col">
                  <CFormSelect
                    value={state.godawan}
                    id="godown"
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        godawan: e.target.value,
                      }))
                    }
                  >
                    {printGodawns.map((i) => (
                      <option value={i}>Godown - {i}</option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    value={state.cost}
                    autocomplete="off"
                    id="cost"
                    required
                    onChange={(e) => updateFinalPrice(e)}
                    placeholder="Purchased Price"
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    id="price"
                    required
                    value={state.price}
                    disabled
                    placeholder="Final Price "
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    required
                    value={state.quantity}
                    id="quantity"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        quantity: e.target.value,
                      }))
                    }}
                    placeholder="Enter Quantity"
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    required
                    id="alert"
                    value={state.alertnum}
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        alertnum: e.target.value,
                      }))
                    }}
                    placeholder="Enter Alerting Quantity"
                  />
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="">
            <CCardHeader>
              <strong>Product Image and QR/Bar Codes</strong>
            </CCardHeader>
            <CCardBody>
              <div className="col-sm-4 mr-2" style={{ float: 'left' }}>
                <CCard className="">
                  <CCardHeader>
                    <strong>Product Image</strong>
                  </CCardHeader>
                  <CCardBody>
                    <div className="">
                      <div className="text-center">
                        {state.showOriginalImage ? (
                          <>
                            <img src={state.prodimage} />
                          </>
                        ) : (
                          <></>
                        )}
                        <canvas id="canvas" width="64" height="64"></canvas>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="input"
                          onChange={baseImage}
                          className="mb-4 mt-4 form-control"
                        />
                      </div>
                    </div>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-sm-4" style={{ float: 'left' }}>
                <CCard className="">
                  <CCardHeader>
                    <strong>Product QR Code</strong>
                  </CCardHeader>
                  <CCardBody>
                    <div className="text-center">
                      {state.code !== '' ? (
                        <QrCode url={state.code} />
                      ) : (
                        <div>Enter Product Code to get QR Code</div>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </div>
              <div className="col-sm-4" style={{ float: 'right' }}>
                <CCard className="">
                  <CCardHeader>
                    <strong>Product Bar Code</strong>
                  </CCardHeader>
                  <CCardBody>
                    <div className="text-center">
                      {state.code !== '' ? (
                        <Barcode value={state.code} width="2" height="40" />
                      ) : (
                        <div>Enter Product Code to get Bar Code</div>
                      )}
                    </div>
                  </CCardBody>
                </CCard>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <hr />
      <CCol xs={12} className="text-right">
        <CRow className="mb-4 text-right">
          <div className="col-sm-1">
            <CButton color="secondary" type="reset">
              Clear
            </CButton>
          </div>
          <div className="col-sm-3">
            <CButton color="primary" type="submit">
              Submit form
            </CButton>
          </div>
        </CRow>
      </CCol>
    </CForm>
  ) : (
    <></>
  )
}

export default EditProduct
