'use client';

import { useEffect, useState, useCallback } from 'react';
import { getObjects, HeyamaObject } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import ObjectCard from '@/components/ObjectCard';
import CreateObjectForm from '@/components/CreateObjectForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [objects, setObjects] = useState<HeyamaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchObjects = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await getObjects(p);
      setObjects(res?.data ?? []);
      setTotalPages(res?.totalPages ?? 1);
    } catch {
      setObjects([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      void fetchObjects(page);
    });

    const socket = getSocket();
    socket.on('new-object', (obj: HeyamaObject) => {
      setObjects((prev) => {
        if (prev.find((o) => o._id === obj._id)) return prev;
        return [obj, ...prev];
      });
      toast.success('Nouvel objet ajouté');
    });
    socket.on('deleted-object', ({ id }: { id: string }) => {
      setObjects((prev) => prev.filter((o) => o._id !== id));
      toast.error('Objet supprimé');
    });

    return () => {
      socket.off('new-object');
      socket.off('deleted-object');
    };
  }, [page, fetchObjects]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Heyama — Collection d&apos;objets</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateObjectForm />
        </div>
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : objects.length === 0 ? (
            <p className="text-muted-foreground">Aucun objet pour le moment.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objects.map((obj) => (
                  <ObjectCard
                    key={obj._id}
                    object={obj}
                    onDeleted={(id) => {
                      setObjects((prev) => prev.filter((o) => o._id !== id));
                    }}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-xs text-muted-foreground">
        Powered by{' '}
        <a
          href="https://wa.me/237695467434"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          MrPola692
        </a>
      </footer>
    </main>
  );
}