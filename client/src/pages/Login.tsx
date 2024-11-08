import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { LoginFormData } from '../lib/validations/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      onGoogleClick={loginWithGoogle}
      onGithubClick={loginWithGithub}
      isLoading={isLoading}
    />
  );
}