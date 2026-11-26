# Skill MicroLearn: dar formato a un curso para la presentación interactiva

> **¿Eres una IA y te han dado la dirección de esta página?** Contiene tus instrucciones.
> Léela entera y después transforma el curso que te proporcione el profesorado en **un único documento Markdown**
> que respete exactamente la sintaxis que se describe a continuación. El archivo se pegará en *MicroLearn Studio*,
> que lo convierte en una presentación interactiva (cuestionarios, tarjetas giratorias, líneas de tiempo, diálogos entre personajes…).

---

## 1. Tu misión

1. **Lee el contenido proporcionado** (texto, esquema, apuntes, PDF copiado, etc.). No pierdas ninguna información importante y no inventes ningún dato.
2. **Divídelo en diapositivas cortas**: una idea por diapositiva, entre 40 y 80 palabras de texto como máximo. Un módulo suele tener entre 8 y 20 diapositivas.
3. **Para cada diapositiva, elige el formato más atractivo** (ver § 4). Alterna los formatos: evita encadenar más de dos diapositivas de «Contenido» seguidas.
4. **Añade interactividad**: al menos un cuestionario cada 4 a 6 diapositivas, tarjetas para el vocabulario, una línea de tiempo para las fechas, un diálogo para presentar una situación.
5. **Haz hablar a los personajes** (roles `mentor` y `peer` por defecto) en los diálogos, consejos y cuestionarios, y **propón una lista de profesiones** (`jobs`, ver § 5) coherente con el curso.
6. **Entrega tu respuesta** en el formato descrito en el § 7.

Redacta el curso en el idioma solicitado (por defecto, el del contenido proporcionado) e indícalo en `lang`. Los ejemplos de esta página están en español (versión francesa: skill.md; versión inglesa: skill-en.md), pero la sintaxis es idéntica en todos los idiomas: solo cambian los textos; los identificadores de formatos, de roles y de expresiones se mantienen siempre en inglés y en minúsculas.

**¿Curso largo?** Por encima de unas 20 diapositivas, divídelo: o bien en **capítulos** dentro de un mismo módulo (una diapositiva `format-title` por capítulo), o bien en **varios módulos** (ver § 2b) si el profesorado lo pide o si el contenido supera las 30 o 40 diapositivas.

Si el profesorado da indicaciones (duración, público, tono, número de diapositivas, formatos preferidos), estas tienen prioridad sobre las recomendaciones de esta página. No cambies nunca la **sintaxis**.

---

## 2. Estructura general del archivo

El archivo empieza con una **cabecera YAML** entre dos líneas `---`, seguida de las diapositivas, **separadas por una línea que solo contiene `---`**.

```markdown
---
title: "Título del módulo"
subtitle: "Microaprendizaje · 10 minutos"
description: "Una frase que invite a seguir el módulo."
duration: 10 min
author: "Nombre del profesor o la profesora"
lang: es
theme: violet
jobs: [profesor/profesora, orientador/orientadora, bibliotecario/bibliotecaria escolar]
characters:
  mentor: "La Guía"
  peer: "El Compañero"
---

<!-- slide: format-title -->
### Primer título
Texto de la primera diapositiva.

---

<!-- slide: format-content -->
### Segunda diapositiva
Texto…
```

### Campos de la cabecera

| Campo | Obligatorio | Función |
|---|---|---|
| `title` | sí | Título del módulo (entre comillas si contiene `:` o `'`). |
| `subtitle` | no | Texto pequeño encima del título en la pantalla de bienvenida. |
| `description` | recomendado | Una frase de presentación en la pantalla de bienvenida. |
| `duration` | recomendado | Duración estimada, p. ej. `10 min`. |
| `author` | no | Autor o autora. |
| `lang` | **sí** | Idioma del curso: `es`, `en` o `fr` (vendrán más idiomas). Traduce los botones e instrucciones de la presentación (Siguiente, Comprobar, Reintentar…) y elige las voces de lectura en voz alta. **Indica siempre el idioma en el que redactas el curso.** |
| `theme` | no | Colores: `violet` (por defecto), `ocean`, `sunset`, `forest`, `night`. |
| `characters` | recomendado | Los **roles** de los personajes y su nombre visible (ver § 5). |
| `audio` | no | `off` para desactivar la lectura en voz alta en todo el módulo. |
| `audio-min` | no | Longitud (en caracteres) a partir de la cual un texto recibe un icono de escucha. Por defecto: `120`. |
| `course` | no | Nombre del **curso** cuando la formación tiene varios módulos. |
| `module` / `modules` | no | Posición de este módulo y número total de módulos del curso, p. ej. `module: 2` y `modules: 4`. |
| `next` | no | Módulo siguiente: `title` (y una `url` opcional, para la publicación web; se ignora en SCORM). `label` cambia el texto del botón (por defecto «Módulo siguiente»). |
| `jobs` | **recomendado** | Profesiones asignadas a los personajes, ver § 5. P. ej. `jobs: [enfermero/enfermera, auxiliar de enfermería, supervisor/supervisora de planta]`. |
| `color` / `accent` | no | Color principal / secundario, p. ej. `color: "#1f7a8c"`; los fondos se derivan de él. Solo si el profesorado da un color (identidad visual, herramienta). |
| `address` | no | Solo en francés: `tu` hace que la interfaz del reproductor tutee («tu»). |
| `score` | no | `off`: sin nota en la pantalla final (visita, descubrimiento, módulo no evaluado). |
| `exit` / `exit-label` | no | Dirección y texto de un botón «Salir» (solo si el profesorado da la dirección de vuelta). |
| `labels` | no | Sustituye textos de la interfaz, p. ej. `p.slide: "Paso {n}"`, `p.endTitle: "¡Visita terminada!"` (una línea sangrada por texto). Solo si se pide. |
| `dialogue-autoplay` | no | `off`: los diálogos tipo mensajería (`format-sms`) avanzan con un clic en lugar de reproducirse solos. |

### Reglas obligatorias

- Una línea `---` sola **separa siempre dos diapositivas**. **No** uses **nunca** `---` como línea horizontal dentro de una diapositiva.
- Cada diapositiva empieza con el comentario `<!-- slide: format-xxx -->` (ver § 4), seguido opcionalmente de otros comentarios `<!-- clave: valor -->`.
- Cada diapositiva tiene **un único título principal**, de nivel `###`. Los subtítulos `####` solo se usan en el formato Pestañas.
- Los comentarios `<!-- … -->` no se muestran: sirven de ajustes.
- Todo lo demás es Markdown estándar: **negrita**, *cursiva*, listas, enlaces, tablas, `código`.
- No inventes **ninguna ruta de imagen**. Usa una imagen (`![texto alternativo](ruta)`) solo si el profesorado te da su ruta o su URL; si no, elige un formato que no la necesite. Proporciona siempre un texto alternativo descriptivo.

### 2b. Un curso en varios módulos

Cada módulo es un documento Markdown completo y autónomo (su propia cabecera, sus propias diapositivas). **Eres tú quien numera los módulos y los enlaza entre sí.**

**Procedimiento:**

1. Planifica primero la división: enumera los N módulos en orden, cada uno con un título corto y distinto (de 5 a 15 diapositivas por módulo).
2. En la cabecera de **cada** módulo, indica:
   - `course`: el **mismo nombre de curso** en todos los módulos (cópialo exactamente, carácter por carácter);
   - `module`: la posición del módulo, de `1` a N;
   - `modules`: N, **idéntico en todos los módulos**;
   - `next` → `title`: el `title` **exacto** del módulo siguiente (módulo k+1);
   - el mismo `lang`, los mismos roles en `characters` y el mismo `theme` en todos los módulos, para una experiencia coherente.
3. **Último módulo** (módulo N): sin campo `next`.
4. Cada módulo empieza con una diapositiva `format-title` (con, por ejemplo, `<!-- eyebrow: Módulo k -->`) y termina con una breve diapositiva de cierre que anuncia el módulo siguiente.
5. `url`: **añádela solo si el profesorado indica que los módulos se publicarán en la web, en una intranet o en una memoria USB.** En ese caso usa `url: "../<carpeta>/index.html"`, donde `<carpeta>` es el título del módulo siguiente en minúsculas, sin tildes, con cada secuencia de caracteres que no sean letras ni cifras sustituida por un guion, y sin guion al principio ni al final (p. ej. «Contraste y color» → `contraste-y-color`). Es el nombre de la carpeta que crea la exportación ZIP. No pongas nunca `url` para una difusión SCORM.

**Ejemplo: módulo 2 de un curso de 3 módulos**

```markdown
---
title: "Formularios accesibles"
course: "Accesibilidad digital"
module: 2
modules: 3
next:
  title: "Contraste y color"
lang: es
theme: ocean
characters:
  mentor: "La Guía"
  peer: "El Compañero"
---
```

El módulo 1 tendría `module: 1` y `next` → `title: "Formularios accesibles"`; el módulo 3, `module: 3` y ningún `next`.

La pantalla final de cada módulo muestra el progreso en el curso («Módulo 2 / 3») y presenta el módulo siguiente.

---

## 3. Ajustes de diapositiva (comentarios)

| Comentario | Efecto |
|---|---|
| `<!-- slide: format-quiz -->` | Formato de la diapositiva (obligatorio). |
| `<!-- character-role: mentor -->` | Personaje que presenta la diapositiva (diálogo, consejo, cuestionario, portada). |
| `<!-- character-expression: happy -->` | Expresión del personaje. |
| `<!-- eyebrow: Capítulo 2 -->` | Pequeña etiqueta encima del título (formato Portada). |
| `<!-- button: Empezar -->` | Texto del botón (formato Portada). |
| `<!-- badge: Truco -->` | Texto de la insignia (formato Consejo). |
| `<!-- audio: all -->` | Icono de escucha en todos los textos de la diapositiva, incluso los cortos. |
| `<!-- audio: off -->` | Sin lectura en voz alta en esta diapositiva (p. ej. cuando oír el texto estropearía el ejercicio). |
| `<!-- id: menu -->` | Identificador de la diapositiva, destino de un enlace `[texto](#menu)` (ver `format-menu`). `<!-- id: fin -->` = conclusión de un recorrido a la carta. |
| `<!-- branch: recepcion -->` | Inicio de la parte `recepcion` de un menú (`format-menu`). |
| `<!-- parent: menu -->` | Menú al que vuelve la parte (por defecto: el último menú que la precede). |
| `<!-- autoplay: off -->` | Diálogo tipo mensajería (`format-sms`): mensajes con un clic en lugar de automáticos. |
| `<!-- chapter: Nombre del capítulo -->` | Inicia un capítulo en esta diapositiva. Cada diapositiva `format-title` ya inicia uno automáticamente (`<!-- chapter: no -->` para evitarlo). |

**Expresiones disponibles**: `neutral`, `happy`, `encouraging`, `thinking`, `surprised`, `concerned`.

---

## 4. Formatos de diapositiva

### `format-title` — Portada / inicio de capítulo
Título grande, gancho, personaje o imagen, botón para empezar. Úsalo para la **primera diapositiva** y para abrir cada gran parte.

```markdown
<!-- slide: format-title -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
<!-- eyebrow: Módulo 1 -->
### Te damos la bienvenida al mundo de la fotosíntesis
En 10 minutos, descubre cómo fabrican las plantas su energía.
```

### `format-content` — Contenido
Texto, listas, tablas. Una imagen sola en su línea se muestra junto al texto.

```markdown
<!-- slide: format-content -->
### Los ingredientes de la fotosíntesis
Una planta necesita tres cosas:

- la **luz** del sol
- el **agua** que absorben las raíces
- el **dióxido de carbono** del aire
```

### `format-dialogue` — Diálogo entre personajes
Cada cita `>` es una intervención, que se muestra de una en una. Para cambiar de interlocutor, pon un comentario `character-role` antes de la intervención, **o** empieza la intervención con `@role:` o `@role(expression):`.

```markdown
<!-- slide: format-dialogue -->
<!-- character-role: peer -->
<!-- character-expression: thinking -->
### Una pregunta para empezar
> Oye, ¿por qué son verdes las hojas?

> @mentor(happy): ¡Por la clorofila! Es la que capta la luz.

> @peer(surprised): ¡Entonces es el panel solar de la planta!
```

Ideal para: presentar una situación, plantear un problema, cerrar el módulo (basta con una sola intervención).

El primer rol declarado en `characters` (normalmente `mentor`) habla siempre a la izquierda y los demás a la derecha: declara primero el personaje que guía.

### `format-sms` — Diálogo tipo mensajería
La misma sintaxis que `format-dialogue` (`> @role(expression): texto`), pero presentado como una conversación en el móvil: los mensajes llegan solos, uno a uno, tras un indicador «…». Escribe mensajes cortos (una o dos frases, 25 palabras como máximo) y de 3 a 7 mensajes. Añade `<!-- autoplay: off -->` si el alumnado debe leer a su ritmo (mensajes largos o importantes).

```markdown
<!-- slide: format-sms -->
### Un mensaje antes de la práctica
> @peer(thinking): ¡Hola! ¿De verdad hay que entregar el informe esta noche?

> @mentor: Sí, antes de las 20:00 en la plataforma.

> @peer(concerned): ¿Y si no he terminado las mediciones?

> @mentor(encouraging): Entrega lo que tengas y explica lo que falta. ¡Mejor que nada!
```

Ideal para: un intercambio informal, una pregunta práctica, una situación cotidiana. No más de uno o dos por módulo.

### `format-prenom` — Pedir el nombre
El personaje hace una pregunta (una cita `>`) y la persona que aprende escribe su nombre (opcional). Después, `{name}` se sustituye por ese nombre en el texto de todas las diapositivas. **Escribe siempre `{, name}`** («¡Te damos la bienvenida{, name}!»): sin nombre, la marca desaparece junto con su coma. Úsalo solo si el profesorado lo pide o para una visita muy cercana, como 2.ª diapositiva.

```markdown
<!-- slide: format-prenom -->
<!-- character-role: mentor -->
<!-- character-expression: happy -->
### Vamos a conocernos
> ¡Hola! Antes de empezar, ¿cómo te llamas?
```

### `format-menu` — Recorrido a la carta
Un menú en el que cada botón lleva a una **parte**. Cada elemento: `- [emoji Etiqueta](#identificador) :: descripción breve`. La parte empieza con una diapositiva que lleva `<!-- branch: identificador -->` y termina en la diapositiva que abre otra parte, en un menú o en una diapositiva `<!-- id: … -->`. Al final de una parte, el reproductor vuelve al menú; las partes ya vistas aparecen marcadas. Las citas `>` son las intervenciones del guía: la 1.ª en la primera visita, la 2.ª al volver, la 3.ª cuando se ha visto todo. `[Etiqueta](#id "featured")` destaca un elemento. Termina con una diapositiva de conclusión `<!-- id: fin -->`, a la que se llega con el botón «He terminado».

```markdown
<!-- slide: format-menu -->
<!-- id: menu -->
<!-- character-role: mentor -->
### ¿Por dónde empezamos?
> Elige una parte y te llevo. Volverás aquí al final de cada una.

> ¿Seguimos? Las partes que ya has visto están marcadas.

> ¡Lo has visto todo, enhorabuena! Puedes terminar o repasar una parte.

- [🛎️ La recepción](#recepcion) :: Donde todo empieza
- [📚 El vocabulario](#palabras) :: Las palabras del oficio

---

<!-- slide: format-dialogue -->
<!-- branch: recepcion -->
### La recepción
> …

---

<!-- slide: format-flashcards -->
<!-- branch: palabras -->
### El vocabulario
- **Signatura** :: …

---

<!-- slide: format-dialogue -->
<!-- id: fin -->
### Recapitulemos
> …
```

Úsalo solo para una visita, una formación a la carta o si el profesorado lo pide, con 3 a 8 partes independientes (el orden no debe importar). Cada `#identificador` del menú necesita su diapositiva `<!-- branch: identificador -->`. En cualquier diapositiva, un enlace `[texto](#id)` también lleva a la diapositiva `<!-- id: … -->` o `<!-- branch: … -->`.

### `format-conseil` — Consejo de un personaje
Un recuadro de «consejo» con el personaje en grande. Una cita `>` dentro se destaca.

```markdown
<!-- slide: format-conseil -->
<!-- character-role: mentor -->
<!-- character-expression: encouraging -->
<!-- badge: Truco para recordar -->
### Recuerda la ecuación
Piensa en «**CO₂ + agua + luz → azúcar + O₂**».

> ¡La planta se alimenta de luz y respira lo que nosotros espiramos!
```

### `format-quiz` — Cuestionario
- `- [x]` = respuesta correcta, `- [ ]` = respuesta incorrecta.
- **Varios `[x]`** = cuestionario de respuesta múltiple (botón Comprobar).
- Después de una respuesta, añade ` :: explicación` para una retroalimentación personalizada (recomendado para las respuestas incorrectas).
- Una cita `>` al final = explicación general que se muestra tras responder.
- El personaje reacciona automáticamente (contento / preocupado).
- De 3 a 5 opciones, una sola pregunta por diapositiva.

```markdown
<!-- slide: format-quiz -->
<!-- character-role: mentor -->
<!-- character-expression: thinking -->
### ¿Qué gas libera la planta?
- [ ] Dióxido de carbono :: No, ese es el que absorbe.
- [x] Oxígeno :: Exacto, un «residuo» muy valioso para nosotros.
- [ ] Nitrógeno
- [ ] Vapor de agua :: También lo libera, pero no es el producto de la fotosíntesis.

> La fotosíntesis produce azúcar y libera oxígeno.
```

### `format-flashcards` — Tarjetas giratorias
Vocabulario, definiciones, nociones clave. Sintaxis: `- **Término** :: Definición`. De 3 a 8 tarjetas.

```markdown
<!-- slide: format-flashcards -->
### Vocabulario clave
Gira cada tarjeta para descubrir su definición.

- **Clorofila** :: Pigmento verde que capta la luz.
- **Estoma** :: Pequeña abertura de la hoja por la que entran y salen los gases.
- **Glucosa** :: Azúcar que fabrica la planta, su fuente de energía.
```

### `format-timeline` — Línea de tiempo
Fechas, etapas de un proceso, un procedimiento ordenado. Sintaxis: `- **Hito** :: Descripción`. De 3 a 7 etapas.

```markdown
<!-- slide: format-timeline -->
### Las etapas de la fotosíntesis
- **1. Captación** :: La clorofila absorbe la luz.
- **2. Absorción** :: Las raíces toman el agua y los estomas captan el CO₂.
- **3. Transformación** :: La energía luminosa fabrica glucosa.
- **4. Liberación** :: El oxígeno se libera al aire.
```

### `format-tabs` — Pestañas (acordeón en el móvil)
Varias facetas de una misma noción. Cada subtítulo `####` crea una pestaña. De 2 a 6 pestañas.

```markdown
<!-- slide: format-tabs -->
### ¿Dónde tiene lugar la fotosíntesis?
#### Las hojas
Concentran la clorofila y captan la máxima luz posible.

#### Los tallos verdes
Algunas plantas, como los cactus, realizan la fotosíntesis en sus tallos.

#### Las algas
Realizan la fotosíntesis en el agua y producen una gran parte del oxígeno de la Tierra.
```

### `format-hotspots` — Imagen interactiva
**Solo si se proporciona una imagen.** Puntos en los que se puede hacer clic sobre la imagen. Sintaxis: `- X,Y :: **Título** :: Texto`, donde X e Y son porcentajes (de 0 a 100) desde la esquina superior izquierda. Si no conoces la imagen, reparte los puntos de forma regular e indica al profesorado que habrá que ajustar las coordenadas.

```markdown
<!-- slide: format-hotspots -->
### Anatomía de una hoja
Haz clic en los puntos para explorar la hoja.

![Esquema en corte de una hoja](images/hoja.png)

- 20,30 :: **Epidermis** :: Capa protectora transparente.
- 50,55 :: **Cloroplastos** :: Donde tiene lugar la fotosíntesis.
- 75,85 :: **Estoma** :: Abertura para el intercambio de gases.
```


### Formatos beta: esquemas interactivos

Estos 7 formatos (en pruebas) convierten una lista en un esquema que el alumnado explora parte por parte. Sintaxis común: `- **Parte** :: explicación` (etiqueta de 1 a 3 palabras); una cita `>` opcional es la **idea clave**, que solo se revela cuando se han explorado todas las partes.

| Formato | Cuándo usarlo | Elementos | Opciones |
|---|---|---|---|
| `format-puzzle` | los componentes de un todo (piezas que hay que colocar) | de 2 a 6 | — |
| `format-pyramid` | una jerarquía; el 1.er elemento está en la **cima** | de 2 a 7 | — |
| `format-funnel` | un filtrado, del más amplio al más estrecho | de 2 a 7 | — |
| `format-cycle` | etapas que se repiten en bucle | de 2 a 8 | `<!-- center: … -->` |
| `format-process` | un método, etapas sucesivas | de 2 a 7 | — |
| `format-matrix` | dos criterios cruzados; orden: arriba a la izquierda, arriba a la derecha, abajo a la izquierda, abajo a la derecha | 4 | `<!-- axis-x: … -->`, `<!-- axis-y: … -->` |
| `format-hub` | un concepto central y sus componentes | de 2 a 8 | `<!-- center: … -->` (si no, el título) |

```markdown
<!-- slide: format-cycle -->
<!-- center: Aprender de la experiencia -->
### El ciclo de aprendizaje de Kolb
- **Experiencia concreta** :: Vivir una situación.
- **Observación reflexiva** :: Tomar distancia, describir.
- **Conceptualización** :: Extraer una regla.
- **Experimentación activa** :: Probarla en otro contexto.

> Aprender es recorrer este ciclo una y otra vez.
```

Úsalos cuando la **estructura de la idea** coincida con la forma, como mucho uno o dos por módulo. Como están en beta, en caso de duda prefiere los formatos principales.

---

## 5. Personajes

- En la cabecera, `characters` declara **roles** (identificador corto en minúsculas → nombre visible).
- Cada persona que aprende elige al empezar la apariencia de cada rol, entre un repertorio diverso (edades, géneros, orígenes, discapacidades). **Por eso, no describas nunca la apariencia física** de los personajes en el texto.
- Todo rol que se use en una diapositiva **debe estar declarado** en la cabecera.
- Normalmente bastan dos roles: `mentor` (la persona que guía) y `peer` (un compañero o compañera que hace las preguntas del alumnado). Puedes añadir más (p. ej. `client: "La Clienta"`).
- Los personajes se dirigen al alumnado con un tono cercano y sencillo. Mantén el mismo nivel de formalidad (tú o usted) en todo el módulo.
- **Profesiones (`jobs`)**: por defecto, cada personaje del repertorio tiene una profesión sin relación con tu curso (ingeniera, abogado…). **Propón siempre** en la cabecera una lista `jobs` de 3 a 6 profesiones **coherentes con el curso y su público** (las personas con las que uno se cruza en ese ámbito): `jobs: [bibliotecario/bibliotecaria, almacenero/almacenera, dinamizador/dinamizadora digital]`. Se reparten entre los personajes; sus rasgos visibles (edad, discapacidad, hiyab…) siguen mostrándose. Para un público escolar, funcionan bien los roles del centro o del alumnado (`alumno/alumna de 3.º de ESO`, `profesor/profesora de Biología`). `jobs: off` muestra solo los rasgos. (En los cursos en español o en francés, escribe la forma masculina y la femenina separadas por `/` cuando sean distintas.)

---

## 6. Buenas prácticas pedagógicas

- **Diapositiva 1**: `format-title`. **Diapositiva 2**: a menudo un `format-dialogue` que plantea el problema o lo que está en juego.
- **Última diapositiva**: un diálogo breve o un consejo que resuma y anime.
- Títulos cortos y significativos (menos de 60 caracteres), preferiblemente en forma de pregunta o de afirmación.
- Frases cortas, vocabulario adaptado al público, una noción por diapositiva.
- Los cuestionarios comprueban lo que se acaba de ver; las respuestas incorrectas deben ser verosímiles y sus explicaciones, útiles.
- Accesibilidad: texto alternativo para cada imagen, ninguna información transmitida solo mediante el color.
- La lectura en voz alta es automática (textos largos, diálogos, elementos abiertos). Escribe frases que suenen bien al oído; evita las abreviaturas poco claras y los símbolos que se leen de forma extraña. Añade `<!-- audio: all -->` solo cuando sea útil.

---

## 7. Formato de tu respuesta

1. Entrega **cada módulo en su propio bloque de código** Markdown (un solo bloque si el curso cabe en un módulo), en orden, cada uno precedido de una línea «Módulo k / N: título» fuera del bloque (etiquetado ```` ```markdown ````), desde el primer `---` de la cabecera hasta la última diapositiva, para que el profesorado pueda copiarlo con un clic.
2. Si un ejemplo de código debe aparecer *dentro* de una diapositiva, usa virgulillas `~~~` para ese bloque interior (para no romper tu bloque de respuesta).
3. **Después** del bloque, añade como máximo 5 líneas: número de diapositivas, formatos utilizados, puntos que debe revisar el profesorado (imágenes que hay que aportar, coordenadas que ajustar, decisiones pedagógicas discutibles).
4. No pongas ningún otro texto en el bloque de código.

### Comprobación antes de enviar

- [ ] La cabecera empieza y termina con `---` y contiene `title`, `lang` y `characters`.
- [ ] Cada diapositiva empieza con `<!-- slide: format-… -->` con un formato del § 4 (formatos beta incluidos).
- [ ] Las diapositivas están separadas por una línea `---` sola, sin ningún `---` decorativo.
- [ ] Cada diapositiva tiene exactamente un título `###`.
- [ ] Cada cuestionario tiene al menos una respuesta `[x]`.
- [ ] Las tarjetas y las etapas de la línea de tiempo usan `**Término** :: texto`.
- [ ] Todos los roles utilizados están declarados en `characters`, el que guía en primer lugar.
- [ ] La cabecera contiene una lista `jobs` coherente con el curso.
- [ ] Menú con ramas: cada `[…](#id)` del menú tiene su diapositiva `<!-- branch: id -->`, y una diapositiva `<!-- id: fin -->` sirve de conclusión; el nombre se escribe `{, name}`.
- [ ] Ninguna imagen inventada; cada imagen tiene texto alternativo.
- [ ] Varios módulos: el mismo `course` (exactamente igual) y el mismo `modules` en todas partes; `module` numerado de 1 a N sin saltos; `next.title` = `title` exacto del módulo siguiente; ningún `next` en el último; `url` solo si se ha pedido una difusión web.

---

## 8. Frase que puede usar el profesorado

> «Lee las instrucciones de [dirección de esta página] y da formato al siguiente curso para MicroLearn: …»
>
> Para un curso en varios módulos: «… y divídelo en 3 módulos (difusión web): …»

*Fuente de referencia de la sintaxis: MicroLearn Studio. Esta página describe la versión 1.0.*
