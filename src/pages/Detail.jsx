import React, { useEffect, useState } from 'react'
import backIcon from '../assets/images/todo-back-button.svg'
import editIcon from '../assets/images/todo-title-edit-button.svg'
import editItemIcon from '../assets/images/todo-item-edit-button.svg'
import deleteIcon from '../assets/images/activity-item-delete-button.svg'
import sortIcon from '../assets/images/todo-sort-button.svg'
import empty from '../assets/images/todo-empty-state.svg'
import AddButton from '../components/AddButton'
import { useNavigate, useParams } from 'react-router-dom'
import ListModal from '../components/ListModal'
import { Button, Dropdown, Form } from 'react-bootstrap'
import DeleteModal from '../components/DeleteModal'
import Loading from '../components/Loading'
import { API } from '../config/API'
import AlertModal from '../components/AlertModal'

const priorities = [
    {key: 'very-high', color: 'red'},
    {key: 'high', color: 'yellow'},
    {key: 'normal', color: 'green'},
    {key: 'low', color: 'blue'},
    {key: 'very-low', color: 'purple'}
]

const Detail = () => {

    const activityId = useParams().id
    const [list, setList] = useState([])
    const [title, setTitle] = useState(`New Activity`)
    const [onTitleChange, setOnTitleChange] = useState(false)
    const [item, setItem] = useState(undefined)
    const [listModalShow, setListModalShow] = useState(false)
    const [deleteModalShow, setDeleteModalShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [sort, setSort] = useState('latest')
    
    const getList = async () => {
        try {
            setLoading(true);
            const response = await API(`/todo-items?activity_group_id=${activityId}`);
            // console.log(response)
            // setList(response.data.data);
            sortList(sort, response.data.data)
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
        // sortList(sort)
    }
    
    const getActivity = async () => {
        try {
            setLoading(true);
            const response = await API(`/activity-groups/${activityId}`);
            setTitle(response.data.title)
            setList(response.data.todo_items);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getActivity()
        // getList()
    }, [])

    const navigate = useNavigate()
    const goBack = () => navigate('/')

    const toggleChangeTitle = () => setOnTitleChange(!onTitleChange)
    useEffect(()=>{
        if (onTitleChange) {
            document.getElementById('todo-title-input').focus()
        } else {
            changeTitle()
        }
    }, [onTitleChange])

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    }
    const changeTitle = async () => {
        try {
            setLoading(true);
            const response = await API.patch(`/activity-groups/${activityId}`, {title});
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    const hideListModal = () => setListModalShow(false)
    const hideDeleteModal = () => setDeleteModalShow(false)
    
    const handleAddItem = () => {
        setItem(undefined)
        setListModalShow(true)
    }

    const handleEditItem = (data) => {
        setItem(data)
        setListModalShow(true)
    }

    const handleDeleteItem = (data) => {
        setItem(data)
        setDeleteModalShow(true)
    }

    const handleCheckItem = async (item) => {
        const newList = list.filter(listItem => listItem.id !== item.id)
        const body = {
            activity_group_id: item.activity_group_id,
            id: item.id,
            title: item.title,
            priority: item.priority,
            is_active: item.is_active === 0 ? 1 : 0
        }
        // setList([...newList, {...body}])
        try {
            const response = await API.patch(`/todo-items/${item.id}`, body);
            const {id, title, priority, activity_group_id, is_active} = response.data
            setList([...newList, {id, title, priority, activity_group_id, is_active}])
        } catch (err) {
            console.log(err);
        }
    }

    const addItem = async ({title, priority}) => {
        const body = {
            activity_group_id: activityId,
            title,
            priority,
        }
        try {
            setLoading(true);
            const response = await API.post(`/todo-items/`, body);
            const {id, title, priority, activity_group_id, is_active} = response.data
            // setList([...list, {id, title, priority, activity_group_id, is_active}])
            getList()
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    const editItem = async ({title, priority, is_active}) => {
        // const newList = list.filter(listItem => listItem.id !== item.id)
        const body = {
            id: item.id,
            title,
            priority,
            is_active
        }
        try {
            setLoading(true);
            const response = await API.patch(`/todo-items/${item.id}`, body);
            const {id, title, priority, activity_group_id, is_active} = response.data
            // setList([...newList, {id, title, priority, activity_group_id, is_active}])
            getList()
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    const deleteItem = async () => {
        // const newList = list.filter(listItem => listItem.id !== item.id)
        try {
            setLoading(true);
            await API.delete(`/todo-items/${item.id}`);
            // setList([...newList])
            getList()
            showAlert()
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
        setDeleteModalShow(false)
    }

    const showAlert = () => {
        setAlert(true)
        setTimeout(hideAlert, 1000)
    }
    const hideAlert = () => setAlert(false)

    const SortButton = React.forwardRef(({ children, onClick }, ref) => (
        <Button
            size='sm'
            variant='transparent'
            className='p-0 me-3'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
            data-cy='todo-sort-button'
            >
            <img src={sortIcon} alt='sort_icon' />
            {children}
        </Button>
    ));

    const handleSort = (eventKey, event) => {
        event.preventDefault()
        setSort(eventKey)
    }

    const sortList = (sort, list) => {
        switch(sort){
            case 'az':
                setList([...list].sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
                break;
            case 'za':
                setList([...list].sort((a, b) => a.title > b.title ? -1 : a.title < b.title ? 1 : 0))
                break;
            case 'unfinished':
                setList([...list].sort((a, b) => (a.is_active > b.is_active) ? -1 : (a.is_active < b.is_active) ? 1 : 0))
                break;
            case 'oldest':
                setList([...list].sort((a, b) => a.id - b.id))
                break;
            case 'latest':
            default:
                setList([...list].sort((a, b) => b.id - a.id))
                break;
        }
    }
    
    useEffect(()=>{
        sortList(sort, list)
    }, [sort])

    return (
        <div className='container py-5'>
            <div className="row">
                <div className="col d-flex justify-content-between">
                    <div className='d-flex align-items-center py-1'>
                        <img src={backIcon} alt='back' role='button' onClick={goBack} data-cy='todo-back-button' />
                        {
                            !onTitleChange ? <h1 className='fw-bold fs-36 mb-0 mx-3' data-cy='todo-title' onClick={toggleChangeTitle}>{title}</h1> :
                            <input id='todo-title-input' value={title} className='input-title mx-3' onChange={handleChangeTitle} onBlur={toggleChangeTitle} />
                        }
                        <img src={editIcon} alt='edit' role='button' onClick={toggleChangeTitle} data-cy='todo-title-edit-button' />
                    </div>
                    <div className='d-flex'>
                        <Dropdown onSelect={handleSort}>
                            <Dropdown.Toggle as={SortButton} />
                            <Dropdown.Menu>
                                <Dropdown.Item as="button" eventKey='latest' className='d-flex align-items-center' data-cy='sort-latest'>Terbaru</Dropdown.Item>
                                <Dropdown.Item as="button" eventKey='oldest' className='d-flex align-items-center' data-cy='sort-oldest'>Terlama</Dropdown.Item>
                                <Dropdown.Item as="button" eventKey='az' className='d-flex align-items-center' data-cy='sort-az'>A-Z</Dropdown.Item>
                                <Dropdown.Item as="button" eventKey='za' className='d-flex align-items-center' data-cy='sort-za'>Z-A</Dropdown.Item>
                                <Dropdown.Item as="button" eventKey='unfinished' className='d-flex align-items-center' data-cy='sort-unfinished'>Belum Selesai</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <AddButton onClick={handleAddItem} data-cy='todo-add-button' />
                    </div>
                </div>
            </div>
            <div className="row mt-5">
            { loading ? <Loading /> : 
            list.length < 1 ?
                <div className="col text-center">
                    <img src={empty} alt='Empty list' data-cy='todo-empty-state' />
                </div>
            :
                list.map( item => {
                    const checkedClass = item.is_active === 0 ? 'checked' : ''
                    const { color } = priorities.find(priority => priority.key === item.priority)
                    const label = <><div className={`icon-priority-sm bg-${color}`} data-cy='todo-item-priority-indicator' /><span className={checkedClass} data-cy='todo-item-title'>{item.title}</span></>
                    return (
                        <div className="card-list position-relative" key={item.id} data-cy='todo-item'>
                            <Form.Check type='checkbox' id={item.id} key={item.id} label={label} className='fw-medium fs-18' onChange={() => handleCheckItem(item)} checked={!item.is_active} data-cy='todo-item-checkbox' />
                            <img src={editItemIcon} alt='edit item' className='text-lightgrey ms-3' role='button' onClick={() => handleEditItem(item)} data-cy='todo-item-edit-button' />
                            <img src={deleteIcon} alt='delete item' className='position-absolute end-0 me-4' role='button' onClick={() => handleDeleteItem(item)} data-cy='todo-item-delete-button' />
                        </div>
                    )
                })
            }
            </div>
            { listModalShow && item ?
                <ListModal show={listModalShow} data={item} hide={hideListModal} confirm={editItem} type='modal-edit' />
                : <ListModal show={listModalShow} hide={hideListModal} confirm={addItem} type='modal-add' />
            }
            { deleteModalShow && <DeleteModal show={deleteModalShow} confirm={deleteItem} hide={hideDeleteModal} type='List Item' data={item} />}
            { alert && <AlertModal show={alert} hide={hideAlert} type='Item' /> }
        </div>
    )
}

export default Detail