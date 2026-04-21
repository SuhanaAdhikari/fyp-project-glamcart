import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const faqs = [
  {
    question: "What is your return policy?",
    answer: "Returns are accepted within 30 days of delivery when the item is unused and eligible for return.",
  },
  {
    question: "How do I track my order?",
    answer: "Open your account order history and choose the order you want to track.",
  },
  {
    question: "Can I cancel an order?",
    answer: "Orders can only be cancelled before they are processed by the seller.",
  },
  {
    question: "Do you ship inside Nepal?",
    answer: "Yes. The current checkout flow is configured for delivery inside Nepal.",
  },
  {
    question: "Which payment methods are available?",
    answer: "Credit card, Khalti and cash on delivery are available on supported orders.",
  },
];

const FAQPage = () => {
  return (
    <div className="page-shell">
      <Header activeHeading={5} />
      <section className="section-shell py-10">
        <div className="flex flex-col gap-2">
          <h1 className="section-heading">Frequently asked questions</h1>
          <p className="section-copy">Short answers to the most common questions about orders, delivery and payment.</p>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={faq.question} faq={faq} defaultOpen={index === 0} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

const FaqItem = ({ faq, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="surface-card-sm bg-white p-5">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 text-left">
        <span className="font-semibold text-[#1f2937]">{faq.question}</span>
        <span className="text-[#6b7280]">{open ? "-" : "+"}</span>
      </button>

      {open && <p className="mt-4 text-sm leading-7 text-[#6b7280]">{faq.answer}</p>}
    </div>
  );
};

export default FAQPage;
