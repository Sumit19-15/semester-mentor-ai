import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Upload, FileText, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  
  // Step 1 State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2 State
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [semester, setSemester] = useState('1');
  
  // Step 3 State
  const [goals, setGoals] = useState('');
  const [curriculumFile, setCurriculumFile] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      submitRegistration();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitRegistration = async () => {
    setIsLoading(true);

    try {
      // Intentionally show a delay with loader
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await api.post('/users/register', {
        name: fullName,
        email,
        password,
        collegeName: university,
        branch: major,
        semester,
        interests: goals,
        dailyFreeHours: 4, // Default value
      });
      
      // Upon successful registration, authenticate the user
      login(response.data);
      
      // If a curriculum file was uploaded, parse it to generate subjects
      if (curriculumFile) {
        const formData = new FormData();
        formData.append("file", curriculumFile);
        await api.post("/subjects/parse-index", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/dashboard'); 
    } catch (error) {
      console.error("Registration failed", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex items-center justify-center p-gutter bg-surface-bright transition-colors duration-300"
    >
      {/* Main Registration Container */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-[0px_2px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-surface-container-highest">
          <div 
            className="h-full bg-primary-container transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        
        {/* Card Content */}
        <div className="p-stack_lg">
          {/* Header Section */}
          <div className="mb-stack_lg">
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mb-stack_sm block">Step {step} of 3</span>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-stack_sm">
              {step === 1 && "Create your account"}
              {step === 2 && "Academic Details"}
              {step === 3 && "Study Goals"}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {step === 1 && "Set up your profile to start organizing your semester efficiently."}
              {step === 2 && "Tell us about your current academic status."}
              {step === 3 && "What are you hoping to achieve this semester?"}
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleNext} className="space-y-stack_md flex flex-col">
            
            {/* Step 1 Fields */}
            {step === 1 && (
              <>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="fullName">Full Name</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="fullName" 
                    name="fullName" 
                    placeholder="Jane Doe" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="email" 
                    name="email" 
                    placeholder="jane@university.edu" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <p className="font-label-sm text-label-sm text-secondary mt-1">Must be at least 8 characters.</p>
                </div>
              </>
            )}

            {/* Step 2 Fields */}
            {step === 2 && (
              <>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="university">University / College</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="university" 
                    name="university" 
                    placeholder="E.g., Stanford University" 
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="major">Major / Field of Study</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="major" 
                    name="major" 
                    placeholder="E.g., Computer Science" 
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="semester">Current Semester</label>
                  <select 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150" 
                    id="semester" 
                    name="semester" 
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>Semester {num}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Step 3 Fields */}
            {step === 3 && (
              <>
                <div className="flex flex-col space-y-stack_sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="goals">What are your primary goals?</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-150 min-h-[120px] resize-y" 
                    id="goals" 
                    name="goals" 
                    placeholder="E.g., Maintain a 4.0 GPA, organize my study schedule better..." 
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex flex-col space-y-stack_sm mt-4">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="curriculum">Upload Curriculum (Optional)</label>
                  <p className="font-body-sm text-secondary text-xs mb-2">
                    Upload your course index or syllabus to automatically extract your subjects.
                  </p>
                  <div className="w-full border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center hover:bg-surface-container transition-colors relative">
                    <input 
                      type="file" 
                      id="curriculum" 
                      accept="image/*,.pdf"
                      onChange={(e) => setCurriculumFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {curriculumFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-8 h-8 text-primary" />
                        <span className="font-label-md text-sm text-on-surface text-center px-4 truncate w-full max-w-[200px]">
                          {curriculumFile.name}
                        </span>
                        <span className="text-xs text-primary font-medium mt-1">Change file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-secondary">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-label-md text-sm text-on-surface">Click or drag file to upload</span>
                        <span className="font-body-sm text-xs text-secondary">Supports PDF, JPG, PNG</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {/* Action Area */}
            <div className="mt-stack_lg flex items-center justify-between pt-stack_sm border-t border-surface-container-highest">
              {step === 1 ? (
                <Link className="font-label-md text-[14px] font-semibold text-secondary hover:text-on-surface bg-surface hover:bg-surface-container border border-outline-variant px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm" to="/login">Log in instead</Link>
              ) : (
                <button 
                  type="button"
                  onClick={handleBack}
                  className="font-label-md text-label-md text-secondary hover:text-on-surface transition-colors duration-150 flex items-center gap-1"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              
              <button 
                className="bg-primary text-on-primary hover:opacity-90 font-label-md text-label-md px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                <span className="flex items-center">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {isLoading ? 'Processing...' : step === 3 ? 'Finish' : 'Continue'}
                </span>
                {!isLoading && step < 3 && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
