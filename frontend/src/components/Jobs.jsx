import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { motion } from 'framer-motion'

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50">
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8 pt-4'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    <div className='w-full lg:w-1/4'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span className="text-gray-500 font-medium text-lg mt-10">No jobs found matching your criteria.</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div 
                                                initial={{opacity:0, x:100}} 
                                                animate={{opacity:1, x:0}}
                                                exit={{opacity:0, x:-100}}
                                                transition={{duration:0.3}}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs
