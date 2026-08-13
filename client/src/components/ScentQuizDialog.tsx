import { Link } from "wouter";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getScentQuizRecommendation,
  SCENT_QUIZ_QUESTIONS,
  type ScentQuizAnswers,
} from "@shared/scent-quiz";

type ScentQuizDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const quizStepCount = SCENT_QUIZ_QUESTIONS.length;

export default function ScentQuizDialog({ open, onOpenChange }: ScentQuizDialogProps) {
  const [answers, setAnswers] = useState<ScentQuizAnswers>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const question = SCENT_QUIZ_QUESTIONS[step];
  const selection = question ? answers[question.id] : undefined;
  const result = showResult ? getScentQuizRecommendation(answers) : null;

  const resetQuiz = () => {
    setAnswers({});
    setStep(0);
    setShowResult(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) resetQuiz();
  };

  const continueQuiz = () => {
    if (!selection) return;
    if (step === quizStepCount - 1) {
      setShowResult(true);
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[calc(100svh-2rem)] max-w-[calc(100%-1.5rem)] gap-6 overflow-y-auto rounded-2xl border-stone-200 bg-white p-5 shadow-2xl sm:max-w-2xl sm:p-8"
      >
        {result ? (
          <div className="space-y-6" data-testid="scent-quiz-result">
            <DialogHeader className="pr-8 text-left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">Votre affinité olfactive</p>
              <DialogTitle className="text-3xl font-light tracking-tight text-gray-950 sm:text-4xl">
                {result.recommendation.name}
              </DialogTitle>
              <DialogDescription className="text-base leading-7 text-gray-600">
                {result.recommendation.reason}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">La signature</p>
              <p className="mt-3 text-lg font-light leading-7 text-gray-900">{result.recommendation.notes}</p>
              <p className="mt-4 text-sm leading-6 text-gray-600">{result.recommendation.description}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">À explorer aussi</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {result.alternatives.map((alternative) => (
                  <Link
                    key={alternative.slug}
                    href={`/parfum/matiere-premiere/${alternative.slug}`}
                    className="rounded-xl border border-stone-200 px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-950"
                  >
                    {alternative.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={resetQuiz} className="min-h-11 justify-start text-gray-600 hover:text-gray-950">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Recommencer
              </Button>
              <Link href={`/parfum/matiere-premiere/${result.recommendation.slug}`}>
                <Button type="button" className="min-h-11 w-full gap-2 bg-gray-950 px-5 text-white hover:bg-gray-800 sm:w-auto">
                  Découvrir ce parfum
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <DialogHeader className="pr-8 text-left">
              <div className="flex items-center gap-2 text-amber-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <p className="text-xs font-medium uppercase tracking-[0.2em]">Votre signature olfactive</p>
              </div>
              <DialogTitle className="text-2xl font-light tracking-tight text-gray-950 sm:text-3xl">
                Quelques gestes, une recommandation.
              </DialogTitle>
              <DialogDescription className="leading-6 text-gray-600">
                Répondez selon votre intuition. Nous sélectionnons la création Matière Première la plus proche de vos préférences.
              </DialogDescription>
            </DialogHeader>

            <div className="h-px bg-stone-200" aria-hidden="true" />

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">{question?.eyebrow}</p>
                <span className="text-xs text-gray-500">{step + 1} / {quizStepCount}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
                <div className="h-full rounded-full bg-gray-900 transition-all duration-500" style={{ width: `${((step + 1) / quizStepCount) * 100}%` }} />
              </div>

              <fieldset>
                <legend className="text-xl font-light leading-8 text-gray-950">{question?.prompt}</legend>
                <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={question?.prompt}>
                  {question?.options.map((option) => {
                    const isSelected = selection === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                        className={`min-h-24 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950/35 ${
                          isSelected
                            ? "border-gray-950 bg-gray-950 text-white shadow-lg shadow-gray-950/10"
                            : "border-stone-200 bg-white text-gray-900 hover:border-stone-400 hover:bg-stone-50"
                        }`}
                      >
                        <span className="block text-base font-medium">{option.label}</span>
                        <span className={`mt-1 block text-sm leading-5 ${isSelected ? "text-gray-200" : "text-gray-500"}`}>{option.description}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                className="min-h-11 text-gray-600 hover:text-gray-950"
              >
                Retour
              </Button>
              <Button
                type="button"
                disabled={!selection}
                onClick={continueQuiz}
                className="min-h-11 gap-2 bg-gray-950 px-5 text-white hover:bg-gray-800"
              >
                {step === quizStepCount - 1 ? "Voir ma recommandation" : "Continuer"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
