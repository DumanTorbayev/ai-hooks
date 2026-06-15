import type { PatternPreviewType } from "@/content/home";

type PatternPreviewProps = {
  type: PatternPreviewType;
};

export function PatternPreview({ type }: PatternPreviewProps) {
  if (type === "stop") {
    return (
      <div className="pat-preview center">
        <div className="mini-stream">
          Generating response<span className="cur" />
        </div>
        <span className="mini-btn">■ Stop generating</span>
      </div>
    );
  }

  if (type === "timeline") {
    return (
      <div className="pat-preview">
        <div className="mini-tl">
          <div className="step done">
            <span className="nd" />
            <span className="lab">planSearch</span>
            <span className="ms">120ms</span>
          </div>
          <div className="step done">
            <span className="nd" />
            <span className="lab">vectorSearch</span>
            <span className="ms">88ms</span>
          </div>
          <div className="step">
            <span className="nd" />
            <span className="lab">synthesize...</span>
            <span className="ms">·</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "file") {
    return (
      <div className="pat-preview center">
        <div className="mini-upload">Drop files or paste</div>
        <div className="mini-file">
          report.pdf <span className="bar"><i /></span> 72%
        </div>
      </div>
    );
  }

  if (type === "voice") {
    return (
      <div className="pat-preview center">
        <div className="mini-voice">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="mini-stream muted">listening · transcribing...</div>
      </div>
    );
  }

  if (type === "cite") {
    return (
      <div className="pat-preview center">
        <div className="mini-cite">
          The index rebalanced in Q1 <sup>[1]</sup>, lifting small-cap weight{" "}
          <sup>[2]</sup>.
          <div className="src">[1] q1-report.pdf · p.4 · [2] rules.md</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pat-preview">
      <div className="mini-bubble">Explain RAG in one line.</div>
      <div className="mini-bubble bot">
        Retrieval pulls context, the model<span className="cur" />
      </div>
    </div>
  );
}
