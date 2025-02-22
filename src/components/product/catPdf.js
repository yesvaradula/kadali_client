import React from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import useState from 'react-usestateref'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import Barcode from 'react-barcode'
import { getBarcodeBase64 } from './generateBarCode'
import {
  CButton,
  CCard,
  CFormLabel,
  CFormSelect,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSpreadsheet, cilColumns } from '@coreui/icons'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
// import { PDFDownloadLink } from '@react-pdf/renderer'

import { ProductPdf, ProductExcel, SampleDoc } from '../prints'
import Loader from '../common/loading'
import FullScreenLoader from '../common/fullscreenloading'
require('dotenv').config()

const CategoryListPDF = (props) => {
  // const [ex2Pdf, setEx2Pdf, refEx2Pdf] = useState(false)
  const [value, setValue] = React.useState(0)
  const [categoryList, setCategoryList] = React.useState([])
  const [products, setProduct] = React.useState([])
  const [category, setCategory] = React.useState('')
  const [resultLoaded, setResultLoaded] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [excelIds, setExcelIds, excelsRef] = useState(() => [])
  const [allProducts, setAllProducts, allProductsRef] = useState(() => [])
  const [allEBClicked, setEBClicked, allEBClickedRef] = useState(false)
  const [fullLoading, setFullLoading] = useState(false)
  const [subCats, setSubCats] = useState([])

  const getCategories = () => {
    setLoading(true)
    axios.get(`${process.env.REACT_APP_API_URL}/category`).then((data) => {
      setCategoryList(data.data)
      setResultLoaded(true)
      setLoading(false)
    })
  }

  const getAllProducts = () => {
    setLoading(true)
    setEBClicked(() => true)
    axios.get(`${process.env.REACT_APP_API_URL}/export/excel`).then((data) => {
      console.log(data)
      setAllProducts(data.data)
      setLoading(false)
      console.log(allProductsRef.current.data)
    })
  }

  const calculateSubCategories = (data) => {
    const uniqueSubcategories = [...new Set(data.map((item) => item.subcategory))]
    const newData = {}
    uniqueSubcategories.forEach((subcategory) => {
      newData[subcategory] = data.filter((item) => item.subcategory === subcategory)
    })
    setSubCats(newData)
  }

  const getListByCategory = async (prtype) => {
    setLoading(true)

    await axios
      .post(`${process.env.REACT_APP_API_URL}/category/products`, { category: prtype })
      .then(async (data) => {
        await setProduct(data.data)
        await calculateSubCategories(data.data)
        setLoading(false)
      })
  }

  React.useEffect(() => {
    if (resultLoaded === false) {
      getCategories()
    }
  })

  React.useEffect(async () => {
    if (allProductsRef.current.data?.length) {
      excelIds.length = 0
      let gTotal = 0
      const json = JSON.stringify(allProductsRef.current.data)
      let prs = JSON.parse(json)
      console.log(prs)
      prs.map((p) => {
        const total = p.price * p.quantity
        p.total = total
        gTotal += total
        excelIds.push(p)
      })
      excelIds.push({ total: gTotal })
      let excelRows = new Set(excelIds)
      setExcelIds(Array.from(excelRows))
    }
  }, [allProductsRef.current.data])

  React.useEffect(async () => {
    if (products?.length) {
      excelIds.length = 0
      let gTotal = 0
      const json = JSON.stringify(products)
      let prs = JSON.parse(json)
      prs.map((p) => {
        delete p.image
        const total = p.price * p.quantity
        p.total = total
        gTotal += total
        excelIds.push(p)
      })
      excelIds.push({ total: gTotal })
      let excelRows = new Set(excelIds)
      setExcelIds(Array.from(excelRows))
    }
  }, [products])

  const listOptions = () => {
    return categoryList.map((c) => <option value={c.name}> {c.name} </option>)
  }

  const setC = async (e) => {
    setEBClicked(false)
    await getListByCategory(e.target.value)
  }

  const exportToPdf = async () => {
    setFullLoading(true)
    const doc = new jsPDF()
    const groupedProducts = groupProductsBySubcategory(products)

    for (const subcategory in groupedProducts) {
      let yPosition = 20 // Reset position for new page
      let columnX = [10, 60, 110, 160] // X positions for four columns
      let rowHeight = 80 // Row height
      let productCount = 0

      // Add a new page for each subcategory (except the first one)
      if (doc.internal.pages.length > 1) {
        doc.addPage()
      }

      // Add Subcategory Title
      doc.setFontSize(18)
      doc.text(`Subcategory: ${subcategory}`, 10, yPosition)
      yPosition += 10

      for (let i = 0; i < groupedProducts[subcategory].length; i++) {
        const product = groupedProducts[subcategory][i]

        // Determine X position (Left or Right)
        let currentX = columnX[productCount % 4]

        // Load and add product image
        if (product.image) {
          try {
            const imageBase64 = await getImageBase64(product.image)
            doc.addImage(imageBase64, 'JPEG', currentX, yPosition, 30, 30)
          } catch (error) {
            setFullLoading(false)
            console.error('Error loading image', error)
          }
        }

        // Generate and add barcode
        if (product.code) {
          try {
            const barcodeBase64 = await getBarcodeBase64(product.code)
            doc.addImage(barcodeBase64, 'PNG', currentX, yPosition + 20, 30, 15)
          } catch (error) {
            console.error('Error generating barcode', error)
          }
        }

        // Add product details
        doc.setFontSize(5)
        let x = 35
        doc.text(`${product.name}`, currentX, yPosition + x)
        doc.text(`${product.code}`, currentX, yPosition + x + 3)
        doc.text(`${product.price}`, currentX, yPosition + x + 6)

        productCount++

        // If two products are placed in a row, move to the next row
        if (productCount % 4 === 0) {
          yPosition += rowHeight
        }

        // If yPosition exceeds page limit, add new page
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
          productCount = 0 // Reset count for new page
        }
      }
    }

    doc.save('products.pdf')
    setFullLoading(false)
  }

  const groupProductsBySubcategory = (products) => {
    const grouped = {}
    products.forEach((product) => {
      const subcategory = product.subcategory || 'Uncategorized'
      if (!grouped[subcategory]) {
        grouped[subcategory] = []
      }
      grouped[subcategory].push(product)
    })
    return grouped
  }

  // Function to convert image URL to Base64
  const getImageBase64 = (url) => {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.crossOrigin = 'Anonymous' // Handle CORS issues
      img.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg'))
      }
      img.onerror = reject
      img.src = url
    })
  }

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    )
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const exportAllProducts = () => {
    getAllProducts()
  }

  const allProductExport = () => {}

  return (
    <>
      {fullLoading ? <FullScreenLoader /> : <></>}

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Product Exporting</strong>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs={12}>
              <CRow>
                <div className="col-sm-1">
                  <CFormLabel htmlFor="category" className="col-form-label">
                    Choose
                  </CFormLabel>
                </div>
                <div className="col-sm-3">
                  {categoryList.length ? (
                    <CFormSelect required id="category" onChange={(e) => setC(e)}>
                      <option value="">Choose Category</option>
                      {listOptions()}
                    </CFormSelect>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-sm-5">
                  <CButton color="primary" type="button" onClick={() => exportAllProducts()}>
                    Click to Load All Products
                  </CButton>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {allEBClickedRef.current && allProductsRef.current.data ? (
                    <CSVLink data={excelsRef.current} filename={'all_products'}>
                      <CButton color="secondary" type="button">
                        Export All Products to Excel
                      </CButton>
                    </CSVLink>
                  ) : (
                    <> </>
                  )}
                </div>

                {products.length && !allEBClickedRef.current ? (
                  <>
                    {value === 1 ? (
                      <div className="col-sm-2">
                        <CButton color="primary" type="button" onClick={() => exportToPdf()}>
                          Export to PDF
                        </CButton>
                      </div>
                    ) : (
                      <></>
                    )}

                    {value === 0 ? (
                      <div className="col-sm-2">
                        <CSVLink data={excelsRef.current} filename={'products'}>
                          <CButton color="primary" type="button">
                            Export To Excel
                          </CButton>
                        </CSVLink>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {allEBClickedRef.current ? (
        <>
          <CCard>
            <CCardHeader>
              All Products <strong>({allProductsRef.current.data?.length})</strong>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {!loading && allProductsRef.current.data?.length == 0 ? (
                    <div>No Products found</div>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <ProductExcel data={allProductsRef.current.data} />
                    </Box>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </>
      ) : (
        <>
          <CCard>
            <CCardHeader>
              List of Products <strong>({products?.length})</strong>
              &nbsp;&nbsp;&nbsp; Sub Categories: <strong>{Object.keys(subCats).length} </strong>
            </CCardHeader>
            <CCardBody>
              <CCol xs={12}>
                <div style={{ marginLeft: '20px;' }}>
                  {loading ? <Loader /> : <></>}

                  {!loading && products.length == 0 ? (
                    <div>No Products found under {category} Category</div>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Excel/SpreadSheet" {...a11yProps(0)} />
                          <Tab label="PDF" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={value} index={0}>
                        <ProductExcel data={products} />
                      </CustomTabPanel>
                      <CustomTabPanel value={value} index={1}>
                        <div id="product-list">
                          <ProductPdf data={products} />
                        </div>
                      </CustomTabPanel>
                    </Box>
                  )}
                </div>
              </CCol>
            </CCardBody>
          </CCard>
        </>
      )}
    </>
  )
}

export default CategoryListPDF
