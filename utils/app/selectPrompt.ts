import { PromptList } from './const';

export const selectPrompt = (value: string) => {
  switch (true) {
    case value === 'student_review_skills':
      return PromptList.reviewWithSkills.promptText;
    case value === 'student_review_selfconf':
      return PromptList.selfConfidence.promptText;
    case value === 'student_review_testperf':
      return PromptList.testPerformance.promptText;
    case value === 'mcq_test':
      return PromptList.mcqTest.promptText;
    case value === 'item_focus_problem':
      return PromptList.itemFocusProblem.promptText;
    case value === 'item_focus_guided_practice':
      return PromptList.itemFocusGuidedPractice.promptText;
    case value === 'item_focus_teach_bot':
      return PromptList.teachChatBot.promptText;
    case value === 'item_focus_gamify':
      return PromptList.gamifyBot.promptText;
    case value === 'content_generation_one':
      return PromptList.contentGenerationOne.promptText;
    case value === 'low_score_areas':
      return PromptList.lowScoreAreas.promptText;
    case value === 'dev_test':
      return PromptList.dev.promptText;
    case value === 'question_based_practice':
      return PromptList.questionBasedPractice.promptText;
    case value === 'skill_based_practice':
      return PromptList.skillBasedPractice.promptText;
    default:
      return PromptList.reviewWithSkills.promptText;
  }
};
