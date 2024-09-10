import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Certifique-se de que estas variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definição do schema do formulário
const formSchema = z.object({
  firstName: z.string().min(1, "Name is mandatory"),
  lastName: z.string().min(1, "Surname is mandatory"),
  email: z.string().email("Invalid e-mail").min(1, "E-mail is mandatory"),
  languages: z.array(z.enum(["English", "Portuguese", "Other"])).min(1),
  other_language: z.string().optional(),
  universityName: z.string().min(1, "University name is mandatory"),
  academicLevel: z.enum(["Undergraduate", "Master's", "Doctoral", "PhD"]),
  courseMajor: z.string().min(1, "Course/Major is mandatory"),
  studentId: z.string().min(1, "Student ID number is mandatory"),
  phoneNumber: z.string().min(1, "Phone Number is mandatory"),
  roles: z.array(z.enum(["Idea Guy", "Communicator", "Peacemaker", "Problem Solver", "Problem Finder", "Executor"])).min(1),
  expertise: z.enum(["Business", "Marketing", "Tech", "Design", "Other"]),
  otherExpertise: z.string().optional(),
  interests: z.array(z.string()).min(1),
  motivations: z.array(z.enum(["BringIdeaToLife", "LearningTools", "FindingTeam", "WorkingCoolProjects", "AccessMentoring", "MeetingPeople", "Other"])).min(1),
  otherMotivation: z.string().optional(),
  innovationExperience: z.enum(["ExperiencedInProjects", "NewToExperience", "Other"]),
  otherInnovationExperience: z.string().optional(),
  termsAgreement: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

// Função auxiliar para formatar arrays para o Supabase
const formatArrayForSupabase = (arr: string[]): string => {
  return `{${arr.join(',')}}`;
};

export const submitForm = async (data: FormData) => {
  console.log('Dados recebidos na função submitForm:', data);
  console.log('Formulário iniciado');

  try {
    // Validar os dados do formulário
    formSchema.parse(data);

    // Obter o usuário autenticado do endpoint
    const response = await fetch('/api/use-auth');
    const userData = await response.json();

    if (!userData.authenticated || !userData.user) {
      throw new Error('Usuário não autenticado');
    }

    const userId = userData.user.id;

    // Preparar os dados para enviar para o Supabase
    const onboardingPayload = {
      languages: formatArrayForSupabase(data.languages),
      other_language: data.other_language,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      university_name: data.universityName,
      academic_level: data.academicLevel,
      course_major: data.courseMajor,
      student_id: data.studentId,
      phone_number: data.phoneNumber,
      roles: formatArrayForSupabase(data.roles),
      
      expertise: data.expertise,
      other_expertise: data.otherExpertise,
      interests: formatArrayForSupabase(data.interests),
      motivations: formatArrayForSupabase(data.motivations),
      other_motivation: data.otherMotivation,
      innovation_experience: data.innovationExperience,
      other_innovation_experience: data.otherInnovationExperience,
      user_id: userId, // Adiciona o user_id do usuário autenticado
    };

    // Preparar os dados para atualizar a tabela profiles
    const profilesPayload = {
      real_full_name: `${data.firstName} ${data.lastName}`,
      roles: formatArrayForSupabase(data.roles),
    };

    // Inserir os dados no Supabase (onboarding_answers)
    const { data: insertedData, error: onboardingError } = await supabase
      .from('onboarding_answers')
      .insert([onboardingPayload]);

    if (onboardingError) {
      throw new Error('Erro ao inserir os dados no Supabase (onboarding_answers): ' + onboardingError.message);
    }

    // Atualizar a tabela profiles
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update(profilesPayload)
      .eq('discord_uid', userId);

    if (profileError) {
      throw new Error('Erro ao atualizar os dados no Supabase (profiles): ' + profileError.message);
    }

    console.log('Dados inseridos com sucesso (onboarding_answers):', insertedData);
    console.log('Perfil atualizado com sucesso:', updatedProfile);
    return { success: true, data: { onboarding: insertedData, profile: updatedProfile } };
  } catch (error: any) {
    console.error('Erro ao submeter o formulário:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};