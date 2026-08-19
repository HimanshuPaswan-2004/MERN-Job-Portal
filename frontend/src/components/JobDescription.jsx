import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { useParams as useRouterParams } from 'react-router-dom';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useRouterParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            
            if (res.data.success) {
                setIsApplied(true); // Update local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100'>
                <div>
                    <h1 className='font-extrabold text-3xl text-gray-900'>{singleJob?.title}</h1>
                    <div className='flex flex-wrap items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 bg-blue-50 hover:bg-blue-100 border-transparent font-semibold px-3 py-1'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] bg-red-50 hover:bg-red-100 border-transparent font-semibold px-3 py-1'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#6A38C2] bg-purple-50 hover:bg-purple-100 border-transparent font-semibold px-3 py-1'} variant="ghost">{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-xl px-8 py-6 text-lg font-semibold shadow-md transition-all ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6A38C2] hover:bg-[#5b30a6] hover:scale-105 active:scale-95 text-white'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            
            <div className='mt-10 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100'>
                <h1 className='border-b border-gray-200 font-bold text-xl py-4 mb-6 text-gray-900'>Job Description</h1>
                <div className='space-y-4'>
                    <h1 className='font-semibold text-gray-900'>Role: <span className='pl-4 font-normal text-gray-600'>{singleJob?.title}</span></h1>
                    <h1 className='font-semibold text-gray-900'>Location: <span className='pl-4 font-normal text-gray-600'>{singleJob?.location}</span></h1>
                    <h1 className='font-semibold text-gray-900'>Description: <span className='pl-4 font-normal text-gray-600 leading-relaxed'>{singleJob?.description}</span></h1>
                    <h1 className='font-semibold text-gray-900'>Experience: <span className='pl-4 font-normal text-gray-600'>{singleJob?.experienceLevel} yrs</span></h1>
                    <h1 className='font-semibold text-gray-900'>Salary: <span className='pl-4 font-normal text-gray-600'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-semibold text-gray-900'>Total Applicants: <span className='pl-4 font-normal text-gray-600'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-semibold text-gray-900'>Posted Date: <span className='pl-4 font-normal text-gray-600'>{singleJob?.createdAt.split("T")[0]}</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription
