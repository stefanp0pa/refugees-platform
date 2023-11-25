import React from "react";
import './about.css';
import aboutLogo from './about-logo.svg';

export default function About() {
    return (
        <>
            <div className="lg:columns-2 gap-0 top-info">
                <div className="about-logo">
                    <img src={aboutLogo} alt='about-logo'/>
                </div>
                <div>
                    <h2 className="about-title">Together for Ukraine</h2>
                    <p className="top-info-p">
                        Now is the time to come together to support each other. Either you are looking for 
                        help or to lend a hand, this is the perfect place for you. Free and easy to use,
                        this platform might help you find a solution to your needs.
                    </p>
                </div>    
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-8 steps">
                <div className="text-justify">
                    <h3 className="step-title text-xl mb-2">Step 1</h3>
                    <span>
                        <strong className="step-title">Choose the type of account</strong> you would like to use (<strong>I offer help</strong> or <strong>I need help</strong>) and register. By choosing to <strong>offer help</strong>, you will accept the responsability of helping the ones in need. By choosing to <strong>request help</strong>, you will be able to view all help offers posted by the ones that provide help.
                    </span>
                </div>
                <div className="text-justify">
                    <h3 className="step-title text-xl mb-2">Step 2</h3>
                    <span>
                    <strong className="step-title">Post a help request or a help offer</strong> (depending on your account). If you request help, provide all details about your condition so that people can help you best. If you offer help, make sure to have all the resources you wish to provide. 
                    </span>
                </div>
                <div className="text-justify">
                    <h3 className="step-title text-xl mb-2">Step 3</h3>
                    <span>
                        <strong className="step-title">Contact the author of the post</strong> and stay in touch. We wish to be flexible on the platform and encourage as much help as possible. Our purpose as a platform is to function as a <span>virtual panel</span> where people can post to offer or request help. 
                    </span>
                </div>
            </div>
        </>
    );
}