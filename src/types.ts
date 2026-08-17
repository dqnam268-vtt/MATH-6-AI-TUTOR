export type UserRole = 'student' | 'teacher';

export type StudentFeature = 
  | 'chat' 
  | 'lesson' 
  | 'check_solution' 
  | 'quick_quiz' 
  | 'adaptive_practice' 
  | 'similar_problem' 
  | 'challenge' 
  | 'real_life' 
  | 'digital_tools';

export type TeacherFeature = 
  | 'curriculum' 
  | 'create_exercise' 
  | 'differentiation_3groups' 
  | 'lesson_plan' 
  | 'self_study_task' 
  | 'diagnose_errors' 
  | 'exam_matrix';

export type DifficultyLevel = 'basic' | 'standard' | 'advanced' | 'challenge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
  meta?: {
    topic?: string;
    problemType?: string;
    goal?: string;
    relatedKnowledge?: string;
    hintLevel?: 1 | 2 | 3 | 4;
    suggestedQuestions?: string[];
    isSolutionCheck?: boolean;
    errorType?: 'knowledge' | 'method' | 'calculation' | 'symbol' | 'reading' | 'presentation' | 'none';
  };
}

export interface ErrorClassification {
  type: 'knowledge' | 'method' | 'calculation' | 'symbol' | 'reading' | 'presentation';
  label: string;
  color: string;
  description: string;
  firstErrorStepIndex?: number;
  guideQuestion: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  knowledgeNode: string;
  level: DifficultyLevel;
  errorHint?: string;
}

export interface CurriculumChapter {
  id: string;
  number: number;
  title: string;
  semester: 1 | 2;
  lessons: CurriculumLesson[];
}

export interface CurriculumLesson {
  id: string;
  code: string;
  title: string;
  objectives: string[];
  keyKnowledge: string[];
  realWorldContext: string;
  digitalToolSuggestion: string;
  sampleProblems: {
    level: DifficultyLevel;
    question: string;
    hint: string;
  }[];
}

export interface AdaptiveProgress {
  totalAttempted: number;
  totalCorrect: number;
  currentLevel: DifficultyLevel;
  strengths: string[];
  weaknesses: string[];
  recentMistakeTypes: Record<string, number>;
  completedTopics: string[];
}
