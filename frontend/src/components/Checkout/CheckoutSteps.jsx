import React from "react"
import { FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi"

const steps = [
  {
    id: 1,
    title: "Shipping",
    desc: "Add delivery details for your order.",
    icon: FiTruck,
  },
  {
    id: 2,
    title: "Payment",
    desc: "Choose a secure payment method.",
    icon: FiCreditCard,
  },
  {
    id: 3,
    title: "Success",
    desc: "Order confirmed and being processed.",
    icon: FiCheckCircle,
  },
]

const CheckoutSteps = ({ active = 1 }) => {
  const progressPercent = active === 1 ? 18 : active === 2 ? 58 : 100

  return (
    <div className="w-full py-8">
      <div className="w-[95%] 900px:w-[85%] lg:w-[70%] mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#14152b] tracking-tight">Checkout Progress</h2>
          <p className="text-sm text-[#5b5f7a] mt-1">A premium flow — just a few steps to glow ✨</p>
        </div>

        {/* MOBILE: pill progress */}
        <div className="md:hidden bg-white/70 backdrop-blur border border-[#eef0ff] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#14152b]">
              Step {active} of 3: <span className="text-[#7b61ff]">{steps[active - 1]?.title}</span>
            </div>
            <div className="text-xs px-3 py-1 rounded-full bg-[#f2f4ff] text-[#7b61ff] font-semibold">
              {progressPercent}%
            </div>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-[#f1f2ff] overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 text-sm text-[#5b5f7a]">{steps[active - 1]?.desc}</div>
        </div>

        {/* DESKTOP: vertical beauty timeline */}
        <div className="hidden md:grid grid-cols-[360px_1fr] gap-6 items-start">
          {/* Timeline */}
          <div className="rounded-2xl border border-[#eef0ff] bg-white/70 backdrop-blur shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-[#14152b]">Steps</div>
              <div className="text-xs px-3 py-1 rounded-full bg-[#fff0f7] text-[#ff5aa5] font-semibold">
                Step {active}/3
              </div>
            </div>

            <div className="relative pl-5">
              {/* vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-[2px] bg-[#eef0ff]" />
              <div
                className="absolute left-2 top-2 w-[2px] bg-gradient-to-b from-[#ff5aa5] to-[#7b61ff] transition-all duration-500"
                style={{
                  height: active === 1 ? "28%" : active === 2 ? "62%" : "100%",
                }}
              />

              <div className="space-y-4">
                {steps.map((s) => {
                  const isDone = active > s.id
                  const isActive = active === s.id
                  const Icon = s.icon

                  return (
                    <div key={s.id} className="flex items-start gap-4">
                      {/* node */}
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border transition-all
                        ${
                          isDone
                            ? "bg-[#14152b] text-white border-[#14152b]"
                            : isActive
                            ? "bg-gradient-to-br from-[#ff5aa5] to-[#7b61ff] text-white border-white/40"
                            : "bg-white text-[#7b61ff] border-[#eef0ff]"
                        }`}
                      >
                        {isDone ? <FiCheckCircle className="text-lg" /> : <Icon className="text-lg" />}
                      </div>

                      {/* content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`font-extrabold ${isActive ? "text-[#14152b]" : "text-[#3b3f5c]"}`}>
                            {s.title}
                          </div>
                          {isActive && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-[#f2f4ff] text-[#7b61ff] font-bold">
                              Current
                            </span>
                          )}
                          {isDone && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                              Done
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#5b5f7a] mt-1">{s.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right “beauty card” status */}
          <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-[0_20px_60px_rgba(20,21,43,0.08)] p-6 overflow-hidden relative">
            {/* glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff5aa5]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7b61ff]/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="text-xs font-bold text-[#7b61ff] uppercase tracking-wider">Now</div>
              <h3 className="text-2xl font-extrabold text-[#14152b] mt-1">{steps[active - 1]?.title}</h3>
              <p className="text-sm text-[#5b5f7a] mt-2 max-w-xl">{steps[active - 1]?.desc}</p>

              <div className="mt-6 rounded-2xl border border-[#eef0ff] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#3b3f5c]">Progress</span>
                  <span className="text-sm font-bold text-[#14152b]">{progressPercent}%</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[#f1f2ff] overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="mt-4 text-xs text-[#5b5f7a]">
                  {active === 1 && "Tip: Use a saved address to checkout faster."}
                  {active === 2 && "Tip: Payment is encrypted and secure."}
                  {active === 3 && "Tip: You can track your order from your profile."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note (optional) */}
        <div className="mt-6 text-center text-xs text-[#5b5f7a]">
          Need help? Contact support anytime — we’re here for you.
        </div>
      </div>
    </div>
  )
}

export default CheckoutSteps
