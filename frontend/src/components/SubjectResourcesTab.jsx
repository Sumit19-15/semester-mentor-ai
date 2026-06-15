import { FileText, Link as LinkIcon, MoreVertical, Upload } from 'lucide-react';

export default function SubjectResourcesTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Tab Actions Header */}
      <div className="flex justify-end mb-2">
        <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[14px] flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors duration-150 shadow-sm font-semibold">
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
              <th className="py-3 px-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="font-body-md text-[14px]">
            {/* Row 1 */}
            <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
              <td className="py-3 px-4">
                <FileText className="w-5 h-5 text-[#d32f2f]" />
              </td>
              <td className="py-3 px-4 font-medium text-on-surface group-hover:text-primary transition-colors">Syllabus_Fall2024.pdf</td>
              <td className="py-3 px-4 text-secondary">PDF Document</td>
              <td className="py-3 px-4 text-secondary">Aug 28, 2024</td>
              <td className="py-3 px-4 text-right">
                <button className="text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
            {/* Row 2 */}
            <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
              <td className="py-3 px-4">
                <LinkIcon className="w-5 h-5 text-[#1976d2]" />
              </td>
              <td className="py-3 px-4 font-medium text-on-surface group-hover:text-primary transition-colors">PostgreSQL Official Documentation</td>
              <td className="py-3 px-4 text-secondary">External Link</td>
              <td className="py-3 px-4 text-secondary">Sep 02, 2024</td>
              <td className="py-3 px-4 text-right">
                <button className="text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
            {/* Row 3 */}
            <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
              <td className="py-3 px-4">
                <FileText className="w-5 h-5 text-primary" />
              </td>
              <td className="py-3 px-4 font-medium text-on-surface group-hover:text-primary transition-colors">Lecture_01_Intro_to_Relational_Algebra.docx</td>
              <td className="py-3 px-4 text-secondary">Word Document</td>
              <td className="py-3 px-4 text-secondary">Sep 05, 2024</td>
              <td className="py-3 px-4 text-right">
                <button className="text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
            {/* Row 4 */}
            <tr className="hover:bg-surface-container transition-colors group cursor-pointer">
              <td className="py-3 px-4">
                <FileText className="w-5 h-5 text-[#d32f2f]" />
              </td>
              <td className="py-3 px-4 font-medium text-on-surface group-hover:text-primary transition-colors">Normalization_Practice_Set.pdf</td>
              <td className="py-3 px-4 text-secondary">PDF Document</td>
              <td className="py-3 px-4 text-secondary">Sep 12, 2024</td>
              <td className="py-3 px-4 text-right">
                <button className="text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all p-1">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
