import { Link } from "react-router-dom";
import './side-menu.css';

export default function SideMenu(props) {
    return (
        <div className="side-menu col-span-6 sm:col-span-2">
            <div>
                <p className="menu-section" onClick={() => props.setCurrentTab('')}>All</p>
                <p className="menu-section" onClick={() => props.setCurrentTab('transportation')}>Transportation</p>
                <p className="menu-section" onClick={() => props.setCurrentTab('donation')}>Donation</p>
                <p className="menu-section" onClick={() => props.setCurrentTab('house')}>House</p>
                <p className="menu-section" onClick={() => props.setCurrentTab('food')}>Food</p>
                <p className="menu-section" onClick={() => props.setCurrentTab('clothes')}>Clothes</p>
            </div>
            {
                props.profile && props.profile.userType === 'requester' && props.currentTab === 'requests' &&
                    <div className="add-wrapper">
                        <Link to="/request" className="add-sign"><strong>Add request</strong></Link>
                    </div>
            }
            {
                props.profile && props.profile.userType === 'provider' &&  props.currentTab === 'offers' &&
                    <div className="add-wrapper">
                        <Link to="/offer" className="add-sign"><strong>Add offer</strong></Link>
                    </div>
            }
        </div>
    );
};