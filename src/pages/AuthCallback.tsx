import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens, createSession } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const AuthCallback = () => {
    const navigate = useNavigate();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const handleAuth = async () => {
            try {
                // Parse the hash fragment (remove the leading #)
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);

                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");
                const error = params.get("error");
                const errorDescription = params.get("error_description");

                if (error) {
                    throw new Error(errorDescription || error);
                }

                if (accessToken) {
                    // Store tokens locally if needed (though we're moving to session cookies)
                    // setTokens(accessToken, refreshToken || ""); 

                    // Exchange the access token for a backend session
                    await createSession(accessToken);

                    toast({
                        title: "Sign in successful",
                        description: "Welcome to Kue!",
                    });
                    navigate("/");
                } else {
                    // Check query params as fallback or for error handling
                    const queryParams = new URLSearchParams(window.location.search);
                    const queryError = queryParams.get("error");
                    if (queryError) {
                        throw new Error(queryError);
                    }

                    navigate("/login");
                }
            } catch (err) {
                console.error("Auth callback error:", err);
                toast({
                    title: "Sign in failed",
                    description: err instanceof Error ? err.message : "Authentication failed",
                    variant: "destructive",
                });
                navigate("/login");
            }
        };

        handleAuth();
    }, [navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
