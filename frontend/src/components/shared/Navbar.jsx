import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSelector, useDispatch } from 'react-redux'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);

    return (
        <div className='bg-background border-b border-border shadow-sm sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8'>
                <div>
                    <h1 className='text-2xl font-bold'><Link to="/">Job<span className='text-[#F83002]'>Portal</span></Link></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        <li><Link to="/" className='hover:text-[#F83002] transition-colors'>Home</Link></li>
                        <li><Link to="/jobs" className='hover:text-[#F83002] transition-colors'>Jobs</Link></li>
                        <li><Link to="/browse" className='hover:text-[#F83002] transition-colors'>Browse</Link></li>
                    </ul>
                    {!user ? (
                        <div className='flex items-center gap-2'>
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            {/* We will add Popover & Avatar here later */}
                            <span className="font-semibold text-sm">Hi, {user.fullname}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
