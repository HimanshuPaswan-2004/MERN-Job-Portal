import React from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'

const HeroSection = () => {
    return (
        <div className='text-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col gap-5 my-10 max-w-4xl mx-auto'
            >
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium tracking-wide shadow-sm border border-gray-200'>
                    No. 1 Job Hunt Website
                </span>
                
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight'>
                    Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
                </h1>
                
                <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto'>
                    Discover thousands of job opportunities with all the information you need. Its your future. Come find it. Manage all your job applications from start to finish.
                </p>
                
                <div className='flex items-center w-full md:w-[60%] lg:w-[50%] mx-auto mt-8 shadow-xl border border-gray-200 rounded-full bg-white overflow-hidden pl-4 pr-2 py-2'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs...'
                        className='outline-none border-none w-full bg-transparent text-gray-800 placeholder-gray-400 focus:ring-0'
                    />
                    <Button className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-6 py-3 transition-transform hover:scale-105 active:scale-95 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default HeroSection
