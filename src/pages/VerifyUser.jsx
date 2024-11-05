import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { serverPath } from "@/constants/app";
import { getUUID } from "@/utils/token";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const [email, setEmail] = useState("kunalagrawal1818@gmail.com");
  const [emailValid, setEmailValid] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState(Array(6).fill(""));
  const [userUUID, setUserUUID] = useState("");

  const navigate = useNavigate();

  // check if userUUID is null and if yes then redirect to login
  // useEffect(() => {
  //   if (userUUID == null) {
  //     navigate("/login");
  //   }
  // }, [userUUID]);

  useEffect(() => {
    console.log("NNNN")
    setUserUUID(getUUID() || null);
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(validateEmail(value));
  };

  // Function to send the OTP code
  const sendCode = async () => {
    try {
      // Log the email for debugging purposes
      console.log("Sending to email:", email);

      // Send the request
      const response = await axios.post(`${serverPath}/services/send-otp/`, {
        user_uuid: userUUID,
        email: email
      });

      // Log and toast on successful response
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Log the error details
      console.error("Error sending code:", error);

      // Show a toast with error details if available
      const errorMessage = error.response?.data?.message || "Failed to send code. Please try again.";
      toast.error(errorMessage);
    }
  };


  // Handle "Next" button click or "Enter" key press
  const handleNextClick = () => {
    if (!showCodeInput && emailValid) {
      sendCode(); // Call sendCode when the email is valid
      setShowCodeInput(true); // Show the code input after sending the code
    }
  };

  // Handle Enter key for email input
  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNextClick();
    }
  };

  // Function to check OTP
  const checkOtp = async () => {
    console.log("OTP entered:", code.join(""));
    const user_otp = code.join("");

    try {
      // Log the email for debugging purposes
      console.log("Sending to email:", email);

      // Send the request
      const response = await axios.post(`${serverPath}/services/verify-otp/`, {
        user_uuid: userUUID,
        otp: user_otp,
      });

      // Log and toast on successful response
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Log the error details
      console.error("Error sending code:", error);
      // Show a toast with error details if available
      const errorMessage = error.response?.data?.message || "Failed to send code. Please try again.";
      toast.error(errorMessage);
    }

  };

  // Handle individual code box input
  const handleCodeChange = (e, index) => {
    const value = e.target.value;

    // If input is valid (a single digit) or empty, update code state
    if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value; // Update current input

      setCode(newCode);

      // Focus on the next input if the current input is filled
      if (value !== "" && index < code.length - 1) {
        setTimeout(() => {
          document.getElementById(`code-${index + 1}`).focus();
        }, 0);
      }
    }
  };

  // Handle key down event for code input
  const handleCodeKeyDown = (e, index) => {
    // If backspace is pressed and the current input is empty
    if (e.key === "Backspace" && code[index] === "") {
      // Move focus to the previous input
      if (index > 0) {
        setTimeout(() => {
          document.getElementById(`code-${index - 1}`).focus();
        }, 0);
      }
    }

    // If Enter is pressed on the last OTP input, call checkOtp
    if (e.key === "Enter" && index === code.length - 1) {
      checkOtp();
    }
  };

  // Check if all code digits are entered
  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Verify User</h2>

        {/* Email Input */}
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleEmailKeyDown} // Handle Enter key for email input
          disabled={showCodeInput} // Disable input when code input is active
          className={`w-full px-4 py-2 rounded-md ${showCodeInput && "bg-gray-100"}`}
        />

        {/* Code Input (appears after email input validation) */}
        {showCodeInput && (
          <div className="mt-6 space-x-2 flex justify-center animate-slide-down">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleCodeKeyDown(e, index)} // Handle key down for OTP input
                className="w-12 h-12 text-center"
              />
            ))}
          </div>
        )}

        {/* Next button */}
        <Button
          onClick={handleNextClick}
          disabled={showCodeInput ? !isCodeComplete : !emailValid}
          className={`w-full mt-4 py-2 ${(showCodeInput ? isCodeComplete : emailValid)
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-gray-400"
            }`}
        >
          Next
        </Button>
        <p>Verify it later <Link to="/" className="text-[var(--secondary-color)]">Go Back</Link></p>
           
      </div>
    </div>
  );
}
