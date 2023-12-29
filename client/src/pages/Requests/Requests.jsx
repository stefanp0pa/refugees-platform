import { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import SearchBar from "../../components/SearchBar/SearchBar";
import RequestCard from "../../components/RequestCard/RequestCard";

import { getAllRequests } from '../../contexts/apis';
import './requests-list.css';

export default function Requests(){
    const [email, setEmail] = useState('');
    const [requestsList, setRequestsList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentTab, setCurrentTab] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        setEmail(user ? JSON.parse(user).email : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const successGetRequests = (requestsData) => setRequestsList(requestsData);
        const failureGetRequests = (error) => setRequestsList([]);
        getAllRequests(successGetRequests, failureGetRequests);
    },[email]);

    const changeCurrentTab = (identifier) => {
        setCurrentTab(identifier);
    }

    const filterRequestsSearch = (searchText, identifier) => {
        if (requestsList == null || requestsList < 1)
            return [];

        identifier = identifier.trim();
        searchText = searchText.trim();

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
            <SideMenu setCurrentTab={changeCurrentTab} currentTab='requests'/>
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