type ResearchArtKind = "network" | "flow" | "cad" | "notes" | "neurons" | "loops";

const neuronCenters = [{ x: 166, y: 157 }, { x: 310, y: 112 }, { x: 339, y: 222 }];
const neuronBranches = neuronCenters.map((center, index) => {
  const paths: string[] = [];
  let step = index * 17;
  function branch(x: number, y: number, angle: number, length: number, depth: number) {
    step += 1;
    const turn = Math.sin(step * 2.34) * 0.24;
    const nextX = x + Math.cos(angle + turn) * length;
    const nextY = y + Math.sin(angle + turn) * length;
    paths.push(`M${x.toFixed(2)} ${y.toFixed(2)}Q${(x + Math.cos(angle) * length * 0.4).toFixed(2)} ${(y + Math.sin(angle) * length * 0.4).toFixed(2)} ${nextX.toFixed(2)} ${nextY.toFixed(2)}`);
    if (depth > 0) {
      branch(nextX, nextY, angle + turn - 0.42, length * 0.7, depth - 1);
      branch(nextX, nextY, angle + turn + 0.45, length * 0.66, depth - 1);
    }
  }
  for (let arm = 0; arm < 6; arm += 1) branch(center.x, center.y, arm * Math.PI / 3 + index * 0.28, index === 0 ? 28 : 19, 3);
  return paths;
});

export default function ResearchArt({
  kind = "network",
  label,
  className,
}: {
  kind?: ResearchArtKind;
  label?: string;
  className?: string;
}) {
  const ink = "var(--ink, #292d27)";
  const accent = "var(--accent, #b65b3c)";
  const olive = "var(--olive, #6f7659)";
  const paper = "var(--paper, #f4f0e7)";
  return (
    <svg
      viewBox="0 0 520 300"
      fill="none"
      className={["research-art", className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {label ? <title>{label}</title> : null}
      <g stroke={olive} strokeWidth="0.65" opacity="0.35">
        <path d="M28 44h13M34.5 37.5v13M479 249h13M485.5 242.5v13M31 264h61M31 260v8M92 260v8" />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${151 + i * 24} 35v${i % 3 === 0 ? 6 : 3}`} />)}
      </g>

      {kind === "network" && (
        <>
          <g stroke={ink} strokeWidth="0.85" opacity="0.45">
            {[76, 125, 174, 223].flatMap((y, i) => [75, 125, 175, 225].map((nextY, j) => <path key={`a${i}-${j}`} d={`M114 ${y}C164 ${y} 161 ${nextY} 209 ${nextY}`} />))}
            {[75, 125, 175, 225].flatMap((y, i) => [100, 150, 200].map((nextY, j) => <path key={`b${i}-${j}`} d={`M219 ${y}C260 ${y} 268 ${nextY} 312 ${nextY}`} />))}
            {[100, 150, 200].flatMap((y, i) => [125, 175].map((nextY, j) => <path key={`c${i}-${j}`} d={`M322 ${y}C360 ${y} 378 ${nextY} 411 ${nextY}`} />))}
          </g>
          <path d="M114 174C164 174 161 125 209 125M219 125C260 125 268 150 312 150M322 150C360 150 378 125 411 125" stroke={accent} strokeWidth="2" />
          {[{ x: 109, ys: [76, 125, 174, 223] }, { x: 214, ys: [75, 125, 175, 225] }, { x: 317, ys: [100, 150, 200] }, { x: 416, ys: [125, 175] }].map((layer, layerIndex) => (
            <g key={layer.x} stroke={layerIndex === 2 ? accent : ink} fill={paper}>
              {layer.ys.map((y) => <circle key={y} cx={layer.x} cy={y} r={layerIndex === 2 ? 7 : 5.5} strokeWidth="1.1" />)}
            </g>
          ))}
          <g stroke={olive} opacity="0.55"><path d="M91 56h36M91 56v190h36M433 107h13v85h-13" strokeWidth="0.7" /></g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.6"><text x="95" y="267">REPRESENTATION</text><text x="310" y="267">CONNECTION</text></g>
          <circle cx="317" cy="150" r="17" stroke={accent} strokeDasharray="2 5" opacity="0.6" />
        </>
      )}

      {kind === "flow" && (
        <>
          <g stroke={ink} strokeWidth="1.1">
            <path d="M83 80h91v132H83zM95 93h67M95 103h45M95 184h66M95 194h46" />
            <path d="M95 151h12l7-18 10 34 12-46 11 30h16" stroke={accent} strokeWidth="1.6" />
            <path d="M220 103h99v86h-99zM230 113h79v66h-79z" />
            <path d="M248 128h44v36h-44zM241 121v50M299 121v50" stroke={olive} />
            {[237, 249, 261, 273, 285, 297].map((x) => <path key={x} d={`M${x} 96v7M${x} 189v7`} />)}
            {[119, 132, 145, 158, 171].map((y) => <path key={y} d={`M213 ${y}h7M319 ${y}h7`} />)}
            <path d="M371 88h66v116h-66zM382 103h43M382 113h29M382 176h43M382 187h31" />
            <path d="m386 143 10 10 18-22" stroke={accent} strokeWidth="2" />
          </g>
          <g stroke={olive} strokeWidth="1"><path d="M174 147h39m-6-4 6 4-6 4M326 147h45m-6-4 6 4-6 4" /><path d="M269 88V67h135v14M128 219v19h141v-37" strokeDasharray="3 4" /></g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.4"><text x="88" y="257">OBSERVE</text><text x="243" y="257">REASON</text><text x="378" y="257">VERIFY</text></g>
          <circle cx="269" cy="146" r="9" stroke={accent} strokeWidth="0.8" />
          <path d="M264 146h10M269 141v10" stroke={accent} strokeWidth="0.7" />
        </>
      )}

      {kind === "cad" && (
        <>
          <g stroke={olive} strokeWidth="0.6" opacity="0.28">
            {Array.from({ length: 9 }, (_, i) => <path key={`g${i}`} d={`M${80 + i * 24} 241l160-92M${120 + i * 24} 264l160-92`} />)}
            {Array.from({ length: 8 }, (_, i) => <path key={`h${i}`} d={`M${80 + i * 24} 241l184 23M${104 + i * 24} 227l184 23`} />)}
          </g>
          <g stroke={ink} strokeWidth="1.1" strokeLinejoin="round">
            <path d="m154 213 107-62 108 62-108 62-107-62Z" fill={paper} />
            <path d="M154 213v-13l107-62 108 62v13M154 200l107 62 108-62M261 262v13" />
            <path d="M200 149v44c0 18 122 18 122 0v-44" fill={paper} />
            <ellipse cx="261" cy="149" rx="61" ry="20" fill={paper} />
            <ellipse cx="261" cy="149" rx="37" ry="12" />
            <path d="M224 149v29c9 7 65 7 74 0v-29" strokeDasharray="3 3" opacity="0.5" />
            <path d="M220 83v32c0 14 82 14 82 0V83" fill={paper} />
            <ellipse cx="261" cy="83" rx="41" ry="14" fill={paper} />
            <ellipse cx="261" cy="83" rx="17" ry="6" />
            <path d="M220 106c0 14 82 14 82 0M220 110c0 14 82 14 82 0" opacity="0.5" strokeWidth="0.65" />
          </g>
          <g stroke={accent} strokeWidth="0.9">
            <path d="M261 49v10M261 125v13M261 215v20" strokeDasharray="3 3" />
            <path d="M335 83h34M335 193h34M357 83v110m-4-104 4-6 4 6m-8 98 4 6 4-6M204 69h-33M185 69v46M171 115h33" />
            <path d="M201 162l-39-20h-37M323 219l55 31h34" />
          </g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.3"><text x="101" y="135">ASSEMBLY</text><text x="375" y="265">CONSTRAINTS</text><text x="368" y="142">h</text></g>
        </>
      )}

      {kind === "neurons" && (
        <>
          <g stroke={olive} strokeWidth="1"><path d="M166 157C230 193 247 119 310 112C287 158 353 172 339 222C287 251 223 216 166 157" /><path d="M219 190c-7 3-10 11-16 12M250 202c3 6 9 11 15 11" opacity="0.5" /></g>
          {neuronCenters.map((center, index) => <g key={index} stroke={index === 0 ? accent : ink} strokeLinecap="round"><g strokeWidth="0.75" opacity="0.7">{neuronBranches[index].map((d, branchIndex) => <path key={branchIndex} d={d} />)}</g><path transform={`translate(${center.x} ${center.y})`} d="M-7-3-2-8 4-5 9 0 5 5 0 8-5 4-7-3Z" fill={paper} strokeWidth="1.1" /><circle cx={center.x} cy={center.y} r="2.5" fill={paper} strokeWidth="0.8" /></g>)}
          <g stroke={olive} strokeWidth="0.6" opacity="0.6"><path d="M70 88c77-59 230-58 306 7" strokeDasharray="2 5" /><path d="m371 89 5 6-7-1M376 214h43v-36" /></g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.3"><text x="79" y="66">STRUCTURE → CONNECTION</text><text x="391" y="168">TRACE</text></g>
        </>
      )}

      {kind === "loops" && (
        <>
          <g stroke={ink} strokeWidth="1.1" strokeLinejoin="round">
            {[112, 223, 334].map((x, i) => <g key={x}><path d={`M${x} 114h74v75h-74z`} fill={paper} /><path d={`M${x + 6} 108h74v75M${x + 74} 114l6-6M${x + 74} 189l6-6`} /><path d={`M${x + 17} 135h40M${x + 17} 147h40M${x + 17} 159h28`} opacity="0.45" /><circle cx={x + 60} cy="176" r="2.5" stroke={accent} /><text x={x + 17} y="211" fill={olive} stroke="none" fontFamily="monospace" fontSize="9">{`t = ${i + 1}`}</text></g>)}
            <path d="M186 151h37m-6-4 6 4-6 4M297 151h37m-6-4 6 4-6 4M77 151h35m-6-4 6 4-6 4M408 151h35m-6-4 6 4-6 4" stroke={olive} />
            <path d="M371 103V72H149v31m-4-6 4 6 4-6" stroke={accent} />
            <path d="M149 222v16h222v-16" stroke={olive} strokeDasharray="3 4" strokeWidth="0.75" />
          </g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.3"><text x="208" y="61">SHARED PARAMETERS</text><text x="193" y="257">ITERATE / REFINE / REPEAT</text></g>
          <circle cx="259" cy="72" r="3" fill={paper} stroke={accent} />
        </>
      )}

      {kind === "notes" && (
        <>
          <g stroke={ink} strokeWidth="1.1" strokeLinejoin="round">
            <path d="m110 93 133 17 148-40 20 140-146 47-132-24-23-140Z" fill={paper} />
            <path d="m110 93 133 17 148-40-2-10-148 40-132-17 1 10ZM243 110l22 147M132 224l132 23 146-46M133 229l132 24 145-47" />
            <path d="m130 111 94 13M133 125l94 13M136 139l78 11M147 196l92 14M149 208l68 10" opacity="0.5" strokeWidth="0.7" />
            <path d="m265 117 105-28M268 130l104-28M277 190l103-29M279 202l78-23M281 214l100-29" opacity="0.5" strokeWidth="0.7" />
            <path d="m149 168 16-9 15 17 19-13 26 17" stroke={accent} strokeWidth="1.5" />
            <circle cx="319" cy="146" r="17" stroke={olive} />
            <ellipse cx="319" cy="146" rx="28" ry="8" transform="rotate(-26 319 146)" stroke={olive} />
            <path d="m319 117 0 58M290 146h57" stroke={olive} opacity="0.5" strokeWidth="0.6" />
          </g>
          <g stroke={accent} strokeWidth="1"><path d="m402 65 36 153 6 9 2-11-36-153-8 2ZM438 218l8-2M405 78l8-2" /><path d="m270 95 3 24 8-7 5 4-5-24" fill={accent} fillOpacity="0.25" /></g>
          <g fill={olive} fontFamily="monospace" fontSize="8" letterSpacing="1.5"><text x="78" y="58">THINKING, IN PROGRESS</text><text x="343" y="272">NOTES &amp; QUESTIONS</text></g>
        </>
      )}
    </svg>
  );
}
