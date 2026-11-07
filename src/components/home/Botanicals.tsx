/**
 * Stylised botanical ingredients for the hero artwork. Every ingredient maps to a note that
 * already exists in the SEVOURA fragrance data (src/components/home/data.ts) — nothing invented.
 * Each drawing sits around (0,0) within roughly ±34 units; gradients live in <BotanicalDefs/>.
 */

export function BotanicalDefs() {
  return (
    <>
      <radialGradient id="bo-white" cx="50%" cy="35%" r="70%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".6" stopColor="#F5EBDB" />
        <stop offset="1" stopColor="#D9C3A0" />
      </radialGradient>
      <linearGradient id="bo-rose" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F7B3BD" />
        <stop offset=".5" stopColor="#C9506C" />
        <stop offset="1" stopColor="#6E1530" />
      </linearGradient>
      <linearGradient id="bo-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#B5C98C" />
        <stop offset=".55" stopColor="#5E7B44" />
        <stop offset="1" stopColor="#2C4424" />
      </linearGradient>
      <linearGradient id="bo-leaf-dark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7E8F55" />
        <stop offset=".55" stopColor="#3D4C27" />
        <stop offset="1" stopColor="#1D2812" />
      </linearGradient>
      <linearGradient id="bo-cedar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9825A" />
        <stop offset=".5" stopColor="#8A4A2C" />
        <stop offset="1" stopColor="#4E2716" />
      </linearGradient>
      <linearGradient id="bo-sandal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F0D6AE" />
        <stop offset=".5" stopColor="#C99F70" />
        <stop offset="1" stopColor="#8E6642" />
      </linearGradient>
      <linearGradient id="bo-drywood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B29C86" />
        <stop offset=".5" stopColor="#7A6450" />
        <stop offset="1" stopColor="#433628" />
      </linearGradient>
      <linearGradient id="bo-clove" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4A2212" />
        <stop offset=".5" stopColor="#9A5632" />
        <stop offset="1" stopColor="#4A2212" />
      </linearGradient>
      <radialGradient id="bo-seed" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#A06A42" />
        <stop offset="1" stopColor="#2E170A" />
      </radialGradient>
      <linearGradient id="bo-amber" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFE09A" />
        <stop offset=".45" stopColor="#E8952A" />
        <stop offset="1" stopColor="#8A3A06" />
      </linearGradient>
      <linearGradient id="bo-pod" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#5A3A22" />
        <stop offset="1" stopColor="#1E110A" />
      </linearGradient>
      <radialGradient id="bo-cocoa" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#B4774C" />
        <stop offset=".6" stopColor="#6B3A1E" />
        <stop offset="1" stopColor="#3A1C0C" />
      </radialGradient>
      <linearGradient id="bo-saffron" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#F2A13A" />
        <stop offset="1" stopColor="#C8241A" />
      </linearGradient>
      <radialGradient id="bo-pearl" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".55" stopColor="#EDE3D8" />
        <stop offset="1" stopColor="#A99D93" />
      </radialGradient>
    </>
  );
}

const veins = (n: number, len: number) =>
  Array.from({ length: n }, (_, i) => {
    const y = -len * 0.6 + (i * len * 1.2) / n;
    return `M0 ${y.toFixed(1)} l${(6 + i).toFixed(1)} -6 M0 ${y.toFixed(1)} l${(-6 - i).toFixed(1)} -6`;
  }).join(" ");

function Jasmine() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 0 C -8 -8 -7 -24 0 -31 C 7 -24 8 -8 0 0Z" fill="url(#bo-white)" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth=".6" />
      ))}
      <circle r="4" fill="#F1D27A" />
      <circle r="1.6" fill="#C9963A" />
    </g>
  );
}

function Neroli() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a + 36})`} d="M0 0 C -11 -6 -10 -21 0 -23 C 10 -21 11 -6 0 0Z" fill="url(#bo-white)" stroke="#FFFFFF" strokeOpacity=".6" strokeWidth=".5" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line y2="-11" stroke="#E7C05A" strokeWidth=".9" />
          <circle cy="-12" r="1.5" fill="#D99A2A" />
        </g>
      ))}
      <circle r="3" fill="#BFD38A" />
    </g>
  );
}

function RosePetal() {
  return (
    <g>
      <path d="M0 -26 C 18 -24 27 -6 19 10 C 11 24 -10 25 -18 11 C -26 -5 -16 -22 0 -26Z" fill="url(#bo-rose)" />
      <path d="M-12 -14 C -4 -20 10 -18 14 -8" fill="none" stroke="#FFD3DA" strokeOpacity=".6" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M-8 14 C 0 18 8 16 12 10" fill="none" stroke="#4A0A20" strokeOpacity=".35" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Leaf({ dark = false }: { dark?: boolean }) {
  return (
    <g>
      <path
        d={dark ? "M0 -28 C 21 -19 21 14 0 30 C -21 14 -21 -19 0 -28Z" : "M0 -32 C 13 -19 13 15 0 32 C -13 15 -13 -19 0 -32Z"}
        fill={dark ? "url(#bo-leaf-dark)" : "url(#bo-leaf)"}
      />
      <path d="M0 -30 L0 30" stroke="#E6EFC8" strokeOpacity=".45" strokeWidth=".9" />
      <path d={veins(5, 26)} stroke="#E6EFC8" strokeOpacity=".28" strokeWidth=".6" fill="none" />
    </g>
  );
}

function Vetiver() {
  return (
    <g fill="none" strokeLinecap="round" stroke="url(#bo-leaf)">
      <path d="M0 30 C 2 8 -2 -10 -9 -32" strokeWidth="2.6" />
      <path d="M3 30 C 6 10 10 -8 18 -26" strokeWidth="2.2" />
      <path d="M-3 30 C -8 14 -16 0 -26 -14" strokeWidth="2" />
      <path d="M1 30 C 2 14 4 0 4 -20" strokeWidth="1.6" stroke="#C9D69A" strokeOpacity=".6" />
    </g>
  );
}

function Wood({ fill }: { fill: string }) {
  return (
    <g>
      <path d="M-32 -6 L22 -11 L33 -3 L25 7 L-29 6 L-34 0Z" fill={fill} />
      <path d="M-26 -2 C -10 -4 6 -5 24 -5 M-24 3 C -6 1 10 0 26 2" fill="none" stroke="#2A140A" strokeOpacity=".3" strokeWidth=".8" />
      <path d="M-30 -5 L22 -10" stroke="#FFFFFF" strokeOpacity=".25" strokeWidth=".7" />
    </g>
  );
}

function Clove() {
  return (
    <g>
      <path d="M-2.4 -6 L2.4 -6 L1.3 30 L-1.3 30Z" fill="url(#bo-clove)" />
      {[-48, -16, 16, 48].map((a) => (
        <ellipse key={a} transform={`rotate(${a}) translate(0 -9)`} rx="3" ry="6" fill="#7A3E20" />
      ))}
      <circle cy="-13" r="5.5" fill="url(#bo-seed)" />
      <circle cx="-1.5" cy="-15" r="1.4" fill="#FFFFFF" opacity=".25" />
    </g>
  );
}

function Spice() {
  return (
    <g>
      {[
        [-9, -4, 6],
        [6, -8, 5],
        [3, 7, 5.5],
        [-6, 10, 4],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="url(#bo-seed)" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#FFFFFF" opacity=".25" />
        </g>
      ))}
    </g>
  );
}

function Amber() {
  return (
    <g>
      <path d="M0 -26 L17 -11 L13 14 L-6 24 L-19 7 L-15 -15Z" fill="url(#bo-amber)" opacity=".95" />
      <path d="M0 -26 L-2 -2 L17 -11 M-2 -2 L13 14 M-2 -2 L-19 7 M-2 -2 L-15 -15" fill="none" stroke="#FFF1C8" strokeOpacity=".4" strokeWidth=".7" />
      <path d="M-13 -13 L0 -24 L-2 -6Z" fill="#FFFFFF" opacity=".28" />
    </g>
  );
}

function Vanilla() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M-36 10 C -12 -2 12 -6 36 -4" stroke="url(#bo-pod)" strokeWidth="5" />
      <path d="M-30 18 C -8 10 14 8 32 12" stroke="url(#bo-pod)" strokeWidth="4" />
      <path d="M-30 7 C -10 -3 10 -6 30 -5" stroke="#B88A5A" strokeOpacity=".45" strokeWidth=".8" />
    </g>
  );
}

function Cocoa() {
  return (
    <g>
      <ellipse rx="16" ry="10" transform="rotate(-20)" fill="url(#bo-cocoa)" />
      <path d="M-12 4 C -4 -2 4 -4 12 -8" transform="rotate(-6)" fill="none" stroke="#2A1206" strokeOpacity=".55" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="-5" cy="-5" rx="5" ry="2" transform="rotate(-20)" fill="#FFFFFF" opacity=".18" />
    </g>
  );
}

function Saffron() {
  return (
    <g fill="none" strokeLinecap="round" stroke="url(#bo-saffron)">
      <path d="M0 26 C 0 8 -4 -8 -12 -26" strokeWidth="1.8" />
      <path d="M2 26 C 4 8 8 -10 10 -28" strokeWidth="1.8" />
      <path d="M1 26 C 2 6 0 -10 -1 -30" strokeWidth="1.6" />
      <path d="M-15 -30 l6 3 M7 -32 l6 3 M-4 -34 l6 2" stroke="#C8241A" strokeWidth="3" />
    </g>
  );
}

function Musk() {
  return (
    <g>
      <circle r="18" fill="#FFFFFF" opacity=".07" />
      {[
        [-6, -4, 8],
        [8, 3, 6],
        [-1, 11, 4.5],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="url(#bo-pearl)" />
          <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.28} fill="#FFFFFF" opacity=".8" />
        </g>
      ))}
    </g>
  );
}

const BY_NOTE: Record<string, () => React.ReactElement> = {
  jasmine: () => <Jasmine />,
  neroli: () => <Neroli />,
  rose: () => <RosePetal />,
  "green tea": () => <Leaf />,
  patchouli: () => <Leaf dark />,
  vetiver: () => <Vetiver />,
  woods: () => <Wood fill="url(#bo-cedar)" />,
  cedarwood: () => <Wood fill="url(#bo-cedar)" />,
  sandalwood: () => <Wood fill="url(#bo-sandal)" />,
  "dry woods": () => <Wood fill="url(#bo-drywood)" />,
  clove: () => <Clove />,
  spice: () => <Spice />,
  amber: () => <Amber />,
  vanilla: () => <Vanilla />,
  cocoa: () => <Cocoa />,
  saffron: () => <Saffron />,
  musk: () => <Musk />,
  "white musk": () => <Musk />,
};

/** Draw one ingredient by its note name (as written in the fragrance data). */
export function Botanical({ note }: { note: string }) {
  const draw = BY_NOTE[note.trim().toLowerCase()];
  return draw ? draw() : null;
}

/** The ingredient list for a blend: the lead fragrance first, then its notes. */
export function ingredientsOf(fragrance: string, notes: string) {
  return [fragrance, ...notes.split("·").map((n) => n.trim())].filter((n) => BY_NOTE[n.toLowerCase()]);
}
