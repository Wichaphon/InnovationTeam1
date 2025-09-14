import type React from "react";
import { useState, type ChangeEvent } from "react";
import axios from "axios"
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    return (
        <div className='flex justify-center pt-[5%]'>
            <LoginForm/>            
        </div>
    );
};
