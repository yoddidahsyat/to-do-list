import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Dropdown, CloseButton } from 'react-bootstrap'
import dropdownIcon from '../assets/images/tabler_chevron-down.svg'

const priorities = [
    {key: 'very-high', label: 'Very High', color: 'red'},
    {key: 'high', label: 'High', color: 'yellow'},
    {key: 'normal', label: 'Medium', color: 'green'},
    {key: 'low', label: 'Low', color: 'blue'},
    {key: 'very-low', label: 'Very Low', color: 'purple'}
]

const ListModal = ({show, hide, confirm, data, type}) => {

    const [form, setForm] = useState({
        title: '',
        priority: 'very-high'
    })

    useEffect(() => {
        if(data) {
            setForm(data)
        }else{
            setForm({
                title: '',
                priority: 'very-high'
            })
        }
    }, [data])

    useEffect(()=>{
        if(!show){
            setForm({
                title: '',
                priority: 'very-high'
            })
        }
    }, [show])

    const handleChangeTitle = (event) => {
        setForm({
            ...form,
            title: event.target.value
        })
    }

    const handleChangePriority = (eventKey, event) => {
        event.preventDefault()
        setForm({
            ...form,
            priority: eventKey
        })
    }
    
    const {label, color} = priorities.find(item => form.priority === item.key)
    const PriorityDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
        <button
            className='btn btn-white ms-0'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
            data-cy={`${type}-priority-dropdown`}
            >
            <div className='d-flex align-items-center'>
                <div className={`icon-priority bg-${color}`} />
                {label}
                <img src={dropdownIcon} alt='select_icon' className='ms-3' />
            </div>
            {children}
        </button>
    ));

    const handleSave = () => {
        hide()
        confirm(form)
    }


    return (
        <Modal show={show} onHide={hide} size='lg' centered data-cy={type}>
            <Modal.Header className='px-5'>
                <Modal.Title className='fw-semibold fs-18' data-cy={`${type}-title`}>{data ? 'Ubah' : 'Tambah'} List Item</Modal.Title>
                <CloseButton onClick={hide} data-cy={`${type}-close-button`} />
            </Modal.Header>
            <Modal.Body className='px-5 pt-3'>
                <Form>
                    <Form.Group className='my-3' controlId="listItem">
                        <Form.Label className='fs-12 fw-semibold' data-cy={`${type}-name-title`}>NAMA LIST ITEM</Form.Label>
                        <Form.Control type="text" placeholder="Tambahkan nama list item" value={form.title} onChange={handleChangeTitle}  data-cy={`${type}-name-input`} />
                    </Form.Group>
                    <Form.Group className='my-3' controlId="priority">
                        <Form.Label className='fs-12 fw-semibold' data-cy={`${type}-priority-title`}>PRIORITY</Form.Label>
                        <Dropdown variant='white' id="dropdown-item-button" onSelect={handleChangePriority}>
                            <Dropdown.Toggle as={PriorityDropdownToggle} />
                            <Dropdown.Menu>
                                {priorities.map(({label, color, key}) => 
                                    <Dropdown.Item as="button" key={key} eventKey={key} className='d-flex align-items-center' data-cy={`${type}-priority-item`}><div className={`icon-priority bg-${color}`} />{label}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className='px-5'>
                <Button variant='blue' className='rounded-pill px-4 fw-semibold' onClick={handleSave} disabled={form.title === ''} data-cy={`${type}-save-button`}>Simpan</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ListModal