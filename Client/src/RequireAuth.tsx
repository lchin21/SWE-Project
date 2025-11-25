import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";
import { Center, Loader } from "@mantine/core";

export default function RequireAuth() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthorized(true);
      } else {
        const token = localStorage.getItem("idToken");
        setAuthorized(Boolean(token));
      }
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <Center mih={200}>
        <Loader />
      </Center>
    );
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
