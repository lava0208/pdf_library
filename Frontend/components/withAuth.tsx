import { BASE_URL } from "@/Config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent: any) => {
    const AuthComponent = (props: any) => {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                const loginToken = localStorage.getItem("login-token");

                if (loginToken) {
                    try {
                        const response = await fetch(`${BASE_URL}/signin`, {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${loginToken}`
                            }
                        });

                        if (response.ok) {
                            console.log("Successfully logged in");
                            setIsAuthenticated(true);
                        } else {
                            console.log("Login failed");
                            localStorage.setItem("originDestination", router.asPath);
                            router.push('/signin');
                        }
                    } catch (error) {
                        console.error("Error during authentication check:", error);
                        localStorage.setItem("originDestination", router.asPath);
                        router.push('/signin');
                    }
                } else {
                    localStorage.setItem("originDestination", router.asPath);
                    router.push('/signin');
                }
            };

            checkAuth();
        }, [router]); // Dependency on router ensures useEffect runs when the router changes

        if (!isAuthenticated) {
            return null; // Or a loading indicator, while the authentication check is happening
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
