import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { toast, Toaster } from "react-hot-toast";
import { FaFolder } from "react-icons/fa";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const fetchFont = async (file) => {
  const res = await fetch(`/fonts/${file}`);
  return await res.arrayBuffer();
};

const Upload = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [signature, setSignature] = useState("");
  const [sigPos, setSigPos] = useState({ x: 100, y: 0 });
  const [selectedFont, setSelectedFont] = useState("Lobster");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#000000");

  const wrapperRef = useRef(null);
  const sigRef = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("PDF selected!");
    } else {
      toast.error("Only PDF files allowed.");
    }
  };

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setTimeout(() => {
      const wrapper = wrapperRef.current;
      const pages = wrapper?.querySelectorAll(".react-pdf__Page");
      if (pages?.length) {
        const lastPage = pages[pages.length - 1];
        const rect = lastPage.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const relativeY = rect.top - wrapperRect.top + 80;
        setSigPos((prev) => ({ ...prev, y: relativeY }));
      }
    }, 300);
  };

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - sigPos.x,
      y: e.clientY - sigPos.y,
    };
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    setSigPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const uploadSignedPdf = async (pdfBlob, metadata) => {
    const formData = new FormData();
    formData.append("file", pdfBlob, metadata.name);
    formData.append("signature", metadata.signature);
    formData.append("position", JSON.stringify(metadata.position));
    formData.append("page", metadata.page);
    formData.append("signedAt", metadata.signedAt);

    const response = await fetch("http://localhost:5000/api/upload-signed-pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
    return response.json();
  };

  const embedSignatureAndDownload = async () => {
    if (!file || !signature || !wrapperRef.current || !sigRef.current) return;

    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    let fontBuffer;
    switch (selectedFont) {
      case "Lobster":
        fontBuffer = await fetchFont("Lobster-Regular.ttf");
        break;
      case "Courier Prime":
        fontBuffer = await fetchFont("CourierPrime-Regular.ttf");
        break;
      case "Roboto":
        fontBuffer = await fetchFont("Roboto-Regular.ttf");
        break;
      default:
        fontBuffer = await fetchFont("Lobster-Regular.ttf");
    }

    const font = await pdfDoc.embedFont(fontBuffer);
    const pages = pdfDoc.getPages();

    const pageElements = wrapperRef.current.querySelectorAll(".react-pdf__Page");
    const sigRect = sigRef.current.getBoundingClientRect();

    let targetPageIndex = 0;
    for (let i = 0; i < pageElements.length; i++) {
      const canvas = pageElements[i].querySelector("canvas");
      const rect = canvas.getBoundingClientRect();
      if (sigRect.top >= rect.top && sigRect.bottom <= rect.bottom) {
        targetPageIndex = i;
        break;
      }
    }

    const targetPage = pages[targetPageIndex];
    const canvas = pageElements[targetPageIndex].querySelector("canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const relX = sigRect.left - canvasRect.left;
    const relY = sigRect.top - canvasRect.top;

    const { width: pdfW, height: pdfH } = targetPage.getSize();
    const scaleX = pdfW / canvasRect.width;
    const scaleY = pdfH / canvasRect.height;

    const sigHeight = sigRect.height || fontSize;
    const sigWidth = sigRect.width || 100;

    const x = (relX + sigWidth / 2) * scaleX;
    const y = pdfH - (relY + sigHeight * 0.75) * scaleY;

    const textWidth = font.widthOfTextAtSize(signature, fontSize);

    targetPage.drawText(signature, {
      x: x - textWidth / 2,
      y: y,
      font,
      size: fontSize,
      color: rgb(
        parseInt(fontColor.slice(1, 3), 16) / 255,
        parseInt(fontColor.slice(3, 5), 16) / 255,
        parseInt(fontColor.slice(5, 7), 16) / 255
      ),
    });

    const output = await pdfDoc.save();
    const blob = new Blob([output], { type: "application/pdf" });

    try {
      await uploadSignedPdf(blob, {
        name: `signed-${file.name}`,
        signature,
        position: { x, y },
        page: targetPageIndex + 1,
        signedAt: new Date().toISOString(),
      });

      toast.success("Signature embedded and uploaded!");
    } catch (error) {
      toast.error("Failed to upload signed PDF.");
      console.error("Upload error:", error);
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `signed-${file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />

      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h1 className="text-lg sm:text-2xl font-bold text-center sm:text-left">DigiSign – Upload & Sign</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {file && signature && (
            <button
              onClick={embedSignatureAndDownload}
              className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded text-white text-sm sm:text-base"
            >
              Download PDF
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 border border-blue-200 hover:bg-gray-100 px-3 py-2 rounded text-sm sm:text-base"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-gray-100">
        {/* Upload Panel */}
        <section className="w-full md:w-1/5 bg-white border-r p-4">
          <h2 className="font-semibold text-md mb-2">Upload PDF</h2>
          <label
            htmlFor="pdf-upload"
            className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-400 bg-white px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
          >
            <FaFolder /> Click to upload PDF
          </label>
          <input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
          <div className="mt-2 text-gray-600 text-sm break-all">{file ? file.name : "No file selected"}</div>
        </section>

        {/* PDF Preview Panel */}
        <section
          className="w-full md:w-3/5 bg-white border-r p-2 sm:p-4 overflow-auto relative"
          ref={wrapperRef}
          style={{ minHeight: "400px" }}
        >
          {file ? (
            <Document file={file} onLoadSuccess={onLoadSuccess}>
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="mb-4 shadow"
                />
              ))}
            </Document>
          ) : (
            <p className="text-center text-gray-500 mt-8 text-sm">Upload a PDF to preview</p>
          )}

          {signature && (
            <div
              ref={sigRef}
              onMouseDown={onMouseDown}
              title="Drag to place signature"
              style={{
                position: "absolute",
                top: sigPos.y,
                left: sigPos.x,
                cursor: "move",
                fontFamily: selectedFont,
                fontSize: `${fontSize}px`,
                color: fontColor,
                padding: "8px 14px",
                whiteSpace: "nowrap",
                zIndex: 1000,
                userSelect: "none",
              }}
            >
              {signature}
            </div>
          )}
        </section>

        {/* Signature Settings Panel */}
        <section className="w-full md:w-1/5 bg-white p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-center mb-3">Signature</h3>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-3 text-sm"
            placeholder="Type your signature..."
          />
          <label className="block text-sm font-medium mb-1 text-gray-700">Font</label>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 mb-3 text-sm"
          >
            <option>Lobster</option>
            <option>Courier Prime</option>
            <option>Roboto</option>
          </select>

          <label className="block text-sm font-medium mb-1 text-gray-700">Font Size</label>
          <input
            type="range"
            min="12"
            max="48"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full mb-3"
          />

          <label className="block text-sm font-medium mb-1 text-gray-700">Color</label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="w-full mb-4 h-10 cursor-pointer"
          />

          <div
            className="border rounded p-4 text-center text-xl bg-gray-50"
            style={{ fontFamily: selectedFont, color: fontColor, fontSize: `${fontSize}px` }}
          >
            {signature || <span className="text-gray-400 italic">Signature Preview</span>}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm bg-white py-3">
        © {new Date().getFullYear()} DigiSign. Built with love.
      </footer>
    </div>
  );
};

export default Upload;
