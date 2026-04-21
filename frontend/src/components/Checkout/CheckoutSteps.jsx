import React from "react";

const steps = [
  { id: 1, title: "Shipping" },
  { id: 2, title: "Payment" },
  { id: 3, title: "Success" },
];

const CheckoutSteps = ({ active = 1 }) => {
  return (
    <section className="section-shell pt-6">
      <div className="surface-card-sm bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((step, index) => {
            const isActive = active === step.id;
            const isDone = active > step.id;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    isActive || isDone
                      ? "border-[#1f2937] bg-[#1f2937] text-white"
                      : "border-[#e6ddd2] bg-[#fbf8f3] text-[#6b7280]"
                  }`}
                >
                  <span>{step.id}</span>
                  <span>{step.title}</span>
                </div>
                {index < steps.length - 1 && <div className="hidden h-px flex-1 bg-[#e6ddd2] sm:block" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CheckoutSteps;
