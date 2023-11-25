import { Link } from "react-router-dom";
import './offer-card.css';

export default function OfferCard({ offer }) {
    return (
        <div className="card-container">
            { offer && 
                <div className="rounded overflow-hidden shadow-lg">
                    <div className="px-6 info-section-card">
                        <div className="font-bold text-xl mb-2 card-title">
                            <div>
                                <h1 className="card-title-h1">{offer.title}</h1>
                            </div>
                        </div>
                        <div className="card-section">
                            <i className="fa fa-map-marker"></i>
                            <p>{offer.location}</p>
                        </div>
                    </div>
                    <div className="px-6 pt-4 pb-2 identifiers-list">
                        {offer.identifiers.map(identifier => {
                            return <span className="inline-block bg-gray-200 rounded-full 
                                px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" 
                                key={identifier}>{identifier}</span>
                        })}
                    </div>
                    
                    <div className="pb-2 link-card-container">
                        <Link className="px-6 pb-2 more-info-btn" to={{pathname: `/offer-details/${offer.id}`}}> More info </Link>
                    </div>
                </div> 
            }
        </div>
    );
}