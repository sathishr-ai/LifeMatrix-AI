import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { SplashScreen } from "./components/auth/SplashScreen";
import { OnboardingScreen } from "./components/auth/OnboardingScreen";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SignupScreen } from "./components/auth/SignupScreen";
import { ProfileSetupScreen } from "./components/auth/ProfileSetupScreen";
import { HomePage } from "./components/home/HomePage";
import { HealthProfileDashboard } from "./components/health-twin/HealthProfileDashboard";
import { LifestyleInput } from "./components/health-twin/LifestyleInput";
import { MedicalHistory } from "./components/health-twin/MedicalHistory";
import { HealthSummary } from "./components/health-twin/HealthSummary";
import { SymptomInput } from "./components/symptom/SymptomInput";
import { SeveritySelection } from "./components/symptom/SeveritySelection";
import { AIProcessing } from "./components/symptom/AIProcessing";
import { ResultScreen } from "./components/symptom/ResultScreen";
import { DetailedExplanation } from "./components/symptom/DetailedExplanation";
import { RiskDashboard } from "./components/risk/RiskDashboard";
import { RiskBreakdown } from "./components/risk/RiskBreakdown";
import { TrendAnalysis } from "./components/risk/TrendAnalysis";
import { FuturePrediction } from "./components/risk/FuturePrediction";
import { LearningDashboard } from "./components/learning/LearningDashboard";
import { TopicList } from "./components/learning/TopicList";
import { ArticleView } from "./components/learning/ArticleView";
import { QuizInterface } from "./components/learning/QuizInterface";
import { QuizResults } from "./components/learning/QuizResults";
import { DailySuggestions } from "./components/recommendations/DailySuggestions";
import { PersonalizedPlan } from "./components/recommendations/PersonalizedPlan";
import { WeeklyGoals } from "./components/recommendations/WeeklyGoals";
import { HabitTracking } from "./components/recommendations/HabitTracking";
import { CalendarView } from "./components/tracking/CalendarView";
import { DailyLogs } from "./components/tracking/DailyLogs";
import { TrendGraphs } from "./components/tracking/TrendGraphs";
import { RecoveryProgress } from "./components/tracking/RecoveryProgress";
import { AlertDashboard } from "./components/alerts/AlertDashboard";
import { AlertSettings } from "./components/alerts/AlertSettings";
import { AddMedicine } from "./components/medication/AddMedicine";
import { ReminderSetup } from "./components/medication/ReminderSetup";
import { ReminderList } from "./components/medication/ReminderList";
import { MedicationHistory } from "./components/medication/MedicationHistory";
import { MapView } from "./components/healthcare-nav/MapView";
import { HospitalList } from "./components/healthcare-nav/HospitalList";
import { HospitalDetail } from "./components/healthcare-nav/HospitalDetail";
import { AIChat } from "./components/ai-assistant/AIChat";
import { VoiceInterface } from "./components/ai-assistant/VoiceInterface";
import { HealthTimeline } from "./components/reports/HealthTimeline";
import { ReportSummary } from "./components/reports/ReportSummary";
import { GraphAnalytics } from "./components/reports/GraphAnalytics";
import { DownloadReport } from "./components/reports/DownloadReport";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { PrivacySecurity } from "./components/profile/PrivacySecurity";
import { HelpSupport } from "./components/profile/HelpSupport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding",
    element: <OnboardingScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/signup",
    element: <SignupScreen />,
  },
  {
    path: "/profile-setup",
    element: <ProfileSetupScreen />,
  },
  {
    path: "/app",
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "health-profile", element: <HealthProfileDashboard /> },
      { path: "lifestyle-input", element: <LifestyleInput /> },
      { path: "medical-history", element: <MedicalHistory /> },
      { path: "health-summary", element: <HealthSummary /> },
      { path: "symptom-input", element: <SymptomInput /> },
      { path: "severity-selection", element: <SeveritySelection /> },
      { path: "ai-processing", element: <AIProcessing /> },
      { path: "result", element: <ResultScreen /> },
      { path: "detailed-explanation", element: <DetailedExplanation /> },
      { path: "risk-dashboard", element: <RiskDashboard /> },
      { path: "risk-breakdown", element: <RiskBreakdown /> },
      { path: "trend-analysis", element: <TrendAnalysis /> },
      { path: "future-prediction", element: <FuturePrediction /> },
      { path: "learning", element: <LearningDashboard /> },
      { path: "topics", element: <TopicList /> },
      { path: "article/:id", element: <ArticleView /> },
      { path: "quiz/:id", element: <QuizInterface /> },
      { path: "quiz-results", element: <QuizResults /> },
      { path: "suggestions", element: <DailySuggestions /> },
      { path: "plan", element: <PersonalizedPlan /> },
      { path: "goals", element: <WeeklyGoals /> },
      { path: "habits", element: <HabitTracking /> },
      { path: "calendar", element: <CalendarView /> },
      { path: "daily-logs", element: <DailyLogs /> },
      { path: "trends", element: <TrendGraphs /> },
      { path: "recovery", element: <RecoveryProgress /> },
      { path: "alerts", element: <AlertDashboard /> },
      { path: "alert-settings", element: <AlertSettings /> },
      { path: "add-medicine", element: <AddMedicine /> },
      { path: "reminder-setup", element: <ReminderSetup /> },
      { path: "reminders", element: <ReminderList /> },
      { path: "medication-history", element: <MedicationHistory /> },
      { path: "map", element: <MapView /> },
      { path: "hospitals", element: <HospitalList /> },
      { path: "nearby-facilities", element: <HospitalList /> },
      { path: "hospital/:id", element: <HospitalDetail /> },
      { path: "ai-chat", element: <AIChat /> },
      { path: "voice", element: <VoiceInterface /> },
      { path: "timeline", element: <HealthTimeline /> },
      { path: "report-summary", element: <ReportSummary /> },
      { path: "analytics", element: <GraphAnalytics /> },
      { path: "download-report", element: <DownloadReport /> },
      { path: "profile", element: <ProfileScreen /> },
      { path: "privacy-security", element: <PrivacySecurity /> },
      { path: "help-support", element: <HelpSupport /> },
    ],
  },
]);
