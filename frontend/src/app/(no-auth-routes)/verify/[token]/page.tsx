"use client";
import { useVerifyUser } from "@/hooks/apiHooks";
import { CheckCircle, Error } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const VerifyPage = () => {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const { mutate, isPending, data, isError } = useVerifyUser(token);

  useEffect(() => {
    if (token) {
      mutate();
    }
  }, [mutate, token]);

  const handleLoginClick = () => {
    router.replace("/login");
  };

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="text-center space-y-3">
          <CircularProgress />
          <p className="text-lg font-medium text-gray-700">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="text-center space-y-3 p-8 bg-white rounded-lg shadow-lg">
          <Error color="error" />
          <p className="text-xl font-medium text-gray-800">
            Verification Failed
          </p>
          <p className="text-gray-600">
            Please try again or contact support for assistance.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (data) {
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
    return (
      <div className="flex h-screen items-center justify-center ">
        <div className="text-center space-y-3 p-8 bg-white rounded-lg shadow-lg">
          <CheckCircle color="success" />
          <p className="text-xl font-medium text-gray-800">
            Verification Successful!
          </p>
          <p className="text-gray-600">
            Your account has been successfully verified. You can now log in.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLoginClick}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyPage;
