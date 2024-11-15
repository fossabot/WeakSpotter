import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Scan, getScanStatusText, getScanStatusClass } from "../types/scan";

export default function ScanList() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      const response = await api.getScans();
      setScans(response.data);
    } catch (error) {
      console.error("Error loading scans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this scan?")) return;

    try {
      await api.deleteScan(id);
      setScans(scans.filter((scan) => scan.id !== id));
    } catch (error) {
      console.error("Error deleting scan:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id}>
              <td>{scan.id}</td>
              <td>{scan.url}</td>
              <td>
                <span className={`badge ${getScanStatusClass(scan.status)}`}>
                  {getScanStatusText(scan.status)}
                </span>
              </td>
              <td>{new Date(scan.created_at).toLocaleString()}</td>
              <td>
                <Link
                  to={`/scan/${scan.id}`}
                  className="btn btn-sm btn-info mr-2"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(scan.id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}