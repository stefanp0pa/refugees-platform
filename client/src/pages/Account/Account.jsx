import {useState, useEffect} from 'react';
import profilePicture from './undraw_profile.svg'
import AccountQuantityChange from './AccountQuantityChange';
import { getProfile } from '../../contexts/apis';

export default function Account() {
    const user = localStorage.getItem('user');
    const email = user ? JSON.parse(user).email : "";

    const [profile, setProfile] = useState({
        email: '', name: '', 
        phone: '', userType: '',
        group: ''
    });
    const [showReset, setShowReset] = useState(false);

    const groupTypes = { 
        adults: 'adults', children: 'children', 
        elders: 'elders', pets: 'pets',
    }

    const updateProfile = () => {
        console.log('update profile');
        // postUpdateProfile(profile, token, successUpdateProfile, failureUpdateProfile);
    }

    const nameChange = (value) => setProfile({...profile, name: value});
    const emailChange = (value) => setProfile({...profile, email: value});
    const phoneChange = (value) => setProfile({...profile, phone: value});
    const groupChange = (value) => setProfile({...profile, group: value});
    const increaseButton = (groupType) => setProfile({...profile, 
        group: {...profile.group, [groupType]: profile.group[groupType] + 1}});
    const decreaseButton = (groupType) => setProfile({...profile,
        group: {...profile.group, [groupType]: profile.group[groupType] - 1 >= 0 ? profile.group[groupType] -1 : 0}});


    // const sendResetPassword = () => {
    //     const email = localStorage.getItem('email');
    //     const token = localStorage.getItem('token');
    //     postResetPassword({'email' : email}, token, successResetPassword, failureResetPassword);
    // }
    // const successResetPassword = (success) => {
    //     console.log('Success reset password');
    //     setShowReset(true);
    // }
    // const failureResetPassword = (failure) => {
    //     console.log('Failure reset password');
    //     setShowReset(false);
    // }


    const updateProfileDetails = () => {
        
    }

    const successUpdateProfile = (success) => {
        console.log('Success update profile');
    }

    const failureUpdateProfile = (failure) => {
        console.log('Failure update profile');
    }

    const getProfileDetails = () => {
        getProfile({'email' : email}, successProfileDetails, failureProfileDetails);
    }
    const successProfileDetails = (success) => {
        setProfile({
            email: success.email,
            name: success.name,
            phone: success.phone,
            userType: success.userType,
            group: success.group
        });
    }
    const failureProfileDetails = (failure) => {
        console.log('Failure profile details');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getProfileDetails(), []);

    return (
        <div className='flex flex-row items-center'>
            <div className='sm:w-full md:w-2/4 p-4'>
                <div className="text-xl font-bold mb-4 border-b-[1px] border-gray">
                    <span>Account Settings</span>
                    <div className="pb-4"></div>
                </div>
                <div className='mb-4 flex flex-col text-justify border-b-[1px] border-gray'>
                    <span className="font-bold">Name</span>
                    <div className='mt-2'>
                        <input className="rounded-md border-[1px] border-black pb-2 pl-2 w-full" type="text" id="username" name="username" placeholder='Username' value={profile.name} onChange={(event) => nameChange(event.currentTarget.value)}></input>
                    </div>
                    <span className="text-xs mt-2 pb-4">This is your full name that you could be associated with in a legal document. You should provide full first name and last name.  </span>
                </div>
                <div className='mb-4 flex flex-col text-justify mt-4 border-b-[1px] border-gray'>
                    <span className="font-bold">Email</span>
                    <div className='mt-2'>
                        <input className="rounded-md border-[1px] border-black pb-2 pl-2 w-full" type="text" id="email" name="email" placeholder='Email' value={profile.email} onChange={(event) => emailChange(event.currentTarget.value)}></input>
                    </div>
                    <span className="text-xs mt-2">Email is important because we will send any notifications from this platform (new offers, requests etc.) for better alerting. Notifications will alert you in real-time about any postings or user interactions. </span>
                    {/* <div className='mt-4 mb-4 flex flex-row items-baseline'>
                        <button className='bg-blue-500 hover:bg-blue-700 w-32 text-xs text-white font-bold py-2 px-4 rounded' onClick={sendResetPassword}>Reset password</button>
                        {showReset && <span className='text-blue-600 text-xs items-baseline ml-2'>Check your email for reset password!</span>}
                    </div> */}
                </div>
                <div className='mb-4 flex flex-col text-justify mt-4 border-b-[1px] border-gray'>
                    <span className="font-bold">Phone</span>
                    <div className='mt-2'>
                        <input className="rounded-md border-[1px] border-black pb-2 pl-2 w-full" type="phone" id="phone" name="phone" placeholder='Phone' value={profile.phone} onChange={(event) => phoneChange(event.currentTarget.value)}></input>
                    </div>
                    <span className="text-xs mt-2 pb-4">Phone number is important because you might be contacted by other users. </span>
                </div>
                {profile.userType === 'refugee' &&
                    <div className="mt-4 flex flex-col text-justify border-b-[1px] border-gray">
                        <span className="font-bold">Group description (this section applies in case of refugees) </span>
                        <div className='mt-2'>
                            <input className="rounded-md border-[1px] border-black pb-2 pl-2 w-full" type="text" id="group" name="group" placeholder='Group description' value={profile.group} onChange={(event) => groupChange(event.currentTarget.value)}></input>
                        </div>
                        {/* <div className='pb-2'>
                            <div className='flex flex-row justify-between mt-1'>
                                <span className="mr-2">Adults (18-65)</span>
                                <AccountQuantityChange 
                                    groupType={groupTypes.adults}
                                    groupValue={profile.group.adults} 
                                    decreaseButton={decreaseButton} 
                                    increaseButton={increaseButton}/>
                            </div>
                            <div className='flex flex-row justify-between mt-1'>
                                <span className="mr-2">Children ({"<"} 18)</span>
                                <AccountQuantityChange 
                                    groupType={groupTypes.children}
                                    groupValue={profile.group.children} 
                                    decreaseButton={decreaseButton}
                                    increaseButton={increaseButton}/>
                            </div>
                            <div className='flex flex-row justify-between mt-1'>
                                <span className="mr-2">Elders ({">"} 65)</span>
                                <AccountQuantityChange
                                    groupType={groupTypes.elders}
                                    groupValue={profile.group.elders}
                                    decreaseButton={decreaseButton}
                                    increaseButton={increaseButton}/>
                            </div>
                            <div className='flex flex-row justify-between mt-1'>
                                <span className="mr-2">Pets</span>
                                <AccountQuantityChange
                                    groupType={groupTypes.pets}
                                    groupValue={profile.group.pets}
                                    decreaseButton={decreaseButton}
                                    increaseButton={increaseButton}/>
                            </div>
                        </div> */}
                    </div>
                }
                {/* <button className='md:invisible bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={updateProfile}>Submit</button> */}
            </div>
            <div className='w-0 md:w-2/4 h-full flex flex-col items-center invisible md:visible'>
                <img src={profilePicture} alt="profile" className="w-96 mb-4"/>
                {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={updateProfile}>Submit</button> */}
            </div>
        </div>
    )
}