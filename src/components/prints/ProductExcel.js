import React from 'react'

export const ProductExcel = ({ data }) => {
  let gTotal = 0
  return (
    <table className="table prlist" id="table-to-excel">
      <thead>
        <tr>
          <th width="5%">Code</th>
          <th width="25%">Name</th>
          <th width="10%">NickName</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Sub-Category</th>
          <th>Type</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((p, i) => {
          const total = p.price * p.quantity    
          gTotal += total
          gTotal = Math.round(gTotal, 2) 
          return (
            <tr key={i}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.nickname}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>{p.subcategory}</td>
              <td>{p.prtype}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>{total}</td>
            </tr>
          )
        })}

        <tr>
          <th colSpan={9} style={{ textAlign: 'right', fontWeight: '800' }}>
            Total Price
          </th>
          <th>
            <strong>{gTotal}</strong>
          </th>
        </tr>
      </tbody>
    </table>
  )
}
