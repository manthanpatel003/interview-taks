"use client";
import { FormContainer } from "@/components/FormContainer";
import { useLogin } from "@/hooks/apiHooks";
import {
  EmailOutlined,
  LockOutlined,
  LoginOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import * as Yup from "yup";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const inputFieldSize = useMemo(() => {
    return isSmallScreen ? "small" : "medium";
  }, [isSmallScreen]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: (response) => {
          console.log("Login successful", response);
          if (response?.token) {
            document.cookie = `token=${response.token}; path=/; max-age=86400; secure`;
          }
          localStorage.setItem("user", JSON.stringify(response?.user));
          router.replace("/");
        },
        onError: (error) => {
          console.error("Login failed", error);
        },
      });
    },
  });

  return (
    <FormContainer>
      <Box sx={{ mb: 5, textAlign: "center" }}>
        <Typography
          variant={isSmallScreen ? "h6" : "h4"}
          component="h1"
          sx={{
            fontWeight: 700,
          }}
        >
          Welcome Back
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Sign in to continue to your account
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <TextField
          size={inputFieldSize}
          fullWidth
          label="Email"
          name="email"
          type="email"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          size={inputFieldSize}
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? (
                      <VisibilityOutlined sx={{ color: "text.secondary" }} />
                    ) : (
                      <VisibilityOffOutlined sx={{ color: "text.secondary" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={!isPending && <LoginOutlined />}
          disabled={isPending}
          sx={{
            mt: 2,
            height: 56,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1.1rem",
            boxShadow: "0 3px 5px 2px rgba(102, 126, 234, .25)",
          }}
        >
          {isPending ? "Loading..." : "Login"}
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register?userType=customer"
              underline="hover"
              sx={{ mr: 1 }}
            >
              Register as Customer
            </Link>
            |
            <Link
              href="/register?userType=admin"
              underline="hover"
              sx={{ ml: 1 }}
            >
              Register as Admin
            </Link>
          </Typography>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default LoginPage;
