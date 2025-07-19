import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/query-client";
import { 
  Star, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  User,
  Send,
  StarIcon
} from "lucide-react";
import type { User as Worker, WorkerReview, WorkerApplication } from "@shared/schema";

interface WorkerWithReviews extends Worker {
  reviews?: WorkerReview[];
  averageRating?: number;
  totalReviews?: number;
}

function WorkerCard({ worker, onClick }: { worker: WorkerWithReviews; onClick: () => void }) {
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
            {worker.is_available ? 'Mavjud' : 'Band'}
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

function WorkerDetailModal({ worker, isOpen, onClose }: { 
  worker: WorkerWithReviews | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews } = useQuery({
    queryKey: [`/api/workers/${worker?.id}/reviews`],
    enabled: !!worker?.id && isOpen,
    queryFn: async () => {
      const response = await fetch(`/api/workers/${worker!.id}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: { rating: number; comment: string }) =>
      apiRequest(`/api/workers/${worker!.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workers/${worker!.id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: ['/api/workers'] });
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      toast({
        title: "Muvaffaqiyat",
        description: "Sharh qo'shildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Sharh qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const createApplicationMutation = useMutation({
    mutationFn: (applicationData: { worker_id: string; description: string; budget?: string }) =>
      apiRequest('/api/worker-applications', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      }),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyat",
        description: "Ariza yuborildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Ariza yuborishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (newReview.comment.trim()) {
      submitReviewMutation.mutate(newReview);
    }
  };

  const handleContact = () => {
    createApplicationMutation.mutate({
      worker_id: worker!.id,
      description: "Xizmat so'rovi",
    });
  };

  if (!worker) return null;

  const avgRating = reviews?.reduce((sum: number, review: WorkerReview) => sum + review.rating, 0) / (reviews?.length || 1) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {worker.first_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{worker.first_name} {worker.last_name}</h2>
              <p className="text-gray-600">{worker.specialization}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Worker Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{worker.experience_years} yil tajriba</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm">{avgRating.toFixed(1)} ({reviews?.length || 0} sharh)</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold text-lg">
              {Number(worker.hourly_rate || 0).toLocaleString()} so'm/soat
            </p>
            <p className="text-sm text-gray-600 mt-1">{worker.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleContact} className="flex-1" disabled={createApplicationMutation.isPending}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Bog'lanish
            </Button>
            {worker.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${worker.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Qo'ng'iroq
                </a>
              </Button>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sharhlar</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Sharh qoldirish
              </Button>
            </div>

            {showReviewForm && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rating">Baho</Label>
                      <div className="flex space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className={`h-8 w-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <StarIcon className="h-6 w-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Sharh</Label>
                      <Textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Ushbu usta haqida fikringizni yozing..."
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmitReview} 
                      disabled={submitReviewMutation.isPending || !newReview.comment.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Yuborish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reviews?.map((review: WorkerReview) => (
                <Card key={review.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
              {!reviews?.length && (
                <p className="text-center text-gray-500 py-4">Hali sharhlar yo'q</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Workers() {
  const [selectedWorker, setSelectedWorker] = useState<WorkerWithReviews | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: workers, isLoading } = useQuery({
    queryKey: ['/api/workers'],
    queryFn: async () => {
      const response = await fetch('/api/workers');
      if (!response.ok) throw new Error('Failed to fetch workers');
      return response.json();
    }
  });

  const handleWorkerClick = (worker: WorkerWithReviews) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
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
            {workers.map((worker: WorkerWithReviews) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onClick={() => handleWorkerClick(worker)}
              />
            ))}
          </div>
        )}

        <WorkerDetailModal
          worker={selectedWorker}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}