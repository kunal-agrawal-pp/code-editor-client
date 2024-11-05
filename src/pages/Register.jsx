import React, { useEffect, useState } from 'react';

// ShadCN UI components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import SideImg from "../assets/login-register-side-img.png";

// Library to get user devices details 
import UAParser from 'ua-parser-js';

// Firebase import
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '@/firebase';
import validator from 'validator';
import { serverPath, USER_SLUG_VARIFY_REGEX } from '@/constants/app';
import axios from 'axios';
import { getUUID } from '@/utils/token';
import toast from 'react-hot-toast';
import { generateRandomFourDigitNumber, generateRandomString } from '@/utils/basic';
import { Link } from 'react-router-dom';


// Google auth instance
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);

const Register = () => {
    // in useState first string is value of that field, second boolean is for error is there or not, and
    // third is for string error message
    const [fname, setFName] = useState(["", false, ""]);
    const [lname, setLName] = useState(["", false, ""]);
    const [email, setEmail] = useState(["", false, ""]);
    const [password, setPassword] = useState(["", false, ""]);
    const [slug, setSlug] = useState(["", false, ""]);

    let inputFieldRow = [];

    useEffect(() => {
        if (inputFieldRow.length != 0) return;

        const allField = document.querySelectorAll(".input");
        // console.log(allField)
        for (let i = 0; i < allField.length; i++) {
            // inputFieldRow.push(allField);
            inputFieldRow.push(allField[i].id)
        }
    }, [inputFieldRow])

    const parser = new UAParser();
    const userDevicesDetails = parser.getResult();

    function emailValidateInput(email) {
        const isEmailValid = validator.isEmail(email);
        return isEmailValid;
    }

    function stringValidateInput(name) {
        const isNameValid = !validator.isEmpty(name);
        return isNameValid;
    }

    // useEffect(() => {
    //     console.log(userDevicesDetails); // This will log device, OS, and browser details.
    // }, [])

    // useEffect(() => {
    //     console.log(fname, " - ", lname, " - ", email, " - ", password)
    //     // if (emailValidateInput(email))


    // }, [fname, lname, email, password])

    const userSlugVarify = (slug) => {
        return USER_SLUG_VARIFY_REGEX.test(slug);
    }

    function handleInputChange(typeOfInput, setter, value, name) {
        let isValid = true, errorMessage = "";
        if (typeOfInput == "string") {
            isValid = validator.isLength(value, { min: "1", max: "15" });
            errorMessage = isValid ? "" : "Length must be min 1 and max 15";
        }
        else if (typeOfInput == "email") {
            isValid = emailValidateInput(value);
            errorMessage = isValid ? "" : "Invalid email";
            console.log(isValid)
        }
        else if (typeOfInput == "password") {
            let isLengthCorrect = validator.isLength(value, { min: "8", max: "15" });
            errorMessage = isLengthCorrect ? "" : "Length must be min 8 and max 15";
        } else if (typeOfInput == "slug") {
            isValid = (validator.isLength(value, { min: "8", max: "15" }) && userSlugVarify(`@${value}`))
            errorMessage = isValid ? "" : "Must contains min 8 and max 15 characters and start only with a-z or A-Z and no other special symbol except '_'";
        }
        console.log(!isValid, name)
        setter([value, !isValid, errorMessage]);
    }

    // Function to login with Google and get details
    const signInWithGoogle = async () => {
        const loadingToast = toast.loading('Processing...');
        let g_user = "";
        let g_token = "";

        try {
            const result = await signInWithPopup(auth, provider); // Await the result here
            console.log("every thing is fine 164");
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log("every thing is fine 166")
            const token = credential.accessToken;
            g_user = result.user;
            console.log("every thing is fine 169");

            console.log(g_user);

            let g_fName = g_user.displayName.split(" ")[0];
            let g_lName = g_user.displayName.split(" ")[1] || "";

            let slugBase = `@${g_fName}_${generateRandomString(5)}_${generateRandomFourDigitNumber()}`;

            console.log("every thing is fine 175");

            // Ensure slug is between 8 and 15 characters
            if (slugBase.length < 8) {
                // Pad with additional characters if it's too short
                slugBase = slugBase.padEnd(8, 'x'); // You can choose a different padding character
            } else if (slugBase.length > 15) {
                // Trim if it's too long
                slugBase = slugBase.slice(0, 15);
            }
            console.log("every thing is fine 183");

            const reqs = await axios.post(`${serverPath}/auth/register`, {
                fName: g_fName, // Use g_fName instead of g_user
                lName: g_lName,
                email: g_user.email,
                password: undefined,
                signupWith: "google",
                slug: slugBase,
                uuid: getUUID(),
            });

            if (reqs.data.success) {
                toast.success("Congrats, you have been registered by google");
                console.log(reqs)

                let user = reqs.data.data.userDetails;
                localStorage.setItem("appTheme", user.appTheme);
                console.log(user);
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
            } else {
                toast.error(reqs.data.message);
            }
        } catch (error) {
            const errorMessage = error.message || "An error occurred";
            toast.error(errorMessage);
        } finally {
            toast.dismiss(loadingToast);
        }
    };



    const submitForm = async () => {
        const loadingToast = toast.loading('Processing...');

        console.log(!!(fname[1] && lname[1] && email[1] && password[1] && slug[1]))
        if (!!(fname[1] && lname[1] && email[1] && password[1] && slug[1])) {
            console.log("Please fill all fields properly")
            toast.error("Please fill all fields properly");
            return;
        }

        try {
            const reqs = await axios.post(`${serverPath}/auth/register`, {
                fName: fname[0],
                lName: lname[0],
                email: email[0],
                password: password[0],
                signupWith: "email",
                slug: `@${slug[0]}`,
                uuid: getUUID()

            });

            if (reqs.data.success) {
                toast.success("Congrats, you have been registered");
            } else {
                toast.error(reqs.data.message);
            }
        } catch (error) {
            toast.error(reqs.data.message);
        } finally {
            toast.dismiss(loadingToast);
        }

        // const req = await toast.promise(
        //     axios.post(`${serverPath}/auth/register`, {
        //         fName: fname[0],
        //         lName: lname[0],
        //         email: email[0],
        //         password: password[0],
        //         signupWith: "email",
        //         slug: `@${slug[0]}`,
        //         uuid: getUUID()

        //     }),
        //     {
        //         loading: 'Processing...',      // Message while loading
        //         success: (data) => {
        //             if (data.data.success) {
        //                 return (
        //                     <div>
        //                         <FaCheckCircle style={{ color: 'green', marginRight: '8px' }} />
        //                         Congrats, you have been registered
        //                     </div>
        //                 );
        //             } else {
        //                 return (
        //                     <div>
        //                         <FaExclamationCircle style={{ color: 'orange', marginRight: '8px' }} />
        //                         {data.data.message}
        //                     </div>
        //                 );
        //             }
        //         },
        //         error: (err) => {
        //             console.log(err)
        //             // Handle error message here
        //             return <b>{err.response?.data?.message || "An error occurred"}</b>;
        //         },
        //     }
        // );

        let data = req.data;

        // if (!data.success) {
        //     toast.error(data.message);
        //     return;
        // }
        console.log(data);
        const user = data.userDetails;
        /* user = {
        "token": "eyJhbGciO.qQmwKRc_Jhf3u22jgRmMM8VzThp7_y2ytf40Ud0mmug",
        "uuid": "ec712436-8c53-430d-9c79-bea564b353a9",
        "slug": "@kunal_me_6",
        "bio": "",
        "email": "me32@gmail.com",
        "isVerified": true,
        "signupWith": "email",
        "appTheme": "DARK"
    }*/

        const user_appTheme = user.appTheme;
        const user_token = user.token;
        const user_uuid = user.uuid;
        const user_slug = user.slug;
        const user_bio = user.bio;
        const user_email = user.email;
        const user_isVerified = user.isVerified;
        const user_signupWith = user.signupWith;
        const user_fName = user.fName;
        const user_lName = user.lName;

        localStorage.setItem("appTheme", user_appTheme);
        // set cookie of uuid to user browser
        document.cookie = `uuid=${user_uuid};`;
        document.cookie = `token=${user_token};`;
        document.cookie = `isVerified=${user_isVerified};`;
        document.cookie = `signupWith=${user_signupWith};`;
        document.cookie = `slug=${user_slug};`;
        document.cookie = `bio=${user_bio};`;
        document.cookie = `email=${user_email};`;
        document.cookie = `fName=${user_fName};`;
        document.cookie = `lName=${user_lName};`;
        console.log(document.cookie)

    };


    const onFocus = (elemId) => {
        const activeInput = document.querySelector(".active");
        // console.log(activeInput);
        if (activeInput) {
            activeInput.classList.remove("active");
        }

        const elem = document.querySelector(`#${elemId}`);
        elem.classList.add("active");
        // console.log(elem.classList.contains("active"))
        // console.log(elem)

    }

    const nextFocus = () => {
        const activeInput = document.querySelector(".active").id;
        // console.log(activeInput)
        // console.log(inputFieldRow)
        const currentIndexInArray = inputFieldRow.indexOf(activeInput);
        // console.log(currentIndexInArray)
        const nextIndexInArray = currentIndexInArray + 1;
        // console.log(nextIndexInArray)
        // console.log(nextIndexInArray)
        if (nextIndexInArray == inputFieldRow.length) {
            // mean focus is on last index field
            // console.log("L:LKIOL<")
            submitForm();
        } else {
            // console.log("L:2345LKIOL<2345678")
            const nextId = inputFieldRow[nextIndexInArray]
            const nextElem = document.querySelector(`#${nextId}`);
            // console.log(nextElem)
            nextElem.focus();
        }
    }

    return (
        <>
            <div className='w-[100%] h-[100%] relative'>
                {/* left side image */}
                <div className='w-[50%] h-[100%] absolute left-[0] top-[0]'>
                    <img src={SideImg} alt="" className='w-[100%] h-[100%]' />
                </div>

                {/* right side form start */}
                <div className='active w-[50%] h-[100%] absolute right-[0] top-[0] flex flex-col items-center justify-center'>
                    <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                        <Label htmlFor="fname">First Name:</Label>
                        <Input
                            id="fname"
                            type="text"
                            placeholder="Enter your first name"
                            value={fname[0]}
                            onFocus={(e) => { onFocus(e.target.id) }}
                            onKeyDown={(e) => { if (e.key == "Enter") { nextFocus() } }}
                            onChange={(e) => { handleInputChange("string", setFName, e.target.value, "fname") }}
                            className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                        />
                        {!fname[1] && <p className="text-red-500">{fname[2]}</p>}
                    </div>

                    <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                        <Label htmlFor="lname">Last Name:</Label>
                        <Input
                            id="lname"
                            type="text"
                            placeholder="Enter your last name"
                            value={lname[0]}
                            onFocus={(e) => { onFocus(e.target.id) }}
                            onKeyDown={(e) => { if (e.key == "Enter") { nextFocus(); console.log("O*&^%$") } }}
                            onChange={(e) => handleInputChange("string", setLName, e.target.value, "lname")}
                            className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                        />
                        {lname[1] && <p className="text-red-500">{lname[2]}</p>}
                    </div>

                    <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="me@example.com"
                            value={email[0]}
                            onFocus={(e) => { onFocus(e.target.id) }}
                            onKeyDown={(e) => { if (e.key == "Enter") { nextFocus() } }}
                            onChange={(e) => handleInputChange("email", setEmail, e.target.value, "email")}
                            className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                        />
                        {email[1] && <p className="text-red-500">{email[2]}</p>}
                    </div>

                    <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                        <Label htmlFor="password">Password:</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter a strong password"
                            value={password[0]}
                            onFocus={(e) => { onFocus(e.target.id) }}
                            onKeyDown={(e) => { if (e.key == "Enter") { nextFocus() } }}
                            onChange={(e) => handleInputChange("password", setPassword, e.target.value, "password")}
                            className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                        />
                        {!password[1] && <p className="text-red-500">{password[2]}</p>}
                    </div>
                    <div className="grid gap-2 w-[80%] mt-[1.5rem]">
                        <Label htmlFor="slug">Slug:</Label>
                        <Input
                            id="slug"
                            type="slug"
                            placeholder="Enter a slug that matches you"
                            value={slug[0]}
                            onFocus={(e) => { onFocus(e.target.id) }}
                            onKeyDown={(e) => { if (e.key == "Enter") { nextFocus() } }}
                            onChange={(e) => handleInputChange("slug", setSlug, e.target.value, "slug")}
                            className="input rounded-[var(--br-1)] focus:border-[var(--secondary-color)] transition"
                        />
                        {slug[1] && <p className="text-red-500">{slug[2]}</p>}
                    </div>

                    <Button onClick={() => { submitForm() }} variant="outline" className="rounded-[var(--br-1)] mt-[2rem] w-[40%] hover:bg-[var(--grey-color-900)] hover:text-[var(--white)]">
                        Create Account
                    </Button>

                    <Button onClick={() => { signInWithGoogle() }} variant="outline" className="rounded-[var(--br-1)] mt-[2rem] w-[40%] hover:bg-[var(--grey-color-900)] hover:!text-[var(--white)]">
                        <img src="https://firebasestorage.googleapis.com/v0/b/replit-clone-d9156.appspot.com/o/app%2Fgoogle_logo.png?alt=media&token=0756cc4b-f8c3-471c-adf5-2db6bb656a9e" alt="Google logo" class="w-5 h-5" />
                        Sign in with Google
                    </Button>
                    <br />
                    <p>Already have an account? <Link to="/login" className="text-[var(--secondary-color)]">Login</Link></p>
                </div>
            </div>
        </>
    );
}

export default Register;
