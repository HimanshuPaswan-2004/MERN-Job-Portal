import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <div className='p-5 rounded-2xl shadow-sm bg-white border border-gray-100 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{job?.createdAt ? (daysAgoFunction(job.createdAt) === 0 ? "Today" : `${daysAgoFunction(job.createdAt)} days ago`) : "Unknown"}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-4 my-4'>
                <Button className="p-6 w-14 h-14 bg-gray-50 border-gray-100 group-hover:border-purple-200 transition-colors" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt={job?.company?.name || "Company Logo"} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-semibold text-lg text-gray-900'>{job?.company?.name || "Company Name"}</h1>
                    <p className='text-sm text-gray-500 font-medium'>{job?.location || "India"}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-xl my-2 text-gray-900 group-hover:text-[#6A38C2] transition-colors'>{job?.title || "Job Title"}</h1>
                <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>{job?.description || "Description"}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-2 mt-5'>
                <Badge className={'text-blue-700 bg-blue-50 border-transparent hover:bg-blue-100 font-semibold px-3 py-1'} variant="ghost">{job?.position || 0} Positions</Badge>
                <Badge className={'text-[#F83002] bg-red-50 border-transparent hover:bg-red-100 font-semibold px-3 py-1'} variant="ghost">{job?.jobType || "Full Time"}</Badge>
                <Badge className={'text-[#6A38C2] bg-purple-50 border-transparent hover:bg-purple-100 font-semibold px-3 py-1'} variant="ghost">{job?.salary || 0}LPA</Badge>
            </div>

            <div className='flex items-center gap-4 mt-6'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="flex-1 rounded-xl font-medium border-gray-300 hover:bg-gray-50">Details</Button>
                <Button className="flex-1 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl font-medium shadow-md">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job
