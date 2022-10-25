import React, { useState, useEffect } from 'react'
import emptyStateImage from '../assets/images/activity-empty-state.svg'
import ActivityCard from '../components/ActivityCard'
import AddButton from '../components/AddButton'
import AlertModal from '../components/AlertModal';
import Loading from '../components/Loading';
import { API } from '../config/API';

const Dashboard = () => {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)

    const getActivities = async () => {
        try {
            setLoading(true);
            const response = await API("/activity-groups?email=contoh%40yoddidahsyat.site");
            setActivities(response.data.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getActivities();
    }, []);

    const addActivity = async () => {
        const body = {
            "title": "New Activity",
            "email": "contoh@yoddidahsyat.site"
        }
        try {
            setLoading(true);
            const response = await API.post("/activity-groups", body);
            // const {id, title, createdAt} = response.data
            if(response.status === 201){
                getActivities()
            }
            // setActivities([ ...activities, { id, title, createdAt } ]);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteActivity = async (id) => {
        try {
            setLoading(true);
            await API.delete(`/activity-groups/${id}`);
            showAlert('activity')
            setLoading(false);
            getActivities()
        } catch (err) {
            console.log(err);
        }
    }

    const showAlert = () => {
        setAlert(true)
        setTimeout(hideAlert, 1000)
    }
    const hideAlert = () => setAlert(false)

    return (
        <div className='container py-5'>
            <div className="row">
                <div className="col d-flex justify-content-between">
                    <h1 className='fw-bold fs-36' data-cy='activity-title'>Activity</h1>
                    <AddButton onClick={() => addActivity()} data-cy='activity-add-button' />
                </div>
            </div>
            <div className="row mt-5">
            { loading ? <Loading /> : 
            activities.length < 1 ?
                <div className="col text-center">
                    <img src={emptyStateImage} alt='Activity empty' data-cy='activity-empty-state' />
                </div>
            :
                activities.map( activity =>
                    <div className="col-3" key={activity.id}>
                        <ActivityCard data={activity} deleteData={() => deleteActivity(activity.id)} />
                    </div>
                )
            }
            { alert && <AlertModal show={alert} hide={hideAlert} type='Activity' /> }
            </div>
        </div>
    )
}

export default Dashboard