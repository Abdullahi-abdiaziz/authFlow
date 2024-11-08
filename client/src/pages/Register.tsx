import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';
import { RegisterFormData } from '../lib/validations/auth';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithGithub } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await register(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleRegister}
      onGoogleClick={loginWithGoogle}
      onGithubClick={loginWithGithub}
      isLoading={isLoading}
    />
  );
}