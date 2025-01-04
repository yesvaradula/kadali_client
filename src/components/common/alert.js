import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Alert from 'react-bootstrap/Alert'

const AlertMessage = (props) => {
  return <div>{props.message}</div>
}

export default AlertMessage
