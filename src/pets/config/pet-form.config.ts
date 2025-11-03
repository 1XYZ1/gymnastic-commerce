import * as yup from 'yup';

export const petFormSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  species: yup
    .string()
    .required('La especie es obligatoria')
    .oneOf(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'], 'Especie inválida'),

  breed: yup
    .string()
    .max(100, 'La raza no puede exceder 100 caracteres')
    .optional(),

  birthDate: yup
    .string()
    .required('La fecha de nacimiento es obligatoria')
    .test('is-valid-date', 'La fecha de nacimiento no puede ser futura', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return date <= new Date();
    }),

  gender: yup
    .string()
    .required('El género es obligatorio')
    .oneOf(['male', 'female', 'unknown'], 'Género inválido'),

  color: yup
    .string()
    .max(50, 'El color no puede exceder 50 caracteres')
    .optional(),

  weight: yup
    .number()
    .positive('El peso debe ser positivo')
    .max(500, 'El peso no puede exceder 500 kg')
    .optional()
    .nullable()
    .transform((value: unknown, originalValue: unknown) => (originalValue === '' ? null : value)),

  microchipNumber: yup
    .string()
    .matches(/^[0-9]{15}$/, 'El microchip debe tener exactamente 15 dígitos')
    .optional(),

  temperament: yup
    .string()
    .oneOf(['friendly', 'aggressive', 'shy', 'playful', 'calm', 'energetic', 'nervous', 'unknown'], 'Temperamento inválido')
    .optional(),

  behaviorNotes: yup
    .array()
    .of(yup.string().max(200, 'Cada nota no puede exceder 200 caracteres'))
    .optional(),

  generalNotes: yup
    .string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),
});

// Infer type from yup schema to ensure exact match
export type PetFormData = yup.InferType<typeof petFormSchema>;
