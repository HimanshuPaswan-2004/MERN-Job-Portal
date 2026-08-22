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
        <div className='p-5 rounded-2xl bg-background border border-border hover:border-purple-200 dark:hover:border-purple-900/50 shadow-sm hover:shadow-xl hover:shadow-purple-200/50 dark:hover:shadow-purple-900/20 hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 group'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>{job?.createdAt ? (daysAgoFunction(job.createdAt) === 0 ? "Today" : `${daysAgoFunction(job.createdAt)} days ago`) : "Unknown"}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-4 my-4'>
                <Button className="p-6 w-14 h-14 bg-background border-border group-hover:border-purple-300 dark:group-hover:border-purple-700 group-hover:shadow-md transition-all duration-300" variant="outline" size="icon">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={job?.company?.logo || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt={job?.company?.name || "Company Logo"} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-semibold text-lg text-foreground'>{job?.company?.name || "Company Name"}</h1>
                    <p className='text-sm text-muted-foreground font-medium'>{job?.location || "India"}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-xl my-2 text-foreground group-hover:text-[#6A38C2] dark:group-hover:text-[#8c52ff] transition-colors'>{job?.title || "Job Title"}</h1>
                <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>{job?.description || "Description"}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-2 mt-5'>
                <Badge className={'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border border-blue-200/50 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold px-4 py-1 rounded-full shadow-sm'} variant="ghost">{job?.position || 0} Positions</Badge>
                <Badge className={'text-[#F83002] dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200/50 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900 font-semibold px-4 py-1 rounded-full shadow-sm'} variant="ghost">{job?.jobType || "Full Time"}</Badge>
                <Badge className={'text-[#6A38C2] dark:text-purple-400 bg-purple-50 dark:bg-purple-950 border border-purple-200/50 dark:border-purple-900 hover:bg-purple-100 dark:hover:bg-purple-900 font-semibold px-4 py-1 rounded-full shadow-sm'} variant="ghost">{job?.salary || 0}LPA</Badge>
            </div>

            <div className='flex items-center gap-4 mt-6'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="flex-1 rounded-xl font-medium border-border hover:bg-accent hover:border-accent-foreground transition-all shadow-sm">Details</Button>
                <Button className="flex-1 bg-gradient-to-r from-[#6A38C2] to-[#8c52ff] hover:from-[#5b30a6] hover:to-[#6A38C2] text-white rounded-xl font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job

