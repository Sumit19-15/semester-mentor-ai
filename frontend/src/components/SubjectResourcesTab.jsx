import { useState } from 'react';
import { FileText, Link as LinkIcon, Download, ExternalLink, Upload, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubjectStore } from '../store/useSubjectStore';
import UploadFileModal from './UploadFileModal';
import toast from 'react-hot-toast';

export default function SubjectResourcesTab() {
  const { resources, activeSubject, deleteResource } = useSubjectStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (e, resource) => {
    if (e) e.stopPropagation();
    if (resource.uploadType === 'link') {
      window.open(resource.fileUrl || resource.link, '_blank');
      return;
    }

    if (e) e.preventDefault();
    setDownloadingId(resource._id);
    try {
      const url = resource.fileUrl || resource.link;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const ext = url.split('.').pop() || 'pdf';
      link.download = `${resource.title || 'Resource'}.${ext}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed', error);
      window.open(resource.fileUrl || resource.link, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteResource(id);
      toast.success('Resource deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Actions Header */}
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[14px] flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors duration-150 shadow-sm font-semibold"
        >
          <Upload className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      {/* Resources Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container text-secondary font-label-md text-[12px] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 font-semibold"></th>
              <th className="py-3 px-4 font-semibold">File Name</th>
              <th className="py-3 px-4 font-semibold w-32">Type</th>
              <th className="py-3 px-4 font-semibold w-40">Date Uploaded</th>
              <th className="py-3 px-4 w-24"></th>
            </tr>
          </thead>
          <tbody className="font-body-md text-[14px]">
            <AnimatePresence>
            {resources?.length > 0 ? resources.map((resource, idx) => (
              <motion.tr 
                key={resource._id || idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => window.open(resource.fileUrl || resource.link, '_blank')}
                className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer"
              >
                <td className="py-3 px-4">
                  {resource.type === 'pdf' ? <FileText className="w-5 h-5 text-[#d32f2f]" /> : <LinkIcon className="w-5 h-5 text-[#1976d2]" />}
                </td>
                <td className="py-3 px-4 font-medium text-on-surface group-hover:text-primary transition-colors">
                  <span className="block w-full">{resource.title}</span>
                </td>
                <td className="py-3 px-4 text-secondary capitalize">{resource.type}</td>
                <td className="py-3 px-4 text-secondary">{new Date(resource.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right flex justify-end gap-1">
                  <button 
                    onClick={(e) => handleDownload(e, resource)} 
                    className="inline-flex text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-2 rounded-lg hover:bg-primary-container/20"
                    disabled={downloadingId === resource._id}
                  >
                    {downloadingId === resource._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : resource.uploadType === 'upload' ? (
                      <Download className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </button>
                  <button onClick={(e) => handleDelete(e, resource._id)} className="inline-flex text-secondary opacity-0 group-hover:opacity-100 hover:text-error transition-all p-2 rounded-lg hover:bg-error/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-secondary">
                  No resources found for this subject.
                </td>
              </tr>
            )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <UploadFileModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        subjectId={activeSubject?._id}
        uploadType="resources"
      />
    </div>
  );
}
