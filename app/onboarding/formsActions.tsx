import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Certifique-se de que estas variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definição do schema do formulário
const formSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  languages: z.array(z.enum(["English", "Portuguese", "Other"])).min(1),
  other_language: z.string().optional(),
  universityName: z.string().min(1, "Nome da universidade é obrigatório"),
  academicLevel: z.enum(["Undergraduate", "Master's", "Doctoral", "PhD"]),
  courseMajor: z.string().min(1, "Curso/Major é obrigatório"),
  studentId: z.string().min(1, "Número de ID do estudante é obrigatório"),
  phoneNumber: z.string().min(1, "Número de telefone é obrigatório"),
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
    const payload = {
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

    //console.log('Dados preparados para o Supabase:', payload);
    console.log(payload.languages)

    // Inserir os dados no Supabase
    const { data: insertedData, error } = await supabase
      .from('onboarding_answers')
      .insert([payload]);

    if (error) {
      throw new Error('Erro ao inserir os dados no Supabase: ' + error.message);
    }

    console.log('Dados inseridos com sucesso:', insertedData);
    return { success: true, data: insertedData };
  } catch (error: any) {
    console.error('Erro ao submeter o formulário:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
};