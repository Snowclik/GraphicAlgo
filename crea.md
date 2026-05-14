# QA RESPONSE — ACLARACIÓN SOBRE CENTRO EN CÍRCULOS

## Estado

✅ El comportamiento actual del algoritmo es correcto matemáticamente.  
❌ Pero la interpretación del requerimiento no estaba contemplada originalmente en la UI/exportación.

---

# Contexto

Hasta ahora el sistema fue diseñado bajo el supuesto académico clásico:

```txt
Circunferencia usando únicamente:
- radio (r)
```

Ejemplo:

```txt
r = 9
```

y el algoritmo trabajaba implícitamente con:

```txt
centro = (0,0)
```

---

# Nuevo Escenario Detectado

Las nuevas instrucciones académicas ahora solicitan:

```txt
Círculo centrado en (100,100), radio 30
```

o:

```txt
Centro (120,120)
```

Esto introduce un nuevo concepto:

# Centro de traslación

---

# Importante

El algoritmo de Bresenham / Punto Medio NO cambia.

La lógica matemática sigue siendo:

```txt
x = 0
y = r
p₀ = 1 - r
```

y la tabla iterativa sigue calculándose respecto al origen:

```txt
(0,0)
```

---

# Lo único que cambia

Al momento de:

- dibujar,
- visualizar,
- exportar,
- pintar píxeles,

los puntos deben desplazarse usando el centro.

---

# Fórmula Correcta

Si el algoritmo genera:

```txt
(x, y)
```

y el centro es:

```txt
(cx, cy)
```

entonces los puntos reales son:

```txt
(cx + x, cy + y)
(cx - x, cy + y)
(cx + x, cy - y)
(cx - x, cy - y)

(cx + y, cy + x)
(cx - y, cy + x)
(cx + y, cy - x)
(cx - y, cy - x)
```

---

# Ejemplo

## Algoritmo interno

```txt
x = 3
y = 8
```

---

## Centro

```txt
(100,100)
```

---

## Puntos finales pintados

```txt
(103,108)
(97,108)
(103,92)
(97,92)

(108,103)
(92,103)
(108,97)
(92,97)
```

---

# Impacto en el Sistema

## Lo que NO cambia

✅ tabla matemática  
✅ cálculo de PK  
✅ pasos del algoritmo  
✅ lógica de decisión  

---

## Lo que SÍ cambia

✅ render visual  
✅ pixel matrix  
✅ coordenadas exportadas  
✅ puntos finales dibujados  

---

# Problema Actual Detectado

La aplicación probablemente:

- asume siempre centro `(0,0)`,
- no tiene soporte de traslación,
- y la matriz visual está acoplada al origen.

---

# Requerimientos Nuevos

## Agregar parámetros:

```txt
Centro X
Centro Y
```

---

# UI Esperada

## Configuración

| Parámetro | Valor |
|---|---|
| Centro X | 100 |
| Centro Y | 100 |
| Radio | 30 |

---

# Exportación Excel

La exportación debe diferenciar:

---

## Tabla Matemática

Puede mantenerse relativa al origen:

| k | (x,y) |
|---|---|
| 0 | (0,30) |
| 1 | (1,30) |

---

## Tabla de Puntos Reales

Nueva hoja recomendada:

| Punto | Coordenada Final |
|---|---|
| P1 | (100,130) |
| P2 | (100,70) |

---

# Render Visual

La matriz ahora debe:

- desplazarse al centro,
- soportar coordenadas grandes,
- permitir viewport dinámico.

---

# Riesgo Detectado

La UI actual probablemente usa:

```txt
matriz 10x10
```

o dimensiones pequeñas.

Pero con:

```txt
(100,100)
```

eso ya no cabe visualmente.

---

# Acción QA Recomendada

## Implementar separación clara:

---

# 1. Coordenadas Algorítmicas

Internas del algoritmo.

Ejemplo:

```txt
(3,8)
```

---

# 2. Coordenadas Reales

Puntos trasladados.

Ejemplo:

```txt
(103,108)
```

---

# Resultado Esperado

El usuario debe entender que:

```txt
El algoritmo SIEMPRE se calcula alrededor del origen.
```

y luego:

```txt
los puntos se trasladan al centro solicitado.
```

---

# Conclusión QA

❌ El sistema no estaba incorrecto matemáticamente.  
✅ El requerimiento evolucionó para incluir traslación de centro.  

La implementación debe actualizar:

- renderizador,
- exportación,
- matriz visual,
- y parámetros de configuración,

sin modificar la lógica base de Bresenham.