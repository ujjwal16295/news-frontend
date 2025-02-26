"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { SummaryOfNews } from "@/store/SummarySlice";

const PdfUpload = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector(state => state.user)["userDetail"][0];

  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: file !== null || loading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]?.type === "application/pdf") {
        setFile(acceptedFiles[0]);
        setSummary(null);
        dispatch(SummaryOfNews([]));
        toast.success(`File "${acceptedFiles[0].name}" uploaded successfully`);
      } else {
        toast.error("Invalid file type. Please upload a PDF file");
      }
    },
  });

  const removeFile = () => {
    const fileName = file.name;
    setFile(null);
    setSummary(null);
    dispatch(SummaryOfNews([]));
    toast.info(`File "${fileName}" removed`);
  };

  const handleProceed = async () => {
    if (!file) {
      toast.error("Please upload a PDF file first");
      return;
    }
    
    if(!userId){
      toast.error("Please login to process PDF files");
      router.push("/login");
      return;
    }

    setLoading(true);
    toast.loading("Processing your PDF...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("https://news-backend-motc.onrender.com/upload-pdf", {
        method: "POST",
        body: formData,
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (errorData.error) {
          toast.dismiss();
          toast.error(errorData.error);
        } else if (response.status === 413) {
          toast.dismiss();
          toast.error("File size too large. Please upload a smaller PDF file");
        } else if (response.status === 401) {
          toast.dismiss();
          toast.error("Session expired. Please login again");
          router.push("/login");
        } else {
          toast.dismiss();
          toast.error("Failed to process PDF. Please try again");
        }
        return;
      }

      const summaryData = await response.json();
      setSummary(summaryData);
      dispatch(SummaryOfNews(summaryData));
      
      toast.dismiss();
      toast.success("PDF processed successfully! Redirecting to summary...");
      router.push("/summary");
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss();
      if (error.message === "Failed to fetch") {
        toast.error("Unable to connect to server. Please check your internet connection");
      } else {
        toast.error(error.message || "Failed to process PDF. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6">
      <h1 className="heading-large mb-6">
        Upload Your Newspaper PDF
      </h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 w-full max-w-lg text-center cursor-pointer font-sans ${
          file ? "border-gray-600 bg-gray-800 opacity-50" : "border-gray-400 bg-gray-900 hover:border-cyan-400"
        }`}
      >
        <input {...getInputProps()} />
        {!file ? (
          <p className="text-body">
            Drag & drop a PDF file here, or click to select one.
          </p>
        ) : (
          <p className="text-body opacity-75">{file.name}</p>
        )}
      </div>

      {/* PDF Actions */}
      {file && (
        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
          {/* Remove File Button */}
          <button
            onClick={removeFile}
            disabled={loading}
            className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-display
              ${loading 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-900 border border-gray-700 text-red-400 hover:border-red-400 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/20'
              }`}
          >
            <span className="text-lg">×</span>
            <span className="font-medium">{loading ? 'Removing...' : 'Remove File'}</span>
          </button>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={loading}
            className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-display
              ${loading 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-900 border border-gray-700 text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20'
              }`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                <span className="font-medium">Processing...</span>
              </>
            ) : (
              <span className="font-medium">Process PDF</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;