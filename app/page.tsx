'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react'; 

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleTriggerImport = async () => {
    setLoading(true);
    setMessage('');
    setError(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/trigger-import`);
      const data = await res.json();
      setMessage(data.message || 'Import started!');
    } catch (err: unknown) {
      setError(true);
      if (err instanceof Error) {
        console.error(err.message);
        setMessage(err.message);
      } else {
        console.error(err);
        setMessage('Failed to start import');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Artha Job Board</h1>

      <Button className="bg-yellow-800 cursor-pointer text-white" onClick={handleTriggerImport} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Importing...' : 'Start New Import'}
      </Button>

      {message && (
        <Alert variant={error ? 'destructive' : 'default'} className="max-w-md">
          <AlertTitle>{error ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
