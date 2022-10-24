import React from 'react'
import { Button } from 'react-bootstrap'
import plusIcon from '../assets/images/tabler_plus.svg'

const AddButton = ({...rest}) => {
  return (
    <Button variant='blue' className='rounded-pill px-4 fw-bold' {...rest}><img src={plusIcon} alt='plus' />Tambah</Button>
  )
}

export default AddButton