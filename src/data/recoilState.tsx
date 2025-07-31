import { atom, selector } from "recoil";
import { DiagnosticScenario } from "../types/game";

export const gamePoints = atom({
  key: "gamePoints",
  default: 0,
});

export const gameLevelId = atom<null | string>({
  key: "levelId",
  default: null,
});

export const gameScenarios = atom<DiagnosticScenario[] | null>({
  key: "scenario",
  default: null,
});

export const getScenarioById = selector({
  key: "getScenarioById",
  get: ({ get }) => {
    const scenarios = get(gameScenarios); // Get all the scenarios
    const _levelId = get(gameLevelId); // Get the current level id
    // console.log(_levelId)
    return (
      scenarios?.find((scenario) => scenario.id === Number(_levelId)) || null
    );
  },
});
