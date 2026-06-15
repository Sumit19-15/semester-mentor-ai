import { Search, FileText, Eye, Download, Upload } from 'lucide-react';

export default function SubjectPyqsTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Tab Actions Header */}
      <div className="flex justify-end mb-2">
        <button className="bg-primary-container text-on-primary-container font-label-md text-[14px] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors shadow-sm font-semibold">
          <Upload className="w-4 h-4" />
          Upload Paper
        </button>
      </div>

      {/* Content Area: PYQs List */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        
        {/* Filters / Search */}
        <div className="p-4 border-b border-outline-variant bg-surface-container flex justify-between items-center">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
              <input 
                className="w-full h-9 pl-9 pr-3 bg-surface border border-outline-variant rounded-lg font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" 
                placeholder="Search papers..." 
                type="text" 
              />
            </div>
            <select className="h-9 w-full sm:w-auto px-3 pr-8 bg-surface border border-outline-variant rounded-lg font-body-md text-[14px] text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer">
              <option>All Years</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-outline-variant">
          
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 shrink-0 rounded bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors truncate">End Semester Examination - Fall 2023</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-variant px-2 py-0.5 rounded tracking-wide">2023 End Semester</span>
                  <span className="font-body-md text-[12px] text-secondary truncate">Added by Prof. Smith • 2.4 MB</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-14 sm:ml-0">
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="View">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="Download">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 shrink-0 rounded bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors truncate">Mid Semester Examination - Fall 2023</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-variant px-2 py-0.5 rounded tracking-wide">2023 Mid Semester</span>
                  <span className="font-body-md text-[12px] text-secondary truncate">Added by Prof. Smith • 1.1 MB</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-14 sm:ml-0">
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="View">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="Download">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-surface-container transition-colors group cursor-pointer gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-10 h-10 shrink-0 rounded bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary-container/40 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors truncate">End Semester Examination - Fall 2022</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-label-sm text-[10px] uppercase font-bold text-secondary bg-surface-variant px-2 py-0.5 rounded tracking-wide">2022 End Semester</span>
                  <span className="font-body-md text-[12px] text-secondary truncate">Added by Admin • 3.0 MB</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-14 sm:ml-0">
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="View">
                <Eye className="w-5 h-5" />
              </button>
              <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors" title="Download">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
