import React, { Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import NotFound from './pages/NotFoundPage';
import Home from './pages/Home';
import Register from './pages/Register';
import { Button } from './components/ui/button'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import VerifyUser from './pages/VerifyUser';
import Profile from './pages/Profile';
import Code from './pages/Code';
// import { useToast } from "@/components/hooks/use-toast"
// import { Toaster } from "./components/ui/toaster"
// import { Toaster } from "./components/ui/"
// import { useToast } from "@./components/hooks/use-toast"

const App = () => {

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastRef = useRef(null);

  // const { toast } = useToast()

  useEffect(() => {
    if (toastMessage) {
      toastRef.current.click();
    }
  }, [showToast]);

  return (
    <Router>
      <main>
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Define the route to match the pattern with @ */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/code/:slug" element={<Code />} />
            <Route path="/user/:slug" element={<Profile></Profile>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Toaster
          position="top-center"
          reverseOrder={false}
        />

      </main>
    </Router>
  );
};

export default App;
