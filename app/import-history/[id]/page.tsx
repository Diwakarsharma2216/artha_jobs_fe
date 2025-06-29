import { ImportLog } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ImportLogDetailProps {
  params: { id: string };
}

async function getImportLog(id: string): Promise<ImportLog> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/import-history/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch import log');
  return res.json();
}

export default async function ImportLogDetail({ params }: ImportLogDetailProps) {
  const log = await getImportLog(params.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📄 Import Log Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p><strong>File Name:</strong> {log.fileName}</p>
          <p><strong>Imported At:</strong> {new Date(log.importDateTime).toLocaleString()}</p>

          <div className="space-y-1">
            <p><strong>Total Fetched:</strong> {log.totalFetched}</p>
            <p><strong>New Jobs:</strong> <Badge variant="default" className="bg-green-600">{log.newJobs}</Badge></p>
            <p><strong>Updated Jobs:</strong> <Badge variant="outline" className="text-blue-600 border-blue-600">{log.updatedJobs}</Badge></p>
            <p><strong>Failed Jobs:</strong> <Badge variant="destructive">{log.failedJobs}</Badge></p>
          </div>
        </CardContent>
      </Card>

      {log.failedReasons?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">❌ Failed Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {log.failedReasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Link href="/import-history">
        <Button variant="outline">← Back to Import History</Button>
      </Link>
    </div>
  );
}
