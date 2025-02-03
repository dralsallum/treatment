import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { userSelector } from "./authSlice";

const withAuthRedirect = (WrappedComponent, redirectPath = "home") => {
  return (props) => {
    const router = useRouter();
    const { currentUser } = useSelector(userSelector);

    useEffect(() => {
      if (currentUser) {
        router.push(redirectPath);
      }
    }, [currentUser]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuthRedirect;
