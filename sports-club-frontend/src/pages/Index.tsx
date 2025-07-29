import React, { useState, useRef, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, CreditCard, Trophy, Activity } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

const quickActions = [
  { label: 'Book Facility', to: '/facilities' },
  { label: 'Register for Event', to: '/events' },
  { label: 'Make Payment', to: '/payments' },
  { label: 'View Notifications', to: '/notifications' },
  { label: 'Settings', to: '/admin/settings' },
];

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { title: 'Upcoming Events', value: '12', icon: Calendar, color: 'text-primary', tooltip: 'View upcoming events' },
    { title: 'Active Bookings', value: '8', icon: MapPin, color: 'text-secondary', tooltip: 'See active facility bookings' },
    { title: 'Team Members', value: '156', icon: Users, color: 'text-accent', tooltip: 'Total team members' },
    { title: 'Monthly Revenue', value: 'KES 12,340', icon: CreditCard, color: 'text-green-600', tooltip: 'Total revenue this month' },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.firstName}! 
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening at your sports club today.
            </p>
          </div>
          <div className="relative" ref={actionsRef}>
            <Button variant="athletic" size="lg" onClick={() => setShowActions((v) => !v)}>
              Quick Actions
            </Button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => setShowActions(false)}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <stat.icon className={`h-5 w-5 ${stat.color} cursor-pointer`} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{stat.tooltip}</TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><Activity className="h-5 w-5 cursor-pointer" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Recent Activities</TooltipContent>
                </Tooltip>
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <p className="text-sm">New member John Doe registered</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full"></div>
                  <p className="text-sm">Tennis Court 1 booked for 3 PM</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                  <p className="text-sm">Basketball tournament event created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><Trophy className="h-5 w-5 cursor-pointer" /></span>
                  </TooltipTrigger>
                  <TooltipContent>Quick Stats</TooltipContent>
                </Tooltip>
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold bg-gradient-athletic bg-clip-text text-transparent">
                  {user?.role === 'admin' ? 'Admin' : 'Member'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'admin' 
                    ? 'Full system access and management capabilities'
                    : 'Access to events, bookings, and team features'
                  }
                </p>
                <div className="flex justify-center gap-2">
                  <Link to="/profile">
                    <Button variant="sport" size="sm">View Profile</Button>
                  </Link>
                  <Link to="/admin/settings">
                    <Button variant="outline" size="sm">Settings</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
