import _round from "lodash/round";
const DIFFICULTY_MULTIPLIER = 100_000;
const simplifyWordForComparaison = (word: string) => {
  return word
    .toLowerCase()
    .replaceAll(/and/g, "")
    .replaceAll(/the/g, "")
    .replaceAll(/of/g, "")
    .replaceAll(/:/g, "")
    .trim()
    .replaceAll(/\s/g, "");
};

export const scoreQuestion =
  (oldScore: number) =>
  ({
    correctAnswer,
    lastAnsweredAt,
    userAnswer,
    difficulty,
  }: {
    userAnswer: string;
    correctAnswer: string;
    lastAnsweredAt: Date;
    difficulty: number;
  }) => {
    const isCorrectAnswer =
      simplifyWordForComparaison(correctAnswer) ===
      simplifyWordForComparaison(userAnswer);

    if (!isCorrectAnswer) return { nextScore: oldScore, isCorrectAnswer };

    const difficultyScore = DIFFICULTY_MULTIPLIER * difficulty;

    const timeTakenToAnswerInS =
      (new Date().getTime() - lastAnsweredAt.getTime()) / DIFFICULTY_MULTIPLIER;

    const score =
      timeTakenToAnswerInS === 0
        ? difficultyScore * 10
        : _round(difficulty / timeTakenToAnswerInS);

    return { nextScore: oldScore + score, isCorrectAnswer };
  };
