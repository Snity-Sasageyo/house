let p = "";
let inv = [];
let clicks = 0;
let ended = { main: false, bad: false, secret: false };

const rooms = {
  hall: {
    n: "Entrance Hall",
    i: [
      {
        k: "portrait",
        l: "The Harrow family, 1986. Four people lived here. The portrait shows five.",
        s: "The fifth figure is standing closer.",
        a: "cam",
        e: "📷",
      },
      {
        k: "clock",
        l: "Stopped at 3:07. One tick when clicked, then silence. It didn't run down. It was told to stop.",
        a: "tick",
      },
      {
        k: "mirror",
        l: "Your reflection lags half a second behind you.",
        a: "lag",
      },
      { k: "door", l: "Locked. It wasn't when you came in.", a: "lock" },
      { k: "paper", l: "Dated Oct 8, 1987 — FAMILY OF FOUR STILL MISSING" },
    ],
  },
  kitchen: {
    n: "Kitchen",
    i: [
      {
        k: "table",
        l: "Set for five. Four chairs pulled out, one pushed in. The fifth plate is still warm.",
      },
      {
        k: "fridge",
        l: "Still humming after 40 years. Taped under the shelf: a small brass key.",
        a: "key",
        e: "🔑",
      },
      { k: "knives", l: "One slot empty." },
      { k: "cupboard", l: "Scratch marks on the inside of the door." },
      {
        k: "radio",
        l: "Static. If clicked twice, three notes of a lullaby play backwards.",
        a: "static",
      },
    ],
  },
  bedroom: {
    n: "Master Bedroom",
    i: [
      { k: "bed", l: "One side still sunk, as if someone just stood up." },
      {
        k: "pillow",
        l: "Beneath it: a wedding ring wrapped in cloth, with a note — Don't let him wear it.",
        a: "ring",
        e: "💍",
      },
      {
        k: "diary",
        l: "Final entry, Oct 7: He stands at the door again. He looks like my husband. He sounds like my husband. My husband has been in the basement for three days.",
      },
      {
        k: "wardrobe",
        l: "Ajar. The dark inside doesn't end. Click again — it closes itself, from the inside.",
        a: "close",
      },
      { k: "box", l: "Plays a few notes, then winds down like a sigh." },
    ],
  },
  attic: {
    n: "Attic",
    i: [
      {
        k: "dollhouse",
        l: "A perfect replica of the house. In its tiny attic, a tiny figure stands facing the tiny you.",
        a: "watch",
      },
      {
        k: "trunk",
        l: "Inside: the daughter's doll. Its eyes are closed. You didn't close them.",
        a: "doll",
        e: "🪆",
      },
      {
        k: "drawings",
        l: "The family sleeping → a tall man by the beds → the tall man in the basement → the last one is just black scribble and he sees you",
      },
      {
        k: "window",
        l: "Looks out onto the front yard… where you can see yourself, arriving, on loop.",
      },
      { k: "tv", l: "Static. For one frame, the static forms a face." },
    ],
  },
  basement: {
    n: "Basement",
    i: [
      {
        k: "seals",
        l: "The door has four hollow seals shaped like the keepsakes. Place each one to unlock the truth.",
      },
    ],
  },
};

const endings = {
  main: {
    t: "They Never Left",
    d: "The family is released. The house goes quiet. Dawn light. You leave. Behind you, the house finally sleeps.",
  },
  bad: { t: "Kept", d: "The house keeps what enters." },
  secret: {
    t: "The Fifth",
    d: "The portrait has changed. It now shows five people. One of them is you.",
  },
};

function init() {
  let btn = document.getElementById("b");
  btn.onclick = () => {
    let nm = document.querySelector(".n").value || "stranger";
    p = nm;
    document.querySelector(".w").style.display = "none";
    document.getElementById("r").style.display = "block";
  };
}

init();

