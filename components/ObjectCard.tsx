'use client';

import { HeyamaObject, deleteObject } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  object: HeyamaObject;
  onDeleted: (id: string) => void;
}

export default function ObjectCard({ object, onDeleted }: Props) {
  const handleDelete = async () => {
    await deleteObject(object._id);
    onDeleted(object._id);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={object.imageUrl}
          alt={object.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{object.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{object.description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(object.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/objects/${object._id}`}>
          <Button variant="outline" size="sm">Voir</Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}