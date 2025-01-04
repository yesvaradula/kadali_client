import React, { useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'
require('dotenv').config()

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
  CImage,
} from '@coreui/react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import CIcon from '@coreui/icons-react'
import { cilPen, cilFingerprint, cilDelete } from '@coreui/icons'

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

const ListCategories = (props) => {
  const [validated, setValidated] = useState(false)
  const [name, setName] = useState('')

  let [categories, setCategories] = useState([])
  const [resultLoaded, setResultLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCategories, setTotalCategories] = useState(0)
  const [pages, setPages] = useState(1)
  const [inputPage, setInputPage] = useState(1)

  const changeName = (e) => {
    setName(e.target.value)
  }

  const deleteItem = (id) => {
    if (window.confirm(`Deleting item with id ${id}`)) {
      let payLoad = { id: id }
      axios.post(`${process.env.REACT_APP_API_URL}/category/delete`, payLoad).then((response) => {
        console.log(response)
        if (response.data) {
          Swal.fire({
            icon: 'info',
            title: 'Success',
            text: 'Category deleted successfully',
            footer: '-'
          })
          fetchData(1)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Cannot delete category which has products',
            footer: '-'
          })
        }
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (name !== '') {

      // check before adding. 

      let payLoad = {
        name: name,
      }

      let res = await axios.post(`${process.env.REACT_APP_API_URL}/category/check`, payLoad)
      if (res.data.length === 0) {
        await axios.post(`${process.env.REACT_APP_API_URL}/category/add`, payLoad).then((response) => {
          fetchData(1)
          setName('')
          setValidated(false)
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: `${name}, already exists and cannot be added`,
          footer: '-'
        })
      }
    }
  }

  const fetchData = (p) => {
    setPage(p)
    axios.get(`${process.env.REACT_APP_API_URL}/category/${p}`).then((data) => {
      let numOfCategories = data.data.categories.total
      let p = data.data.categories.data
      setTotalCategories(numOfCategories)
      setCategories(p)
      setResultLoaded(true)
      setPages(Math.ceil(numOfCategories / 10))
    })
  }

  const gotoPage = (p) => {
    p = p <= 1 ? 1 : p
    p = p > pages ? pages : p
    setInputPage(p)
    fetchData(p)
  }

  useEffect(() => {
    if (resultLoaded === false) {
      fetchData(page)
    }
  })

  const writePagination = () => {
    return (
      <div style={{ marginRight: 5 }}>
        Goto Page &nbsp;&nbsp;
        <input
          style={{ width: '100px', padding: '5px' }}
          type="number"
          onChange={changePage}
          value={inputPage}
          width="3"
        />
        /{pages} &nbsp; &nbsp;
        <button onClick={() => gotoPage(inputPage)}>Go</button>
      </div>
    )
  }

  const changePage = (e) => {
    setInputPage(e.target.value)
    if (e.target.value !== '') {
      setTimeout(() => {
        gotoPage(e.target.value)
      }, 500);
    }
  }

  const nextPrevBtns = () => {
    return (
      <div>
        {page > 1 ? (
          <a href="javascript:void(0)" onClick={() => gotoPage(page - 1)}>
            Previous
          </a>
        ) : (
          <></>
        )}
        &nbsp; &nbsp;
        {page < pages ? (
          <a href="javascript:void(0)" onClick={() => gotoPage(page + 1)}>
            Next
          </a>
        ) : (
          <></>
        )}
      </div>
    )
  }

  const displayCats = () => {
    return (
      <>
        <table className="table prlist">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Added On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((p, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>

                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip-2">
                        Delete <b>{p.name}</b>
                      </Tooltip>
                    }
                  >
                    <Link to="#" path="#" onClick={() => deleteItem(p.id)}>
                      <CIcon icon={cilDelete} className="cricon" />
                    </Link>
                  </OverlayTrigger>
                  {/* <Navbar>
                    <Navbar.Collapse id="navbar-dark-example">
                      <Nav>
                        <NavDropdown
                          id="nav-dropdown-dark-example"
                          title="Action"
                          menuVariant="dark"
                        >
                          <NavDropdown.Item href={`#/category/${p.id}/delete`}>
                            Delete
                          </NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
  }

  return (
    <>
      <CForm
        className="g-3"
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <CRow>
          <CCol xs={12}>
            <CCard className="">
              <CCardHeader>
                <strong>Add Category</strong>
              </CCardHeader>
              <CCardBody>
                <CRow className="mb-4">
                  <div className="col-sm-1">
                    <CFormLabel htmlFor="categoryName" className="col-form-label">
                      <strong>Name</strong>
                    </CFormLabel>
                  </div>
                  <div className="col-sm-3">
                    <CFormInput
                      required
                      autocomplete="off"
                      type="text"
                      value={name}
                      id="categoryName"
                      onChange={changeName}
                      placeholder="Enter Category Name"
                    />
                    <CFormFeedback invalid>Please provide category name.</CFormFeedback>
                  </div>
                  <div className="col-sm-3">
                    <CButton color="secondary" type="submit">
                      Add Category
                    </CButton>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
      <CRow className="mt-4">
        <CCol xs={12}>
          <CCard className="">
            <CCardHeader>
              <strong>Category List</strong>
            </CCardHeader>
            <CCardBody>
              {displayCats()}
              <table className="table table">
                <tr>
                  <td>
                    Showing &nbsp;
                    {(page - 1) * 10 + 1} to{' '}
                    {totalCategories < page * 10 ? totalCategories : page * 10}
                    &nbsp; of {totalCategories} Products
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {totalCategories > 10 ? nextPrevBtns() : <div></div>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {totalCategories > 10 ? writePagination() : <div></div>}
                  </td>
                </tr>
              </table>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default ListCategories
