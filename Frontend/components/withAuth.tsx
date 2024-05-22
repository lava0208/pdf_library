import { BASE_URL } from "@/Config";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent: any) => {
    const AuthComponent = (props: any) => {
        const router = useRouter();
        useEffect(() => {
            const loginToken = localStorage.getItem("login-token");

            if (loginToken) {
                fetch(`${BASE_URL}/signin`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${loginToken}`
                    }
                }).then(response => {
                    if (response.ok) {
                        console.log("Successfully logged in");
                        const data = response.json();
                        return data;
                    } else {
                        console.log("Login failed");
                        localStorage.setItem("originDestination", router.asPath);
                        router.push('/signin');
                    }
                }).then((data) => {
                })
            } else {
                localStorage.setItem("originDestination", router.asPath);
                router.push('/signin');
            }
        }, []); // Empty dependency array ensures this effect runs only once

        return <WrappedComponent {...props} />;
    }
    return AuthComponent;
}

export default withAuth;