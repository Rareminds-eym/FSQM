import { DifficultyBadge } from "../types/game";

export const getDifficultyBadge = (difficulty: string): DifficultyBadge => {
  switch (difficulty) {
    case "Easy":
    case "Basic":
      return {
        colors: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      };
    case "Medium":
    case "Intermediate":
      return {
        colors: "bg-violet-500/5 border-violet-600/20 text-violet-600",
      };
    case "Hard":
    case "Advanced":
      return {
        colors: "bg-red-500/0 border-red-500/10 text-red-400",
      };

    case "Critical Thinking":
      return {
        colors: "bg-red-500/10 border-red-500/80 text-red-400",
      };

    default:
      return {
        colors: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      };
  }
};