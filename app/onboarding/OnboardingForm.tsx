"use client"
import { submitForm } from './formsActions';
import React, { useEffect, useState, useCallback, FormEvent, ChangeEvent } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from '@supabase/supabase-js';
import { useTheme } from "next-themes"
import { Globe, MessageSquare, MoonIcon, SunIcon } from "lucide-react"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import {
  Lightbulb,
  Megaphone,
  Bird,
  Wrench,
  Search,
  Settings,
  Briefcase,
  BarChart,
  Monitor,
  Paintbrush,
  Box,
  Book,
  Users,
  Rocket,
  Coffee,
  PlusCircle,
  Sparkles,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const generateUniqueId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Custom Checkbox component
const CustomCheckbox = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof ShadcnCheckbox> & { id: string; name: string }>(
  ({ id, name, ...props }, ref) => {
    return (
      <ShadcnCheckbox
        ref={ref}
        {...props}
        id={id}
        name={name}
      />
    );
  }
);
CustomCheckbox.displayName = 'CustomCheckbox';

// Schema for the form validation
const formSchema = z.object({
  firstName: z.string().min(1, "Name is mandatory"),
  lastName: z.string().min(1, "Surname is mandatory"),
  email: z.string().email("E-mail not valid").min(1, "E-mail is mandatory"),
  languages: z.array(z.enum(["Portuguese", "English", "Other"])).min(1, "Select at least one language"),
  other_language: z.string().optional(),
  universityName: z.string().min(1, "College name is mandatory"),
  academicLevel: z.enum(["Undergraduate", "Master's", "Doctoral", "PhD"], {
    required_error: "Please select your current academic level",
  }),
  courseMajor: z.string().min(1, "Course/Major is mandatory"),
  studentId: z.string().min(1, "Student ID Number is mandatory"),
  phoneNumber: z.string().min(1, "Phone Number is mandatory"),
  roles: z.array(
    z.enum([
      "Idea Guy",
      "Communicator",
      "Peacemaker",
      "Problem Solver",
      "Problem Finder",
      "Executor",
    ])
  ).min(1, "Select at least one persona"),
  expertise: z.enum([
    "Business",
    "Marketing",
    "Tech",
    "Design",
    "Other",
  ]),
  otherExpertise: z.string().optional(),
  interests: z.array(z.string()).min(1, "Select at least one area of interest"),
  motivations: z.array(z.enum(["BringIdeaToLife", "LearningTools", "FindingTeam", "WorkingCoolProjects", "AccessMentoring", "MeetingPeople", "Other"])).min(1, "Select at least one option"),
  otherMotivation: z.string().optional(),
  innovationExperience: z.enum(["ExperiencedInProjects", "NewToExperience", "Other"], {
    required_error: "Please define your experience with innovation",
  }),
  otherInnovationExperience: z.string().optional(),
  termsAgreement: z.boolean({
    required_error: "You must agree to the Terms of Use and Data Protection Policy.",
  }),
});

type FormData = z.infer<typeof formSchema>;
type LanguageType = "Portuguese" | "English" | "Other";
type RoleType = "Idea Guy" | "Communicator" | "Peacemaker" | "Problem Solver" | "Problem Finder" | "Executor";
type ExpertiseType = "Business" | "Marketing" | "Tech" | "Design" | "Other";
type MotivationType = "BringIdeaToLife" | "LearningTools" | "FindingTeam" | "WorkingCoolProjects" | "AccessMentoring" | "MeetingPeople" | "Other";
type InnovationExperienceType = "ExperiencedInProjects" | "NewToExperience" | "Other";
type AcademicLevelType = "Undergraduate" | "Master's" | "Doctoral" | "PhD";

const interestOptions = [
  "Web3",
  "Artificial Intelligence",
  "Blockchain",
  "Cybersecurity",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "Education",
  "Green Tech",
  "IoT",
  "VR/AR",
  "Robotics",
  "Gaming",
  "Data Science",
  "Social Media",
  "Cloud Computing",
];

const motivationOptions: Array<{ value: MotivationType; label: string; icon: React.ElementType }> = [
  { value: "BringIdeaToLife", label: "Bringing your own idea to life", icon: Lightbulb },
  { value: "LearningTools", label: "Learning tools for innovation", icon: Book },
  { value: "FindingTeam", label: "Finding a team for a startup", icon: Users },
  { value: "WorkingCoolProjects", label: "Working in cool projects that inspires me", icon: Rocket },
  { value: "AccessMentoring", label: "Get access to mentoring", icon: Briefcase },
  { value: "MeetingPeople", label: "Meeting cool people", icon: Coffee },
  { value: "Other", label: "Other", icon: Box },
];

const innovationExperienceOptions: Array<{ value: InnovationExperienceType; label: string; icon: React.ElementType }> = [
  { value: "ExperiencedInProjects", label: "I've been part of projects before", icon: Briefcase },
  { value: "NewToExperience", label: "I'm new to this experience", icon: Sparkles },
  { value: "Other", label: "Other", icon: Box },
];

const academicLevelOptions: Array<{ value: AcademicLevelType; label: string; icon: React.ElementType }> = [
  { value: "Undergraduate", label: "Undergraduate (Licenciatura)", icon: GraduationCap },
  { value: "Master's", label: "Master's", icon: GraduationCap },
  { value: "Doctoral", label: "Doctoral", icon: GraduationCap },
  { value: "PhD", label: "PhD", icon: GraduationCap },
];

const languageOptions: Array<{ value: LanguageType; label: string; icon: React.ElementType }> = [
  { value: "Portuguese", label: "Portuguese", icon: Globe },
  { value: "English", label: "English", icon: Globe },
  { value: "Other", label: "Other", icon: Box },
];

const ProblemsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleClick = useCallback(() => setIsOpen(prev => !prev), []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback('');

    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      setFeedback('Error: Support system not configured.');
      setIsLoading(false);
      return;
    }

    const formattedMessage = `
**New Support Request**
:bust_in_silhouette: **Name:** ${name}
:envelope: **Email:** ${email}
:warning: **Problem:**
${problem}
---
*This support request was sent through the Problems button on the form page.*
    `.trim();

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formattedMessage,
        }),
      });

      if (response.ok) {
        setFeedback('Support request sent successfully!');
        setName('');
        setEmail('');
        setProblem('');
      } else {
        throw new Error('Failed to send support request');
      }
    } catch (error) {
      setFeedback('Error sending support request. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'problem':
        setProblem(value);
        break;
    }
  };

  return (
    <div className="absolute top-0 right-0">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClick}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Problems
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Do you need help?</h4>
            <p className="text-sm text-muted-foreground">
              If you're experiencing any issues, please fill out the form below and our support team will get back to you as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Describe your problem</Label>
                <Textarea
                  id="problem"
                  value={problem}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Support Request'}
              </Button>
              {feedback && (
                <div className={`mt-2 p-2 text-sm rounded ${feedback.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback}
                </div>
              )}
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OnboardingForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      languages: [],
      other_language: "",
      universityName: "",
      academicLevel: undefined,
      courseMajor: "",
      studentId: "",
      phoneNumber: "",
      roles: [],
      expertise: "Business",
      otherExpertise: "",
      interests: [],
      motivations: [],
      otherMotivation: "",
      innovationExperience: "NewToExperience",
      otherInnovationExperience: "",
      termsAgreement: false,
    },
  });

  useEffect(() => {
    if (!form.watch("languages").includes("Other")) {
      form.setValue("other_language", "");
    }
  }, [form.watch("languages")]);

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()}: ${message}`])
    console.log(message)
  }, [])

  useEffect(() => {
    setMounted(true)
    addLog("Componente montado")
    const testSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('onboarding_answers')
          .select('*')
          .limit(1)

        if (error) throw error
        addLog('Conexão com Supabase bem-sucedida: ' + JSON.stringify(data))
      } catch (error) {
        addLog('Erro na conexão com Supabase: ' + JSON.stringify(error))
      }
    }

    testSupabaseConnection()
  }, [addLog])

  useEffect(() => {
    if (searchParams.get('accepted') === 'true') {
      form.setValue('termsAgreement', true)
    }
  }, [searchParams, form])

  const handleRoleSelect = (role: RoleType) => {
    const currentRoles = form.getValues("roles");
    if (currentRoles.includes(role)) {
      form.setValue("roles", currentRoles.filter(r => r !== role));
    } else {
      form.setValue("roles", [...currentRoles, role]);
    }
  };

  const handleInterestSelect = (interest: string) => {
    const currentInterests = form.getValues("interests");
    if (currentInterests.includes(interest)) {
      form.setValue("interests", currentInterests.filter(i => i !== interest));
    } else {
      form.setValue("interests", [...currentInterests, interest]);
    }
  };

  const handleMotivationSelect = (motivation: MotivationType) => {
    const currentMotivations = form.getValues("motivations");
    if (currentMotivations.includes(motivation)) {
      form.setValue("motivations", currentMotivations.filter(m => m !== motivation));
    } else {
      form.setValue("motivations", [...currentMotivations, motivation]);
    }
  };

  const handleInnovationExperienceSelect = (experience: InnovationExperienceType) => {
    form.setValue("innovationExperience", experience);
  };

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    console.log('Dados do formulário antes do envio:', data);

    const result = await submitForm(data);
    
    if (result.success) {
      // Redirecionar para o link do Discord
      window.location.href = 'https://discord.gg/3XXEjGFtjq';
    } else {
      setSubmitError(result.error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
        <ProblemsButton />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center mt-16 sm:mt-0">Welcome to UPSTART!</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 sm:space-y-8">
          {/* Campos de Nome */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="firstName" className="text-base sm:text-lg font-semibold">Let's start by getting to know you a bit.<strong> What's your name?</strong></FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <FormControl>
                    <Input id="firstName" placeholder="Your name" {...field} className="h-10" />
                  </FormControl>
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field: lastNameField }) => (
                      <FormControl>
                        <Input id="lastName" placeholder="Your surname" {...lastNameField} className="h-10" />
                      </FormControl>
                    )}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

            {/* Email Selection */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-base sm:text-lg font-semibold">Your <strong>e-mail address</strong>:</FormLabel>
                  <FormControl>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your e-mail address" 
                      {...field} 
                      className="h-10"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          {/* Language Selection */}
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    Select all the <strong>language(s) you're comfortable with</strong>:
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {languageOptions.map(({ value, label, icon: Icon }) => {
                      const isSelected = field.value.includes(value);
                      return (
                        <Button
                          key={value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            const updatedLanguages = isSelected
                              ? field.value.filter((lang: LanguageType) => lang !== value)
                              : [...field.value, value];
                            field.onChange(updatedLanguages);
                          }}
                          className="h-24 sm:h-32 flex flex-col items-center justify-center"
                          aria-pressed={isSelected}
                        >
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-center">{label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other Language Input */}
          {form.watch("languages").includes("Other") && (
            <FormField
              control={form.control}
              name="other_language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-semibold">What's your <strong>other language</strong>?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your other language" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Divisória personalizada */}
          <div className="my-12">
            <Separator className="my-6" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Your Personality in Innovation</h2>
              <p className="text-muted-foreground">
                Every innovator has a unique personality that adds flavor to the mix. Let's discover which one resonates with you the most.
              </p>
            </div>
            <Separator className="my-6" />
          </div>

          {/* Role Selection */}
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    Select the <strong>role(s) that resonate with you</strong> the most:
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {([
                      { role: "Idea Guy", icon: Lightbulb },
                      { role: "Communicator", icon: Megaphone },
                      { role: "Peacemaker", icon: Bird },
                      { role: "Problem Solver", icon: Wrench },
                      { role: "Problem Finder", icon: Search },
                      { role: "Executor", icon: Settings },
                    ] as const).map(({ role, icon: Icon }) => {
                      const isSelected = field.value.includes(role);
                      return (
                        <Button
                          key={role}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            const updatedRoles = isSelected
                              ? field.value.filter((r: RoleType) => r !== role)
                              : [...field.value, role];
                            field.onChange(updatedRoles);
                          }}
                          className="h-24 sm:h-32 flex flex-col items-center justify-center"
                          aria-pressed={isSelected}
                        >
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-center">{role}</span>
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expertise Selection */}
          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    Choose your <strong>primary area of expertise or interest</strong>:
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {([
                      { expertise: "Business", icon: Briefcase },
                      { expertise: "Marketing", icon: BarChart },
                      { expertise: "Tech", icon: Monitor },
                      { expertise: "Design", icon: Paintbrush },
                      { expertise: "Other", icon: Box },
                    ] as const).map(({ expertise, icon: Icon }) => (
                      <Button
                        key={expertise}
                        type="button"
                        variant={field.value === expertise ? "default" : "outline"}
                        onClick={() => field.onChange(expertise)}
                        className="h-24 sm:h-32 flex flex-col items-center justify-center"
                        aria-pressed={field.value === expertise}
                      >
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">{expertise}</span>
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adicione o campo de input para "Other" expertise */}
          {form.watch("expertise") === "Other" && (
            <FormField
              control={form.control}
              name="otherExpertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-semibold">What's your <strong>expertise</strong>?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your expertise" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Interests Selection */}
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    Select your <strong>interests</strong> from those:
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => {
                      const isSelected = field.value.includes(interest);
                      return (
                        <Button
                          key={interest}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            const updatedInterests = isSelected
                              ? field.value.filter((i: string) => i !== interest)
                              : [...field.value, interest];
                            field.onChange(updatedInterests);
                          }}
                          className="p-2 h-10 text-xs sm:text-sm"
                          aria-pressed={isSelected}
                        >
                          <span>{interest}</span>
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Divisória personalizada */}
          <div className="my-12">
            <Separator className="my-6" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Goals and Expectations</h2>
              <p className="text-muted-foreground">
                Let's talk about your aspirations within our community.
              </p>
            </div>
            <Separator className="my-6" />
          </div>

          {/* Pergunta sobre o que te traz à nossa comunidade */}
          <FormField
            control={form.control}
            name="motivations"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    <strong>What brings you to our community</strong>? Select all that apply:
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {motivationOptions.map(({ value, label, icon: Icon }) => {
                      const isSelected = field.value.includes(value);
                      return (
                        <Button
                          key={value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            const updatedMotivations = isSelected
                              ? field.value.filter((m: MotivationType) => m !== value)
                              : [...field.value, value];
                            field.onChange(updatedMotivations);
                          }}
                          className="h-24 sm:h-32 flex flex-col items-center justify-center"
                          aria-pressed={isSelected}
                        >
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-xs sm:text-sm font-medium text-center">{label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adicione o campo de input para "Other" motivation */}
          {form.watch("motivations").includes("Other") && (
            <FormField
              control={form.control}
              name="otherMotivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-semibold">What's your <strong>other motivation</strong>?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your other motivation" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Divisória personalizada */}
          <div className="my-12">
            <Separator className="my-6" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Your Experience and Approach</h2>
              <p className="text-muted-foreground">
                Whether you're a seasoned innovator or just starting out, we're excited to learn about your journey.
              </p>
            </div>
            <Separator className="my-6" />
          </div>

          {/* Pergunta sobre experiência com inovação (continuação) */}
          <FormField
            control={form.control}
            name="innovationExperience"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    What's your <strong>experience with innovation or entrepreneurship</strong>?
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {innovationExperienceOptions.map(({ value, label, icon: Icon }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={field.value === value ? "default" : "outline"}
                        onClick={() => field.onChange(value)}
                        className="h-24 sm:h-32 flex flex-col items-center justify-center"
                        aria-pressed={field.value === value}
                      >
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">{label}</span>
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adicione o campo de input para "Other" innovation experience */}
          {form.watch("innovationExperience") === "Other" && (
            <FormField
              control={form.control}
              name="otherInnovationExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-semibold">What's your <strong>other experience</strong> with innovation or entrepreneurship?</FormLabel>
                  <FormControl>
                    <Input placeholder="Your other experience" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Divisória personalizada */}
          <div className="my-12">
            <Separator className="my-6" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Final Details (Boring but Important)</h2>
              <p className="text-muted-foreground">
                We know, paperwork details aren't the most exciting, but they're crucial for keeping things in order. Let's quickly wrap up with some university info.
              </p>
            </div>
            <Separator className="my-6" />
          </div>

          {/* University Name Field */}
          <FormField
            control={form.control}
            name="universityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg font-semibold">Your <strong>University Name</strong> is...</FormLabel>
                <FormControl>
                  <Input placeholder="Your university name" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Academic Level Field */}
          <FormField
            control={form.control}
            name="academicLevel"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="text-base sm:text-lg font-semibold mb-3">
                    Current <strong>Academic Level</strong>:
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {academicLevelOptions.map(({ value, label, icon: Icon }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={field.value === value ? "default" : "outline"}
                        onClick={() => field.onChange(value)}
                        className="h-24 sm:h-32 flex flex-col items-center justify-center"
                        aria-pressed={field.value === value}
                      >
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">{label}</span>
                      </Button>
                    ))}
                  </div>
                </fieldset>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Course/Major Field */}
          <FormField
            control={form.control}
            name="courseMajor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg font-semibold">Current <strong>Course/Major</strong>:</FormLabel>
                <FormControl>
                  <Input placeholder="Your current course or major" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Student ID Field */}
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg font-semibold">Your <strong>Student ID number</strong>:</FormLabel>
                <FormControl>
                  <Input placeholder="Your student ID number" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base sm:text-lg font-semibold">Your <strong>Phone Number</strong>:</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} className="h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Divisória personalizada */}
          <div className="my-12">
            <Separator className="my-6" />
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3">Terms of Use and Data Protection Agreement</h2>
              <p className="text-muted-foreground">
                Before marking the next box, feel free to read our Terms of Use and Data Protection Agreement. 
                You can access them by clicking {' '}
                <Link href="/termos-of-use" className="text-primary hover:underline">
                  here
                </Link>.
              </p>
            </div>
            <Separator className="my-6" />
          </div>

          {/* Checkbox de Concordância com os Termos */}
          <FormField
            control={form.control}
            name="termsAgreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <CustomCheckbox
                    id="termsAgreement"
                    name="termsAgreement"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="termsAgreement" className="text-sm font-medium">
                    I have read and agree to the <strong>Terms of Use and Data Protection Policy.</strong>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {submitError && (
            <div className="text-red-500 text-center text-sm sm:text-base">{submitError}</div>
          )}

          <Button 
            type="submit" 
            className="w-full mt-6 sm:mt-8 h-10 sm:h-12 text-base sm:text-lg font-semibold"
            disabled={isSubmitting}
            onClick={() => addLog('Botão de envio clicado')}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingForm;
