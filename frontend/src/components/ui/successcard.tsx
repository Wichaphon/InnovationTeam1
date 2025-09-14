import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const SuccessCard = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg border border-gray-100">

            {/* Outer checkmark circle */}

            {/* Content Section */}
            <div className="flex flex-col items-center justify-center mt-16 text-center">
                <div className="absolute -top-12 flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg">
                    {/* Inner checkmark circle */}
                    <div className="flex items-center justify-center w-20 h-20 bg-green-500 rounded-full shadow-md">
                        {/* Checkmark SVG */}
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Success!</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Your account has been created successfully.
                </p>
                <hr className="w-12 h-1 bg-gray-300 rounded mt-6 mb-8" />
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 px-4 md:space-x-4 w-full">
                <Button
                    onClick={handleLoginClick}
                    className="flex-1 px-6 py-6 text-base font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Continue to Login
                </Button>
                <Button
                    onClick={handleRegisterClick}
                    className="flex-1 px-6 py-6 text-base font-semibold text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Back To Register
                </Button>
            </div>

        </div>

    );
}