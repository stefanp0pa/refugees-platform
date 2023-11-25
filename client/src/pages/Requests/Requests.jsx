import { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import SearchBar from "../../components/SearchBar/SearchBar";
import RequestCard from "../../components/RequestCard/RequestCard";

import { getAllRequests, getProfile } from '../../contexts/apis';
import './requests-list.css';


export default function Requests(){
    const user = localStorage.getItem('user');
    const [email, setEmail] = useState(user ? JSON.parse(user).email : "");

    const [profile, setProfile] = useState(null);
    const [requestsList, setRequestsList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentTab, setCurrentTab] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        getProfile({email: email}, successGetProfile, failureGetProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (profile === null) return;

        let requests = [];

        const successGetRequests = (requestsData) => {
            requests = requestsData;
            setRequestsList(requests);
        };
        const failureGetRequests = (error) => {
            console.log(error);
            setRequestsList([]);
        };

        getAllRequests(successGetRequests, failureGetRequests);
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

    const filterRequestsSearch = (searchText, identifier) => {
        if (requestsList == null || requestsList < 1)
            return [];

        identifier = identifier.trim();
        searchText = searchText.trim();

        const user = localStorage.getItem('user');
        const email = user ? JSON.parse(user).email : "";

        let filteredByIdentifier;
        if(identifier !== 'myRequests' && identifier !== 'favorites') {
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? requestsList.filter(offer => offer.identifiers.includes(identifier)) 
                : requestsList;
        } else if(identifier === 'myRequests'){
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? requestsList.filter(offer => offer.author === email) 
                : requestsList;
        } else if(identifier === 'favorites') {
            filteredByIdentifier = (identifier !== null && identifier !== '') 
                ? requestsList.filter(offer => offer.favorite) 
                : requestsList;
        }

        const finalFiltered = (searchText !== null && searchText !== '') 
            ? filteredByIdentifier.filter(offer => offer.title.toUpperCase().includes(searchText.toUpperCase())) 
            : filteredByIdentifier;
        
        setFilteredRequests(finalFiltered);
    }

    useEffect(() => {
        if (requestsList === null || requestsList.length < 1) return;
        filterRequestsSearch(searchText, currentTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestsList, currentTab, searchText]);

    return (
        <div className="grid grid-cols-6 gap-0">
            <SideMenu setCurrentTab={changeCurrentTab} profile={profile} currentTab='requests'/>
            <div className="card-list sm:col-span-4 col-span-6">
                <SearchBar
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}/>

                <div className="cards-container grid grid-cols-2 gap-8">
                    {
                        filteredRequests.length > 0 && filteredRequests.map(request => {
                            return <RequestCard request={request} key={request.id}/>
                    })}
                    {
                        !filteredRequests.length &&
                            <span>No requests to be displayed...</span>
                    }
                </div>
            </div>
        </div>
    )
}