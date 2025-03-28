"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col justify-center items-center h-dvh">
      <h1 className="text-3xl font-bold mb-6">Oops!😜Page Not Found</h1>
      <p>Redirecting to Home in {countdown} Seconds</p>
    </div>
  );
}
