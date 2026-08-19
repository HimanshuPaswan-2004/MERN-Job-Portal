import React from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

const HeroSection = () => {
    return (
        <div className='relative overflow-hidden text-center py-20 px-4 sm:px-6 lg:px-8 bg-white min-h-[70vh] flex items-center justify-center'>
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/50 blur-[100px] mix-blend-multiply opacity-70"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-red-100/50 blur-[100px] mix-blend-multiply opacity-70"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-[120px] mix-blend-multiply opacity-50"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='flex flex-col gap-6 my-10 max-w-4xl mx-auto z-10'
            >
                <motion.span 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className='mx-auto px-5 py-2 rounded-full bg-white text-[#F83002] font-semibold tracking-wide shadow-[0_4px_14px_0_rgba(248,48,2,0.1)] border border-red-100 uppercase text-sm'
                >
                    No. 1 Job Hunt Website
                </motion.span>
                
                <h1 className='text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight'>
                    Search, Apply & <br /> Get Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#9d5cff]'>Dream Jobs</span>
                </h1>
                
                <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium mt-2'>
                    Discover thousands of job opportunities with all the information you need. Its your future. Come find it. Manage all your job applications from start to finish.
                </p>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className='flex items-center w-full md:w-[65%] lg:w-[55%] mx-auto mt-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-full bg-white/80 backdrop-blur-md overflow-hidden pl-6 pr-2 py-2 hover:shadow-[0_8px_30px_rgb(106,56,194,0.15)] transition-shadow duration-300'
                >
                    <input
                        type="text"
                        placeholder='Find your dream jobs...'
                        className='outline-none border-none w-full bg-transparent text-gray-800 placeholder-gray-400 focus:ring-0 text-lg font-medium'
                    />
                    <Button className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-8 py-6 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/30 flex items-center justify-center">
                        <Search className="h-6 w-6 text-white" />
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default HeroSection
