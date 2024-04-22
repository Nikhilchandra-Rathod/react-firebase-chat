import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export type AuthView = "login" | "signup";

export const Auth = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login");

  const handleChangeView = (view: AuthView) => {
    setCurrentView(view);
  };

  const handleAfterSignUp = () => {
    setCurrentView("login");
  };
  return <div className="flex h-dvh w-dvw items-center px-4 md:px-0 justify-center">{currentView === "login" ? <LoginForm onSignUpClick={() => handleChangeView("signup")} /> : <SignUpForm onAfterSingUp={handleAfterSignUp} />}</div>;
};
