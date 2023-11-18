import {useState, useEffect} from 'react';

import './info-page.css';

import * as english from './info-en.js';
import * as ukraine from './info-ua.js';

import people from './undraw_ukraine.png';
import ukFlag from './uk_flag.png';
import uaFlag from './ua_flag.png';

export default function Info() {
    const languages = {en: 'EN', ua: 'UA'};
    const [language, setLanguage] = useState(languages.en);
    const [intlPackage, setIntlPackage] = useState(english);

    useEffect(() => {
        setIntlPackage(language === languages.en ? english : ukraine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const chooseLanguage = (value) => setLanguage(value);

    return (
        <div>
            <div className="flex flex-wrap flex-row">
                <div className="w-1/4 content-center">
                    <img src={people} alt="ukraine-logo" className="w-96"/>
                </div>
                <div className='w-3/5'>
                    <div className="flex flex-row">
                        <div className="font-bold mr-4 text-xl">
                            <h1>Emergency Info - FAQ</h1>
                        </div>
                        <div className="flex flex-row ml-4 items-center cursor-pointer">
                            <div className="flex flex-row items-center hover:underline" onClick={() => chooseLanguage(languages.en)}>
                                <span className={ language === languages.en ? 'font-bold' : ''}>English</span>
                                <img src={ukFlag} alt="uk-flag" className="h-4 ml-1"/>
                            </div>
                            <div className="ml-2 flex flex-row items-center hover:underline" onClick={() => chooseLanguage(languages.ua)}>
                                <span className={ language === languages.ua ? 'font-bold' : ''}>Ukrainian</span>
                                <img src={uaFlag} alt="ua-flag" className="h-4 ml-1"/>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 text-justify'>
                        <p className='break-normal'>
                            {intlPackage.pageDescription}
                        </p>
                        <p className='break-normal mt-2'>
                            {intlPackage.secondDescription}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                {
                    intlPackage.questions.map((question, index) => (
                        <div key={index} className="mt-2 p-4 cursor-pointer">
                            <details className="question border-b border-grey-lighter">
                                <summary className="flex items-center font-bold">Q: {question.question}
                                    <button className="ml-auto">
                                    <svg className="fill-current opacity-75 w-4 h-4 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
                                    </button>
                                </summary>

                                <div className="mt-4 leading-normal text-md ">{question.answer}</div>
                            </details>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}