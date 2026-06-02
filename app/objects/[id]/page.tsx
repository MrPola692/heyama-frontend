'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getObject, HeyamaObject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ObjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [object, setObject] = useState<HeyamaObject | null>(null);

  useEffect(() => {
    getObject(id).then(setObject);
  }, [id]);

  if (!object) return <div className="container mx-auto px-4 py-8">Chargement...</div>;

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Retour
      </Button>
      <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
        <Image src={object.imageUrl} alt={object.title} fill className="object-cover" unoptimized />
      </div>
      <h1 className="text-3xl font-bold mb-2">{object.title}</h1>
      <p className="text-muted-foreground mb-4">{object.description}</p>
      <p className="text-sm text-muted-foreground">
        Créé le {new Date(object.createdAt).toLocaleDateString('fr-FR')}
      </p>
    </main>
  );
}