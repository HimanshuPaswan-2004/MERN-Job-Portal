import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-border rounded-md p-4 my-10 shadow-lg bg-card text-card-foreground'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="john@example.com" />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="********" />
                    </div>
                    <div className='flex items-center justify-between my-4'>
                        <div className='flex items-center gap-4'>
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                <Label>Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer w-4 h-4" />
                                <Label>Recruiter</Label>
                            </div>
                        </div>
                    </div>
                    {loading ? <Button className="w-full my-4" disabled>Please wait...</Button> : <Button type="submit" className="w-full my-4 bg-primary hover:bg-primary/90 text-primary-foreground">Login</Button>}
                    <span className='text-sm text-muted-foreground'>Don't have an account? <Link to="/signup" className='text-primary hover:underline'>Signup</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login
