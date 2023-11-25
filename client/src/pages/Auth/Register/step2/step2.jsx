import QuantityChange from "./quantity-change/quantity-change";
import './step2.css';

export default function Step2(props) {
    return(
        <div>
            { props.userType === 'I need help' &&
                <div>
                    <h2 className="register-title-step2">Describe your group</h2>
                    <div className="input-group">
                        <div className="quantity-wrapper">
                            <span className="category-label mr-2">Adults (18 - 65)</span>
                            <QuantityChange
                                addButton={props.increaseGroupMember}
                                decreaseButton={props.decreaseGroupMember}
                                member="adults"
                                value={props.adults}
                                id='adults'
                            ></QuantityChange> 
                        </div>
                        <div className="quantity-wrapper">
                            <span className="category-label mr-2">Children ({"<"} 18)</span>
                            <QuantityChange
                                addButton={props.increaseGroupMember}
                                decreaseButton={props.decreaseGroupMember}
                                member="children"
                                value={props.children}
                                id='children'
                            ></QuantityChange>  
                        </div>
                        <div className="quantity-wrapper">
                            <span className="category-label mr-2">Elders ({">"} 65)</span>
                            <QuantityChange
                                addButton={props.increaseGroupMember}
                                decreaseButton={props.decreaseGroupMember}
                                member="elders"
                                value={props.elders}
                                id='elders'
                            ></QuantityChange>                       
                        </div>
                        <div className="quantity-wrapper">
                            <span className="category-label mr-2">Pets</span>
                            <QuantityChange
                                addButton={props.increaseGroupMember}
                                decreaseButton={props.decreaseGroupMember}
                                member="pets"
                                value={props.pets}
                                id='pets'
                            ></QuantityChange>                       
                        </div>
                    </div>
                </div>
            }
            { props.userType === 'I offer help' &&
                <div style={{width: "540px", textAlign: "justify"}}>
                    <h2 className="register-title-step2">Be responsable!</h2>
                    <div>
                        <span>As a <strong>help provider</strong>, you must know that you undertake a big responsability by helping the ones in need. You should only offer what you can provide as help. Be responsable with the posts you upload on the platform and keep in mind that on other side, there are people who deeply need help, both for them and their families. <strong>Always be tolerant, positive and encouraging!</strong> Besides all the material help, all these people need material help.</span>
                    </div>
                </div>
            }
        </div>
        )
}