// not finish api are not working properly

import { serverPath } from '@/constants/app';
import { getToken, getUUID } from '@/utils/token';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [slug, setSlug] = useState();
  const [isVerifiedSlug, setIsVerifiedSlug] = useState(false);

  useEffect(() => {
    let url = location.pathname.split("/")[2];
    if (url.startsWith("@")) {
      setSlug(url);
      setTimeout(() => {
        verifySlug();
      }, 2000)
    } else {
      console.log(":LKJHGFDSwEDFGHTR#")
      toast.error("Invalid URL, Navigating you to home page");
      // setTimeout(() => {
      // navigate("/");
      // }, 3000)

    }
  }, [])

  const verifySlug = async () => {
    const loadingToast = toast.loading("Verifying you...");
    // if (!slug) return;
    try {
      const res = await axios.post(`${serverPath}/user/get-user-details`, {
        withCredentials: true,
        token: getToken(),
        user_slug: slug,
      });
      if (res.data.success) {
        toast.success("You are verified");
        setIsVerifiedSlug(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify you, Please refresh once");
    } finally {
      toast.dismiss(loadingToast);
    }
  }

  // console.log();

  return (
    <div>Profile</div>
  )
}

export default Profile