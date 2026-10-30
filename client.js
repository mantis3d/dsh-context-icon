/**
 * Client half of `@mantis3d/dsh-context-title`.
 *
 * Fills four seats with the same reading:
 *   • `conversation.session.header.actions` / `.utilities` — the session badge
 *     (ring and/or percentage plus a hover card of the token figures), placed
 *     by the user's `seat` setting.
 *   • `sidebar.session.row.leading` — a compact mark in the row's 16px cell
 *     (the owner only mounts it on an idle, non-archived row).
 *   • `sidebar.session.row.hover` — the detail line inside the row's hover card.
 *   • `settings.section` — the options page in Settings.
 *
 * The numbers are not computed here. `@deepseek-ai/dsh-token-meter` publishes
 * the `contextPressure` (capacity) and `contextBreakdown` (composition)
 * projections, and the Client session list snapshot carries them for every
 * listed Session, so the plugin is a pure reader of the same figures the
 * composer's context ring shows.
 *
 * Preferences live in `localStorage` (the same way the installed community
 * plugins keep their display options), so they survive reloads and restarts on
 * this machine and browser.
 */
window.__ModuleLoader__.load({
  id: '@mantis3d/dsh-context-title',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'context-title'
    const STYLE_ID = '@mantis3d/dsh-context-title/styles'
    const CONFIG_KEY = 'dsh-context-title:config'

    // Dictionaries are flat, dotted-key maps (see @deepseek-ai/dsh-client-locale):
    // `t('badge.aria')` resolves the literal key and replaces `{name}` holes.
    const zh = {
      'badge.aria': '上下文已用 {percent}',
      'tip.title': '上下文',
      'tip.system': '系统提示词',
      'tip.tools': '工具定义',
      'tip.messages': '对话消息',
      'hover.label': '上下文',
      'nav': '上下文用量',
      'page.title': '会话标题上下文用量',
      'page.desc': '选择标题旁与侧栏行显示上下文占用的方式。修改立即生效，保存在本机浏览器。',
      'page.preview': '预览',
      'legend.title': '四档配色',
      'group.form': '标题旁显示什么',
      'group.seat': '放在哪里',
      'group.rail': '侧栏会话行行首',
      'group.hover': '悬浮卡',
      'group.visibility': '显示规则',
      'group.tone': '配色',
      'group.precision': '百分比精度',
      'opt.form.ringPercent': '圆环 + 百分比',
      'opt.form.percent': '仅百分比',
      'opt.form.ring': '仅圆环',
      'opt.form.fraction': 'token 分数',
      'opt.form.mixed': '百分比 + 分数',
      'opt.form.bar': '横条 + 百分比',
      'opt.seat.title': '标题左侧',
      'opt.seat.utilities': '右上工具区',
      'opt.rail.ring': '小圆环',
      'opt.rail.bar': '竖条',
      'opt.rail.dot': '色点',
      'opt.rail.none': '不显示',
      'opt.hover.detail': '显示构成明细',
      'opt.hover.line': '只显示一行摘要',
      'opt.vis.always': '始终显示',
      'opt.vis.50': '≥50% 才显示',
      'opt.vis.80': '≥80% 才显示',
      'opt.vis.dim': '低占用时弱化',
      'opt.tone.four': '四档（绿/蓝/橙/红）',
      'opt.tone.two': '双档（蓝/红，≥90% 变红）',
      'opt.tone.neutral': '中性（不变色）',
      'opt.dec.int': '整数',
      'opt.dec.one': '一位小数',
    }
    const en = {
      'badge.aria': 'Context used {percent}',
      'tip.title': 'Context',
      'tip.system': 'System prompt',
      'tip.tools': 'Tool definitions',
      'tip.messages': 'Messages',
      'hover.label': 'Context',
      'nav': 'Context usage',
      'page.title': 'Session title context usage',
      'page.desc': 'Choose how context occupancy is shown beside the title and on sidebar rows. Changes apply immediately and are stored in this browser.',
      'page.preview': 'Preview',
      'legend.title': 'Tiers',
      'group.form': 'What the badge shows',
      'group.seat': 'Where it sits',
      'group.rail': 'Sidebar row mark',
      'group.hover': 'Hover card',
      'group.visibility': 'Visibility',
      'group.tone': 'Colours',
      'group.precision': 'Percentage precision',
      'opt.form.ringPercent': 'Ring + percent',
      'opt.form.percent': 'Percent only',
      'opt.form.ring': 'Ring only',
      'opt.form.fraction': 'Token fraction',
      'opt.form.mixed': 'Percent + fraction',
      'opt.form.bar': 'Bar + percent',
      'opt.seat.title': 'Left of the title',
      'opt.seat.utilities': 'Right utilities',
      'opt.rail.ring': 'Small ring',
      'opt.rail.bar': 'Vertical bar',
      'opt.rail.dot': 'Colour dot',
      'opt.rail.none': 'Hidden',
      'opt.hover.detail': 'With composition rows',
      'opt.hover.line': 'Summary line only',
      'opt.vis.always': 'Always',
      'opt.vis.50': 'Only at ≥50%',
      'opt.vis.80': 'Only at ≥80%',
      'opt.vis.dim': 'Dim when low',
      'opt.tone.four': 'Four tiers (green/blue/orange/red)',
      'opt.tone.two': 'Two tiers (blue, red at ≥90%)',
      'opt.tone.neutral': 'Neutral (no colour shift)',
      'opt.dec.int': 'Integer',
      'opt.dec.one': 'One decimal',
    }

    const CSS = [
      '.ct-badge{position:relative;display:inline-flex;align-items:center;gap:4px;flex:none;box-sizing:border-box;',
      'padding:1px 6px;border-radius:6px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;',
      'font-variant-numeric:tabular-nums;white-space:nowrap;cursor:default;outline:none}',
      '.ct-badge:hover,.ct-badge:focus-visible{background:var(--dsw-alias-bg-layer-2)}',
      '.ct-badge:focus-visible{box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2)}',
      '.ct-badge-ring{display:inline-flex;align-items:center;justify-content:center;flex:none}',
      '.ct-ring{display:block;overflow:visible}',
      '.ct-track{fill:none;stroke:var(--dsw-alias-border-l2)}',
      '.ct-fill{fill:none;stroke:var(--ct-color,var(--dsw-alias-brand-primary));stroke-linecap:round;',
      'transition:stroke-dasharray .3s ease}',
      '.ct-badge-text{color:var(--ct-color,var(--dsw-alias-label-secondary))}',
      '.ct-ok{--ct-color:var(--dsw-alias-state-success-primary,#15803d)}',
      '.ct-info{--ct-color:var(--dsw-alias-button-info-fill,#4176e6)}',
      '.ct-warn{--ct-color:var(--dsw-alias-state-warn-primary,#d97706)}',
      '.ct-error{--ct-color:var(--dsw-alias-state-error-primary,#d92d20)}',
      '.ct-dim{--ct-color:var(--dsw-alias-border-l2)}',
      '.ct-dim .ct-badge-text{color:var(--dsw-alias-label-secondary)}',
      '.ct-bar{display:inline-flex;align-items:center;flex:none;width:44px;height:4px;border-radius:2px;',
      'background:var(--dsw-alias-border-l2);overflow:hidden}',
      '.ct-bar-fill{display:block;height:100%;border-radius:2px;',
      'background:var(--ct-color,var(--dsw-alias-brand-primary));transition:width .3s ease}',
      '.ct-tip{position:absolute;top:calc(100% + 6px);left:0;z-index:80;display:none;flex-direction:column;gap:4px;',
      'box-sizing:border-box;min-width:196px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l1);',
      'border-radius:8px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-secondary);',
      'box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:12px;line-height:18px;font-weight:400;text-align:left;',
      'white-space:normal;pointer-events:none}',
      '.ct-badge:hover .ct-tip,.ct-badge:focus-visible .ct-tip{display:flex}',
      '.ct-tip-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;color:var(--dsw-alias-label-secondary)}',
      '.ct-tip-fig{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);font-weight:500}',
      '.ct-tip-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px;color:var(--dsw-alias-label-secondary)}',
      '.ct-tip-row b{font-weight:500;color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}',
      '.ct-hover{display:flex;align-items:baseline;justify-content:space-between;gap:12px;',
      'font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.ct-hover b{font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.ct-hover-stack{display:flex;flex-direction:column;gap:2px}',
      '.ct-hover-sub{font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}',
      '.ct-rail{display:inline-flex;align-items:center;justify-content:center;flex:none;width:16px;height:16px}',
      '.ct-rail-bar{display:flex;align-items:flex-end;width:3px;height:14px;border-radius:2px;',
      'background:var(--dsw-alias-border-l2);overflow:hidden}',
      '.ct-rail-bar-fill{display:block;width:100%;border-radius:2px;',
      'background:var(--ct-color,var(--dsw-alias-brand-primary))}',
      '.ct-rail-dot{display:block;width:6px;height:6px;border-radius:50%;',
      'background:var(--ct-color,var(--dsw-alias-brand-primary))}',
      '.ct-set{display:flex;flex-direction:column;gap:18px;max-width:640px;font-size:13px;',
      'color:var(--dsw-alias-label-primary)}',
      '.ct-set-title{font-size:14px;font-weight:600;line-height:20px}',
      '.ct-set-desc{margin-top:4px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.ct-set-group{display:flex;flex-direction:column;gap:8px}',
      '.ct-set-label{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.ct-set-choices{display:flex;flex-wrap:wrap;gap:6px}',
      '.ct-set-opt{appearance:none;border:1px solid var(--dsw-alias-border-l1);',
      'background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;',
      'font-size:12px;line-height:18px;padding:3px 10px;border-radius:999px;cursor:pointer}',
      '.ct-set-opt:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.ct-set-opt[aria-pressed="true"]{border-color:var(--dsw-alias-brand-primary);',
      'color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.ct-set-opt:focus-visible{outline:none;box-shadow:0 0 0 2px var(--dsw-alias-border-l2)}',
      '.ct-set-preview{display:flex;align-items:center;gap:8px;padding:10px 12px;',
      'border:1px dashed var(--dsw-alias-border-l1);border-radius:8px;',
      'color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.ct-set-preview-tag{font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.ct-legend{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:2px 0;',
      'font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}',
      '.ct-legend-item{display:inline-flex;align-items:center;gap:5px}',
      '.ct-legend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;',
      'background:var(--ct-color,var(--dsw-alias-border-l2))}',
    ].join('')

    // ---- preferences -------------------------------------------------------

    const DEFAULTS = {
      seat: 'title',
      form: 'ring-percent',
      rail: 'ring',
      hoverDetail: true,
      visibility: 'always',
      tone: 'four',
      decimals: 0,
    }

    function readConfig() {
      try {
        if (typeof localStorage === 'undefined') return { ...DEFAULTS }
        const raw = localStorage.getItem(CONFIG_KEY)
        if (raw === null) return { ...DEFAULTS }
        const parsed = JSON.parse(raw)
        if (parsed === null || typeof parsed !== 'object') return { ...DEFAULTS }
        return { ...DEFAULTS, ...parsed }
      } catch (error) {
        return { ...DEFAULTS }
      }
    }

    let config = readConfig()
    const configListeners = new Set()

    function getConfig() {
      return config
    }

    function subscribeConfig(listener) {
      configListeners.add(listener)
      return () => {
        configListeners.delete(listener)
      }
    }

    function updateConfig(patch) {
      config = { ...config, ...patch }
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
        }
      } catch (error) {
        // Private mode or a full quota: the in-memory value still applies.
      }
      for (const listener of configListeners) listener()
    }

    function useConfig() {
      return React.useSyncExternalStore(subscribeConfig, getConfig)
    }

    // ---- reading + formatting ---------------------------------------------

    /** Compact token count: 946, 12.3k, 1.2M. */
    function compactNumber(value) {
      if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
      const rounded = Math.round(value)
      if (rounded < 1000) return String(rounded)
      const scaled = (n) => (Math.abs(n) >= 100 ? String(Math.round(n)) : String(Math.round(n * 10) / 10))
      if (rounded < 1000000) return scaled(rounded / 1000) + 'k'
      return scaled(rounded / 1000000) + 'M'
    }

    /**
     * Read one Session's live occupancy from the projection snapshot.
     * @returns `{ percent, used, window, breakdown }`, or null while the Host
     *   has not reported both a numerator and a route capacity.
     */
    function readOccupancy(list, sessionId) {
      if (list === null || list === undefined || sessionId === undefined) return null
      const bySession = list.projectionsBySession
      if (bySession === null || bySession === undefined) return null
      const entry = bySession[sessionId]
      if (entry === null || entry === undefined) return null
      const values = entry.values
      if (values === null || values === undefined) return null
      const pressure = values.contextPressure
      if (pressure === null || pressure === undefined) return null
      const used = typeof pressure.projectedTokens === 'number' ? pressure.projectedTokens : pressure.pressureTokens
      const window = pressure.contextWindow
      if (typeof used !== 'number' || !Number.isFinite(used)) return null
      if (typeof window !== 'number' || !Number.isFinite(window) || window <= 0) return null
      const percent = Math.max(0, Math.min(100, (used / window) * 100))
      return { percent, used, window, breakdown: values.contextBreakdown }
    }

    /** Subscribe to the Client session list snapshot (live projections). */
    function useSessionList(list) {
      const subscribe = React.useCallback((callback) => list.subscribe(callback), [list])
      const getSnapshot = React.useCallback(() => list.getSnapshot(), [list])
      return React.useSyncExternalStore(subscribe, getSnapshot)
    }

    /** `42%` or `42.7%`. */
    function percentText(percent, decimals) {
      if (decimals === 1) return (Math.round(percent * 10) / 10).toFixed(1) + '%'
      return Math.round(percent) + '%'
    }

    /** `≈68k / 128k`. */
    function fractionText(info) {
      return '≈' + compactNumber(info.used) + ' / ' + compactNumber(info.window)
    }

    /** Tier class from the percentage and the chosen palette. */
    function toneClass(percent, cfg) {
      const dim = cfg.visibility === 'dim' && percent < 20
      if (dim) return ' ct-dim'
      if (cfg.tone === 'neutral') return ''
      if (cfg.tone === 'two') return percent >= 90 ? ' ct-error' : ' ct-info'
      if (percent >= 95) return ' ct-error'
      if (percent >= 80) return ' ct-warn'
      if (percent >= 50) return ' ct-info'
      return ' ct-ok'
    }

    /** Whether the visibility rule keeps this reading on screen. */
    function hiddenByRule(percent, cfg) {
      if (cfg.visibility === 'gte50') return percent < 50
      if (cfg.visibility === 'gte80') return percent < 80
      return false
    }

    /** Progress ring; the wrapper carries the tier class. */
    function Ring(props) {
      const size = props.size
      const stroke = props.stroke
      const radius = (size - stroke) / 2
      const circumference = 2 * Math.PI * radius
      const filled = (circumference * props.percent) / 100
      const center = size / 2
      return h(
        'svg',
        { className: 'ct-ring', viewBox: '0 0 ' + size + ' ' + size, width: size, height: size, 'aria-hidden': true },
        h('circle', { className: 'ct-track', cx: center, cy: center, r: radius, strokeWidth: stroke }),
        h('circle', {
          className: 'ct-fill',
          cx: center,
          cy: center,
          r: radius,
          strokeWidth: stroke,
          strokeDasharray: filled.toFixed(2) + ' ' + circumference.toFixed(2),
          transform: 'rotate(-90 ' + center + ' ' + center + ')',
        }),
      )
    }

    /** Composition figures from `contextBreakdown`, or null when absent. */
    function breakdownList(info) {
      const breakdown = info.breakdown
      if (breakdown === null || breakdown === undefined) return null
      const parts = [
        ['tip.system', breakdown.systemTokens],
        ['tip.tools', breakdown.toolsTokens],
        ['tip.messages', breakdown.messageTokens],
      ]
      let total = 0
      for (const [, tokens] of parts) if (typeof tokens === 'number') total += tokens
      if (total <= 0) return null
      return parts
    }

    /** Composition rows for the header hover card. */
    function breakdownRows(info, t) {
      const parts = breakdownList(info)
      if (parts === null) return []
      return parts.map(([key, tokens]) =>
        h(
          'span',
          { className: 'ct-tip-row', key },
          h('span', null, t(key)),
          h('b', null, '≈' + compactNumber(typeof tokens === 'number' ? tokens : 0)),
        ),
      )
    }

    /**
     * One header badge: ring and/or figure, the tone class, and a hover card
     * with the token figures (and composition rows when enabled).
     */
    function HeaderBadge(props) {
      const { info, cfg, t, size } = props
      const percent = info.percent
      const label = percentText(percent, cfg.decimals)
      const detail = cfg.hoverDetail ? breakdownRows(info, t) : []
      const children = []
      if (cfg.form === 'ring-percent' || cfg.form === 'ring') {
        children.push(h('span', { className: 'ct-badge-ring' }, h(Ring, { percent, size: size, stroke: 2 })))
      } else if (cfg.form === 'bar') {
        children.push(
          h('span', { className: 'ct-bar', 'aria-hidden': true }, h('span', { className: 'ct-bar-fill', style: { width: percent + '%' } })),
        )
      }
      if (cfg.form !== 'ring') {
        if (cfg.form === 'fraction') {
          children.push(h('span', { className: 'ct-badge-text' }, fractionText(info)))
        } else if (cfg.form === 'mixed') {
          children.push(
            h('span', { className: 'ct-badge-text' }, label + ' · ' + fractionText(info)),
          )
        } else {
          children.push(h('span', { className: 'ct-badge-text' }, label))
        }
      }
      children.push(
        h(
          'span',
          { className: 'ct-tip', role: 'tooltip' },
          h(
            'span',
            { className: 'ct-tip-head' },
            h('span', null, t('tip.title')),
            h('span', { className: 'ct-tip-fig' }, fractionText(info)),
          ),
          ...detail,
        ),
      )
      return h(
        'span',
        {
          className: 'ct-badge' + toneClass(percent, cfg),
          tabIndex: 0,
          'aria-label': t('badge.aria', { percent: label }),
        },
        ...children,
      )
    }

    /** Header seat component factory: renders only in the configured seat. */
    function makeHeaderSeat(seat, size) {
      return function HeaderSeat(props) {
        const { sessionId, list, t } = props
        const cfg = useConfig()
        const snapshot = useSessionList(list)
        const info = readOccupancy(snapshot, sessionId)
        if (info === null || cfg.seat !== seat) return null
        if (hiddenByRule(info.percent, cfg)) return null
        return h(HeaderBadge, { info, cfg, t, size })
      }
    }

    const HeaderTitleSeat = makeHeaderSeat('title', 14)
    const HeaderUtilitiesSeat = makeHeaderSeat('utilities', 14)

    /** Sidebar row's 16px leading cell: the configured mark. */
    function SidebarMark(props) {
      const { sessionId, list, t } = props
      const cfg = useConfig()
      const snapshot = useSessionList(list)
      const info = readOccupancy(snapshot, sessionId)
      if (info === null || cfg.rail === 'none') return null
      if (hiddenByRule(info.percent, cfg)) return null
      const label = t('badge.aria', { percent: percentText(info.percent, cfg.decimals) })
      const tone = toneClass(info.percent, cfg)
      const className = 'ct-rail' + tone
      let mark
      if (cfg.rail === 'bar') {
        mark = h(
          'span',
          { className: 'ct-rail-bar', 'aria-hidden': true },
          h('span', { className: 'ct-rail-bar-fill', style: { height: info.percent + '%' } }),
        )
      } else if (cfg.rail === 'dot') {
        mark = h('span', { className: 'ct-rail-dot', 'aria-hidden': true })
      } else {
        mark = h(Ring, { percent: info.percent, size: 12, stroke: 1.8 })
      }
      return h('span', { className: className, title: label, 'aria-label': label, role: 'img' }, mark)
    }

    /** Sidebar hover card: the percentage, both token figures, optional breakdown. */
    function SidebarHoverRow(props) {
      const { sessionId, list, t } = props
      const cfg = useConfig()
      const snapshot = useSessionList(list)
      const info = readOccupancy(snapshot, sessionId)
      if (info === null) return null
      const line = h(
        'span',
        { className: 'ct-hover' },
        h('span', null, t('hover.label')),
        h('b', null, percentText(info.percent, cfg.decimals) + ' · ' + fractionText(info)),
      )
      if (!cfg.hoverDetail) return line
      const parts = breakdownList(info)
      if (parts === null) return line
      return h(
        'span',
        { className: 'ct-hover-stack' },
        line,
        ...parts.map(([key, tokens]) =>
          h(
            'span',
            { className: 'ct-hover-sub', key },
            t(key) + ' ≈' + compactNumber(typeof tokens === 'number' ? tokens : 0),
          ),
        ),
      )
    }

    // ---- settings page -----------------------------------------------------

    /** One labelled group of exclusive pill choices. */
    function ChoiceGroup(props) {
      const { label, options, value, field } = props
      return h(
        'div',
        { className: 'ct-set-group' },
        h('div', { className: 'ct-set-label' }, label),
        h(
          'div',
          { className: 'ct-set-choices', role: 'group', 'aria-label': label },
          ...options.map((option) =>
            h(
              'button',
              {
                type: 'button',
                key: option.key,
                className: 'ct-set-opt',
                'aria-pressed': value === option.key,
                onClick: () => updateConfig({ [field]: option.key }),
              },
              option.label,
            ),
          ),
        ),
      )
    }

    function SettingsPanel(props) {
      const { t } = props
      const cfg = useConfig()
      const sample = { percent: 42.4, used: 54300, window: 128000, breakdown: null }
      return h(
        'div',
        { className: 'ct-set' },
        h(
          'div',
          null,
          h('div', { className: 'ct-set-title' }, t('page.title')),
          h('div', { className: 'ct-set-desc' }, t('page.desc')),
        ),
        h(
          'div',
          { className: 'ct-set-preview' },
          h('span', { className: 'ct-set-preview-tag' }, t('page.preview')),
          h(HeaderBadge, { info: sample, cfg: { ...cfg, visibility: 'always' }, t, size: 14 }),
        ),
        h(
          'div',
          { className: 'ct-legend' },
          h('span', { className: 'ct-set-preview-tag' }, t('legend.title')),
          ...[35, 65, 88, 97].map((percent) =>
            h(
              'span',
              { key: percent, className: 'ct-legend-item' },
              h('span', { className: 'ct-legend-dot' + toneClass(percent, { tone: 'four' }) }),
              percent + '%',
            ),
          ),
        ),
        h(ChoiceGroup, {
          label: t('group.form'),
          field: 'form',
          value: cfg.form,
          options: [
            { key: 'ring-percent', label: t('opt.form.ringPercent') },
            { key: 'percent', label: t('opt.form.percent') },
            { key: 'ring', label: t('opt.form.ring') },
            { key: 'fraction', label: t('opt.form.fraction') },
            { key: 'mixed', label: t('opt.form.mixed') },
            { key: 'bar', label: t('opt.form.bar') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.seat'),
          field: 'seat',
          value: cfg.seat,
          options: [
            { key: 'title', label: t('opt.seat.title') },
            { key: 'utilities', label: t('opt.seat.utilities') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.rail'),
          field: 'rail',
          value: cfg.rail,
          options: [
            { key: 'ring', label: t('opt.rail.ring') },
            { key: 'bar', label: t('opt.rail.bar') },
            { key: 'dot', label: t('opt.rail.dot') },
            { key: 'none', label: t('opt.rail.none') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.hover'),
          field: 'hoverDetail',
          value: cfg.hoverDetail === true,
          options: [
            { key: true, label: t('opt.hover.detail') },
            { key: false, label: t('opt.hover.line') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.visibility'),
          field: 'visibility',
          value: cfg.visibility,
          options: [
            { key: 'always', label: t('opt.vis.always') },
            { key: 'gte50', label: t('opt.vis.50') },
            { key: 'gte80', label: t('opt.vis.80') },
            { key: 'dim', label: t('opt.vis.dim') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.tone'),
          field: 'tone',
          value: cfg.tone,
          options: [
            { key: 'four', label: t('opt.tone.four') },
            { key: 'two', label: t('opt.tone.two') },
            { key: 'neutral', label: t('opt.tone.neutral') },
          ],
        }),
        h(ChoiceGroup, {
          label: t('group.precision'),
          field: 'decimals',
          value: cfg.decimals,
          options: [
            { key: 0, label: t('opt.dec.int') },
            { key: 1, label: t('opt.dec.one') },
          ],
        }),
      )
    }

    return {
      inject: ['slots', 'locale', 'sessions'],
      apply(ctx) {
        ctx.effect(() => {
          if (typeof document === 'undefined') return () => {}
          const existing = document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')
          if (existing !== null) return () => {}
          const style = document.createElement('style')
          style.dataset.plugin = '@mantis3d/dsh-context-title'
          style.dataset.pluginCss = STYLE_ID
          style.textContent = CSS
          document.head.appendChild(style)
          return () => style.remove()
        }, 'context-title: styles')

        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'context-title: dictionaries')

        const list = ctx.sessions === undefined ? undefined : ctx.sessions.list
        if (list === undefined || list === null) {
          console.warn('[context-title] ctx.sessions.list is unavailable; no usage is shown')
          return
        }

        ctx.slots.inject('conversation.session.header.actions', () =>
          ctx.slots.register(
            {
              name: 'conversation.session.header.actions',
              id: 'context-title-badge',
              order: 0,
              locale: NS,
              inject: (sessionId) => ({ sessionId, list }),
            },
            HeaderTitleSeat,
          ),
        )

        ctx.slots.inject('conversation.session.header.utilities', () =>
          ctx.slots.register(
            {
              name: 'conversation.session.header.utilities',
              id: 'context-title-utilities',
              order: 0,
              locale: NS,
              inject: (sessionId) => ({ sessionId, list }),
            },
            HeaderUtilitiesSeat,
          ),
        )

        ctx.slots.inject('sidebar.session.row.leading', () =>
          ctx.slots.register(
            {
              name: 'sidebar.session.row.leading',
              id: 'context-title-ring',
              order: 0,
              locale: NS,
              inject: () => ({ list }),
            },
            SidebarMark,
          ),
        )

        ctx.slots.inject('sidebar.session.row.hover', () =>
          ctx.slots.register(
            {
              name: 'sidebar.session.row.hover',
              id: 'context-title-hover',
              order: 0,
              locale: NS,
              inject: () => ({ list }),
            },
            SidebarHoverRow,
          ),
        )

        const t = ctx.locale.bind(NS)
        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'context-title',
              order: 60,
              label: () => t('nav'),
              locale: NS,
            },
            SettingsPanel,
          ),
        )
      },
    }
  },
})
