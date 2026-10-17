import assert from "node:assert/strict";
import { test } from "node:test";
import { interpretDream } from "./interpret.ts";
import type { DreamInput } from "./interpret.ts";

const input: DreamInput = {
  dream:
    "I was flying above a silver ocean. A doorway appeared and I felt peaceful.",
  age: "25–34",
  dreamType: "dream",
  dayMood: "Anxious",
  dreamMood: "Peaceful",
};

test("grounds multiple symbolic readings and the excerpt in the actual dream", () => {
  const report = interpretDream(input);
  assert.equal(report.symbols.length, 3);
  assert.deepEqual(
    new Set(report.symbols.map((symbol) => symbol.icon)),
    new Set(["flight", "water", "key"]),
  );
  for (const word of ["flying", "ocean", "doorway"]) {
    assert.ok(
      report.symbols.some((symbol) => symbol.meaning.includes(`“${word}”`)),
    );
  }
  assert.ok(report.summary.includes("“I was flying above a silver ocean.”"));
  assert.ok(report.themes.includes("Emotional depth"));
  assert.ok(report.themes.includes("Change & choice"));
});

test("does not invent recognized symbols when the user has supplied none", () => {
  const dream = "Everything felt violet and unusually quiet.";
  const report = interpretDream({ ...input, dream });
  assert.deepEqual(report.symbols, []);
  assert.ok(report.summary.includes(`“${dream}”`));
  assert.ok(report.prompts[0].includes(dream));
  assert.doesNotMatch(report.summary, /ocean|doorway|flight|forest/);
});

test("uses complete words rather than accidental substrings for symbols", () => {
  const report = interpretDream({
    ...input,
    dream:
      "I saw a carpet in an outdoor classroom with a seashell and a superstar poster.",
  });
  // carpet/car, outdoor/door, classroom/room, seashell/sea, superstar/star.
  assert.deepEqual(report.symbols, []);
});

test("uses the selected age as a tentative life-stage context", () => {
  const younger = interpretDream({ ...input, age: "Under 18" });
  const older = interpretDream({ ...input, age: "65+" });
  assert.notEqual(younger.summary, older.summary);
  assert.notDeepEqual(younger.prompts, older.prompts);
  assert.match(younger.summary, /growing independence/);
  assert.match(older.summary, /changing priorities/);
  assert.match(younger.summary, /if|may|no need/i);
  assert.match(older.summary, /if|may/i);
});

test("nightmare guidance is gentle and explicitly avoids prediction", () => {
  const ordinary = interpretDream(input);
  const nightmare = interpretDream({
    ...input,
    dreamType: "nightmare",
    dreamMood: "Afraid",
  });
  assert.notEqual(nightmare.emotionalInsight, ordinary.emotionalInsight);
  assert.match(nightmare.emotionalInsight, /not a prediction/);
  assert.match(nightmare.emotionalInsight, /your own pace/);
  assert.match(
    nightmare.reflection,
    /remind yourself that the scene has ended/,
  );
  assert.match(nightmare.affirmation, /allowed to pause/);
  assert.ok(
    nightmare.emotions.find((emotion) => emotion.label === "Unease")!.value >
      ordinary.emotions.find((emotion) => emotion.label === "Unease")!.value,
  );
});

test("lucid guidance discusses choice without assuming total control", () => {
  const lucid = interpretDream({ ...input, dreamType: "lucid" });
  assert.match(lucid.subtitle, /lucid dream/);
  assert.match(lucid.emotionalInsight, /does not require complete control/);
  assert.ok(lucid.themes.includes("Awareness & choice"));
  assert.match(lucid.reflection, /when you noticed you were dreaming/);
});

test("day and dream moods change the reflection and emotional illustration", () => {
  const calm = interpretDream({
    ...input,
    dayMood: "Calm",
    dreamMood: "Peaceful",
  });
  const uneasy = interpretDream({
    ...input,
    dayMood: "Calm",
    dreamMood: "Uneasy",
  });
  const changedDay = interpretDream({
    ...input,
    dayMood: "Low",
    dreamMood: "Peaceful",
  });
  assert.match(calm.emotionalInsight, /consistent emotional thread/);
  assert.match(uneasy.emotionalInsight, /change in atmosphere/);
  assert.notEqual(calm.emotionalInsight, changedDay.emotionalInsight);
  assert.notDeepEqual(calm.emotions, changedDay.emotions);
  assert.ok(
    uneasy.emotions.find((emotion) => emotion.label === "Unease")!.value >
      calm.emotions.find((emotion) => emotion.label === "Unease")!.value,
  );
});

test("recognizes the website mood labels without recasting curiosity as confusion", () => {
  const expectations = [
    ["Joyful", "happiness"],
    ["Peaceful", "calm"],
    ["Curious", "curiosity"],
    ["Uneasy", "tension"],
    ["Afraid", "tension"],
  ];
  for (const [dreamMood, word] of expectations) {
    assert.ok(
      interpretDream({ ...input, dreamMood }).emotionalInsight.includes(word),
      dreamMood,
    );
  }
  assert.match(
    interpretDream({ ...input, dayMood: "Okay" }).emotionalInsight,
    /neutral feeling/,
  );
  assert.match(
    interpretDream({ ...input, dayMood: "Low" }).emotionalInsight,
    /sadness/,
  );
});

test("emotional illustrations stay finite, nonnegative, and total one hundred", () => {
  for (const dreamType of ["dream", "nightmare", "lucid"] as const) {
    for (const dreamMood of [
      "Joyful",
      "Peaceful",
      "Curious",
      "Uneasy",
      "Afraid",
    ]) {
      const report = interpretDream({ ...input, dreamType, dreamMood });
      assert.equal(report.emotions.length, 4);
      assert.equal(
        report.emotions.reduce((sum, emotion) => sum + emotion.value, 0),
        100,
      );
      assert.ok(
        report.emotions.every(
          (emotion) =>
            Number.isInteger(emotion.value) &&
            emotion.value >= 0 &&
            emotion.value <= 100,
        ),
      );
    }
  }
  assert.match(interpretDream(input).interpretationNote, /not a measurement/);
});

test("gives a stable report for the same input without mutating it", () => {
  const original = { ...input };
  const frozen = Object.freeze({ ...input });
  assert.deepEqual(interpretDream(frozen), interpretDream(original));
  assert.deepEqual(frozen, original);
});

test("rejects an empty dream rather than generating a fabricated reading", () => {
  assert.throws(
    () => interpretDream({ ...input, dream: " \n\t " }),
    /Write a little about your dream/,
  );
});
