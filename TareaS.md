# Tarea: Implementar Vista de Lista para Múltiples Citas Diarias

¡Hola! Aquí tienes una guía detallada para implementar la funcionalidad que solicitaste. El objetivo es que cuando un día en la vista de "mes" del calendario tenga más de 3 citas, se muestre un enlace para verlas todas en una lista detallada.

## Archivo principal a modificar

Toda la lógica y la interfaz del calendario se encuentran en un único archivo, lo que facilita bastante la tarea. El archivo que necesitas editar es:

-   `src/components/dashboard/sessions-calendar.tsx`

## Plan de acción paso a paso

A continuación, te detallo los pasos y las partes del código que deberías modificar.

### 1. Añadir nuevos estados para el modal

Necesitarás dos nuevos estados en el componente `SessionsCalendar` para controlar la visibilidad del modal (la vista de lista) y para saber qué día se ha seleccionado.

```typescript
// Al inicio del componente SessionsCalendar, junto a los otros `useState`.
const [isDayDetailOpen, setIsDayDetailOpen] = React.useState(false);
const [dayWithTooManySessions, setDayWithTooManySessions] = React.useState<Date | null>(null);

```

-   `isDayDetailOpen`: Un booleano que controla si el modal con la lista de citas está abierto o cerrado.
-   `dayWithTooManySessions`: Almacenará el objeto `Date` del día que el usuario quiere inspeccionar.

### 2. Modificar la lógica de la vista del mes (`renderMonthView`)

Dentro de la función `renderMonthView`, necesitas cambiar cómo se muestran las citas cuando hay más de 3.

**Localiza esta parte del código:**

```javascript
// Dentro del `div` que mapea los `days` del mes.
<div className="absolute top-8 left-1 right-1 flex flex-col gap-1">
  {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).slice(0, 3).map((session) => (
      // ...código que renderiza cada sesión individual
  ))}
   {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length > 3 && (
      <div className="text-primary/80 text-xs font-bold px-1 py-0.5 mt-1">
        ...y {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length - 3} más
      </div>
   )}
</div>
```

**Propuesta de modificación:**

Debes reemplazar el `div` que muestra "...y X más" por un `button` o `div` clicable. Este nuevo elemento, al ser presionado, actualizará los estados que creaste en el paso 1.

```javascript
// Reemplaza el bloque `{(sessionsByDay[...].length > 3 && ...)}` con esto:
{(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length > 3 && (
    <button
        onClick={(e) => {
            e.stopPropagation(); // Evita que se seleccione el día en el calendario principal
            setDayWithTooManySessions(day);
            setIsDayDetailOpen(true);
        }}
        className="text-primary/80 text-xs font-bold px-1 py-0.5 mt-1 text-left hover:underline"
    >
        Ver las {(sessionsByDay[format(day, "yyyy-MM-dd")] || []).length} citas
    </button>
)}
```

### 3. Crear el nuevo componente de Modal (Dialog)

Al final del archivo `sessions-calendar.tsx`, fuera del `return` principal del componente `SessionsCalendar`, puedes crear un nuevo componente para la lista de citas o simplemente añadir el JSX del `Dialog` dentro del `return`.

Te recomiendo añadirlo junto a los otros `Dialog` que ya existen para mantener el orden.

```javascript
// Añade este JSX dentro del fragmento <>...</> del return principal.
<Dialog open={isDayDetailOpen} onOpenChange={setIsDayDetailOpen}>
    <DialogContent className="max-w-xl">
        <DialogHeader>
            <DialogTitle>
                Citas para el {dayWithTooManySessions ? format(dayWithTooManySessions, "eeee, d 'de' MMMM", { locale: es }) : ''}
            </DialogTitle>
            <DialogDescription>
                Listado completo de todas las sesiones agendadas para este día.
            </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
                {dayWithTooManySessions && sessionsByDay[format(dayWithTooManySessions, "yyyy-MM-dd")]
                    ?.sort((a, b) => a.date.getTime() - b.date.getTime()) // Ordenar cronológicamente
                    .map(session => {
                        const StatusIcon = statusDetails[session.status]?.icon || HelpCircle;
                        return (
                            <div key={session.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => {
                                setIsDayDetailOpen(false);
                                handleSessionClick(session);
                            }}>
                                <div className="flex-shrink-0">
                                    <StatusIcon className={cn("w-6 h-6", statusDetails[session.status]?.color)} />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold">{session.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{session.type}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="font-medium">{format(session.date, "p", { locale: es })}</p>
                                    <p className="text-muted-foreground">{session.status}</p>
                                </div>
                            </div>
                        )
                })}
            </div>
        </div>
    </DialogContent>
</Dialog>
```

**Criterios de aceptación cubiertos en esta propuesta:**

1.  ✅ **Botón "Ver todas las citas"**: Se muestra cuando hay más de 3 citas.
2.  ✅ **Despliegue de la lista**: Al hacer clic, se abre un `Dialog` con la lista.
3.  ✅ **Información de la cita**: La lista muestra nombre del paciente, tipo de sesión, hora y estado (con un ícono de color).
4.  ✅ **Cierre fácil**: El `Dialog` se puede cerrar haciendo clic fuera o en el botón de cierre (X).
5.  ✅ **Orden cronológico**: Se utiliza `.sort()` para ordenar las citas por hora.

¡Mucha suerte con la implementación! Con estos pasos deberías poder añadir la funcionalidad sin problemas.