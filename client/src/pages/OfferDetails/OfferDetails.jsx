import {useState, useEffect} from 'react';
import { getProfile, getOfferById, acceptOffer } from '../../contexts/apis';
import { useParams } from 'react-router-dom';

import moreInfoLogo from './more-info.svg';
import './more-info-offer.css';

export default function OfferDetails(props){

    let { offId } = useParams();
    
    const [offerId, setOfferId] = useState(offId);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [currentOffer, setCurrentOffer] = useState();

    useEffect(() => {
        const user = localStorage.getItem('user');
        setEmail(user ? JSON.parse(user).email : "");
        setName(user ? JSON.parse(user).name : "");
        setUserId(user ? JSON.parse(user).id : "");
        getOfferById({id: offerId}, successGetMoreInfo, failureGetMoreInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const acceptOfferEvent = async () => {
        acceptOffer({ accepter: name, accepterId: userId, offerId: offerId }, successfulAcceptOffer, failureAcceptOffer);
    }

    const successfulAcceptOffer = () => {
        alert("Offer accepted! Email was sent to the author...");
        setTimeout(() => window.location.href = '/offers', 1000);
    }

    const failureAcceptOffer = () => {
        alert("Offer not accepted!");
    }

    const successGetMoreInfo = (data) => {
        setCurrentOffer(data);
    }
    const failureGetMoreInfo = (error) => {
        console.log(error);
        setCurrentOffer();
    }

    return (
        <div>
            {currentOffer &&
            <div className='more-info-container'>
                <img src={moreInfoLogo} className='more-info-logo' alt='more-info-logo'/>
                <h2 className="text-center mb-4 text-xl">
                    <strong>Description</strong>
                </h2>

                <div className='info-div'>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Offer title:</strong></label>
                        <p className='more-info-section'>{currentOffer.title}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Author:</strong></label>
                        <p className='more-info-section'>{currentOffer.author}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Contact email:</strong></label>
                        <p className='more-info-section'>{currentOffer.email}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Contact phone:</strong></label>
                        <p className='more-info-section'>{currentOffer.phone}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Help location:</strong></label>
                        <p className='more-info-section'>{currentOffer.location}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Description:</strong></label>
                        <p className='more-info-section'>{currentOffer.description}</p>
                    </div>
                    <div className='section-div'>
                        <label className='more-info-label'><strong>Identifiers:</strong></label>
                        <p className='more-info-section'>{currentOffer.identifiers.join(', ')}</p>
                    </div>
                    <button className='accept-button' onClick={acceptOfferEvent}>Accept</button>
                </div>
            </div>}
        </div>
    );
}