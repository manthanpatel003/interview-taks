"use client";
import { FormContainer } from "@/components/FormContainer";
import { useRegister } from "@/hooks/apiHooks";
import {
  EmailOutlined,
  HowToRegOutlined,
  LockOutlined,
  PersonOutline,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as Yup from "yup";

const AdminRegisterPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const search = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userType = search.get("userType");
  const { mutate, isPending } = useRegister(userType ?? "");
  const router = useRouter();

  const inputFieldSize = useMemo(() => {
    return isSmallScreen ? "small" : "medium";
  }, [isSmallScreen]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is Required"),
    }),
    onSubmit: (values) => {
      mutate(values, {
        onSuccess: () => {
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
          Create {userType === "admin" ? "Admin" : "Customer"} Account
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Fill in the details to create your account
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            size={inputFieldSize}
            fullWidth
            label="First Name"
            name="firstName"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            size={inputFieldSize}
            fullWidth
            label="Last Name"
            name="lastName"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Box>

        <TextField
          size={inputFieldSize}
          fullWidth
          label="Email"
          name="email"
          type="email"
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
        <TextField
          size={inputFieldSize}
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
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
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
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
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={!isPending && <HowToRegOutlined />}
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
          {isPending ? "Loading..." : "Create Account"}
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </FormContainer>
  );
};

export default AdminRegisterPage;
