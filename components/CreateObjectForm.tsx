'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createObject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
});

type FormData = z.infer<typeof schema>;

export default function CreateObjectForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!file) return alert('Veuillez sélectionner une image');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('image', file);
      await createObject(formData);
      reset();
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvel objet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" {...register('title')} placeholder="Titre de l'objet" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Description..." />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] ?? null)
              }
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Envoi...' : 'Créer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}