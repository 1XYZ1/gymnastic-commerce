# Guía de Uso - Hooks del Módulo Pets

Esta guía muestra cómo utilizar los hooks personalizados del módulo Pets en componentes React.

## Tabla de Contenidos

1. [usePets - Lista de Mascotas](#usepets---lista-de-mascotas)
2. [usePet - Mascota Individual](#usepet---mascota-individual)
3. [useCompleteProfile - Perfil Completo](#usecompleteprofile---perfil-completo)
4. [usePetMutations - Crear, Actualizar, Eliminar](#usepetmutations---crear-actualizar-eliminar)

---

## usePets - Lista de Mascotas

Hook para obtener la lista de mascotas con paginación.

### Ejemplo Básico

```tsx
import { usePets } from '@/pets/hooks';

export function PetsList() {
  const { data: pets, isLoading, error } = usePets();

  if (isLoading) return <div>Cargando mascotas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {pets?.map((pet) => (
        <div key={pet.id}>
          <h3>{pet.name}</h3>
          <p>{pet.species}</p>
        </div>
      ))}
    </div>
  );
}
```

### Con Paginación

```tsx
import { useState } from 'react';
import { usePets } from '@/pets/hooks';

export function PaginatedPetsList() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: pets, isLoading, isFetching } = usePets({
    limit,
    offset: page * limit,
  });

  return (
    <div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <>
          {pets?.map((pet) => <PetCard key={pet.id} pet={pet} />)}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isFetching}
            >
              Anterior
            </button>
            <span>Página {page + 1}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isFetching || (pets?.length ?? 0) < limit}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

### Carga Condicional

```tsx
import { usePets } from '@/pets/hooks';

export function OptionalPetsList({ shouldLoad }: { shouldLoad: boolean }) {
  // Solo ejecuta el query cuando shouldLoad es true
  const { data: pets } = usePets({ enabled: shouldLoad });

  if (!shouldLoad) return <div>Selecciona una opción para ver mascotas</div>;

  return <div>{/* Renderiza la lista */}</div>;
}
```

---

## usePet - Mascota Individual

Hook para obtener los datos de una mascota específica.

### Ejemplo con React Router

```tsx
import { useParams } from 'react-router-dom';
import { usePet } from '@/pets/hooks';

export function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>();
  const { data: pet, isLoading, error } = usePet(petId);

  if (isLoading) return <div>Cargando datos de la mascota...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!pet) return <div>Mascota no encontrada</div>;

  return (
    <div>
      <h1>{pet.name}</h1>
      <p>Especie: {pet.species}</p>
      <p>Raza: {pet.breed || 'No especificada'}</p>
      <p>Edad: {pet.age} {pet.ageUnit}</p>
      <img src={pet.imageUrl} alt={pet.name} />
    </div>
  );
}
```

### Actualización Automática al Cambiar ID

```tsx
import { usePet } from '@/pets/hooks';

export function PetQuickView({ selectedPetId }: { selectedPetId?: string }) {
  // El hook se ejecuta automáticamente cuando cambia selectedPetId
  const { data: pet, isLoading } = usePet(selectedPetId);

  if (!selectedPetId) return <div>Selecciona una mascota</div>;
  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h3>{pet?.name}</h3>
      {/* ... */}
    </div>
  );
}
```

---

## useCompleteProfile - Perfil Completo

Hook para obtener el perfil consolidado con historial médico, grooming y citas.

### Ejemplo Completo

```tsx
import { useParams } from 'react-router-dom';
import { useCompleteProfile } from '@/pets/hooks';
import { PetAgeCalculatorService } from '@/pets/services';

export function PetCompletePage() {
  const { petId } = useParams<{ petId: string }>();
  const { data: profile, isLoading, error } = useCompleteProfile(petId);

  if (isLoading) return <div>Cargando perfil completo...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>Perfil no encontrado</div>;

  const { pet, medicalHistory, groomingServices, appointments } = profile;

  // Usar servicio para calcular edad humana
  const humanAge = PetAgeCalculatorService.calculateHumanAge(
    pet.age,
    pet.ageUnit,
    pet.species
  );

  return (
    <div className="space-y-6">
      {/* Información Básica */}
      <section>
        <h2>{pet.name}</h2>
        <p>Edad: {pet.age} {pet.ageUnit} (≈ {humanAge} años humanos)</p>
      </section>

      {/* Historial Médico */}
      <section>
        <h3>Historial Médico ({medicalHistory.length})</h3>
        {medicalHistory.map((record) => (
          <div key={record.id}>
            <p><strong>{record.procedure}</strong></p>
            <p>{new Date(record.date).toLocaleDateString()}</p>
            <p>{record.veterinarian}</p>
          </div>
        ))}
      </section>

      {/* Servicios de Grooming */}
      <section>
        <h3>Grooming ({groomingServices.length})</h3>
        {groomingServices.map((service) => (
          <div key={service.id}>
            <p>{service.service} - ${service.cost}</p>
          </div>
        ))}
      </section>

      {/* Citas */}
      <section>
        <h3>Citas Programadas ({appointments.length})</h3>
        {appointments.map((apt) => (
          <div key={apt.id}>
            <p>{apt.type}</p>
            <p>{new Date(apt.appointmentDate).toLocaleString()}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

### Sincronización con usePet

```tsx
import { usePet, useCompleteProfile } from '@/pets/hooks';

export function PetDashboard({ petId }: { petId: string }) {
  // Cargar datos básicos primero (más rápido)
  const { data: pet, isLoading: loadingBasic } = usePet(petId);

  // Cargar perfil completo después
  const { data: profile, isLoading: loadingComplete } = useCompleteProfile(
    petId,
    !loadingBasic // Solo cargar cuando tengamos los datos básicos
  );

  return (
    <div>
      {loadingBasic ? (
        <div>Cargando...</div>
      ) : (
        <>
          <h1>{pet?.name}</h1>

          {loadingComplete ? (
            <div>Cargando historial...</div>
          ) : (
            <div>
              <p>Registros médicos: {profile?.medicalHistory.length}</p>
              <p>Servicios: {profile?.groomingServices.length}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## usePetMutations - Crear, Actualizar, Eliminar

Hook para realizar mutaciones con invalidación automática de cache.

### Crear Mascota

```tsx
import { useState } from 'react';
import { usePetMutations } from '@/pets/hooks';
import type { CreatePetDto } from '@/pets/types';

export function CreatePetForm() {
  const { createPet } = usePetMutations();
  const [formData, setFormData] = useState<CreatePetDto>({
    name: '',
    species: 'dog',
    age: 1,
    ageUnit: 'years',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPet.mutateAsync(formData);
      // Toast de éxito se muestra automáticamente
      // Lista de mascotas se invalida automáticamente

      // Limpiar formulario
      setFormData({ name: '', species: 'dog', age: 1, ageUnit: 'years' });
    } catch (error) {
      // Toast de error se muestra automáticamente
      console.error('Error al crear mascota:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nombre de la mascota"
      />

      <select
        value={formData.species}
        onChange={(e) => setFormData({ ...formData, species: e.target.value as 'dog' | 'cat' })}
      >
        <option value="dog">Perro</option>
        <option value="cat">Gato</option>
      </select>

      <button
        type="submit"
        disabled={createPet.isPending}
      >
        {createPet.isPending ? 'Creando...' : 'Crear Mascota'}
      </button>
    </form>
  );
}
```

### Actualizar Mascota

```tsx
import { useState, useEffect } from 'react';
import { usePet, usePetMutations } from '@/pets/hooks';
import type { UpdatePetDto } from '@/pets/types';

export function EditPetForm({ petId }: { petId: string }) {
  const { data: pet } = usePet(petId);
  const { updatePet } = usePetMutations();
  const [formData, setFormData] = useState<UpdatePetDto>({});

  // Cargar datos actuales cuando llegue la mascota
  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        breed: pet.breed,
        weight: pet.weight,
        imageUrl: pet.imageUrl,
      });
    }
  }, [pet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePet.mutateAsync({ id: petId, data: formData });
      // Cache se invalida automáticamente
      // Toast de éxito se muestra automáticamente
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nombre"
      />

      <input
        type="text"
        value={formData.breed || ''}
        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
        placeholder="Raza"
      />

      <button
        type="submit"
        disabled={updatePet.isPending}
      >
        {updatePet.isPending ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  );
}
```

### Eliminar Mascota

```tsx
import { usePetMutations } from '@/pets/hooks';
import { useNavigate } from 'react-router-dom';

export function DeletePetButton({ petId, petName }: { petId: string; petName: string }) {
  const { deletePet } = usePetMutations();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar a ${petName}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await deletePet.mutateAsync(petId);
      // Toast de éxito se muestra automáticamente
      // Cache se invalida automáticamente

      // Redirigir a la lista
      navigate('/pets');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deletePet.isPending}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {deletePet.isPending ? 'Eliminando...' : 'Eliminar Mascota'}
    </button>
  );
}
```

### Uso Combinado (CRUD Completo)

```tsx
import { usePets, usePetMutations } from '@/pets/hooks';
import type { CreatePetDto } from '@/pets/types';

export function PetsManager() {
  const { data: pets, isLoading } = usePets();
  const { createPet, updatePet, deletePet } = usePetMutations();

  const handleCreate = async (data: CreatePetDto) => {
    await createPet.mutateAsync(data);
    // La lista se actualiza automáticamente
  };

  const handleUpdate = async (id: string, data: UpdatePetDto) => {
    await updatePet.mutateAsync({ id, data });
    // La mascota específica y la lista se actualizan
  };

  const handleDelete = async (id: string) => {
    await deletePet.mutateAsync(id);
    // La mascota se elimina del cache y la lista se actualiza
  };

  return (
    <div>
      <CreatePetForm onSubmit={handleCreate} isSubmitting={createPet.isPending} />

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        pets?.map((pet) => (
          <PetCard
            key={pet.id}
            pet={pet}
            onUpdate={(data) => handleUpdate(pet.id, data)}
            onDelete={() => handleDelete(pet.id)}
            isUpdating={updatePet.isPending}
            isDeleting={deletePet.isPending}
          />
        ))
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Manejo de Estados

```tsx
const { data, isLoading, error, isFetching, isSuccess } = usePets();

// isLoading: Primera carga
// isFetching: Cualquier fetch (incluye refetch)
// error: Error si lo hay
// isSuccess: Query exitoso
```

### 2. Optimistic Updates (Avanzado)

```tsx
const { updatePet } = usePetMutations();
const queryClient = useQueryClient();

const handleUpdate = async (id: string, data: UpdatePetDto) => {
  // Actualización optimista (opcional)
  const previousPet = queryClient.getQueryData(['pet', id]);

  queryClient.setQueryData(['pet', id], (old: Pet) => ({
    ...old,
    ...data,
  }));

  try {
    await updatePet.mutateAsync({ id, data });
  } catch (error) {
    // Revertir en caso de error
    queryClient.setQueryData(['pet', id], previousPet);
  }
};
```

### 3. Invalidación Manual

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidar todas las mascotas
queryClient.invalidateQueries({ queryKey: ['pets'] });

// Invalidar una mascota específica
queryClient.invalidateQueries({ queryKey: ['pet', petId] });

// Refetch inmediato
queryClient.refetchQueries({ queryKey: ['pets'] });
```

### 4. Prefetch para Mejor UX

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { petRepository } from '@/pets/repositories';

function PetsList() {
  const queryClient = useQueryClient();
  const { data: pets } = usePets();

  const handleMouseEnter = (petId: string) => {
    // Pre-cargar datos de la mascota al hacer hover
    queryClient.prefetchQuery({
      queryKey: ['pet', petId],
      queryFn: () => petRepository.findById(petId),
    });
  };

  return (
    <div>
      {pets?.map((pet) => (
        <div
          key={pet.id}
          onMouseEnter={() => handleMouseEnter(pet.id)}
        >
          {pet.name}
        </div>
      ))}
    </div>
  );
}
```

---

## Notas Importantes

1. **Validación automática**: `usePetMutations` ya valida los datos con `PetValidationService`
2. **Toast notifications**: Se muestran automáticamente en success/error
3. **Cache invalidation**: Sucede automáticamente después de mutaciones
4. **TypeScript**: Todos los hooks tienen tipos completos inferidos
5. **Error handling**: Los errores se propagan como `Error` objects

---

## Troubleshooting

### Error: "Pet ID is required"
```tsx
// ❌ Incorrecto
const { data } = usePet(undefined);

// ✅ Correcto
const { data } = usePet(petId, !!petId);
```

### La lista no se actualiza después de crear
```tsx
// Asegúrate de estar usando el hook correctamente
const { createPet } = usePetMutations();

// El hook invalida automáticamente ['pets']
// Si no funciona, verifica que estés usando el mismo queryKey
```

### Queries ejecutándose innecesariamente
```tsx
// Usa enabled para control fino
const { data } = usePets({ enabled: shouldLoad });
const { data: pet } = usePet(petId, !!petId && isAuthenticated);
```
