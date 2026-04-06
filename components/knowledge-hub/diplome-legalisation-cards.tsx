import { BilingualRow, C } from "./knowledge-hub-shared"
import { LEGALISATION_DIPLOME_BLOCKS } from "./legalisation-reference-data"

export function DiplomeLegalisationCards() {
  return (
    <div className="space-y-4">
      {LEGALISATION_DIPLOME_BLOCKS.map((block, i) => {
        const bg = i % 2 === 0 ? C.lightGreen : C.lightBlue
        return (
          <div
            key={i}
            className="rounded-xl border border-border/60 p-5 shadow-sm"
            style={{ backgroundColor: bg }}
          >
            <BilingualRow
              fr={<span className="font-bold" style={{ color: C.navy }}>{block.frTitle}</span>}
              ar={<span className="font-bold" style={{ color: C.navy }}>{block.arTitle}</span>}
            />
            <div className="mt-3 space-y-1">
              <BilingualRow
                fr={<span className="font-medium" style={{ color: C.green }}>{block.frMin}</span>}
                ar={<span className="font-medium" style={{ color: C.green }}>{block.arMin}</span>}
              />
            </div>
            {block.note ? (
              <p className="mt-3 border-t border-border/50 pt-3 text-sm italic leading-relaxed text-[#1a2b4b]">
                {block.note}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
