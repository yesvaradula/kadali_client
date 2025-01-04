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

const AddProducts = (props) => {
  const [validated, setValidated] = useState(false)
  const history = useHistory()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sname, setSName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [cost, setCost] = useState(0)
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState('')
  const [alertNum, setAlertNum] = useState(1)
  const [model, setModel] = useState('')
  const [prType, setPrType] = useState('')
  const [unit, setUnit] = useState('unit')
  const [godawn, setGodawn] = useState(1)

  const [prodImage, setProdImage] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [resultLoaded, setResultLoaded] = useState(false)
  const [loading, setLoading] = useState(true)

  const getCategories = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/category`).then((data) => {
      setCategoryList(data.data)
      setResultLoaded(true)
      // setLoading(false)
    })
  }

  useEffect(() => {
    if (resultLoaded === false) {
      getCategories()
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      console.log("should be here...")
      console.log(event)
      event.preventDefault()
      event.stopPropagation()
      setValidated(false)
    }

    setValidated(true)
    setLoading(true)

    if (code && name && sname && category && subCategory && quantity) {
      let payLoad = {
        code: code,
        name: name,
        sname: sname,
        brand: brand,
        category: category,
        subcategory: subCategory,
        cost: cost,
        price: price,
        quantity: quantity,
        alertNum: alertNum,
        prodImage: prodImage,
        model: model,
        prtype: prType,
        unit: unit,
        godawan: godawn,
      }

      axios.post(`${process.env.REACT_APP_API_URL}/products/add`, payLoad).then((response) => {
        if (response.status === 200) {
          history.push('/products/list/1')
        }
      })
    }
  }

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  const create_src = (type, buffer) => {
    let base64Flag = 'data:image/' + type + ';base64,';
    let base64string = arrayBufferToBase64(buffer);
    let result = base64Flag + base64string;
    return result;
  }

  const baseImage = (e) => {
    let img = new Image;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let maxW = 512;
    let maxH = 512;
    img.onload = () => {
      let iw = img.width;
      let ih = img.height;
      let scale = Math.min((maxW / iw), (maxH / ih));
      let iwScaled = iw * scale;
      let ihScaled = ih * scale;
      canvas.width = iwScaled;
      canvas.height = ihScaled;
      ctx.drawImage(img, 0, 0, iwScaled, ihScaled);
      let imageCode = canvas.toDataURL("image/jpeg", 0.5);
      setProdImage(imageCode)
    }
    img.src = URL.createObjectURL(e.target.files[0]);
  }

  const changeCode = (e) => {
    // setCode(e.target.value)
  }

  const listOptions = () => {
    return categoryList.map((c) => <option value={c.name}>{c.name}</option>)
  }

  const updateFinalPrice = (e) => {
    let c = parseInt(e.target.value);
    setCost(c)
    c = parseFloat(c + (c * 0.1)).toFixed(2)
    setPrice(c)
  }

  const getFirstLetter = (words) => {
    let matches = words.match(/\b(\w)/g);
    return matches?.join('').toUpperCase();
  }

  const setC = (e) => {
    setCategory(e.target.value)
    setSubCategory('')
  }

  const setSubC = (e) => {
    setLoading(true)
    setCode('')
    let categoryFL = getFirstLetter(category)
    let fLetters = getFirstLetter(e.target.value);
    setSubCategory(e.target.value)
    fLetters = categoryFL + fLetters;
    axios.get(`${process.env.REACT_APP_API_URL}/products/getNextCode/${fLetters}`).then((res) => {
      setCode(res.data);
      setLoading(false)
    })
  }

  const printGodawns = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ]

  return setResultLoaded ? (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={(e) => handleSubmit(e)}
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
                      required
                      id="category"
                      onChange={(e) => setC(e)}
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
                    autocomplete="off"
                    id="subcategory"
                    onChange={() => setLoading(true)}
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
                    readOnly
                    value={code}
                    autocomplete="off"
                    type="text"
                    id="productCode"
                    // onChange={changeCode}
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
                    autocomplete="off"
                    type="text"
                    id="productName"
                    onChange={(e) => { setLoading(false); setName(e.target.value) }}
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
                    autocomplete="off"
                    type="text"
                    maxlength="25"
                    id="productName"
                    onChange={(e) => { setLoading(false); setSName(e.target.value) }}
                    placeholder="Enter Product Nick(Short) Name"
                  />
                  <CFormFeedback invalid>Please enter product name.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="prtype" className="col-form-label">
                    Pr.Type
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormSelect required id="prtype" onChange={(e) => { setLoading(false); setPrType(e.target.value) }}>
                    <option value="">Choose...</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="antique">Antique</option>
                    <option value="damage">Damaged</option>
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
                    autocomplete="off"
                    type="text"
                    id="model"
                    onChange={(e) => { setLoading(false); setModel(e.target.value) }}
                    placeholder="Enter Brand"
                  />
                  <CFormFeedback invalid>Please enter Brand.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="brandName" className="col-form-label">
                    Size
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    type="text"
                    autocomplete="off"
                    id="brandName"
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Enter Size"
                  />
                  <CFormFeedback invalid>Please enter size.</CFormFeedback>
                </div>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="unitchange" className="col-form-label">
                    Unit
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  <CFormInput
                    type="text"
                    autocomplete="off"
                    id="unitchange"
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Unit. Eg: Kgs/Dozens"
                  />
                </div>
              </CRow>
              <hr />
              <CRow className="mb-4">
                <div className="col">
                  <CFormSelect required id="godown"
                    onChange={(e) => setGodawn(e.target.value)}>
                    {printGodawns.map(i => <option value={i}>Godown - {i}</option>)}
                  </CFormSelect>
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    id="cost"
                    required
                    value={cost}
                    onChange={(e) => { setLoading(false); updateFinalPrice(e) }}
                    placeholder="Purchase Price"
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    id="price"
                    required
                    value={price}
                    disabled
                    placeholder="Final Price "
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    required
                    id="quantity"
                    onChange={(e) => { setLoading(false); setQuantity(e.target.value) }}
                    placeholder="Enter Quantity"
                  />
                </div>
                <div className="col">
                  <CFormInput
                    type="number"
                    autocomplete="off"
                    id="alert"
                    value={alertNum}
                    onChange={(e) => setAlertNum(e.target.value)}
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
                        {/* {prodImage !== '' ? (
                          <img src={prodImage} alt="Product Image" width={150} height={150} />
                        ) : (
                          ''
                        )} */}

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
                      {code !== '' ? (
                        <QrCode url={code} />
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
                      {code !== '' ? (
                        <Barcode value={code} width="2" height="40" />
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
            {
              loading ?
                <CButton color="secondary" type="button" disabled>
                  Add Product
                </CButton>
                :
                <CButton color="primary" type="submit">
                  Add Product
                </CButton>
            }
          </div>
        </CRow>
      </CCol>
    </CForm>
  ) : (
    <></>
  )
}

export default AddProducts
