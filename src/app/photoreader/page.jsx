"use client";

import { SummaryOfNews } from "@/store/SummarySlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'sonner';

const PhotoUpload = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector(state => state.user)["userDetail"][0];

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: false,
    disabled: file !== null || loading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const fileWithPreview = Object.assign(acceptedFiles[0], { 
          preview: URL.createObjectURL(acceptedFiles[0]) 
        });
        setFile(fileWithPreview);
        setAnalysis(null);
        dispatch(SummaryOfNews([]));
        toast.success(`Image "${acceptedFiles[0].name}" uploaded successfully`);
      } else {
        toast.error("Please upload a valid image file (JPG, PNG, or WebP)");
      }
    },
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0]?.errors[0];
      if (error?.code === 'file-invalid-type') {
        toast.error("Invalid file type. Please upload an image file");
      } else if (error?.code === 'file-too-large') {
        toast.error("File is too large. Please upload a smaller image");
      } else {
        toast.error("Failed to upload image. Please try again");
      }
    }
  });

  const removeFile = () => {
    const fileName = file.name;
    URL.revokeObjectURL(file.preview);
    setFile(null);
    setAnalysis(null);
    dispatch(SummaryOfNews([]));
    toast.info(`Image "${fileName}" removed`);
  };

  const handleProceed = async () => {
    if (!file) {
      toast.error("Please upload an image first");
      return;
    }

    if(!userId) {
      toast.error("Please login to analyze images");
      router.push("/login");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing your image...");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("https://news-backend-motc.onrender.com/upload-image", {
        method: "POST",
        body: formData,
        headers: {
          'user-id': userId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.dismiss();
        
        if (response.status === 400) {
          toast.error(errorData.error || "Invalid image format");
        } else if (response.status === 413) {
          toast.error("Image size too large. Please upload a smaller file");
        } else if (response.status === 401) {
          toast.error("Session expired. Please login again");
          router.push("/login");
        } else {
          toast.error("Failed to process image. Please try again");
        }
        return;
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);
      dispatch(SummaryOfNews(analysisData));
      
      toast.dismiss();
      toast.success("Image analysis completed! Redirecting to summary...");
      router.push("/summary");

    } catch (error) {
      console.error("Error:", error);
      toast.dismiss();
      if (error.message === "Failed to fetch") {
        toast.error("Unable to connect to server. Please check your internet connection");
      } else {
        toast.error(error.message || "Failed to analyze image. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-6">
      <h1 className="heading-large mb-6">Upload a News Image</h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 w-full max-w-lg text-center cursor-pointer transition-all duration-300 font-sans
          ${file 
            ? "border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed" 
            : "border-gray-400 bg-gray-900 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
          }
        `}
      >
        <input {...getInputProps()} />
        {!file ? (
          <p className="text-body">Drag & drop an image here, or click to select one.</p>
        ) : (
          <p className="text-body opacity-75">Upload complete. Remove to upload a new file.</p>
        )}
      </div>

      {/* Image Preview and Actions */}
      {file && (
        <div className="mt-6 flex flex-col items-center space-y-6">
          {/* Image Preview Container */}
          <div className="relative group">
            <img 
              src={file.preview} 
              alt="Uploaded" 
              className="w-48 h-48 object-cover rounded-lg border border-gray-700 transition-all duration-300 group-hover:border-cyan-400" 
            />
            <p className="mt-2 text-center text-body text-sm">{file.name}</p>
          </div>

          {/* Buttons Container */}
          <div className="flex flex-col md:flex-row items-center gap-4">
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
              <span className="font-medium">{loading ? 'Removing...' : 'Remove Image'}</span>
            </button>

            {/* Analyze Button */}
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
                <span className="font-medium">Analyze Image</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-8 p-6 w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          <h2 className="heading-medium mb-4 text-cyan-400">
            Image Analysis
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-marker mb-2">Headline</h3>
              <p className="text-body">{analysis.headline}</p>
            </div>
            <div>
              <h3 className="text-marker mb-2">Summary</h3>
              <p className="text-body">{analysis.summary}</p>
            </div>
            <div>
              <h3 className="text-marker mb-2">Key Details</h3>
              <ul className="list-disc list-inside text-body">
                {analysis.keyDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
            {analysis.visibleText && (
              <div>
                <h3 className="text-marker mb-2">Visible Text</h3>
                <p className="text-body">{analysis.visibleText}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;