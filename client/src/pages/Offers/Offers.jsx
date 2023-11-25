import { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import SearchBar from "../../components/SearchBar/SearchBar";
import OfferCard from "../../components/OfferCard/OfferCard";

import { getAllOffers, getProfile } from '../../contexts/apis';
import './offers-list.css';

export default function Offers(){
    const user = localStorage.getItem('user');
    const [email, setEmail] = useState(user ? JSON.parse(user).email : "");

    const [profile, setProfile] = useState(null);
    const [offersList, setOffersList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentTab, setCurrentTab] = useState('');
    const [filteredOffers, setFilteredOffers] = useState([]);

    useEffect(() => {
        getProfile({email: email}, successGetProfile, failureGetProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (profile === null) return;

        let offers = [];

        const successGetOffers = (offersData) => {
            offers = offersData;
            setOffersList(offers);
        };
        const failureGetOffers = (error) => {
            console.log(error);
            setOffersList([]);
        };

        getAllOffers(successGetOffers, failureGetOffers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    const successGetProfile = (data) => {
        setProfile(data);
    }

    const failureGetProfile = (error) => {
        console.log(error);
        setProfile(null);
    }

    const changeCurrentTab = (identifier) => {
        setCurrentTab(identifier);
    }

    // const bookmarkPost = (request) => {
    //     const successBookmark = () => {
    //         const oldRequests = requestsList;
    //         const newRequests = oldRequests.map(oldRequest => {
    //             if (oldRequest.id === request.id) {
    //                 return { ...oldRequest, favorite: !oldRequest.favorite };
    //             }
    //             return oldRequest;
    //         });
    //         setRequestsList(newRequests);
    //     }
    //     const failureBookmark = (error) => {
    //         console.log(error);
    //     }

    //     (request.favorite === true)
    //         ? deleteFavorite({postId: request.id, profileId: profile.id}, token, successBookmark, failureBookmark)
    //         : postFavorite({postId: request.id, profileId: profile.id}, token, successBookmark, failureBookmark);
    // }

    const filterOffersSearch = (searchText, identifier) => {
        if (offersList == null || offersList < 1)
            return [];

        identifier = identifier.trim();
        searchText = searchText.trim();

        const user = localStorage.getItem('user');
        const email = user ? JSON.parse(user).email : "";

        let filteredByIdentifier;
        if(identifier !== 'myOffers' && identifier !== 'favorites') {
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? offersList.filter(offer => offer.identifiers.includes(identifier)) 
                : offersList;
        } else if(identifier === 'myOffers'){
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? offersList.filter(offer => offer.author === email) 
                : offersList;
        } else if(identifier === 'favorites') {
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? offersList.filter(offer => offer.favorite) 
                : offersList;
        }

        const finalFiltered = (searchText !== null && searchText !== '') 
            ? filteredByIdentifier.filter(offer => offer.title.toUpperCase().includes(searchText.toUpperCase())) 
            : filteredByIdentifier;
        
        setFilteredOffers(finalFiltered);
    }

    useEffect(() => {
        if (offersList === null || offersList.length < 1) return;
        filterOffersSearch(searchText, currentTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offersList, currentTab, searchText]);

    return (
        <div className="grid grid-cols-6 gap-0">
            <SideMenu setCurrentTab={changeCurrentTab} profile={profile} currentTab='offers'/>
            <div className="card-list sm:col-span-4 col-span-6">
                <SearchBar
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}/>

                <div className="cards-container grid grid-cols-2 gap-8">
                    {
                        filteredOffers.length > 0 && filteredOffers.map(offer => {
                            return <OfferCard offer={offer} key={offer.id}/>
                    })}
                    {
                        !filteredOffers.length &&
                            <span>No offers to be displayed...</span>
                    }
                </div>
            </div>
        </div>
    )
}