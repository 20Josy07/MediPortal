
export interface FAQ {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export const faqData: FAQ[] = [
  {
    id: 'faq-1',
    question: '¿Cómo puedo agregar un nuevo paciente?',
    answer: 'Para agregar un nuevo paciente, ve a la sección "Pacientes" en el menú lateral y haz clic en el botón "Agregar Paciente". Completa el formulario con la información del paciente y haz clic en "Guardar".'
  },
  {
    id: 'faq-2',
    question: '¿Cómo agendo una nueva sesión?',
    answer: 'Puedes agendar una sesión desde la sección "Sesiones". Haz clic en el botón "Agendar" o directamente en una fecha del calendario para abrir el formulario y completar los detalles de la cita.'
  },
  {
    id: 'faq-3',
    question: '¿Mis datos y los de mis pacientes están seguros?',
    answer: 'Sí. La seguridad y privacidad son nuestra máxima prioridad. Usamos encriptación de extremo a extremo y cumplimos con los estándares de la industria para proteger toda la información en la plataforma.'
  },
  {
    id: 'faq-4',
    question: '¿Cómo funciona la transcripción de notas de voz?',
    answer: 'En la sección "Notas", selecciona un paciente, ve a la pestaña "Nota de Voz" y haz clic en el ícono del micrófono para empezar a grabar. Cuando termines, la IA transcribirá automáticamente el audio y lo guardará como una nueva nota.'
  },
  {
    id: 'faq-5',
    question: '¿Puedo editar o eliminar una nota?',
    answer: '¡Claro! En el historial de notas, haz clic en la nota que deseas modificar. Se abrirá una vista detallada donde podrás editar el contenido y el título, o eliminarla permanentemente.'
  },
  {
    id: 'faq-6',
    question: '¿Qué tipo de análisis realiza la IA?',
    answer: 'Nuestra IA te ayuda a identificar patrones en las notas, como temas recurrentes o tendencias emocionales. También puedes chatear con el asistente de IA para pedirle resúmenes o análisis específicos sobre las notas de un paciente.'
  },
  {
    id: 'faq-7',
    question: '¿Cómo puedo cambiar mi foto de perfil?',
    answer: 'Ve a la configuración de tu perfil haciendo clic en tu avatar en la esquina superior derecha y seleccionando "Administrar mi Perfil". Allí podrás subir una nueva foto y actualizar tu información personal.'
  },
];
