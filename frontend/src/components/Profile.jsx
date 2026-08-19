import React from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

import { Contact, Mail, Pen } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Label } from './ui/label'

const Profile = () => {
    useGetAppliedJobs();
    const { user } = useSelector(store => store.auth);
    
    // Check if skills exist, otherwise provide empty array
    const isHaveResume = user?.profile?.resume ? true : false;
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl my-8 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-6'>
                        <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname || "Full Name"}</h1>
                            <p className='text-gray-500 font-medium mt-1'>{user?.profile?.bio || "No bio provided"}</p>
                        </div>
                    </div>
                    <Button className="text-right" variant="outline" size="icon"><Pen className="h-4 w-4" /></Button>
                </div>
                
                <div className='my-8 space-y-4'>
                    <div className='flex items-center gap-3 text-gray-600'>
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>{user?.email || "email@example.com"}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-600'>
                        <Contact className="h-5 w-5 text-gray-400" />
                        <span>{user?.phoneNumber || "Phone Number"}</span>
                    </div>
                </div>

                <div className='my-5'>
                    <h1 className='font-semibold text-lg text-gray-900 mb-3'>Skills</h1>
                    <div className='flex items-center gap-2 flex-wrap'>
                        {user?.profile?.skills?.length ? (
                            user.profile.skills.map((item, index) => <Badge key={index} className="bg-purple-50 text-[#6A38C2] hover:bg-purple-100 border-transparent px-3 py-1">{item}</Badge>)
                        ) : (
                            <span className="text-gray-500 text-sm">No skills added</span>
                        )}
                    </div>
                </div>

                <div className='grid w-full max-w-sm items-center gap-2 mt-6'>
                    <Label className="text-md font-semibold text-gray-900">Resume</Label>
                    {isHaveResume ? (
                        <a target='_blank' rel="noreferrer" href={user?.profile?.resume} className='text-blue-600 hover:underline hover:text-blue-800 font-medium break-words'>
                            {user?.profile?.resumeOriginalName || 'Download Resume'}
                        </a>
                    ) : (
                        <span className="text-gray-500 text-sm">No resume uploaded</span>
                    )}
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10 p-8'>
                <h1 className='font-bold text-xl mb-6 text-gray-900'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
        </div>
    )
}

export default Profile
