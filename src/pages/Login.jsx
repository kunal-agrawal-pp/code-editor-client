import React, {useState } from 'react';

// ShadCN UI components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import SideImg from "../assets/login-register-side-img.png";

// Firebase import
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '@/firebase';
import validator from 'validator';
import { serverPath } from '@/constants/app';
import axios from 'axios';
import { getUUID } from '@/utils/token';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// Google auth instance
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const Login = () => {
    const [email, setEmail] = useState(["", false, ""]);
    const [password, setPassword] = useState(["", false, ""]);

    const navigate = useNavigate();


    const submitForm = async () => {
        const loadingToast = toast.loading('Processing...');

        if (!!(email[1] && password[1])) {
            toast.error("Please fill all fields properly");
            return;
        }

        try {
            const reqs = await axios.post(`${serverPath}/auth/login`, {
                email: email[0],
                password: password[0],
                loginWith: "email",
                uuid: getUUID()
            });

            if (reqs.data.success) {
                toast.success("Logged in successfully");
                // Handle successful login (store user details, redirect, etc.)
                if (reqs.data.data.userDetails.signupWith !== "email") { return; }
                const user = reqs.data.data.userDetails;
                console.log(user)

                localStorage.setItem("appTheme", user.appTheme);
                // set cookie of uuid to user browser
                document.cookie = `uuid=${user.uuid};`;
                document.cookie = `token=${user.token};`;
                document.cookie = `isVerified=${user.isVerified};`;
                document.cookie = `signupWith=${user.signupWith};`;
                document.cookie = `slug=${user.slug};`;
                document.cookie = `bio=${user.bio};`;
                document.cookie = `email=${user.email};`;
                document.cookie = `fName=${user.fName};`;
                document.cookie = `lName=${user.lName};`;

                navigate("/verify-user");
                

            } else {
                toast.error(reqs.data.message);
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            toast.dismiss(loadingToast);
        }
    };


    function handleInputChange(typeOfInput, setter, value) {
        let isValid = true, errorMessage = "";
        if (typeOfInput === "email") {
            isValid = validator.isEmail(value);
            errorMessage = isValid ? "" : "Invalid email";
        } else if (typeOfInput === "password") {
            isValid = validator.isLength(value, { min: 8, max: 15 });
            errorMessage = isValid ? "" : "Length must be min 8 and max 15";
        }
        setter([value, !isValid, errorMessage]);
    }

    const logInWithGoogle = async () => {
        const loadingToast = toast.loading('Processing...');
        try {
            const result = await signInWithPopup(auth, provider);
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            const g_user = result.user;

            // You can store user data in your backend here.
            const reqs = await axios.post(`${serverPath}/auth/login`, {
                email: g_user.email,
                loginWith: "google", // or any identifier for Google signup
            });
            // console.log(reqs.data)
            if (reqs.data.success) {
                toast.success("Logged in successfully with Google");
                console.log("good to go");
                console.log(reqs.data)
                let user = reqs.data.data.userDetails;
                localStorage.setItem("appTheme", user.appTheme);
                // set cookie of uuid to user browser
                document.cookie = `uuid=${user.uuid};`;
                document.cookie = `token=${user.token};`;
                document.cookie = `isVerified=${user.isVerified};`;
                document.cookie = `signupWith=${user.signupWith};`;
                document.cookie = `slug=${user.slug};`;
                document.cookie = `bio=${user.bio};`;
                document.cookie = `email=${user.email};`;
                document.cookie = `fName=${user.fName};`;
                document.cookie = `lName=${user.lName};`;

                navigate("/verify-user");


            } else {
                console.log("error in else block 103");
                toast.error(reqs.data.message);
            }
        } catch (error) {
            console.log("error in catch block 107");
            toast.error("An error occurred during Google login");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    return (
        <div className='w-[100%] h-[100%] relative'>
            <div className='w-[50%] h-[100%] absolute left-[0] top-[0]'>
                <img src={SideImg} alt="" className='w-[100%] h-[100%]' />
            </div>

            <div className='active w-[50%] h-[100%] absolute right-[0] top-[0] flex flex-col items-center justify-center'>
                <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="me@example.com"
                        value={email[0]}
                        onChange={(e) => handleInputChange("email", setEmail, e.target.value)}
                        className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                    />
                    {email[1] && <p className="text-red-500">{email[2]}</p>}
                </div>

                <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                    <Label htmlFor="password">Password:</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password[0]}
                        onChange={(e) => handleInputChange("password", setPassword, e.target.value)}
                        className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                    />
                    {!password[1] && <p className="text-red-500">{password[2]}</p>}
                </div>

                <Button onClick={submitForm} variant="outline" className="rounded-[var(--br-1)] mt-[2rem] w-[40%] hover:bg-[var(--grey-color-900)] hover:text-[var(--white)]">
                    Login
                </Button>

                {/* <Button onClick={logInWithGoogle}>Sign in with Google</Button> */}
                <Button onClick={() => { logInWithGoogle() }} variant="outline" className="rounded-[var(--br-1)] mt-[2rem] w-[40%] hover:bg-[var(--grey-color-900)] hover:!text-[var(--white)]">
                    <img src="https://firebasestorage.googleapis.com/v0/b/replit-clone-d9156.appspot.com/o/app%2Fgoogle_logo.png?alt=media&token=0756cc4b-f8c3-471c-adf5-2db6bb656a9e" alt="Google logo" class="w-5 h-5" />
                    Sign in with Google
                </Button>
                <br />
                <p>Don't have an account? <Link to="/register" className="text-[var(--secondary-color)]">Sign up</Link></p>
            </div>
        </div>
    );
}

export default Login;
