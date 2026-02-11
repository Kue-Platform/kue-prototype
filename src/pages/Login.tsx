import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { sendOTP, verifyOTP, setTokens, initiateGoogleSignIn } from "@/lib/auth";

type AuthStep = "email" | "verification";

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<AuthStep>("email");
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle email submission - send OTP
    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await sendOTP(email);
            setStep("verification");
            toast({
                title: "Verification code sent",
                description: `We've sent a verification code to ${email}. Valid for ${response.data.expiresIn / 60} minutes.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send verification code. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await verifyOTP(email, verificationCode);

            // Store tokens
            setTokens(response.data.accessToken, response.data.refreshToken);

            toast({
                title: "Sign in successful",
                description: response.data.isNewUser ? "Welcome to Kue!" : "Welcome back to Kue!",
            });

            // Navigate to home
            navigate("/");
        } catch (error) {
            toast({
                title: "Verification failed",
                description: error instanceof Error ? error.message : "Invalid code. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            const { url } = await initiateGoogleSignIn();
            // Redirect to the URL returned by the backend
            window.location.href = url;
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to initiate Google Sign-In. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep("email");
        setVerificationCode("");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
            <Card className="w-full max-w-md border-border/70 shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="font-serif text-3xl tracking-tight">
                        Welcome to Kue
                    </CardTitle>
                    <CardDescription className="text-base">
                        {step === "email" && "Sign in to access your professional network"}
                        {step === "verification" && "Verify your email to continue"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Google Sign In Button - Always visible */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2 border-border/70 py-6 text-base hover:bg-muted/80"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    {/* Step 1: Email Input */}
                    {step === "email" && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                    autoFocus
                                    className="border-border/70"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-6 text-base"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? "Sending code..." : "Continue"}
                            </Button>
                        </form>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === "verification" && (
                        <form onSubmit={handleVerificationSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="space-y-2">
                                <label htmlFor="email-display" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id="email-display"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="border-border/70 bg-muted/50"
                                />
                            </div>

                            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Verification code sent!</strong>
                                    <br />
                                    We've sent a 6-digit code to <strong>{email}</strong>. Please check your inbox and enter the code below.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="verification-code" className="text-sm font-medium text-foreground">
                                    Verification Code
                                </label>
                                <Input
                                    id="verification-code"
                                    name="code"
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    required
                                    disabled={isLoading}
                                    autoComplete="one-time-code"
                                    autoFocus
                                    maxLength={6}
                                    className="border-border/70 text-center text-lg tracking-widest"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBackToEmail}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-6 text-base"
                                    disabled={isLoading || verificationCode.length !== 6}
                                >
                                    {isLoading ? "Verifying..." : "Verify & Continue"}
                                </Button>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    toast({
                                        title: "Code resent",
                                        description: `A new verification code has been sent to ${email}.`,
                                    });
                                }}
                                disabled={isLoading}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                            >
                                Didn't receive the code? Resend
                            </button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
