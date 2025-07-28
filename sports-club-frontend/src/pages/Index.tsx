import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, CreditCard, Trophy, Activity } from 'lucide-react';

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { title: 'Upcoming Events', value: '12', icon: Calendar, color: 'text-primary' },
    { title: 'Active Bookings', value: '8', icon: MapPin, color: 'text-secondary' },
    { title: 'Team Members', value: '156', icon: Users, color: 'text-accent' },
    { title: 'Monthly Revenue', value: '$12,340', icon: CreditCard, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}! 🏆
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening at your sports club today.
          </p>
        </div>
        <Button variant="athletic" size="lg">
          Quick Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
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
              <Activity className="h-5 w-5" />
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
              <Trophy className="h-5 w-5" />
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
                <Button variant="sport" size="sm">View Profile</Button>
                <Button variant="outline" size="sm">Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
