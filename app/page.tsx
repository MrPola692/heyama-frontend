'use client';

import { useEffect, useState } from 'react';
import { getObjects, HeyamaObject } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import ObjectCard from '@/components/ObjectCard';
import CreateObjectForm from '@/components/CreateObjectForm';

export default function Home() {
  const [objects, setObjects] = useState<HeyamaObject[]>([]);

  useEffect(() => {
    getObjects().then(setObjects);

    const socket = getSocket();
    socket.on('new-object', (obj: HeyamaObject) => {
      setObjects((prev) => {
        if (prev.find((o) => o._id === obj._id)) return prev;
        return [obj, ...prev];
      });
    });
    socket.on('deleted-object', ({ id }: { id: string }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
    });

    return () => {
      socket.off('new-object');
      socket.off('deleted-object');
    };
  }, []);

  const handleDeleted = (id: string) => {
    setObjects((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Heyama — Collection d&apos;objets</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateObjectForm />
        </div>
        <div className="lg:col-span-2">
          {objects.length === 0 ? (
            <p className="text-muted-foreground">Aucun objet pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objects.map((obj) => (
                <ObjectCard key={obj._id} object={obj} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}