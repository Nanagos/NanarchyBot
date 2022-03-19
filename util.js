const plugins = {
  conversions: false,
  furnace: false,
  math: false,
  painting: false,
  scoreboard: false,
  villager: false,
  bed: false,
  book: false,
  boss_bar: false,
  chest: false,
  command_block: false,
  craft: false,
  digging: false,
  dispenser: false,
  enchantment_table: false,
  experience: false,
  rain: false,
  ray_trace: false,
  sound: false,
  tablist: false,
  time: false,
  title: false,
  physics: true,
  blocks: true
}

function removeDiscordFormating(text) {
  let new_text = "";
  const chars = "*_|";
  for(let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    new_text += `${chars.includes(char) ? "\\" : ""}${char}`;
  }
  return new_text;
}

function removeIllegalSigns(text) {
  let new_text = "";
  const legal = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.:,;<>|*+~#/()[]{}-_"
  for(let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if(legal.includes(char)) new_text += char;
  }
  return new_text;
}

module.exports = {
  plugins,
  removeDiscordFormating,
  removeIllegalSigns
}