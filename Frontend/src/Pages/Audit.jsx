import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Audit = () => {
  const [signedDocs, setSignedDocs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch list of signed PDFs from backend with metadata (assuming backend sends {filename, signedAt, signedBy})
    fetch("http://localhost:5000/api/list-signed-pdfs")
      .then((res) => res.json())
      .then((files) => {
        // Example: files = [{ filename, signedAt, signedBy }]
        // If backend only sends filename, then we fake signedAt for demo
        const docs = files.map((file) =>
          typeof file === "string"
            ? {
                name: file,
                url: `http://localhost:5000/uploads/${file}`,
                signedAt: null,
                signedBy: null,
              }
            : {
                name: file.filename,
                url: `http://localhost:5000/uploads/${file.filename}`,
                signedAt: file.signedAt,
                signedBy: file.signedBy,
              }
        );
        setSignedDocs(docs);
      })
      .catch((err) => {
        console.error("Failed to fetch signed PDFs", err);
        toast.error("Failed to load signed PDFs");
      });
  }, []);

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  // Show modal and set doc to delete
  const confirmDelete = (doc) => {
    setDocToDelete(doc);
    setConfirmText("");
    setShowConfirm(true);
  };

  // Delete API call
  const handleDelete = () => {
    if (!docToDelete) return;
    if (confirmText !== "DELETE") {
      toast.error("You must type DELETE to confirm deletion.");
      return;
    }

    fetch(
      `http://localhost:5000/api/delete-signed-pdf?filename=${encodeURIComponent(
        docToDelete.name
      )}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        // Remove from UI list
        setSignedDocs((prev) =>
          prev.filter((d) => d.name !== docToDelete.name)
        );
        setShowConfirm(false);
        setDocToDelete(null);
        toast.success("File deleted successfully");
      })
      .catch((err) => {
        toast.error("Failed to delete file");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <header className="bg-blue-600 text-white p-4 flex items-center justify-center gap-2 text-center text-2xl font-bold">
        <FaFolder /> Audit Trail – Signed PDF Activity
      </header>

      <main className="p-6 max-w-4xl mx-auto relative">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back to Dashboard
        </button>

        {signedDocs.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No signed PDFs found.</p>
        ) : (
          <div className="space-y-4">
            {signedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded shadow border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-lg">{doc.name}</p>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleView(doc.url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => confirmDelete(doc)}
                    title="Delete signed PDF"
                    className="bg-red-500 hover:bg-red-600 flex items-center gap-1 text-white px-3 py-1 text-sm rounded"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-4">
                To delete <strong>{docToDelete?.name}</strong>, type{" "}
                <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                  DELETE
                </code>{" "}
                below and press Delete.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2 mb-4"
                placeholder='Type "DELETE" to confirm'
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== "DELETE"}
                  className={`px-4 py-2 rounded text-white ${
                    confirmText === "DELETE"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Audit;
