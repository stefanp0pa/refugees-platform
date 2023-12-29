import { useState, useEffect } from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import SearchBar from "../../components/SearchBar/SearchBar";
import OfferCard from "../../components/OfferCard/OfferCard";

import { getAllOffers } from '../../contexts/apis';
import './offers-list.css';

export default function Offers(){
    const [email, setEmail] = useState('');
    const [offersList, setOffersList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentTab, setCurrentTab] = useState('');
    const [filteredOffers, setFilteredOffers] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        setEmail(user ? JSON.parse(user).email : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const successGetOffers = (offersData) => setOffersList(offersData);
        const failureGetOffers = (error) => setOffersList([]);
        getAllOffers(successGetOffers, failureGetOffers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    const changeCurrentTab = (identifier) => {
        setCurrentTab(identifier);
    }

    const filterOffersSearch = (searchText, identifier) => {
        if (offersList == null || offersList < 1)
            return [];

        identifier = identifier.trim();
        searchText = searchText.trim();

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
            <SideMenu setCurrentTab={changeCurrentTab} currentTab='offers'/>
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