'use client';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome!</h1>
            <p className="text-sm text-muted-foreground">
              We are glad to see you
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">LOGIN OR EMAIL</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">PASSWORD</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="text-center text-sm">
            Don't have an account yet?{' '}
            <Link
              to="/pages/signup"
              className="text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
