import React, { useEffect, useState } from 'react'
import back from '../assets/images/todo-back-button.svg'
import edit from '../assets/images/todo-title-edit-button.svg'
import editItemIcon from '../assets/images/todo-item-edit-button.svg'
import deleteIcon from '../assets/images/activity-item-delete-button.svg'
import empty from '../assets/images/todo-empty-state.svg'
import AddButton from '../components/AddButton'
import { useNavigate, useParams } from 'react-router-dom'
import ListModal from '../components/ListModal'
import { Form } from 'react-bootstrap'
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
    
    // const getList = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await API(`/todo-items?activity_group_id=${id}`);
    //         console.log(response)
    //         setList(response.data.data);
    //         setLoading(false);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    
    const getActivity = async () => {
        try {
            setLoading(true);
            const response = await API(`/activity-groups/${activityId}`);
            console.log(response)
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

    const toggleChangeTitle = () => {
        setOnTitleChange(!onTitleChange)
        if (onTitleChange) {
            changeTitle()
        }
    }

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
            setList([...list, {id, title, priority, activity_group_id, is_active}])
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    const editItem = async ({title, priority, is_active}) => {
        const newList = list.filter(listItem => listItem.id !== item.id)
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
            setList([...newList, {id, title, priority, activity_group_id, is_active}])
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    
    const deleteItem = async () => {
        const newList = list.filter(listItem => listItem.id !== item.id)
        try {
            setLoading(true);
            await API.delete(`/todo-items/${item.id}`);
            setList([...newList])
            showAlert()
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
        setDeleteModalShow(false)
    }

    const showAlert = () => {
        setAlert(true)
        setTimeout(hideAlert, 2000)
    }
    const hideAlert = () => setAlert(false)



    return (
        <div className='container py-5'>
            <div className="row">
                <div className="col d-flex justify-content-between">
                    <div className='d-flex align-items-center py-1'>
                        <img src={back} alt='back' role='button' onClick={goBack} />
                        {
                            !onTitleChange ? <h1 className='fw-bold fs-36 mb-0 mx-3'>{title}</h1> :
                            <input value={title} className='input-title mx-3' onChange={handleChangeTitle} />
                        }
                        <img src={edit} alt='edit' role='button' onClick={toggleChangeTitle} />
                    </div>
                    <AddButton onClick={handleAddItem} />
                </div>
            </div>
            <div className="row mt-5">
            { loading ? <Loading /> : 
            list.length < 1 ?
                <div className="col text-center">
                    <img src={empty} alt='Empty list' />
                </div>
            :
                list.map( item => {
                    const checkedClass = item.is_active === 0 ? 'checked' : ''
                    const { color } = priorities.find(priority => priority.key === item.priority)
                    const label = <><div className={`icon-priority-sm bg-${color}`} /><span className={checkedClass}>{item.title}</span></>
                    return (
                        <div className="card-list position-relative" key={item.id}>
                            <Form.Check type='checkbox' id={item.id} key={item.id} label={label} className='fw-medium fs-18' onChange={() => handleCheckItem(item)} checked={!item.is_active} />
                            <img src={editItemIcon} alt='edit item' className='text-lightgrey ms-3' role='button' onClick={() => handleEditItem(item)} />
                            <img src={deleteIcon} alt='delete item' className='position-absolute end-0 me-4' role='button' onClick={() => handleDeleteItem(item)} />
                        </div>
                    )
                })
            }
            </div>
            { listModalShow && item ?
                <ListModal show={listModalShow} data={item} hide={hideListModal} confirm={editItem} />
                : <ListModal show={listModalShow} hide={hideListModal} confirm={addItem} />
            }
            { deleteModalShow && <DeleteModal show={deleteModalShow} confirm={deleteItem} hide={hideDeleteModal} type='List Item' data={item} />}
            { alert && <AlertModal show={alert} hide={hideAlert} type='Item' /> }
        </div>
    )
}

export default Detail