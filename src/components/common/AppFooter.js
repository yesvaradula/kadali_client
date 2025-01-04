import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="hideinprint">
      <div>
        <span className="ms-1">&reg; 2022 Right Choice.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        &copy; Admin - Right Choice
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
