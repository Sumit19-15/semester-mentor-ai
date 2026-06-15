import { Search, Plus, FileText } from 'lucide-react';

export default function SubjectNotesTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-stack_md">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            className="w-full pl-10 pr-3 py-2 bg-surface rounded-lg border border-outline-variant font-body-md text-[14px] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all" 
            placeholder="Filter notes..." 
            type="text" 
          />
        </div>
        <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-[14px] font-semibold flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Create Note
        </button>
      </div>

      {/* Notes List */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
        <div className="divide-y divide-outline-variant">
          
          {/* Note Row 1 */}
          <div className="p-4 hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1 text-primary">
                <FileText className="w-6 h-6 fill-primary/20" />
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">Lecture 14: Canonical Ensembles</h3>
                <p className="font-body-md text-[14px] text-secondary truncate max-w-xl mt-1">Derivation of the canonical partition function Z and connection to Helmholtz free energy. Key examples included ideal gas and simple harmonic oscillators.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-sm text-[11px] text-outline">Oct 24, 2023</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">Lecture</span>
              </div>
            </div>
          </div>

          {/* Note Row 2 */}
          <div className="p-4 hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1 text-outline">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">Chapter 5 Reading Notes</h3>
                <p className="font-body-md text-[14px] text-secondary truncate max-w-xl mt-1">Summary of chapter covering phase transformations. Need to review the Clausius-Clapeyron relation derivation before the midterm.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-sm text-[11px] text-outline">Oct 20, 2023</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">Reading</span>
                <span className="px-2 py-0.5 rounded-sm bg-error-container/50 text-on-error-container font-label-sm text-[11px] font-semibold">Review Needed</span>
              </div>
            </div>
          </div>

          {/* Note Row 3 */}
          <div className="p-4 hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1 text-primary">
                <FileText className="w-6 h-6 fill-primary/20" />
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">Lecture 13: Microcanonical Ensembles</h3>
                <p className="font-body-md text-[14px] text-secondary truncate max-w-xl mt-1">Introduction to statistical ensembles. Postulate of equal a priori probabilities and the definition of entropy S = k ln(Omega).</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-sm text-[11px] text-outline">Oct 17, 2023</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">Lecture</span>
              </div>
            </div>
          </div>

          {/* Note Row 4 */}
          <div className="p-4 hover:bg-surface-container-low transition-colors duration-150 cursor-pointer group flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1 text-outline">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline-sm text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">Problem Set 4 Ideas</h3>
                <p className="font-body-md text-[14px] text-secondary truncate max-w-xl mt-1">Scratchpad for solving the Ising model in 1D problem. Using transfer matrices seems to be the most efficient approach.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-sm text-[11px] text-outline">Oct 15, 2023</span>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded-sm bg-surface-container-high text-secondary font-label-sm text-[11px] font-semibold">Assignment</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
