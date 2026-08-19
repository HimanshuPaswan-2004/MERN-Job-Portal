import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { motion } from 'framer-motion'

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
                <h1 className='font-bold text-2xl my-8 text-gray-900'>Search Results <span className='text-muted-foreground text-lg ml-2'>({allJobs.length} found)</span></h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {
                        allJobs.map((job) => {
                            return (
                                <motion.div 
                                    initial={{opacity:0, x:100}} 
                                    animate={{opacity:1, x:0}}
                                    exit={{opacity:0, x:-100}}
                                    transition={{duration:0.3}}
                                    key={job._id}>
                                    <Job job={job}/>
                                </motion.div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Browse
