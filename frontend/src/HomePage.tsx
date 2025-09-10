import { useState } from "react";
import { useNavigate } from "react-router-dom";


function HomePage() {
    const baseurl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "user"


  const togglePassword = () => setShowPassword(prev => !prev)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    try {
        console.log(baseurl);
        const res = await fetch(`${baseurl}auth/signup`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                fname,
                lname,
                role
            }
            ),

        });
        if (!res.ok) {
            throw new Error("Failed to sign up");
        }
        const data = await res.json();
        console.log("Signup success:", data);

    } catch (error) {
        console.error("Error:", error);
    }
  }
    
  return (
    <>
    <div className="flex justify-center m-10">
        <div>
            <h1 className="text-5xl">Sign Up</h1>
        </div>
    </div>
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white-900">First Name</label>
            <input value={fname} onChange={(e) => setFname(e.target.value)} type="text" id="fname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Kongphop" required />
            
        </div>
        <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white-900">Last Name</label>
            <input value={lname} onChange={(e) => setLname(e.target.value)} type="text" id="lname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Worawut" required />
        </div>
        <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-white-900">Your email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="email@gmail.com" required />
        </div>
        <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white-900">Your password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            <div className="justify-self-end">
                <button type="button" onClick={togglePassword} className="cursor-pointer text-gray-500 hover:text-gray-700">{showPassword ? "Hide" : "Show"} </button>
            </div>
        </div>

        <div className="mb-5 justify-self-center">
            <button  type="submit" className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
    </form>
    
    </>

  );
}

export default HomePage;
