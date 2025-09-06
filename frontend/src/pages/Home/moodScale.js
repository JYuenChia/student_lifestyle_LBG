export const emojiToScale = {
  "😢": 1,
  "😡": 1,
  "😖": 2,
  "😨": 2,
  "😐": 3,
  "😊": 4,
  "❤️": 4,
  "➕": 3, // neutral by default
};

// Build scaleToEmoji dynamically from emojiToScale
export const scaleToEmoji = Object.entries(emojiToScale).reduce((acc, [emoji, scale]) => {
  // only set if not already assigned (keeps first found emoji for that scale)
  if (!acc[scale]) {
    acc[scale] = emoji;
  }
  return acc;
}, {});
