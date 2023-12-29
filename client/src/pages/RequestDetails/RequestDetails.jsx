import {useState, useEffect} from 'react';
import { getProfile, getRequestById, acceptRequest } from '../../contexts/apis';
import { useParams } from 'react-router-dom';

import moreInfoLogo from './more-info.svg';
import './more-info-request.css';

export default function RequestDetails(props){

    let { reqId } = useParams();
    const [requestId, setRequestId] = useState(reqId);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [currentRequest, setCurrentRequest] = useState();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setEmail(user ? JSON.parse(user).email : "");
        setName(user ? JSON.parse(user).name : "");
        setUserId(user ? JSON.parse(user).id : "");
        getRequestById({id: requestId}, successGetMoreInfo, failureGetMoreInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const acceptRequestEvent = async () => {
        acceptRequest({ accepter: name, accepterId: userId, requestId: requestId }, successfulAcceptRequest, failureAcceptRequest);
    }

    const successfulAcceptRequest = () => {
        alert("Request accepted! Email was sent to the author...");
        setTimeout(() => window.location.href = '/requests', 1000);
    }

    const failureAcceptRequest = () => {
        alert("Request not accepted!");
    }

    const successGetMoreInfo = (data) => {
        setCurrentRequest(data);
    }
    const failureGetMoreInfo = (error) => {
        console.log(error);
        setCurrentRequest();
    }

    return (
        <div>
            {currentRequest &&
            <div className='more-info-container'>
                <img src={moreInfoLogo} className='more-info-logo' alt='more-info-logo'/>
                <h2 className="text-center mb-4 text-xl">
                    <strong>Description</strong>
                </h2>
                

                <div className='info-div'>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Request title:</strong></label>
                        <p className='more-info-section'>{currentRequest.title}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Author:</strong></label>
                        <p className='more-info-section'>{currentRequest.author}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Contact email:</strong></label>
                        <p className='more-info-section'>{currentRequest.email}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Contact phone:</strong></label>
                        <p className='more-info-section'>{currentRequest.phone}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Help location:</strong></label>
                        <p className='more-info-section'>{currentRequest.location}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Description:</strong></label>
                        <p className='more-info-section'>{currentRequest.description}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Group:</strong></label>
                        <p className='more-info-section'>{currentRequest.group}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Identifiers:</strong></label>
                        <p className='more-info-section'>{currentRequest.identifiers.join(', ')}</p>
                    </div>
                    <button className='accept-button' onClick={acceptRequestEvent}>Accept</button>
                </div>
            </div>}
        </div>
    );
}