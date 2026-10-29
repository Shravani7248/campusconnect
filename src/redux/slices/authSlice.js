import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialToken =
  localStorage.getItem("campusconnect_token") || null;

const storedUser = localStorage.getItem("campusconnect_user");

const initialUser = storedUser ? JSON.parse(storedUser) : null;

// ======================================================
// REGISTER
// ======================================================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);

// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-email", {
        email,
        otp,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Email verification failed."
      );
    }
  }
);

// ======================================================
// RESEND OTP
// ======================================================

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resend-otp", {
        email,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to resend OTP."
      );
    }
  }
);

// ======================================================
// LOGIN
// ======================================================

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Invalid credentials."
      );
    }
  }
);

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to request password reset."
      );
    }
  }
);

// ======================================================
// VERIFY RESET OTP
// ======================================================

export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/verify-reset-otp",
        {
          email,
          otp,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Invalid or expired reset OTP."
      );
    }
  }
);

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { email, otp, newPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to reset password."
      );
    }
  }
);

// ======================================================
// GET CURRENT USER
// ======================================================

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch user profile."
      );
    }
  }
);

// ======================================================
// GOOGLE LOGIN WITH CREDENTIAL
// ======================================================

export const googleLoginWithCredential = createAsyncThunk(
  "auth/googleLoginWithCredential",
  async ({ credential }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google/credential", { credential });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Google authentication failed."
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  user: initialUser,

  token: initialToken,

  pendingEmail:
    localStorage.getItem(
      "campusconnect_pending_email"
    ) || "",

  resetEmail: "",

  resetOTP: "",

  loading: false,

  error: null,

  successMessage: null,
};

// ======================================================
// AUTH SLICE
// ======================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // --------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------

    clearAuthError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------
    // CLEAR SUCCESS
    // --------------------------------------------------

    clearAuthSuccess: (state) => {
      state.successMessage = null;
    },

    // --------------------------------------------------
    // PENDING EMAIL
    // --------------------------------------------------

    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;

      localStorage.setItem(
        "campusconnect_pending_email",
        action.payload
      );
    },

    // --------------------------------------------------
    // RESET EMAIL
    // --------------------------------------------------

    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },

    // --------------------------------------------------
    // SET AUTH SESSION (GOOGLE OAUTH / CALLBACK)
    // --------------------------------------------------
    setAuthSession: (state, action) => {
      const { token, user } = action.payload || {};
      state.token = token || null;
      state.user = user || null;
      state.loading = false;
      state.error = null;
      state.pendingEmail = "";

      if (token) {
        localStorage.setItem("campusconnect_token", token);
      }
      if (user) {
        localStorage.setItem("campusconnect_user", JSON.stringify(user));
      }
      localStorage.removeItem("campusconnect_pending_email");
    },

    // --------------------------------------------------
    // RESET OTP
    // --------------------------------------------------
    setResetOTP: (state, action) => {
      state.resetOTP = action.payload;
    },

    // ==================================================
    // LOGOUT
    // ==================================================

    logout: (state) => {
      // Clear Redux authentication state
      state.user = null;
      state.token = null;

      // Clear temporary auth data
      state.pendingEmail = "";
      state.resetEmail = "";
      state.resetOTP = "";

      // Clear messages
      state.error = null;
      state.successMessage = null;

      // Clear browser storage
      localStorage.removeItem(
        "campusconnect_token"
      );

      localStorage.removeItem(
        "campusconnect_user"
      );

      localStorage.removeItem(
        "campusconnect_pending_email"
      );

      // Clear any possible old authentication keys
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");

      sessionStorage.removeItem(
        "campusconnect_token"
      );

      sessionStorage.removeItem(
        "campusconnect_user"
      );
    },
  },

  // ====================================================
  // ASYNC REDUCERS
  // ====================================================

  extraReducers: (builder) => {
    builder

      // ==================================================
      // REGISTER
      // ==================================================

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(
        registerUser.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;

          const email =
            action.payload.data?.email || "";

          state.pendingEmail = email;

          if (email) {
            localStorage.setItem(
              "campusconnect_pending_email",
              email
            );
          }
        }
      )

      .addCase(
        registerUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // VERIFY EMAIL
      // ==================================================

      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(
        verifyEmail.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;

          const token =
            action.payload.data?.token;

          const user =
            action.payload.data?.user;

          if (token) {
            state.token = token;

            localStorage.setItem(
              "campusconnect_token",
              token
            );
          }

          if (user) {
            state.user = user;

            localStorage.setItem(
              "campusconnect_user",
              JSON.stringify(user)
            );
          }

          state.pendingEmail = "";

          localStorage.removeItem(
            "campusconnect_pending_email"
          );
        }
      )

      .addCase(
        verifyEmail.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // RESEND OTP
      // ==================================================

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(
        resendOTP.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;
        }
      )

      .addCase(
        resendOTP.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // LOGIN
      // ==================================================

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.loading = false;

          const token =
            action.payload.data?.token;

          const user =
            action.payload.data?.user;

          state.token = token || null;

          state.user = user || null;

          state.successMessage =
            action.payload.message;

          if (token) {
            localStorage.setItem(
              "campusconnect_token",
              token
            );
          }

          if (user) {
            localStorage.setItem(
              "campusconnect_user",
              JSON.stringify(user)
            );
          }
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;

          // Make sure failed login does not
          // leave an old authentication session.
          state.token = null;
          state.user = null;

          localStorage.removeItem(
            "campusconnect_token"
          );

          localStorage.removeItem(
            "campusconnect_user"
          );
        }
      )

      // ==================================================
      // FORGOT PASSWORD
      // ==================================================

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })

      .addCase(
        forgotPassword.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;
        }
      )

      .addCase(
        forgotPassword.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // VERIFY RESET OTP
      // ==================================================

      .addCase(
        verifyResetOTP.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        }
      )

      .addCase(
        verifyResetOTP.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;
        }
      )

      .addCase(
        verifyResetOTP.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // RESET PASSWORD
      // ==================================================

      .addCase(
        resetPassword.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.successMessage = null;
        }
      )

      .addCase(
        resetPassword.fulfilled,
        (state, action) => {
          state.loading = false;

          state.successMessage =
            action.payload.message;

          state.resetEmail = "";
          state.resetOTP = "";
        }
      )

      .addCase(
        resetPassword.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // GET ME
      // ==================================================

      .addCase(
        getMe.fulfilled,
        (state, action) => {
          const user =
            action.payload.data?.user;

          if (user) {
            state.user = user;

            localStorage.setItem(
              "campusconnect_user",
              JSON.stringify(user)
            );
          }
        }
      )

      .addCase(
        getMe.rejected,
        (state) => {
          // If token is invalid/expired,
          // clear the authentication session.
          state.user = null;
          state.token = null;

          localStorage.removeItem(
            "campusconnect_token"
          );

          localStorage.removeItem(
            "campusconnect_user"
          );
        }
      )

      // ==================================================
      // GOOGLE LOGIN WITH CREDENTIAL
      // ==================================================

      .addCase(googleLoginWithCredential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(googleLoginWithCredential.fulfilled, (state, action) => {
        state.loading = false;
        const token = action.payload.data?.token;
        const user = action.payload.data?.user;

        state.token = token || null;
        state.user = user || null;
        state.successMessage = action.payload.message || "Google login successful";

        if (token) {
          localStorage.setItem("campusconnect_token", token);
        }
        if (user) {
          localStorage.setItem("campusconnect_user", JSON.stringify(user));
        }
      })

      .addCase(googleLoginWithCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ======================================================
// EXPORT ACTIONS
// ======================================================

export const {
  clearAuthError,
  clearAuthSuccess,
  setPendingEmail,
  setResetEmail,
  setResetOTP,
  setAuthSession,
  logout,
} = authSlice.actions;

// ======================================================
// EXPORT REDUCER
// ======================================================

export default authSlice.reducer;