import { useId } from "react";
import "./celestial.css";

const stars = Array.from({ length: 54 }, (_, index) => ({
  x: ((index * 173 + 71) % 997) / 9.97,
  y: ((index * 283 + 139) % 991) / 9.91,
  size: index % 11 === 0 ? 2 : index % 3 === 0 ? 1.5 : 1,
  delay: -(index % 13),
  duration: 5 + (index % 7),
}));

export function Starfield() {
  return (
    <div className="starfield-background" aria-hidden="true">
      {stars.map((star, index) => (
        <span
          className={`starfield-star${index % 11 === 0 ? " starfield-star-bright" : ""}`}
          key={index}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CelestialMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`celestial-mark ${className}`}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M23.6 24.1a12.3 12.3 0 0 1-16.7-17A11.6 11.6 0 1 0 23.6 24.1Z"
        fill="currentColor"
      />
      <path
        d="m22 4 1.2 4.3 4.3 1.2-4.3 1.2L22 15l-1.2-4.3-4.3-1.2 4.3-1.2L22 4Z"
        fill="currentColor"
      />
      <circle cx="28" cy="19" r="1" fill="currentColor" opacity=".55" />
    </svg>
  );
}

function ChartStar({
  x,
  y,
  size = 6,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${-size} Q1 -1 ${size} 0 Q1 1 0 ${size} Q-1 1 ${-size} 0 Q-1 -1 0 ${-size}Z`}
        fill="#d3d4b5"
      />
      <circle r="1.5" fill="#f3eee3" />
    </g>
  );
}

export function MoonIllustration({ className = "" }: { className?: string }) {
  const uniqueId = useId().replace(/:/g, "");
  const id = (name: string) => `${uniqueId}-${name}`;

  return (
    <div className={`celestial-illustration ${className}`} aria-hidden="true">
      <svg className="celestial-chart" viewBox="0 0 400 400" fill="none">
        <defs>
          <radialGradient id={id("aura")}>
            <stop offset="0" stopColor="#c0c598" stopOpacity=".11" />
            <stop offset=".55" stopColor="#9ea982" stopOpacity=".035" />
            <stop offset="1" stopColor="#9ea982" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("moon")} cx=".31" cy=".26" r=".85">
            <stop offset="0" stopColor="#eee8cf" />
            <stop offset=".35" stopColor="#cccdb1" />
            <stop offset=".68" stopColor="#9da88b" />
            <stop offset=".91" stopColor="#5b6c5d" />
            <stop offset="1" stopColor="#354a40" />
          </radialGradient>
          <radialGradient id={id("crater")} cx=".65" cy=".75" r=".8">
            <stop offset="0" stopColor="#c4c7a5" stopOpacity="0" />
            <stop offset=".55" stopColor="#627660" stopOpacity=".15" />
            <stop offset=".84" stopColor="#4d604e" stopOpacity=".28" />
            <stop offset="1" stopColor="#e2dfc1" stopOpacity=".28" />
          </radialGradient>
          <radialGradient id={id("shadow")} cx=".85" cy=".62" r=".88">
            <stop offset="0" stopColor="#11251e" stopOpacity=".45" />
            <stop offset=".52" stopColor="#172b23" stopOpacity=".23" />
            <stop offset="1" stopColor="#243a2d" stopOpacity="0" />
          </radialGradient>
          <clipPath id={id("moonclip")}>
            <circle cx="202" cy="196" r="72" />
          </clipPath>
          <filter id={id("texture")} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".17"
              numOctaves="4"
              seed="12"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope=".26" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>

        <circle cx="202" cy="196" r="177" fill={`url(#${id("aura")})`} />

        <g className="celestial-chart-lines" stroke="#b6c09b" strokeWidth=".65">
          <circle cx="202" cy="196" r="112" opacity=".13" />
          <circle
            cx="202"
            cy="196"
            r="147"
            opacity=".13"
            strokeDasharray="1 8"
          />
          <path d="M202 30v28m0 276v28M36 196h28m276 0h28" opacity=".19" />
          <ellipse
            cx="202"
            cy="196"
            rx="177"
            ry="64"
            transform="rotate(-29 202 196)"
            opacity=".4"
          />
          <ellipse
            cx="202"
            cy="196"
            rx="157"
            ry="107"
            transform="rotate(36 202 196)"
            opacity=".22"
          />
          <ellipse
            cx="202"
            cy="196"
            rx="94"
            ry="170"
            transform="rotate(-33 202 196)"
            opacity=".16"
          />
          <path
            d="m82 283 34 31 44-2M278 80l28 24 29 7M288 286l30-8 19 21 25-7"
            opacity=".26"
          />
          <path
            d="M80 99v-7m-3 3h6M315 195v-7m-3 3h6M141 56v-5m-2.5 2.5h5"
            opacity=".4"
          />
        </g>

        <g className="celestial-orbit-motion">
          <circle
            cx="202"
            cy="196"
            r="147"
            stroke="#c8cbaa"
            strokeWidth=".6"
            opacity=".13"
            strokeDasharray="31 892"
          />
          <circle cx="202" cy="49" r="2.4" fill="#c8cbaa" opacity=".7" />
          <circle
            cx="202"
            cy="49"
            r="6"
            stroke="#c8cbaa"
            strokeWidth=".5"
            opacity=".25"
          />
        </g>

        <g clipPath={`url(#${id("moonclip")})`}>
          <circle cx="202" cy="196" r="72" fill={`url(#${id("moon")})`} />
          <g fill="#586e57" opacity=".14">
            <path d="M152 162c7-21 27-27 37-17 10 9 4 17 10 26 5 8 22 1 22 17 0 13-17 6-20 17-2 9-15 15-27 7-12-8-4-20-14-28-8-7-13-9-8-22Z" />
            <path d="M239 180c-9 0-11 12-5 18 12 10-8 19-5 28 4 14 22 13 30-3l10-31-30-12Z" />
            <path d="M177 224c-13-2-17 10-10 18s21 7 23-1-3-15-13-17Z" />
          </g>
          <g fill={`url(#${id("crater")})`}>
            <circle cx="178" cy="160" r="14" />
            <circle cx="159" cy="184" r="10" />
            <circle cx="180" cy="205" r="18" />
            <circle cx="212" cy="151" r="10" />
            <circle cx="225" cy="171" r="8" />
            <circle cx="227" cy="210" r="20" />
            <circle cx="204" cy="241" r="12" />
            <circle cx="157" cy="218" r="7" />
            <circle cx="190" cy="182" r="6" />
            <circle cx="218" cy="190" r="4" />
            <circle cx="188" cy="250" r="5" />
            <circle cx="244" cy="166" r="6" />
            <circle cx="250" cy="237" r="9" />
            <circle cx="172" cy="237" r="5" />
          </g>
          <circle
            cx="202"
            cy="196"
            r="72"
            fill="#a7b192"
            filter={`url(#${id("texture")})`}
            opacity=".34"
          />
          <circle cx="202" cy="196" r="72" fill={`url(#${id("shadow")})`} />
          <path
            d="M150 149c-14 15-20 39-17 58"
            stroke="#eee7ca"
            strokeWidth="1"
            opacity=".3"
          />
        </g>
        <circle
          cx="202"
          cy="196"
          r="72"
          stroke="#d5d6b7"
          strokeWidth=".5"
          opacity=".27"
        />

        <g fill="#c8cdaa">
          <circle cx="83" cy="283" r="2" opacity=".65" />
          <circle cx="116" cy="314" r="1.4" opacity=".45" />
          <circle cx="160" cy="312" r="1.5" opacity=".45" />
          <circle cx="278" cy="80" r="1.7" opacity=".55" />
          <circle cx="306" cy="104" r="1.4" opacity=".35" />
          <circle cx="335" cy="111" r="2" opacity=".55" />
          <circle cx="288" cy="286" r="1.4" opacity=".4" />
          <circle cx="318" cy="278" r="1.5" opacity=".5" />
          <circle cx="337" cy="299" r="1.4" opacity=".4" />
          <circle cx="362" cy="292" r="1" opacity=".4" />
          <circle cx="65" cy="222" r="1.2" opacity=".65" />
          <circle cx="283" cy="324" r="1" opacity=".5" />
        </g>
        <g className="celestial-chart-sparkle">
          <ChartStar x={96} y={122} size={5} />
        </g>
        <g className="celestial-chart-sparkle celestial-chart-sparkle-late">
          <ChartStar x={306} y={240} size={7} />
        </g>
        <ChartStar x={256} y={62} size={3} />
        <ChartStar x={148} y={330} size={3} />

        <g
          fill="#a8b391"
          fontFamily="Arial, sans-serif"
          fontSize="6"
          letterSpacing="2.1"
          opacity=".44"
        >
          <text x="197" y="26">
            N
          </text>
          <text x="373" y="199">
            E
          </text>
          <text x="198" y="376">
            S
          </text>
          <text x="23" y="199">
            W
          </text>
        </g>
      </svg>
    </div>
  );
}
