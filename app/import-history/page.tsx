"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import type { ImportLog } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";


async function getImportLogs(): Promise<ImportLog[]> {
  const res = await fetch(`${BACKEND_URL}/api/import-history`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch import history");
  }

  return res.json();
}

export default function ImportHistoryPage() {
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await getImportLogs();
        setImportLogs(logs);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();

    const socket: Socket = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("importLogUpdated", (updatedLog: ImportLog) => {
      setImportLogs((prev) => {
        const idx = prev.findIndex((log) => log._id === updatedLog._id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = updatedLog;
          return updated;
        }
        return [updatedLog, ...prev].sort(
          (a, b) =>
            new Date(b.importDateTime).getTime() -
            new Date(a.importDateTime).getTime()
        );
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">📦 Import History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {isLoading && <p className="text-gray-500 mb-4">Loading...</p>}
      {!isLoading && importLogs.length === 0 && <p>No import logs found.</p>}

      {importLogs.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Import Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-green-600">New</TableHead>
              <TableHead className="text-blue-600">Updated</TableHead>
              <TableHead className="text-red-600">Failed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {importLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  <Link href={`/import-history/${log._id}`} className="text-blue-600 hover:underline">
                    {log.fileName}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(log.importDateTime).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell>{log.totalFetched}</TableCell>
                <TableCell className="text-green-600">{log.newJobs}</TableCell>
                <TableCell className="text-blue-600">{log.updatedJobs}</TableCell>
                <TableCell className="text-red-600">{log.failedJobs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
