import React from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'

const Profile = () => {
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-card text-card-foreground border border-border rounded-2xl my-5 p-8'>
                <h1 className='font-bold text-2xl mb-5'>Profile</h1>
                {user ? (
                    <div>
                        <p><strong>Name:</strong> {user.fullname}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phoneNumber}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                ) : (
                    <p>Please login to view your profile.</p>
                )}
            </div>
        </div>
    )
}

export default Profile
