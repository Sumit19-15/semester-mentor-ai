import { useState } from 'react';
import { Share2, PlayCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import SubjectOverviewTab from '../components/SubjectOverviewTab';
import SubjectNotesTab from '../components/SubjectNotesTab';
import SubjectResourcesTab from '../components/SubjectResourcesTab';
import SubjectPyqsTab from '../components/SubjectPyqsTab';

export default function SubjectWorkspacePage() {
  const [activeTab, setActiveTab] = useState('Topics');

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col w-full h-full">
        {/* Page Header */}
        <div className="mb-8" data-purpose="workspace-header">
          <div className="flex items-center font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-3">
            <span>Computer Science</span>
            <span className="mx-2 text-outline-variant">•</span>
            <span>Semester 4</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight max-w-2xl leading-tight">
              Database Management Systems
            </h1>
            <div className="flex gap-3 shrink-0">
              <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container-lowest rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-all shadow-sm">
                <Share2 className="w-4 h-4 text-secondary" />
                Share
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm">
                <PlayCircle className="w-4 h-4" />
                Resume Learning
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-outline-variant mb-8" data-purpose="workspace-tabs">
          <nav className="flex gap-8 overflow-x-auto custom-scrollbar">
            {['Topics', 'Resources', 'Notes', 'PYQs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-label-md text-[14px] uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'font-bold text-primary border-b-2 border-primary'
                    : 'font-semibold text-secondary hover:text-on-surface border-b-2 border-transparent hover:border-outline-variant'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Render Active Tab Content */}
        {activeTab === 'Topics' && <SubjectOverviewTab />}
        {activeTab === 'Notes' && <SubjectNotesTab />}
        {activeTab === 'Resources' && <SubjectResourcesTab />}
        {activeTab === 'PYQs' && <SubjectPyqsTab />}

      </div>
    </DashboardLayout>
  );
}
