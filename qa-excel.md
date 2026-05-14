# QA / FEATURE REQUEST — Mejora de Exportación Excel (.xlsx)

## Objetivo

Implementar una exportación profesional en formato Excel (`.xlsx`) para los algoritmos gráficos del sistema, utilizando `ExcelJS`.

La exportación NO debe limitarse a texto plano o tablas básicas.  
Debe representar visual y matemáticamente la ejecución completa del algoritmo.

---

# Contexto del Sistema

La aplicación es un visualizador interactivo de algoritmos gráficos clásicos.

Actualmente muestra:

- ejecución paso a paso,
- lógica matemática,
- tabla de iteraciones,
- pixel matrix / diagrama visual,
- parámetros configurables,
- animación en tiempo real.

Algoritmos soportados:

- Bresenham Línea Recta
- Bresenham Circunferencia
- Punto Medio
- Elipse

---

# Objetivo de la Exportación

El archivo Excel debe funcionar como:

- reporte matemático,
- representación visual,
- documento académico,
- evidencia del proceso paso a paso.

Debe verse organizado, limpio y profesional.

---

# Librería a utilizar

## ExcelJS

Repositorio:

https://github.com/exceljs/exceljs

---

# Requerimientos Funcionales

# 1. Generar archivo `.xlsx`

La exportación debe generar un workbook real de Excel compatible con:

- Microsoft Excel
- Google Sheets
- LibreOffice

NO usar:

- CSV
- Markdown
- TXT plano

---

# 2. Estructura del Workbook

El archivo debe contener múltiples hojas organizadas.

---

## Hoja 1 — Resumen

Debe contener:

- nombre del algoritmo,
- descripción breve,
- parámetros utilizados,
- fecha/hora de exportación,
- cantidad de pasos,
- resolución de la matriz.

Ejemplo:

| Propiedad | Valor |
|---|---|
| Algoritmo | Circunferencia Punto Medio |
| Radio | 9 |
| Pasos | 8 |

---

## Hoja 2 — Registro Matemático

Tabla completa del algoritmo.

Debe incluir:

| K | PK | (X,Y) | Fórmula | Acción |
|---|---|---|---|---|

Ejemplo:

| 0 | -8 | (0,9) | p₀ = 1 - r | Inicio |
| 1 | -5 | (1,9) | p = -8 + 2x + 1 | Mantiene Y |

---

### Requisitos visuales

- encabezados con color,
- filas alternadas,
- bordes,
- tipografía clara,
- columnas autoajustadas,
- alineación centrada.

---

# 3. Exportar Pixel Matrix

Debe existir una hoja dedicada a la representación visual.

Nombre sugerido:

## `Pixel Matrix`

---

## Requerimientos

Representar la matriz usando celdas coloreadas.

### Colores sugeridos

| Tipo | Color |
|---|---|
| Pixel activo | Azul |
| Pixel actual | Amarillo |
| Fondo | Blanco |

---

## Requisitos adicionales

- celdas cuadradas,
- grid visible,
- coordenadas opcionales,
- mantener proporción visual.

La matriz debe parecerse al visualizador web.

---

# 4. Exportar Captura Visual

Agregar captura del canvas/visualizador como imagen PNG dentro del workbook.

La imagen debe insertarse en:

- hoja resumen,
- o una hoja exclusiva llamada `Preview`.

---

# 5. Exportar Parámetros

Agregar hoja:

## `Configuración`

Debe incluir:

| Parámetro | Valor |
|---|---|
| Radio | 9 |
| Velocidad | 600ms |
| Tamaño matriz | 10x10 |

---

# 6. Compatibilidad React

La implementación debe funcionar correctamente con:

- React
- Vite
- TypeScript

---

# 7. Arquitectura Recomendada

Separar lógica en módulos.

---

## Ejemplo

```ts
generateSteps()
generateMatrix()
exportWorkbook()
captureCanvas()
```

---

# 8. Requerimientos Técnicos

## Debe soportar

- estilos,
- fills,
- borders,
- merges,
- imágenes,
- múltiples worksheets.

---

# 9. UX Esperada

La exportación debe sentirse como:

- software educativo,
- herramienta universitaria,
- visualizador profesional de algoritmos.

NO debe parecer:

- dump de datos,
- tabla simple,
- exportación improvisada.

---

# 10. Bonus Opcionales

## Deseables

- fórmulas reales Excel,
- modo oscuro,
- exportar PDF adicional,
- insertar logo del sistema,
- auto paginación,
- leyenda de colores,
- exportar animación como frames.

---

# Resultado Esperado

El usuario debe poder:

1. Ejecutar el algoritmo.
2. Visualizar pasos y diagrama.
3. Exportar un Excel organizado y visualmente claro.
4. Compartirlo como documento académico/profesional.

El `.xlsx` debe representar fielmente:

- la lógica matemática,
- el proceso iterativo,
- y la visualización gráfica del algoritmo.