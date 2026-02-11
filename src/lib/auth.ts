const API_BASE_URL = import.meta.env.API_URL;

// Token management
export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// API response types
interface SendOTPResponse {
    statusCode: number;
    message: string;
    data: {
        email: string;
        expiresIn: number;
    };
}

interface VerifyOTPResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            createdAt: string;
        };
        isNewUser: boolean;
    };
}

// Auth API functions
export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        // Try to parse error message from backend
        try {
            const errorData = await response.json();
            const errorMessage = errorData.message || errorData.error;
            throw new Error(errorMessage || 'Failed to send verification code. Please try again.');
        } catch (parseError) {
            throw new Error('Failed to send verification code. Please try again.');
        }
    }

    return response.json();
};

export const verifyOTP = async (email: string, code: string): Promise<VerifyOTPResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
    });

    // Parse the response body first
    const data = await response.json();

    // Backend returns HTTP 201 but with statusCode in body for errors
    // Check both HTTP status and body statusCode
    if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
        const errorMessage = data.message || data.error || 'Failed to verify OTP. Please try again.';
        throw new Error(errorMessage);
    }

    return data;
};

export const createSession = async (accessToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to create session');
    }

    return response.json();
};

// API utility with authentication
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const accessToken = getAccessToken();

    const headers = {
        ...options.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
        clearTokens();
        window.location.href = '/login';
        throw new Error('Unauthorized - please log in again');
    }

    return response;
};

export const initiateGoogleSignIn = async (): Promise<{ url: string }> => {
    // Determine the current origin to use as the redirect URL
    const redirectTo = `${window.location.origin}/auth/callback`;

    // Call the backend to get the Google OAuth URL with the redirect parameter
    const response = await fetch(`${API_BASE_URL}/auth/signin/google?redirectTo=${redirectTo}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to initiate Google Sign-In');
    }

    return response.json();
};
