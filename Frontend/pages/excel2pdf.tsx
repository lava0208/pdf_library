import { useState, ChangeEvent } from "react";
import axios, { AxiosResponse } from 'axios';
import Button from "../components/button";
import { BASE_URL } from "@/Config";
import Header from "@/components/Header";
import withAuth from "@/components/withAuth";

const Excel2PDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleFileUpload = async () => {
    setIsLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response: AxiosResponse = await axios.post(`${BASE_URL}/upload_excel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded successfully', response.data);
      } catch (error) {
        console.error('Error uploading file', error);
      }
    } else {
      console.error('No file selected');
    }
    alert('successfully converted!')
    setIsLoading(false);
  };
  const handleFileDownload = async () => {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`${BASE_URL}/download_excel`, {
        responseType: 'blob', // Set the response type to blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.pdf'); // Set the filename for the downloaded file
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };

  return (
    <div>
      <Header text="Convert Excel to PDF Document"/>
      <input
        aria-label="Add files"
        accept=".xlsx"
        onChange={handleFileChange}
        className="2xl:p-12 max-w-full p-5 my-4 rounded-lg border border-blue-700 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 border-dashed block mx-auto"
        type="file"
      />
      <div className="w-full flex justify-center gap-5 mb-2">
        <Button
          isLoading={isLoading}
          onClick={handleFileUpload}
        >
          Convert
        </Button >
        <Button
          isLoading={isLoading}
          onClick={handleFileDownload}
        >
          Download
        </Button >
      </div>
    </div>
  )
}

export default withAuth(Excel2PDF);