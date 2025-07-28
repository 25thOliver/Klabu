import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Trophy, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const { error: showError } = useNotification();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      showError('Login Failed', 'Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-sport">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-athletic flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Sports Club account</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              variant="athletic" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}