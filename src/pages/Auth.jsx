import { useState } from "react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="auth-section">

      <div className="auth-card">

        <div className="auth-logo">
          <div className="auth-logo-box">C</div>
        </div>

        <h1>
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>

        <p>
          {isLogin
            ? "Login to your CampusConnect account"
            : "Join the CampusConnect platform"}
        </p>

        <form>

          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button type="submit" className="auth-submit">
            {isLogin ? "Login" : "Create Account"}
          </button>

        </form>

        <div className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

      </div>

    </section>
  );
}

export default Auth;