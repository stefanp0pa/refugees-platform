import { Link } from "react-router-dom";
import './step1.css';

export default function Step1(props){
    return(
        <div>
            <h2 className="register-title">CREATE AN ACCOUNT</h2>

            <div className="w-100 text-center mt-2 option">
                Already have an account? <Link to="/login" className="register-link">Login</Link>
            </div>
                
            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-user font-awesome-icon-register"></i>
                    <input className="register-custom-input" type="text" id="name" name="name" placeholder='Name' value={props.name} onChange={(event) => props.handleNameChange(event.currentTarget.value)}></input>
                </div>
            </div>

            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-envelope font-awesome-icon-register"></i>
                    <input className="register-custom-input" type="text" id="email" name="email" placeholder='Email' value={props.email} onChange={(event) => props.handleEmailChange(event.currentTarget.value)}></input>
                </div>
            </div>

            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-phone font-awesome-icon-register"></i>
                    <input className="register-custom-input" type="text" id="phone" name="phone" placeholder='Phone' value={props.phone} onChange={(event) => props.handlePhoneChange(event.currentTarget.value)}></input>
                </div>
            </div>

            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-arrow-down font-awesome-icon-register"></i>
                    <select id="userType" name="cars" className="register-custom-input" value={props.userType} onChange={(event) => props.handleUserTypeChange(event.currentTarget.value)}>
                        <option className="register-option">Type of account</option>
                        <option className="register-option">I need help</option>
                        <option className="register-option">I offer help</option>
                    </select>
                    
                </div>
            </div>

            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-lock font-awesome-icon-register"></i>
                    <input className="register-custom-input" type="password" id="password" 
                        name="password" placeholder='Password' value={props.password} onChange={(event) => props.handlePasswordChange(event.currentTarget.value)}></input>
                </div>
            </div>

            <div className="register-section">
                <div className="register-input-wrapper">
                    <i className="fa fa-user font-awesome-icon-register"></i>
                    <input className="register-custom-input" type="text" id="topics" name="topics" placeholder='Topics separated by comma...' value={props.topics} onChange={(event) => props.handleTopicsChange(event.currentTarget.value)}></input>
                </div>
            </div>
        </div>
    )
}