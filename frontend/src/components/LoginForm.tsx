import { Button } from '@/components/ui/button';
import { IoPerson } from "react-icons/io5";
import { FaUserTag } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io";
import type React from "react";
import { useState, type ChangeEvent } from "react";
import axios from "axios"
import type { UserAuthData } from '@/components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/features/user/hooks/useUser';


export const LoginForm = () => {
    const nav = useNavigate();
    const [formData, setFormData] = useState<UserAuthData>({
        email: "",
        password: "",
    });
    const { login, loading, googleAuth } = useAuth();


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login({email:formData.email, password:formData.password} as UserAuthData);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error', error.response?.data?.message ?? error.message);
            }
            else if (error instanceof Error) {
                console.error('Error', error.message);
            }
            else {
                console.error('Unknown error', error);
            }
        }
    }

    return (
        <div className='max-w-xl w-lg'>
            <div className="w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-white mt-3">Sign In</h1>
                        <p className="text-white/80 mt-2">Please enter your information below please</p>
                    </div>

                    <div className="p-9 pt-12 text-start">
                        <form className="space-y-6" onSubmit={onSubmit}>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MdEmail />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="john.doe@example.com"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiLockPasswordLine />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>



                            {/* <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Create Account
                            </button> */}
                            <div className='px-[5rem] my-[2rem]'>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    {loading ? (<>Loading...</>) : "Sign In"}
                                </button>
                                {/* <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-gradient-to-r text-center py-[1.2rem] text-lg md:text-md from-primary to-secondary hover:scale-105"
                                >
                                    {loading ? (
                                        <>
                                            <h2>
                                                Login...
                                            </h2>
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button> */}
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <Button className="bg-white border-r-gray-400 hover:border hover:bg-accent" onClick={googleAuth}>
                                    <FcGoogle />
                                </Button>
                                <Button className="bg-white border-r-gray-400 hover:border text-blue hover:bg-accent">
                                    <FaSquareFacebook />
                                </Button>
                                <Button className="bg-white border-r-gray-400 hover:border text-black hover:bg-accent">
                                    <IoLogoGithub />
                                </Button>

                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?
                                <a href="#" className="font-medium text-primary hover:text-secondary transition-colors">Sign in</a>
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 text-center">
                        <p className="text-xs text-gray-500">
                            By registering, you agree to our <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}