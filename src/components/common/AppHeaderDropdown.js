import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import actions from '../../constants/actionTypes'

import avatar8 from './../../assets/images/avatar.png'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const { name, role } = useSelector((state) => state.auth.user) 
  const logUserOut = () => {
    dispatch({
      type: actions.LOGOUT,
    })
    location.reload();
  }

  const logout = () => dispatch(() => logUserOut()) 

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          {name}({role})
        </CDropdownHeader>
        
        <CDropdownItem href="#" onClick={() => logout() }>
          <CIcon onClick={() => logout() } icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
