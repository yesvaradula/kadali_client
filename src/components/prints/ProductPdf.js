import React from 'react'
import Barcode from 'react-barcode'

export const ProductPdf = ({ data }) => {
  const uniqueSubcategories = [...new Set(data.map((item) => item.subcategory))]

  const newData = {}

  uniqueSubcategories.forEach((subcategory) => {
    newData[subcategory] = data.filter((item) => item.subcategory === subcategory)
  })

  return (
    <div>
      {Object.keys(newData).map((subcategory) => (
        <div key={subcategory.replace(/ /g, '_')}>
          <table id={subcategory.replace(/ /g, '_')}>
            <tr>
              <td style={{ paddingBottom: '10px', paddingLeft: '0px' }}>
                <span className="sub_cat_heading">{subcategory}</span>
              </td>
            </tr>
            <tr>
              {newData[subcategory].map((item) => {
                return (
                  <>
                    <td className="pdfclass">
                      <div>
                        <div className="text-center ">
                          <img className="image-border" src={item.image} width={150} height={150} />
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid' }}>
                        <div className="text-center" style={{ border: '1px solid' }}>
                          <Barcode
                            value={`${item.code}`}
                            width={2.2}
                            height={55}
                            displayValue="false"
                            renderer="img"
                          />
                        </div>
                        <div>{item.name}</div>
                        <div>Code: {item.code}</div>
                        <div>Cost: {item.price}</div>
                      </div>
                    </td>
                  </>
                )
              })}
            </tr>
          </table>
          <hr />
        </div>
      ))}
    </div>
  )
}
