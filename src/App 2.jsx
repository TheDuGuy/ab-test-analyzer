import { useState } from 'react'
import './App.css'

function App() {
  // Channel selection
  const [channel, setChannel] = useState('web')

  // Channel-specific terminology
  const channelConfig = {
    web: {
      metric1: 'Visitors',
      metric2: 'Conversions',
      rate: 'Conversion Rate',
      icon: '🌐'
    },
    email: {
      metric1: 'Sends',
      metric2: 'Clicks',
      rate: 'Click Rate',
      icon: '📧'
    },
    push: {
      metric1: 'Sends',
      metric2: 'Opens',
      rate: 'Open Rate',
      icon: '🔔'
    },
    sms: {
      metric1: 'Sends',
      metric2: 'Clicks',
      rate: 'Click Rate',
      icon: '💬'
    }
  }

  const config = channelConfig[channel]

  // Control group data
  const [controlVisitors, setControlVisitors] = useState(10000)
  const [controlConversions, setControlConversions] = useState(450)

  // Variant group data
  const [variantVisitors, setVariantVisitors] = useState(10000)
  const [variantConversions, setVariantConversions] = useState(520)

  // Calculate conversion rates
  const controlRate = controlVisitors > 0 ? (controlConversions / controlVisitors) * 100 : 0
  const variantRate = variantVisitors > 0 ? (variantConversions / variantVisitors) * 100 : 0

  // Calculate relative uplift
  const relativeUplift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0

  // Statistical significance calculations
  const calculateStats = () => {
    if (controlVisitors === 0 || variantVisitors === 0) {
      return { zScore: 0, pValue: 1, isSignificant: false, confidenceLevel: 0 }
    }

    const p1 = controlConversions / controlVisitors
    const p2 = variantConversions / variantVisitors
    const pPooled = (controlConversions + variantConversions) / (controlVisitors + variantVisitors)

    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/controlVisitors + 1/variantVisitors))

    if (se === 0) {
      return { zScore: 0, pValue: 1, isSignificant: false, confidenceLevel: 0 }
    }

    const zScore = (p2 - p1) / se

    // Two-tailed p-value calculation using approximation
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)))

    const isSignificant = pValue < 0.05
    const confidenceLevel = (1 - pValue) * 100

    return { zScore, pValue, isSignificant, confidenceLevel }
  }

  // Normal CDF approximation
  const normalCDF = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - prob : prob
  }

  const stats = calculateStats()

  // Determine winner
  const getWinner = () => {
    if (!stats.isSignificant) {
      return { winner: 'inconclusive', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500' }
    }
    if (variantRate > controlRate) {
      return { winner: 'Variant Wins', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500' }
    }
    if (controlRate > variantRate) {
      return { winner: 'Control Wins', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500' }
    }
    return { winner: 'Tie', color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500' }
  }

  const result = getWinner()

  // Calculate confidence intervals (95%)
  const calculateCI = (conversions, visitors) => {
    if (visitors === 0) return { lower: 0, upper: 0 }
    const rate = conversions / visitors
    const z = 1.96 // 95% confidence
    const se = Math.sqrt((rate * (1 - rate)) / visitors)
    return {
      lower: Math.max(0, (rate - z * se) * 100),
      upper: Math.min(100, (rate + z * se) * 100)
    }
  }

  const controlCI = calculateCI(controlConversions, controlVisitors)
  const variantCI = calculateCI(variantConversions, variantVisitors)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              A/B Test Results Analyzer
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Calculate statistical significance and confidence intervals for your A/B tests.
            Built for data-driven marketers and growth teams.
          </p>

          {/* Channel Selector */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setChannel('web')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                channel === 'web'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🌐 Web
            </button>
            <button
              onClick={() => setChannel('email')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                channel === 'email'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              📧 Email
            </button>
            <button
              onClick={() => setChannel('push')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                channel === 'push'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🔔 Push
            </button>
            <button
              onClick={() => setChannel('sms')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                channel === 'sms'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              💬 SMS
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Control Group */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🅰️</span>
              Control Group
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">{config.metric1}</label>
                <input
                  type="number"
                  min="0"
                  value={controlVisitors}
                  onChange={(e) => setControlVisitors(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">{config.metric2}</label>
                <input
                  type="number"
                  min="0"
                  max={controlVisitors}
                  value={controlConversions}
                  onChange={(e) => setControlConversions(Math.min(parseInt(e.target.value) || 0, controlVisitors))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">{config.rate}</p>
                  <p className="text-4xl font-bold text-blue-400">{controlRate.toFixed(2)}%</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center">
                95% CI: {controlCI.lower.toFixed(2)}% - {controlCI.upper.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Middle Column - Variant Group */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">🅱️</span>
              Variant Group
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">{config.metric1}</label>
                <input
                  type="number"
                  min="0"
                  value={variantVisitors}
                  onChange={(e) => setVariantVisitors(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">{config.metric2}</label>
                <input
                  type="number"
                  min="0"
                  max={variantVisitors}
                  value={variantConversions}
                  onChange={(e) => setVariantConversions(Math.min(parseInt(e.target.value) || 0, variantVisitors))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-1">{config.rate}</p>
                  <p className="text-4xl font-bold text-purple-400">{variantRate.toFixed(2)}%</p>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center">
                95% CI: {variantCI.lower.toFixed(2)}% - {variantCI.upper.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Winner Display */}
            <div className={`${result.bgColor} backdrop-blur-sm rounded-xl p-6 border-2 ${result.borderColor}`}>
              <div className="text-center">
                <p className="text-gray-300 text-sm uppercase tracking-wide mb-2">Result</p>
                <p className={`text-3xl font-bold ${result.color} mb-2`}>
                  {result.winner === 'inconclusive' ? 'Inconclusive' : result.winner}
                </p>
                {result.winner !== 'inconclusive' && (
                  <p className="text-sm text-gray-400">
                    {stats.confidenceLevel.toFixed(1)}% confidence
                  </p>
                )}
              </div>
            </div>

            {/* Uplift */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Relative Uplift</h3>
              <div className="text-center">
                <p className={`text-4xl font-bold ${relativeUplift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {relativeUplift >= 0 ? '+' : ''}{relativeUplift.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {Math.abs(variantRate - controlRate).toFixed(2)}pp absolute change
                </p>
              </div>
            </div>

            {/* Statistical Details */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Statistical Details</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Z-Score</span>
                  <span className="text-white font-medium">{stats.zScore.toFixed(4)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">P-Value</span>
                  <span className="text-white font-medium">{stats.pValue.toFixed(4)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Significance (95%)</span>
                  <span className={`font-medium ${stats.isSignificant ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.isSignificant ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Sample Size</span>
                    <span className="text-white font-medium">
                      {(controlVisitors + variantVisitors).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Recommendation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {!stats.isSignificant && (
                  <>The test results are <strong>not statistically significant</strong> at the 95% confidence level. Consider running the test longer or with more traffic to reach significance.</>
                )}
                {stats.isSignificant && variantRate > controlRate && (
                  <>The variant shows a <strong>statistically significant improvement</strong> over the control. Consider implementing this variation.</>
                )}
                {stats.isSignificant && controlRate > variantRate && (
                  <>The control performs <strong>significantly better</strong> than the variant. Keep the current version or test a different variation.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Visual Comparison */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Visual Comparison</h3>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Control Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">Control</span>
                <span className="text-blue-400 font-bold">{controlRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${Math.min(controlRate * 2, 100)}%` }}
                >
                  <span className="text-white text-sm font-bold">{controlConversions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Variant Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">Variant</span>
                <span className="text-purple-400 font-bold">{variantRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${Math.min(variantRate * 2, 100)}%` }}
                >
                  <span className="text-white text-sm font-bold">{variantConversions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Built by <a href="https://edou-mota-interactive-cv.vercel.app" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">Edou Mota</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
