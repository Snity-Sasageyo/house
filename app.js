let p = "";
let inv = [];
let clicks = 0;
let ended = { main: false, bad: false, secret: false };
let cur = "h";

const rooms = {
  h: {
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
  k: {
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
  m: {
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
  t: {
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
  s: {
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

function go(id) {
  let all = document.querySelectorAll(".rm");
  for (let i = 0; i < all.length; i++) {
    all[i].classList.remove("on");
  }
  let el = document.getElementById(id);
  if (el) el.classList.add("on");
  cur = id;
  hud();
}

function hud() {
  let rn = document.getElementById("rn");
  let sls = document.querySelectorAll(".sl");
  let nm = rooms[cur] ? rooms[cur].n : "Unknown";
  rn.innerText = nm;

  for (let i = 0; i < 4; i++) {
    if (inv[i]) {
      sls[i].innerText = inv[i].e;
      sls[i].style.borderColor = "#d9a441";
      sls[i].style.color = "#d9a441";
      sls[i].style.boxShadow =
        "0 0 10px rgba(217,164,65,0.4), inset 0 0 4px rgba(217,164,65,0.2)";
    } else {
      sls[i].innerText = "?";
      sls[i].style.borderColor = "#8a0f0f";
      sls[i].style.color = "#8a0f0f";
      sls[i].style.boxShadow = "inset 0 0 6px rgba(138,15,15,0.3)";
    }
  }
}

function build() {
  for (let r in rooms) {
    let el = document.getElementById(r);
    if (!el) continue;
    el.className = "rm";
    let html = "";
    let list = rooms[r].i;
    for (let x = 0; x < list.length; x++) {
      html +=
        '<div class="ob" data-k="' + list[x].k + '">' + list[x].k + "</div>";
    }
    if (r !== "h" && r !== "s") {
      html += '<div class="lk" data-go="h">return to hall</div>';
    }
    el.innerHTML = html;

    let obs = el.querySelectorAll(".ob");
    for (let y = 0; y < obs.length; y++) {
      obs[y].onclick = function () {
        open(this.dataset.k);
      };
    }
    let lk = el.querySelector(".lk");
    if (lk)
      lk.onclick = function () {
        go("h");
      };
  }
}

function open(k) {
  let o = document.getElementById("o");
  let txt = "You look at the " + k + ".";
  for (let r in rooms) {
    let list = rooms[r].i;
    for (let z = 0; z < list.length; z++) {
      if (list[z].k === k) {
        txt = list[z].l;
        if (list[z].e) {
          let got = false;
          for (let w = 0; w < inv.length; w++) {
            if (inv[w].k === k) got = true;
          }
          if (!got) {
            inv.push(list[z]);
            txt += '<br><br><em style="color:#d9a441">You take it.</em>';
          }
        }
        break;
      }
    }
  }
  o.innerHTML =
    '<div class="obx"><p>' + txt + '</p><p class="cls">close</p></div>';
  o.classList.add("on");
  let c = o.querySelector(".cls");
  c.onclick = function () {
    o.classList.remove("on");
    hud();
  };
}

function init() {
  let btn = document.getElementById("b");
  let lv = document.getElementById("lv");

  btn.onclick = function () {
    let nm = document.querySelector(".n").value || "stranger";
    p = nm;
    document.querySelector(".w").style.display = "none";
    document.getElementById("r").style.display = "block";
    lv.style.display = "block";
    build();
    go("h");
  };

  lv.onclick = function () {
    lv.innerText = "not yet.";
    lv.style.color = "#d8d3c5";
    lv.style.borderColor = "#d8d3c5";
    setTimeout(function () {
      lv.innerText = "Leave";
      lv.style.color = "#8a0f0f";
      lv.style.borderColor = "#8a0f0f";
    }, 2500);
  };
}

init();

