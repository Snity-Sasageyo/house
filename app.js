let p = "";
let inv = [];
let door = 0;
let ended = { main: false, bad: false, secret: false };
let cur = "h";
let seen = [];
let put = [];
let tt = null;
let full = "";
let dn = false;
let live = false;
let ward = 0;
let mir = 0;
let pic = 0;
let rd = null;
let mt = null;

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
    d: "The family is released. The house goes quiet. Dawn light. You leave.<br><br>Behind you, the house finally sleeps.",
  },
  bad: {
    t: "Kept",
    d: "The house keeps what enters.",
  },
  secret: {
    t: "The Fifth",
    d: "The portrait has changed. It now shows five people.",
  },
};

const whs = {
  portrait: "a breath near your ear: thank you.",
  fridge: "water drips somewhere below the floor.",
  pillow: "a woman whispers: don't let him wear it.",
  trunk: "a child whispers: he is under the floor.",
};

let sl = ["portrait", "fridge", "pillow", "trunk"];

function gotEnds() {
  let d = { main: false, bad: false, secret: false };
  try {
    let j = localStorage.getItem("h47");
    if (j) {
      let x = JSON.parse(j);
      if (x.main) d.main = true;
      if (x.bad) d.bad = true;
      if (x.secret) d.secret = true;
    }
  } catch (e) {}
  return d;
}

function cnt() {
  let d = gotEnds();
  let c = 0;
  if (d.main) c++;
  if (d.bad) c++;
  if (d.secret) c++;
  return c;
}

function saveEnd(t) {
  let d = gotEnds();
  d[t] = true;
  ended[t] = true;
  try {
    localStorage.setItem("h47", JSON.stringify(d));
  } catch (e) {}
}

function has(k) {
  for (let i = 0; i < inv.length; i++) {
    if (inv[i].k === k) return true;
  }
  return false;
}

function find(k) {
  for (let r in rooms) {
    let list = rooms[r].i;
    for (let i = 0; i < list.length; i++) {
      if (list[i].k === k) return list[i];
    }
  }
  return null;
}

function allSeen() {
  for (let r in rooms) {
    let list = rooms[r].i;
    for (let i = 0; i < list.length; i++) {
      if (seen.indexOf(list[i].k) === -1) return false;
    }
  }
  return true;
}

function gl() {
  document.body.classList.remove("gl");
  void document.body.offsetWidth;
  document.body.classList.add("gl");
  setTimeout(function () {
    document.body.classList.remove("gl");
  }, 350);
}

function dip(hard) {
  let dp = document.getElementById("dp");
  if (!dp) return;
  dp.classList.add("on");
  setTimeout(
    function () {
      dp.classList.remove("on");
    },
    hard ? 420 : 180,
  );
}

function amb() {
  if (!live) return;
  let wt = 12000 + Math.random() * 22000;
  let dr = inv.length + put.length;
  if (dr > 2) wt -= 3500;
  if (dr > 5) wt -= 4500;
  if (wt < 5500) wt = 5500;

  rd = setTimeout(function () {
    if (!live) return;
    let x = Math.random();
    if (x < 0.5) {
      dip(Math.random() < 0.35);
    } else if (x < 0.78) {
      gl();
    } else {
      dip(true);
      gl();
    }
    amb();
  }, wt);
}

function type(el, s, cb) {
  if (tt) clearTimeout(tt);
  full = s;
  el.textContent = "";
  dn = false;
  let i = 0;

  function step() {
    if (i < s.length) {
      el.textContent += s[i];
      let ch = s[i];
      i++;
      let wt = 16;
      if (ch === "." || ch === "—" || ch === "?") wt = 130;
      if (ch === ",") wt = 70;
      if (ch === "…") wt = 170;
      tt = setTimeout(step, wt);
    } else {
      tt = null;
      dn = true;
      if (cb) cb();
    }
  }

  step();
}

function say(s, cb) {
  let o = document.getElementById("o");
  o.innerHTML =
    '<div class="obx"><p id="tx" class="ty"></p><p class="cls" id="cl">close</p></div>';
  o.classList.add("on");

  let tx = document.getElementById("tx");
  let c = document.getElementById("cl");
  let went = false;

  let fin = function () {
    if (went) return;
    went = true;
    tx.classList.remove("ty");
  };

  type(tx, s, fin);

  o.onclick = function (ev) {
    if (!dn && ev.target.id !== "cl") {
      if (tt) clearTimeout(tt);
      tt = null;
      tx.textContent = full;
      dn = true;
      fin();
    } else if (dn && ev.target === o) {
      o.classList.remove("on");
      if (cb) cb();
    }
  };

  c.onclick = function () {
    if (!dn) {
      if (tt) clearTimeout(tt);
      tt = null;
      tx.textContent = full;
      dn = true;
      fin();
    }
    o.classList.remove("on");
    if (cb) cb();
  };
}

function go(id) {
  let all = document.querySelectorAll(".rm");
  for (let i = 0; i < all.length; i++) {
    all[i].classList.remove("on");
  }

  let el = document.getElementById(id);
  if (el) el.classList.add("on");

  cur = id;

  if (id === "s") drawS();

  if (live && Math.random() < 0.22) gl();
  if (live && id === "s" && Math.random() < 0.5) dip(false);

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

    if (r === "s") {
      drawS();
      continue;
    }

    el.className = "rm";
    let html = "";
    let list = rooms[r].i;

    for (let x = 0; x < list.length; x++) {
      let cls = "ob";
      if (list[x].e && has(list[x].k)) cls += " got";
      html +=
        '<div class="' +
        cls +
        '" data-k="' +
        list[x].k +
        '">' +
        list[x].k +
        "</div>";
    }

    if (r === "h") {
      html += '<div class="drs">';
      html += '<div class="dr" data-go="k">kitchen</div>';
      html += '<div class="dr" data-go="m">bedroom</div>';
      html += '<div class="dr" data-go="t">attic</div>';
      html += '<div class="dr" data-go="s">basement</div>';
      html += "</div>";
    }

    if (r !== "h") {
      html += '<div class="lk" data-go="h">return to hall</div>';
    }

    el.innerHTML = html;

    let obs = el.querySelectorAll(".ob");
    for (let y = 0; y < obs.length; y++) {
      obs[y].onclick = function () {
        open(this.dataset.k);
      };
    }

    let drs = el.querySelectorAll(".dr");
    for (let d = 0; d < drs.length; d++) {
      drs[d].onclick = function () {
        go(this.dataset.go);
      };
    }

    let lk = el.querySelector(".lk");
    if (lk)
      lk.onclick = function () {
        go("h");
      };
  }
}

function drawS() {
  let el = document.getElementById("s");
  if (!el) return;

  el.className = "rm";

  if (seen.indexOf("seals") === -1) seen.push("seals");

  let html =
    '<div class="bt">The basement door has four hollow seals shaped like the keepsakes.</div>';
  html += '<div class="srs">';

  for (let i = 0; i < sl.length; i++) {
    let it = find(sl[i]);
    let cls = "se";
    let ic = "?";

    if (put.indexOf(sl[i]) !== -1) {
      cls += " on";
      ic = it ? it.e : "?";
    } else if (has(sl[i])) {
      cls += " rd";
      ic = it ? it.e : "?";
    }

    html += '<div class="' + cls + '" data-sk="' + sl[i] + '">' + ic + "</div>";
  }

  html += "</div>";
  html += '<div class="ob" data-k="seals">seals</div>';
  html +=
    '<div class="wh" id="wh">' +
    (put.length === 4 ? "The four seals are full." : "") +
    "</div>";

  if (put.length === 4) {
    html += '<div class="hd" id="hd">the hidden room</div>';
  }

  html += '<div class="lk" data-go="h">return to hall</div>';

  el.innerHTML = html;

  let ob = el.querySelector('[data-k="seals"]');
  if (ob)
    ob.onclick = function () {
      open("seals");
    };

  let ses = el.querySelectorAll(".se");
  for (let j = 0; j < ses.length; j++) {
    ses[j].onclick = function () {
      seal(this.dataset.sk);
    };
  }

  let lk = el.querySelector(".lk");
  if (lk)
    lk.onclick = function () {
      go("h");
    };

  if (put.length === 4) {
    let hd = document.getElementById("hd");
    if (hd)
      hd.onclick = function () {
        finish();
      };
  }
}

function seal(kk) {
  if (put.indexOf(kk) !== -1) {
    say("It is already set.", function () {
      drawS();
    });
    return;
  }

  if (!has(kk)) {
    say("The hollow seal waits for something else.", function () {
      drawS();
    });
    return;
  }

  put.push(kk);
  gl();
  dip(false);

  let w = whs[kk] || "something breathes behind the door.";

  say(w, function () {
    drawS();
  });
}

function finish() {
  if (allSeen()) end("secret");
  else end("main");
}

function end(t) {
  live = false;

  if (rd) clearTimeout(rd);
  if (tt) clearTimeout(tt);
  if (mt) clearTimeout(mt);

  rd = null;
  tt = null;
  mt = null;

  if (t === "bad") {
    dip(true);
    gl();
  }

  if (t === "secret") {
    gl();
  }

  document.getElementById("o").classList.remove("on");

  let all = document.querySelectorAll(".rm");
  for (let i = 0; i < all.length; i++) {
    all[i].classList.remove("on");
  }

  let z = document.getElementById("z");
  z.className = "rm on " + t;

  document.querySelector(".u").style.display = "none";
  document.getElementById("lv").style.display = "none";

  saveEnd(t);

  let e = endings[t];
  let d = e.d;

  if (t === "main") {
    d =
      "we never left. we hid where he can't look. thank you for bringing back our things.<br><br>" +
      d;
  }

  if (t === "secret") {
    d =
      "we never left. we hid where he can't look. thank you for bringing back our things.<br><br>";
    d += "The portrait has changed. It now shows five people.<br><br>";
    d += "One of them is you.<br><br>";
    d += "...and " + (p || "stranger") + " makes five.";
  }

  z.innerHTML =
    '<div class="end"><h2 class="et">' +
    e.t +
    '</h2><p class="ed">' +
    d +
    '</p><p class="ef2">Endings found: ' +
    cnt() +
    '/3</p><div class="agn" id="agn">again</div></div>';

  document.getElementById("agn").onclick = function () {
    location.reload();
  };
}

function open(k) {
  let f = find(k);
  if (!f) return;

  if (seen.indexOf(k) === -1) seen.push(k);

  if (k === "door") {
    door++;
    if (door >= 3) {
      end("bad");
      return;
    }
  }

  if (k === "wardrobe") {
    ward++;

    if (ward === 2) {
      gl();
      dip(true);

      let ob = document.querySelector('[data-k="wardrobe"]');
      if (ob) {
        ob.innerText = "wardrobe — closed";
        ob.classList.add("shut");
      }

      say("It closes itself. From the inside.", function () {
        hud();
      });
      return;
    }

    if (ward > 2) {
      say("You are not going back in there.", function () {
        hud();
      });
      return;
    }
  }

  let line = f.l;
  let wait = 0;

  if (k === "door" && door === 2) {
    line = "Locked. The handle is colder now.";
  }

  if (k === "portrait") {
    pic++;

    if (pic === 2) {
      line = f.s;
      gl();
    }

    if (pic > 2) {
      line = "The fifth figure is facing you.";
    }
  }

  if (k === "mirror") {
    mir++;
    wait = 680;

    document.body.classList.remove("lag");
    void document.body.offsetWidth;
    document.body.classList.add("lag");

    setTimeout(function () {
      document.body.classList.remove("lag");
    }, 3400);

    if (mir === 2) {
      line =
        "Your reflection is half a second behind you. Then it smiles when you do not.";
      gl();
    }

    if (mir > 2) {
      line = "Your reflection is watching the door now.";
    }
  }

  if (f.a === "watch" || f.a === "tv" || f.a === "close") {
    if (Math.random() < 0.65) gl();
  }

  let o = document.getElementById("o");
  o.innerHTML =
    '<div class="obx"><p id="tx" class="ty"></p><p id="tk" class="tk"></p><p class="cls" id="cl">close</p></div>';
  o.classList.add("on");

  let tx = document.getElementById("tx");
  let tk = document.getElementById("tk");
  let c = document.getElementById("cl");
  let got = has(k);
  let went = false;

  full = line;

  let fin = function () {
    if (went) return;
    went = true;
    tx.classList.remove("ty");

    if (f.e && !got) {
      inv.push(f);
      tk.innerText = "You take it.";
      tk.style.display = "block";

      let ob = document.querySelector('[data-k="' + k + '"]');
      if (ob) ob.classList.add("got");

      hud();
    } else if (f.e && got) {
      tk.innerText = "You already have it.";
      tk.style.display = "block";
    }
  };

  if (mt) clearTimeout(mt);
  mt = null;

  if (wait) {
    tx.classList.add("ty");
    mt = setTimeout(function () {
      type(tx, line, fin);
    }, wait);
  } else {
    type(tx, line, fin);
  }

  o.onclick = function (ev) {
    if (!dn && ev.target.id !== "cl") {
      if (mt) clearTimeout(mt);
      mt = null;
      tx.textContent = full;
      dn = true;
      fin();
    } else if (dn && ev.target === o) {
      o.classList.remove("on");
      hud();
    }
  };

  c.onclick = function () {
    if (!dn) {
      if (mt) clearTimeout(mt);
      mt = null;
      tx.textContent = full;
      dn = true;
      fin();
    }
    o.classList.remove("on");
    hud();
  };
}

function init() {
  let btn = document.getElementById("b");
  let lv = document.getElementById("lv");
  let ef = document.getElementById("ef");

  if (ef) ef.innerText = "endings found: " + cnt() + "/3";

  btn.onclick = function () {
    let nm = document.querySelector(".n").value || "stranger";
    p = nm;
    document.querySelector(".w").style.display = "none";
    document.getElementById("r").style.display = "block";
    lv.style.display = "block";
    build();
    go("h");
    live = true;
    amb();
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

