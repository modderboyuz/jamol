"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Star, 
  Clock, 
  User
} from "lucide-react";

function WorkerCard({ worker, onClick }: { worker: any; onClick: () => void }) {
  const avgRating = worker.averageRating || 0;
  const totalReviews = worker.totalReviews || 0;

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {worker.first_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors">
              {worker.first_name} {worker.last_name}
            </h3>
            <p className="text-sm text-gray-600">{worker.specialization}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({totalReviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{worker.experience_years} yil</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">
            {Number(worker.hourly_rate || 0).toLocaleString()} so'm/soat
          </span>
          <Badge variant="secondary" className="text-xs">
            Mavjud
          </Badge>
        </div>

        {worker.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {worker.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Workers() {
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['/api/workers'],
    queryFn: async () => {
      const response = await fetch('/api/workers');
      if (!response.ok) throw new Error('Failed to fetch workers');
      return response.json();
    }
  });

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    // Open worker detail modal
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
            <div className="mb-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
          <div className="mb-4">
            <h1 className="text-lg font-bold text-gray-900 mb-1">Ustalar</h1>
            <p className="text-gray-600 text-sm">Malakali ustalar bilan tanishing</p>
          </div>

          {!workers?.length ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ustalar topilmadi</h3>
              <p className="text-gray-500">Hozircha mavjud ustalar yo'q</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker: any) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onClick={() => handleWorkerClick(worker)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}