"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/app-layout';
import { ClipboardList } from 'lucide-react';

export default function WorkerApplications() {
  const { user } = useAuth();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['/api/worker-applications'],
    enabled: !!user && user.role === 'worker',
    queryFn: async () => {
      const response = await fetch('/api/worker-applications', {
        headers: {
          'x-telegram-id': user?.telegram_id?.toString() || '',
        },
      });
      if (!response.ok) {
        throw new Error('Arizalarni yuklashda xatolik');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Arizalar yuklanmoqda...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Menga kelgan arizalar</h1>
        </div>

        {!applications || applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Arizalar mavjud emas</h2>
              <p className="text-gray-600">Hozircha sizga ariza yo'q</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application: any) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{application.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{application.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}