import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState();
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, {companyName}, {
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res.data.company));
                navigate(`/admin/companies/${res.data.company._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className='max-w-3xl mx-auto mt-16 px-4'>
                <div className='bg-white p-8 rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-50'>
                    <div className='mb-8'>
                        <h1 className='font-bold text-3xl text-gray-900'>Your Company Name</h1>
                        <p className='text-gray-500 mt-2 text-lg'>What would you like to give your company name? you can change this later.</p>
                    </div>

                <div className="space-y-2">
                    <Label className="text-gray-700 font-medium text-base">Company Name</Label>
                    <Input
                        type="text"
                        className="py-6 text-lg rounded-xl border-gray-200 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 transition-all shadow-sm"
                        placeholder="JobHunt, Microsoft etc."
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                <div className='flex items-center gap-4 mt-10'>
                    <Button variant="outline" className="rounded-xl px-6 py-6 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button className="rounded-xl px-8 py-6 font-medium bg-gradient-to-r from-[#6A38C2] to-[#8c52ff] hover:from-[#5b30a6] hover:to-[#6A38C2] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" onClick={registerNewCompany}>Continue</Button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate
