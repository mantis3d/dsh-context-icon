/**
 * Host half of the context-title bundle.
 *
 * Every value this plugin shows is already published by the Host: the
 * `contextPressure` and `contextBreakdown` session projections (owned by
 * `@deepseek-ai/dsh-token-meter`) reach the Client through the session list
 * snapshot. The Host half therefore registers nothing; the Client module owns
 * the rendering.
 */
export function apply() {}
