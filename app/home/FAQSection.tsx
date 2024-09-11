import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQSectionProps {
  id: string;
}

const faqData = [
    {
      question: "What is UPSTART?",
      answer: "UPSTART is an innovation community created by and for students. We are a student-led initiative the University of Porto. UPSTART empowers young people by providing essential tools to become innovation protagonists. While our focus is on university students, we welcome anyone interested in taking their first steps in innovation. Our mission is to support and empower students in developing and realizing their innovative ideas, providing an environment where creation, collaboration, and innovation are encouraged."
    },
    {
      question: "How does UPSTART help students?",
      answer: "UPSTART offers a variety of resources and opportunities, including events and workshops focused on networking and skill-building, a collaborative community on Discord, and personalized mentoring. We also provide access to tools, educational resources, and a valuable network of contacts in the entrepreneurial ecosystem."
    },
    {
      question: "Is it free to join UPSTART?",
      answer: "Yes, becoming a member of our community is completely free. All events organized directly by UPSTART are also free of charge. Only some events organized by our partners that we promote may have a cost. However, our goal is to always keep our services free or at minimal cost to ensure accessibility for all students."
    },
    {
      question: "How can I participate in the UPSTART community?",
      answer: "Joining UPSTART is easy! Simply create an account on our platform, and upon completion, we'll direct you to our Discord community where you can meet other innovators. You can participate by joining our Discord community, attending our events and workshops, or contributing ideas to our innovation forum. We also offer mentoring opportunities and collaboration on innovative projects."
    },
    {
      question: "What kind of support does UPSTART offer for innovative projects?",
      answer: "UPSTART offers comprehensive support for innovative projects, including mentoring from industry experts, access to development resources and tools, networking opportunities, workshops focused on essential skills, and a platform to share and receive feedback on ideas. We also assist in team formation and provide opportunities to connect with potential collaborators and mentors."
    }
  ];
export const FAQSection: React.FC<FAQSectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {typeof faq.answer === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                ) : (
                  faq.answer
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};