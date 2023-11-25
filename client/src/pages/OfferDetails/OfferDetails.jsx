import {useState, useEffect} from 'react';
import { getProfile, getOfferById } from '../../contexts/apis';
import { useParams } from 'react-router-dom';

import moreInfoLogo from './more-info.svg';
import './more-info-offer.css';

export default function OfferDetails(props){

    let { offerId } = useParams();
    const user = localStorage.getItem('user');
    const email = user ? JSON.parse(user).email : "";
    const [currentOffer, setCurrentOffer] = useState();

    // const [profile, setProfile] = useState(null);

    const concatIdentifiers = () => currentOffer.identifiers.join(' ');

    useEffect(() => {
        getOfferById({id: offerId}, successGetMoreInfo, failureGetMoreInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     getProfile({email: email}, token, successGetProfile, failureGetProfile);
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    // const successGetProfile = (data) => {
    //     setProfile(data);
    // }
    // const failureGetProfile = (error) => {
    //     console.log(error);
    //     setProfile(null);
    // }

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
                </div>
            </div>}
        </div>
    );
}